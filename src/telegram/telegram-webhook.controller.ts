import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TelegramService } from './telegram.service';

/**
 * Receives Telegram updates via webhook. When user opens the bot and sends /start
 * (or any message), Telegram POSTs here → Railway wakes up before user taps "Open".
 */
@Controller('telegram')
export class TelegramWebhookController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async webhook(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    res.status(200);
    await this.telegramService.handleWebhook(body);
    return { ok: true };
  }
}
