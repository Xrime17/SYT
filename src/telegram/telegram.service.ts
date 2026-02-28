import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Priority, TaskType } from '@prisma/client';
import { RecurringService } from '../recurring/recurring.service';
import { RemindersService } from '../reminders/reminders.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Telegraf, Markup } = require('telegraf');

const MSG_NEED_START = 'Сначала /start';

type NewTaskStep = 'title' | 'description' | 'dueDate' | 'priority' | 'type';

interface NewTaskState {
  step: NewTaskStep;
  title?: string;
  description?: string;
  dueDate?: Date | null;
  priority?: Priority;
  type?: TaskType;
}

type TelegrafContext = import('telegraf').Context;
type CallbackCtx = import('telegraf').Context<import('telegraf/types').Update.CallbackQueryUpdate>;

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: InstanceType<typeof Telegraf> | null = null;
  private readonly newTaskState = new Map<number, NewTaskState>();

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
    private readonly recurringService: RecurringService,
    private readonly remindersService: RemindersService,
  ) {}

  async onModuleInit(): Promise<void> {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN is not set; Telegram bot will not start',
      );
      return;
    }

    this.bot = new Telegraf(token);

    this.bot.command('start', (ctx: TelegrafContext) => this.handleStart(ctx));
    this.bot.command('tasks', (ctx: TelegrafContext) => this.handleTasks(ctx));
    this.bot.command('new', (ctx: TelegrafContext) => this.handleNewStart(ctx));
    this.bot.command('done', (ctx: TelegrafContext) => this.handleDone(ctx));
    this.bot.command('recurring', (ctx: TelegrafContext) => this.handleRecurring(ctx));
    this.bot.command('remind', (ctx: TelegrafContext) => this.handleRemind(ctx));

    this.bot.on('message', (ctx: TelegrafContext) => this.handleMessage(ctx));
    this.bot.on('callback_query', (ctx: CallbackCtx) => this.handleCallback(ctx));

    // Запуск бота в фоне, чтобы не блокировать подъём HTTP-сервера (listen)
    void this.launchBot();
  }

  private async launchBot(): Promise<void> {
    if (!this.bot) return;
    try {
      await this.bot.launch();
      const webAppUrl = this.configService.get<string>('WEB_APP_URL');
      if (webAppUrl) {
        try {
          await this.bot.telegram.setChatMenuButton({
            menuButton: {
              type: 'web_app',
              text: 'Open',
              web_app: { url: webAppUrl },
            },
          });
          this.logger.log(`Menu button "Open" set → ${webAppUrl}`);
        } catch (err) {
          this.logger.warn('Failed to set menu button: ' + (err instanceof Error ? err.message : String(err)));
        }
      } else {
        this.logger.warn('WEB_APP_URL not set; menu button not configured');
      }
      this.logger.log('Telegram bot launched');
    } catch (err) {
      this.logger.error('Telegram bot failed to launch: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  private async ensureUser(ctx: TelegrafContext): Promise<{ id: string } | null> {
    const from = ctx.from;
    if (!from) return null;
    const telegramId = from.id;
    try {
      const user = await this.usersService.findUserByTelegramId(telegramId);
      if (!user) return null;
      return { id: user.id };
    } catch {
      return null;
    }
  }

  private async handleStart(ctx: TelegrafContext): Promise<void> {
    const from = ctx.from;
    if (!from) return;
    const telegramId = from.id;
    const firstName = from.first_name ?? '';
    const lastName = from.last_name ?? undefined;
    const username = from.username ?? undefined;

    const webAppUrl = this.configService.get<string>('WEB_APP_URL');
    const openAppMarkup =
      webAppUrl ?
        Markup.inlineKeyboard([[Markup.button.webApp('Open', webAppUrl)]])
      : undefined;

    try {
      const existing = await this.usersService.findUserByTelegramId(telegramId);
      if (existing) {
        await ctx.reply(
          `Снова привет, ${firstName}! Ты уже зарегистрирован.`,
          openAppMarkup ? { reply_markup: openAppMarkup.reply_markup } : {},
        );
        this.logger.log(
          `User already exists: telegramId=${String(telegramId)}`,
        );
        return;
      }
      await this.usersService.createUser(
        telegramId,
        firstName,
        lastName,
        username,
      );
      await ctx.reply(
        `Привет, ${firstName}! Ты успешно зарегистрирован. Используй /tasks, /new и другие команды.`,
        openAppMarkup ? { reply_markup: openAppMarkup.reply_markup } : {},
      );
      this.logger.log(`User registered: telegramId=${String(telegramId)}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка регистрации';
      await ctx.reply(msg).catch(() => {});
      this.logger.warn(`/start error: ${msg}`);
    }
  }

  private async handleTasks(ctx: TelegrafContext): Promise<void> {
    const user = await this.ensureUser(ctx);
    if (!user) {
      await ctx.reply(MSG_NEED_START);
      return;
    }
    try {
      const tasks = await this.tasksService.getTasks(user.id);
      if (tasks.length === 0) {
        await ctx.reply('У тебя пока нет задач.');
        return;
      }
      const lines = tasks.map(
        (t) => `• ${t.title} (${t.status})`,
      );
      await ctx.reply(lines.join('\n'));
      this.logger.log(`/tasks: sent ${tasks.length} task(s) for user ${user.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки задач';
      await ctx.reply(msg).catch(() => {});
      this.logger.warn(`/tasks error: ${msg}`);
    }
  }

  private async handleNewStart(ctx: TelegrafContext): Promise<void> {
    const from = ctx.from;
    if (!from) return;
    const user = await this.ensureUser(ctx);
    if (!user) {
      await ctx.reply(MSG_NEED_START);
      return;
    }
    this.newTaskState.set(from.id, { step: 'title' });
    await ctx.reply('Введи название задачи (обязательно):');
  }

  private async handleMessage(ctx: TelegrafContext): Promise<void> {
    const from = ctx.from;
    const msg = ctx.message;
    if (!from || !msg || !('text' in msg)) return;

    const state = this.newTaskState.get(from.id);
    if (!state) return;

    const text = msg.text?.trim() ?? '';

    try {
      if (state.step === 'title') {
        if (!text) {
          await ctx.reply('Название не может быть пустым. Введи название:');
          return;
        }
        state.title = text;
        state.step = 'description';
        await ctx.reply('Введи описание (или нажми кнопку «Пропустить»):', {
          reply_markup: {
            inline_keyboard: [
              [{ callback_data: 'new_skip_desc', text: 'Пропустить' }],
            ],
          },
        });
        return;
      }

      if (state.step === 'description') {
        state.description = text || undefined;
        state.step = 'dueDate';
        await ctx.reply(
          'Введи дату срока в формате ISO 8601 (например 2026-12-31) или нажми «Пропустить»:',
          {
            reply_markup: {
              inline_keyboard: [
                [{ callback_data: 'new_skip_due', text: 'Пропустить' }],
              ],
            },
          },
        );
        return;
      }

      if (state.step === 'dueDate') {
        if (text) {
          const parsed = new Date(text);
          if (Number.isNaN(parsed.getTime())) {
            await ctx.reply('Неверный формат даты. Введи ISO 8601 или нажми Пропустить.');
            return;
          }
          state.dueDate = parsed;
        } else {
          state.dueDate = null;
        }
        state.step = 'priority';
        await ctx.reply('Выбери приоритет:', {
          reply_markup: {
            inline_keyboard: [
              [
                { callback_data: 'new_priority_LOW', text: 'LOW' },
                { callback_data: 'new_priority_MEDIUM', text: 'MEDIUM' },
                { callback_data: 'new_priority_HIGH', text: 'HIGH' },
              ],
            ],
          },
        });
        return;
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Ошибка';
      await ctx.reply(errMsg).catch(() => {});
      this.newTaskState.delete(from.id);
    }
  }

  private async handleCallback(ctx: CallbackCtx): Promise<void> {
    const from = ctx.from;
    const cq = ctx.callbackQuery;
    const data = cq && 'data' in cq ? cq.data : undefined;
    if (!from || !data) return;

    await ctx.answerCbQuery().catch(() => {});

    const state = this.newTaskState.get(from.id);
    const user = await this.ensureUser(ctx as TelegrafContext);

    if (data === 'new_skip_desc') {
      if (!state || state.step !== 'description') return;
      state.description = undefined;
      state.step = 'dueDate';
      await ctx.reply(
        'Введи дату срока (ISO 8601) или нажми «Пропустить»:',
        {
          reply_markup: {
            inline_keyboard: [
              [{ callback_data: 'new_skip_due', text: 'Пропустить' }],
            ],
          },
        },
      );
      return;
    }

    if (data === 'new_skip_due') {
      if (!state || state.step !== 'dueDate') return;
      state.dueDate = null;
      state.step = 'priority';
      await ctx.reply('Выбери приоритет:', {
        reply_markup: {
          inline_keyboard: [
            [
              { callback_data: 'new_priority_LOW', text: 'LOW' },
              { callback_data: 'new_priority_MEDIUM', text: 'MEDIUM' },
              { callback_data: 'new_priority_HIGH', text: 'HIGH' },
            ],
          ],
        },
      });
      return;
    }

    if (data.startsWith('new_priority_')) {
      if (!state || state.step !== 'priority' || !user) return;
      const p = data.replace('new_priority_', '') as Priority;
      if (p !== 'LOW' && p !== 'MEDIUM' && p !== 'HIGH') return;
      state.priority = p;
      state.step = 'type';
      await ctx.reply('Выбери тип задачи:', {
        reply_markup: {
          inline_keyboard: [
            [
              { callback_data: 'new_type_TASK', text: 'TASK' },
              { callback_data: 'new_type_GOAL', text: 'GOAL' },
              { callback_data: 'new_type_NOTE', text: 'NOTE' },
            ],
          ],
        },
      });
      return;
    }

    if (data.startsWith('new_type_')) {
      if (!state || state.step !== 'type' || !user) return;
      const t = data.replace('new_type_', '') as TaskType;
      if (t !== 'TASK' && t !== 'GOAL' && t !== 'NOTE') return;
      state.type = t;

      try {
        await this.tasksService.createTask(
          user.id,
          state.title!,
          state.description,
          {
            dueDate: state.dueDate ?? undefined,
            priority: state.priority,
            type: state.type,
          },
        );
        this.newTaskState.delete(from.id);
        await ctx.reply('Задача создана.');
        this.logger.log(`/new: task created for user ${user.id}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания задачи';
        await ctx.reply(msg).catch(() => {});
        this.newTaskState.delete(from.id);
      }
      return;
    }
  }

  private async handleDone(ctx: TelegrafContext): Promise<void> {
    const user = await this.ensureUser(ctx);
    if (!user) {
      await ctx.reply(MSG_NEED_START);
      return;
    }
    const text = (ctx.message && 'text' in ctx.message ? ctx.message.text : '') ?? '';
    const taskId = text.replace(/^\s*\/done\s+/, '').trim();
    if (!taskId) {
      await ctx.reply('Использование: /done <taskId>');
      return;
    }
    try {
      const task = await this.tasksService.getTaskById(taskId);
      if (!task || task.userId !== user.id) {
        await ctx.reply('Задача не найдена или не принадлежит тебе.');
        return;
      }
      await this.tasksService.updateTask(taskId, { status: 'COMPLETED' });
      await ctx.reply('Задача отмечена как выполненная.');
      this.logger.log(`/done: task ${taskId} completed by user ${user.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      await ctx.reply(msg).catch(() => {});
    }
  }

  private async handleRecurring(ctx: TelegrafContext): Promise<void> {
    const user = await this.ensureUser(ctx);
    if (!user) {
      await ctx.reply(MSG_NEED_START);
      return;
    }
    const text = (ctx.message && 'text' in ctx.message ? ctx.message.text : '') ?? '';
    const taskId = text.replace(/^\s*\/recurring\s+/, '').trim();
    if (!taskId) {
      await ctx.reply('Использование: /recurring <taskId>');
      return;
    }
    try {
      const task = await this.tasksService.getTaskById(taskId);
      if (!task || task.userId !== user.id) {
        await ctx.reply('Задача не найдена или не принадлежит тебе.');
        return;
      }
      const rule = await this.recurringService.getRecurringByTask(taskId);
      const endStr = rule.endDate
        ? rule.endDate.toISOString().slice(0, 10)
        : 'нет';
      const daysStr =
        rule.daysOfWeek.length > 0
          ? rule.daysOfWeek.join(', ')
          : '—';
      await ctx.reply(
        `Повтор: frequency=${rule.frequency}, interval=${rule.interval}, daysOfWeek=[${daysStr}], endDate=${endStr}`,
      );
      this.logger.log(`/recurring: sent rule for task ${taskId}`);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Правило не найдено или ошибка.';
      await ctx.reply(msg).catch(() => {});
    }
  }

  private async handleRemind(ctx: TelegrafContext): Promise<void> {
    const user = await this.ensureUser(ctx);
    if (!user) {
      await ctx.reply(MSG_NEED_START);
      return;
    }
    const text = (ctx.message && 'text' in ctx.message ? ctx.message.text : '') ?? '';
    const rest = text.replace(/^\s*\/remind\s+/, '').trim();
    const [taskId, timeStr] = rest.split(/\s+/);
    if (!taskId || !timeStr) {
      await ctx.reply('Использование: /remind <taskId> HH:MM');
      return;
    }
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      await ctx.reply('Время укажи в формате HH:MM (например 09:00).');
      return;
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      await ctx.reply('Неверное время.');
      return;
    }
    try {
      const task = await this.tasksService.getTaskById(taskId);
      if (!task || task.userId !== user.id) {
        await ctx.reply('Задача не найдена или не принадлежит тебе.');
        return;
      }
      const now = new Date();
      const remindAt = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          hours,
          minutes,
          0,
          0,
        ),
      );
      await this.remindersService.createReminder(taskId, remindAt);
      await ctx.reply(
        `Напоминание установлено на ${remindAt.toISOString().slice(0, 16)} UTC.`,
      );
      this.logger.log(`/remind: created for task ${taskId} at ${timeStr}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка';
      await ctx.reply(msg).catch(() => {});
    }
  }
}
