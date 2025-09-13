"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  FileText,
  Download,
  Share,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FileImage,
  Send,
  Eye,
  Settings,
} from "lucide-react"

interface ReportFilter {
  dateRange: {
    start: string
    end: string
  }
  classes: string[]
  teachers: string[]
  reportType: "summary" | "detailed" | "compliance" | "trends"
  includeFaceCoded: boolean
}

interface ReportData {
  id: string
  name: string
  type: string
  dateGenerated: string
  dateRange: string
  status: "generating" | "ready" | "shared"
  size: string
  filters: string[]
  faceCoded?: boolean
}

export function ReportsSystem() {
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    classes: [],
    teachers: [],
    reportType: "summary",
    includeFaceCoded: true,
  })

  const [generatingReport, setGeneratingReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"]
  const teachers = [
    "Ms. Gurpreet Kaur",
    "Mr. Harpreet Singh",
    "Ms. Navjot Kaur",
    "Mr. Manpreet Singh",
    "Ms. Simran Kaur",
    "Mr. Balwinder Singh",
  ]

  const [reports, setReports] = useState<ReportData[]>([
    {
      id: "1",
      name: "Monthly Attendance Summary",
      type: "PDF",
      dateGenerated: new Date().toISOString(),
      dateRange: "Nov 1-30, 2024",
      status: "ready",
      size: "2.4 MB",
      filters: ["All Classes", "Summary View", "Face-coded"],
      faceCoded: true,
    },
    {
      id: "2",
      name: "Teacher Compliance Report",
      type: "Excel",
      dateGenerated: new Date(Date.now() - 86400000).toISOString(),
      dateRange: "Nov 1-30, 2024",
      status: "shared",
      size: "1.8 MB",
      filters: ["All Teachers", "Compliance View", "Face-coded"],
      faceCoded: true,
    },
    {
      id: "3",
      name: "Weekly Trends Analysis",
      type: "PDF",
      dateGenerated: new Date(Date.now() - 172800000).toISOString(),
      dateRange: "Nov 25-Dec 1, 2024",
      status: "ready",
      size: "3.1 MB",
      filters: ["All Classes", "Trends View"],
      faceCoded: false,
    },
  ])

  // Sample data for charts
  const attendanceData = [
    { class: "Class 1", attendance: 92, target: 90 },
    { class: "Class 2", attendance: 88, target: 90 },
    { class: "Class 3", attendance: 76, target: 90 },
    { class: "Class 4", attendance: 94, target: 90 },
    { class: "Class 5", attendance: 68, target: 90 },
    { class: "Class 6", attendance: 91, target: 90 },
  ]

  const trendData = [
    { date: "Nov 25", attendance: 85 },
    { date: "Nov 26", attendance: 87 },
    { date: "Nov 27", attendance: 83 },
    { date: "Nov 28", attendance: 89 },
    { date: "Nov 29", attendance: 86 },
    { date: "Dec 1", attendance: 88 },
  ]

  const complianceData = [
    { name: "On Time", value: 75, color: "#059669" },
    { name: "Late", value: 20, color: "#d97706" },
    { name: "Missing", value: 5, color: "#dc2626" },
  ]

  const handleClassToggle = (className: string) => {
    setFilters((prev) => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter((c) => c !== className)
        : [...prev.classes, className],
    }))
  }

  const handleTeacherToggle = (teacherName: string) => {
    setFilters((prev) => ({
      ...prev,
      teachers: prev.teachers.includes(teacherName)
        ? prev.teachers.filter((t) => t !== teacherName)
        : [...prev.teachers, teacherName],
    }))
  }

  const generateReport = async (format: "pdf" | "csv" | "excel") => {
    setGeneratingReport(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newReport: ReportData = {
      id: Date.now().toString(),
      name: `${filters.reportType.charAt(0).toUpperCase() + filters.reportType.slice(1)} Report`,
      type: format.toUpperCase(),
      dateGenerated: new Date().toISOString(),
      dateRange: `${filters.dateRange.start} to ${filters.dateRange.end}`,
      status: "ready",
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      filters: [
        filters.classes.length > 0 ? `${filters.classes.length} Classes` : "All Classes",
        filters.teachers.length > 0 ? `${filters.teachers.length} Teachers` : "All Teachers",
        `${filters.reportType} View`,
        ...((filters as any).includeFaceCoded ? ["Face-coded"] : []),
      ],
      faceCoded: (filters as any).includeFaceCoded,
    }

    setReports((prev) => [newReport, ...prev])
    setGeneratingReport(false)

    // In a real app, this would trigger the actual file download
    const blob = new Blob(["Sample report content"], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${newReport.name}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareWithGovernment = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) => (report.id === reportId ? { ...report, status: "shared" as const } : report)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generating":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Generating
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="default" className="bg-primary">
            Ready
          </Badge>
        )
      case "shared":
        return (
          <Badge variant="default" className="bg-green-600">
            Shared
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generating":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "ready":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "shared":
        return <Share className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Export</h1>
          <p className="text-muted-foreground">Generate and export attendance reports with custom filters</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Report Generator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Report Configuration</span>
              </CardTitle>
              <CardDescription>Customize your report parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Type */}
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  value={filters.reportType}
                  onValueChange={(value: any) => setFilters((prev) => ({ ...prev, reportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="trends">Trends Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Classes Filter */}
              <div className="space-y-2">
                <Label>Classes ({filters.classes.length > 0 ? filters.classes.length : "All"} selected)</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {classes.map((className) => (
                    <div key={className} className="flex items-center space-x-2">
                      <Checkbox
                        id={className}
                        checked={filters.classes.includes(className)}
                        onCheckedChange={() => handleClassToggle(className)}
                      />
                      <Label htmlFor={className} className="text-sm">
                        {className}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teachers Filter */}
              <div className="space-y-2">
                <Label>Teachers ({filters.teachers.length > 0 ? filters.teachers.length : "All"} selected)</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {teachers.map((teacherName) => (
                    <div key={teacherName} className="flex items-center space-x-2">
                      <Checkbox
                        id={teacherName}
                        checked={filters.teachers.includes(teacherName)}
                        onCheckedChange={() => handleTeacherToggle(teacherName)}
                      />
                      <Label htmlFor={teacherName} className="text-sm">
                        {teacherName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Buttons */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="faceCoded"
                    checked={(filters as any).includeFaceCoded}
                    onCheckedChange={(checked) =>
                      setFilters((prev: any) => ({ ...prev, includeFaceCoded: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="faceCoded" className="text-sm">Include Face-coded attendance data</Label>
                </div>
                <Label>Export Format</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => generateReport("pdf")}
                    disabled={generatingReport}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FileImage className="h-4 w-4" />
                    <span>Generate PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateReport("excel")}
                    disabled={generatingReport}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Generate Excel</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateReport("csv")}
                    disabled={generatingReport}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Generate CSV</span>
                  </Button>
                </div>
                {generatingReport && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">Generating report...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Report Preview</span>
              </CardTitle>
              <CardDescription>Live preview of your report data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attendance by Class Chart */}
              <div>
                <h4 className="font-semibold mb-3">Attendance by Class</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#059669" />
                    <Bar dataKey="target" fill="#e5e7eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Line Chart */}
              <div>
                <h4 className="font-semibold mb-3">Attendance Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Compliance Pie Chart */}
              <div>
                <h4 className="font-semibold mb-3">Submission Compliance</h4>
                <div className="flex items-center space-x-6">
                  <ResponsiveContainer width="50%" height={150}>
                    <PieChart>
                      <Pie data={complianceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                        {complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {complianceData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>View and manage your exported reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(report.status)}
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.size} • Generated {formatDateTime(report.dateGenerated)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">Range: {report.dateRange}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Filters: {report.filters.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  <div className="flex space-x-2">
                    {report.status === "ready" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Send className="h-3 w-3 mr-1" />
                              Share with Gov
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Share with Government</DialogTitle>
                              <DialogDescription>
                                This will securely transmit the report to the government portal
                              </DialogDescription>
                            </DialogHeader>
                            <Alert>
                              <CheckCircle className="h-4 w-4" />
                              <AlertDescription>
                                Report meets all government compliance requirements and is ready for submission.
                              </AlertDescription>
                            </Alert>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                onClick={() => shareWithGovernment(report.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirm Share
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    {report.status === "shared" && (
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Shared Successfully
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
