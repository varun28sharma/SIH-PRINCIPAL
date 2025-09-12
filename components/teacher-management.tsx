"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Send, CheckCircle, Clock, XCircle, TrendingUp, Mail, Phone, Award, AlertTriangle } from "lucide-react"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  class: string
  avatar?: string
  submissionStatus: "submitted" | "pending" | "correction" | "late"
  lastSubmission: string
  submissionTime?: string
  complianceRate: number
  weeklySubmissions: number[]
  monthlyCompliance: number
  notes?: string
  yearsExperience: number
  subjects: string[]
}

export function TeacherManagement() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [reminderSent, setReminderSent] = useState<string[]>([])

  const teachers: Teacher[] = [
    {
      id: "1",
      name: "Ms. Sarah Johnson",
      email: "sarah.johnson@school.edu",
      phone: "(555) 123-4567",
      class: "Class 1",
      submissionStatus: "submitted",
      lastSubmission: "Today",
      submissionTime: "8:30 AM",
      complianceRate: 96,
      weeklySubmissions: [1, 1, 1, 1, 1],
      monthlyCompliance: 94,
      yearsExperience: 8,
      subjects: ["Mathematics", "Science"],
    },
    {
      id: "2",
      name: "Mr. David Smith",
      email: "david.smith@school.edu",
      phone: "(555) 234-5678",
      class: "Class 2",
      submissionStatus: "submitted",
      lastSubmission: "Today",
      submissionTime: "8:45 AM",
      complianceRate: 92,
      weeklySubmissions: [1, 1, 1, 1, 1],
      monthlyCompliance: 89,
      yearsExperience: 12,
      subjects: ["English", "Social Studies"],
    },
    {
      id: "3",
      name: "Ms. Emily Davis",
      email: "emily.davis@school.edu",
      phone: "(555) 345-6789",
      class: "Class 3",
      submissionStatus: "pending",
      lastSubmission: "Yesterday",
      complianceRate: 78,
      weeklySubmissions: [1, 1, 0, 1, 0],
      monthlyCompliance: 76,
      notes: "Frequently late submissions",
      yearsExperience: 3,
      subjects: ["Art", "Music"],
    },
    {
      id: "4",
      name: "Mr. James Wilson",
      email: "james.wilson@school.edu",
      phone: "(555) 456-7890",
      class: "Class 4",
      submissionStatus: "submitted",
      lastSubmission: "Today",
      submissionTime: "9:15 AM",
      complianceRate: 98,
      weeklySubmissions: [1, 1, 1, 1, 1],
      monthlyCompliance: 97,
      yearsExperience: 15,
      subjects: ["Physical Education", "Health"],
    },
    {
      id: "5",
      name: "Ms. Lisa Brown",
      email: "lisa.brown@school.edu",
      phone: "(555) 567-8901",
      class: "Class 5",
      submissionStatus: "correction",
      lastSubmission: "Today",
      submissionTime: "8:20 AM",
      complianceRate: 85,
      weeklySubmissions: [1, 0, 1, 1, 1],
      monthlyCompliance: 82,
      notes: "Data accuracy issues",
      yearsExperience: 6,
      subjects: ["Science", "Mathematics"],
    },
    {
      id: "6",
      name: "Mr. Robert Taylor",
      email: "robert.taylor@school.edu",
      phone: "(555) 678-9012",
      class: "Class 6",
      submissionStatus: "submitted",
      lastSubmission: "Today",
      submissionTime: "9:00 AM",
      complianceRate: 94,
      weeklySubmissions: [1, 1, 1, 1, 1],
      monthlyCompliance: 91,
      yearsExperience: 10,
      subjects: ["English", "Literature"],
    },
  ]

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
      case "late":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Late
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "correction":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "late":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return "text-primary"
    if (rate >= 75) return "text-yellow-600"
    return "text-destructive"
  }

  const sendReminder = (teacherId: string) => {
    setReminderSent([...reminderSent, teacherId])
    // In a real app, this would send an actual notification
    setTimeout(() => {
      setReminderSent((prev) => prev.filter((id) => id !== teacherId))
    }, 3000)
  }

  const submittedCount = teachers.filter((t) => t.submissionStatus === "submitted").length
  const pendingCount = teachers.filter((t) => t.submissionStatus === "pending").length
  const correctionCount = teachers.filter((t) => t.submissionStatus === "correction").length
  const averageCompliance = Math.round(teachers.reduce((sum, t) => sum + t.complianceRate, 0) / teachers.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Management</h1>
          <p className="text-muted-foreground">Monitor teacher submissions and compliance rates</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Send className="h-4 w-4" />
          <span>Send Bulk Reminder</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">Out of {teachers.length} teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Correction</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{correctionCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(averageCompliance)}`}>{averageCompliance}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher List */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Submissions</CardTitle>
          <CardDescription>Track daily submission status and compliance rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{teacher.name}</h3>
                      {getStatusIcon(teacher.submissionStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">{teacher.class}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Last: {teacher.lastSubmission}
                        {teacher.submissionTime && ` at ${teacher.submissionTime}`}
                      </span>
                      <span className={`text-xs font-medium ${getComplianceColor(teacher.complianceRate)}`}>
                        {teacher.complianceRate}% compliance
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    {getStatusBadge(teacher.submissionStatus)}
                    {teacher.notes && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-32 truncate">{teacher.notes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {(teacher.submissionStatus === "pending" || teacher.submissionStatus === "correction") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendReminder(teacher.id)}
                        disabled={reminderSent.includes(teacher.id)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        {reminderSent.includes(teacher.id) ? "Sent!" : "Remind"}
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedTeacher(teacher)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{teacher.name}</span>
                          </DialogTitle>
                          <DialogDescription>{teacher.class} Teacher</DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="compliance">Compliance</TabsTrigger>
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Current Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(teacher.submissionStatus)}
                                    {getStatusBadge(teacher.submissionStatus)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Last submission: {teacher.lastSubmission}
                                    {teacher.submissionTime && ` at ${teacher.submissionTime}`}
                                  </p>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Experience</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center space-x-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">{teacher.yearsExperience} years</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Subjects: {teacher.subjects.join(", ")}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>

                            {teacher.notes && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{teacher.notes}</AlertDescription>
                              </Alert>
                            )}
                          </TabsContent>

                          <TabsContent value="compliance" className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Monthly Compliance Rate</span>
                                  <span className={`font-bold ${getComplianceColor(teacher.monthlyCompliance)}`}>
                                    {teacher.monthlyCompliance}%
                                  </span>
                                </div>
                                <Progress value={teacher.monthlyCompliance} className="h-2" />
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-2">This Week's Submissions</h4>
                                <div className="flex space-x-2">
                                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                                    <div key={day} className="text-center">
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                          teacher.weeklySubmissions[index]
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {teacher.weeklySubmissions[index] ? "✓" : "✗"}
                                      </div>
                                      <span className="text-xs text-muted-foreground mt-1">{day}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="contact" className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{teacher.email}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{teacher.phone}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{teacher.class}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2 pt-4">
                              <Button size="sm" className="flex-1">
                                <Mail className="h-3 w-3 mr-1" />
                                Send Email
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
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
