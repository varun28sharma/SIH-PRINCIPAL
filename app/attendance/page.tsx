import { DashboardLayout } from "@/components/dashboard-layout"
import { AttendanceOverview } from "@/components/attendance-overview"

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <AttendanceOverview />
    </DashboardLayout>
  )
}
