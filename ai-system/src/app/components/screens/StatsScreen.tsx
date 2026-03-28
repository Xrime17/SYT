import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { CompletionStats, StreakIndicator, CircularProgress } from '../syt/Progress';
import { SegmentedControl } from '../syt/SegmentedControl';
import { Divider } from '../syt/Divider';
import { useState } from 'react';

export function StatsScreen() {
  const [period, setPeriod] = useState('week');

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-syt-surface-2 border-b border-syt-divider backdrop-blur-sm">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <h1 className="text-center">Statistics</h1>
        </div>
      </div>

      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Period Selector */}
        <SegmentedControl
          fullWidth
          items={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={period}
          onValueChange={setPeriod}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-syt-card border border-syt-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-syt-success" />
              <h4 className="text-sm font-medium text-syt-text-secondary">Completed</h4>
            </div>
            <p className="text-2xl font-semibold text-syt-text">24</p>
            <p className="text-xs text-syt-text-muted mt-1">tasks this week</p>
          </div>

          <div className="bg-syt-card border border-syt-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-syt-accent" />
              <h4 className="text-sm font-medium text-syt-text-secondary">Goal</h4>
            </div>
            <p className="text-2xl font-semibold text-syt-text">80%</p>
            <p className="text-xs text-syt-text-muted mt-1">completion rate</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-syt-warning-subtle to-syt-error-subtle border border-syt-border rounded-xl">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-syt-warning" />
            <div>
              <p className="text-2xl font-semibold text-syt-text">7</p>
              <p className="text-sm text-syt-text-muted">Day Streak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-syt-text-secondary">Longest: 14 days</p>
          </div>
        </div>

        <Divider />

        {/* Completion Progress */}
        <CompletionStats completed={24} total={30} label="This Week" />

        <Divider />

        {/* Daily Progress */}
        <section>
          <h3 className="mb-4">Daily Progress</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const values = [8, 6, 7, 5, 8, 4, 6];
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-syt-text-secondary">{day}</span>
                  <div className="flex-1 h-8 bg-syt-surface rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-syt-accent rounded-lg"
                      style={{ width: `${(values[index] / 10) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-syt-text text-right">
                    {values[index]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* Categories */}
        <section>
          <h3 className="mb-4">By Category</h3>
          <div className="space-y-3">
            {[
              { name: 'Work', count: 12, color: '#6366F1' },
              { name: 'Personal', count: 8, color: '#10B981' },
              { name: 'Health', count: 4, color: '#F59E0B' },
            ].map((category) => (
              <div
                key={category.name}
                className="flex items-center gap-3 p-3 bg-syt-card border border-syt-border rounded-lg"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1 text-sm text-syt-text">{category.name}</span>
                <span className="text-sm font-medium text-syt-text">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Achievements */}
        <section>
          <h3 className="mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🎯', label: 'First Task', unlocked: true },
              { icon: '🔥', label: '7 Day Streak', unlocked: true },
              { icon: '💯', label: '100 Tasks', unlocked: false },
              { icon: '⭐', label: 'Perfect Week', unlocked: true },
              { icon: '🏆', label: 'Monthly Goal', unlocked: false },
              { icon: '💪', label: '30 Day Streak', unlocked: false },
            ].map((achievement) => (
              <div
                key={achievement.label}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${
                  achievement.unlocked
                    ? 'bg-syt-card border-syt-border'
                    : 'bg-syt-surface border-syt-border opacity-40'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <span className="text-xs text-syt-text-muted text-center">
                  {achievement.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
