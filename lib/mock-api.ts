// Lightweight mock API layer for Principal Portal
// Replace implementations with real fetch calls later.

export type MockResult<T> = Promise<{ data: T; meta?: { durationMs: number } }>

function simulateLatency<T>(data: T, min = 400, max = 1100): MockResult<T> {
  const duration = Math.floor(Math.random() * (max - min)) + min
  return new Promise((resolve) => setTimeout(() => resolve({ data, meta: { durationMs: duration } }), duration))
}

// Approval workflow
export interface ReviewPayload { recordId: string; notes?: string }
export interface ApprovePayload { recordId: string; notes?: string }
export interface LockPayload { recordId: string }
export interface RollbackPayload { recordId: string; reason?: string }

export const approvalApi = {
  review: (payload: ReviewPayload) => simulateLatency({ status: 'reviewed', ...payload }),
  approve: (payload: ApprovePayload) => simulateLatency({ status: 'approved', rollbackDeadline: Date.now() + 24*60*60*1000, ...payload }),
  lock: (payload: LockPayload) => simulateLatency({ status: 'locked', lockedAt: Date.now(), ...payload }),
  rollback: (payload: RollbackPayload) => simulateLatency({ status: 'pending_review', ...payload }),
}

// Teacher management
export interface ReminderPayload { teacherId: string }
export interface BulkReminderPayload { teacherIds: string[] }

export const teacherApi = {
  sendReminder: (payload: ReminderPayload) => simulateLatency({ sent: true, ...payload }),
  sendBulkReminder: (payload: BulkReminderPayload) => simulateLatency({ sent: payload.teacherIds.length }),
}

// Reports
export interface GenerateReportPayload { format: 'pdf' | 'csv' | 'excel'; type: string }
export interface ShareReportPayload { reportId: string }

export const reportsApi = {
  generate: (payload: GenerateReportPayload) => simulateLatency({ reportId: Date.now().toString(), ...payload }),
  share: (payload: ShareReportPayload) => simulateLatency({ shared: true, ...payload }),
  download: (payload: ShareReportPayload) => simulateLatency({ downloaded: true, ...payload }, 150, 400),
}

// Attendance
export const attendanceApi = {
  refreshSummary: () => simulateLatency({ refreshedAt: Date.now() }),
  filterRisk: () => simulateLatency({ applied: true, criteria: 'risk' }),
}

export const randomFailure = async <T>(promise: MockResult<T>, failureRate = 0.1) => {
  const result = await promise
  if (Math.random() < failureRate) throw new Error('Simulated network error')
  return result
}
