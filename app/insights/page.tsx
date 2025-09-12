import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insights (Coming Soon)</h1>
          <p className="text-muted-foreground text-sm mt-1">Aggregate analytics and deeper attendance intelligence will appear here.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="font-semibold mb-1">Planned Widgets</h2>
            <ul className="text-sm list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Chronic absenteeism trend</li>
              <li>Submission time distribution</li>
              <li>At-risk cohort trajectory</li>
              <li>Teacher compliance heatmap</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="font-semibold mb-1">Next Steps</h2>
            <p className="text-sm text-muted-foreground">Hook this page to real analytics endpoints once backend aggregation APIs are available.</p>
            <Button variant="outline" size="sm" className="mt-3" disabled>
              Generate Sample Insight
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
