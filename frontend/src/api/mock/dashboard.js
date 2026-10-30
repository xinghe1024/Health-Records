export const mockDashboard = {
  glucose: [
    { value: 6.8, measured_at: '2026-04-01 07:00:00' },
    { value: 9.2, measured_at: '2026-04-01 09:30:00' },
    { value: 6.5, measured_at: '2026-04-02 07:00:00' },
    { value: 8.8, measured_at: '2026-04-02 09:30:00' },
    { value: 7.1, measured_at: '2026-04-03 07:00:00' },
  ],
  metrics: {
    avg_glucose: 7.9,
    hba1c: 6.7,
    target_rate: 82,
    bmi: 26.4,
    streak_days: 12,
  },
  today_tasks: [
    { id: 1, time: '07:00', title: '空腹血糖测量', done: true, type: '血糖' },
    { id: 2, time: '07:30', title: '格列美脲 2mg', done: true, type: '用药' },
    { id: 3, time: '12:30', title: '午餐后步行 15 分钟', done: false, type: '运动' },
    { id: 4, time: '18:30', title: '二甲双胍 500mg', done: false, type: '用药' },
  ],
  insight: '过去 5 天空腹血糖整体平稳；4 月 3 日午餐后升高明显，与较多米饭摄入相关。建议午餐主食减少约 1/4，并在餐后快走 15 分钟。',
}