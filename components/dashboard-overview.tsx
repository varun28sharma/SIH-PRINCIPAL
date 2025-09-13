"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle, Clock, AlertTriangle, TrendingUp, FileText, Send, Lock } from "lucide-react"

export function DashboardOverview() {
  const attendanceData = [
    { class: "Class 1", attendance: 92, status: "good", students: 28, present: 26 },
    { class: "Class 2", attendance: 88, status: "good", students: 30, present: 26 },
    { class: "Class 3", attendance: 76, status: "warning", students: 29, present: 22 },
    { class: "Class 4", attendance: 94, status: "good", students: 27, present: 25 },
    { class: "Class 5", attendance: 68, status: "poor", students: 31, present: 21 },
    { class: "Class 6", attendance: 91, status: "good", students: 28, present: 25 },
  ]

  const teacherSubmissions = [
    { name: "Ms. Gurpreet Kaur", class: "Class 1", status: "submitted", time: "8:30 AM" },
    { name: "Mr. Harpreet Singh", class: "Class 2", status: "submitted", time: "8:45 AM" },
    { name: "Ms. Navjot Kaur", class: "Class 3", status: "pending", time: "-" },
    { name: "Mr. Manpreet Singh", class: "Class 4", status: "submitted", time: "9:15 AM" },
    { name: "Ms. Simran Kaur", class: "Class 5", status: "correction", time: "8:20 AM" },
    { name: "Mr. Balwinder Singh", class: "Class 6", status: "submitted", time: "9:00 AM" },
  ]

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-primary"
      case "warning":
        return "text-yellow-600"
      case "poor":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="default" className="bg-primary">
            Submitted
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "correction":
        return <Badge variant="destructive">Needs Correction</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">86.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/6</div>
            <p className="text-xs text-muted-foreground">2 pending submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Pending</div>
            <p className="text-xs text-muted-foreground">Awaiting final review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Classes below 70%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Attendance Today</CardTitle>
            <CardDescription>Click on a class to view detailed submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendanceData.map((item) => (
              <div
                key={item.class}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="font-medium">{item.class}</div>
                  <Badge variant="outline" className="text-xs">
                    {item.present}/{item.students}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24">
                    <Progress value={item.attendance} className="h-2" />
                  </div>
                  <div className={`font-semibold ${getAttendanceColor(item.status)}`}>{item.attendance}%</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Teacher Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Submissions</CardTitle>
            <CardDescription>Track daily attendance submission status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherSubmissions.map((teacher) => (
              <div key={teacher.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher.class}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-muted-foreground">{teacher.time}</div>
                  {getStatusBadge(teacher.status)}
                  {teacher.status === "pending" && (
                    <Button size="sm" variant="outline">
                      <Send className="h-3 w-3 mr-1" />
                      Remind
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Approval System</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <CheckCircle className="h-4 w-4" />
              <span>Review & Approve</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Send className="h-4 w-4" />
              <span>Send Reminders</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <TrendingUp className="h-4 w-4" />
              <span>View Trends</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
