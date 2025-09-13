"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, AlertTriangle, TrendingDown, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"

interface ClassData {
  id: string
  name: string
  attendance: number
  students: number
  present: number
  absent: number
  status: "good" | "warning" | "poor"
  teacher: string
  lastUpdate: string
  anomaly?: {
    type: "drop" | "spike"
    change: number
    comparison: string
  }
  submissions: {
    studentName: string
    status: "present" | "absent" | "late"
    time?: string
    reason?: string
  }[]
}

export function AttendanceOverview() {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const classData: ClassData[] = [
    {
      id: "1",
      name: "Class 1",
      attendance: 92,
      students: 28,
      present: 26,
      absent: 2,
      status: "good",
  teacher: "Ms. Gurpreet Kaur",
      lastUpdate: "8:30 AM",
      submissions: [
        { studentName: "Alice Smith", status: "present" },
        { studentName: "Bob Johnson", status: "present" },
        { studentName: "Charlie Brown", status: "absent", reason: "Sick" },
        { studentName: "Diana Prince", status: "present" },
        { studentName: "Edward Norton", status: "late", time: "8:45 AM" },
      ],
    },
    {
      id: "2",
      name: "Class 2",
      attendance: 88,
      students: 30,
      present: 26,
      absent: 4,
      status: "good",
  teacher: "Mr. Harpreet Singh",
      lastUpdate: "8:45 AM",
      submissions: [
        { studentName: "Frank Miller", status: "present" },
        { studentName: "Grace Kelly", status: "absent", reason: "Family emergency" },
        { studentName: "Henry Ford", status: "present" },
        { studentName: "Ivy League", status: "absent", reason: "Doctor appointment" },
      ],
    },
    {
      id: "3",
      name: "Class 3",
      attendance: 76,
      students: 29,
      present: 22,
      absent: 7,
      status: "warning",
  teacher: "Ms. Navjot Kaur",
      lastUpdate: "Pending",
      anomaly: {
        type: "drop",
        change: -15,
        comparison: "yesterday",
      },
      submissions: [
        { studentName: "Jack Wilson", status: "present" },
        { studentName: "Kate Middleton", status: "absent", reason: "Flu symptoms" },
        { studentName: "Liam Neeson", status: "absent", reason: "Sick" },
      ],
    },
    {
      id: "4",
      name: "Class 4",
      attendance: 94,
      students: 27,
      present: 25,
      absent: 2,
      status: "good",
  teacher: "Mr. Manpreet Singh",
      lastUpdate: "9:15 AM",
      submissions: [
        { studentName: "Maya Angelou", status: "present" },
        { studentName: "Noah Webster", status: "present" },
        { studentName: "Olivia Newton", status: "absent", reason: "Dentist appointment" },
      ],
    },
    {
      id: "5",
      name: "Class 5",
      attendance: 68,
      students: 31,
      present: 21,
      absent: 10,
      status: "poor",
  teacher: "Ms. Simran Kaur",
      lastUpdate: "8:20 AM",
      anomaly: {
        type: "drop",
        change: -22,
        comparison: "last week",
      },
      submissions: [
        { studentName: "Peter Parker", status: "present" },
        { studentName: "Quinn Fabray", status: "absent", reason: "Sick" },
        { studentName: "Rachel Green", status: "absent", reason: "Family vacation" },
      ],
    },
    {
      id: "6",
      name: "Class 6",
      attendance: 91,
      students: 28,
      present: 25,
      absent: 3,
      status: "good",
  teacher: "Mr. Balwinder Singh",
      lastUpdate: "9:00 AM",
      submissions: [
        { studentName: "Sam Wilson", status: "present" },
        { studentName: "Tina Turner", status: "present" },
        { studentName: "Uma Thurman", status: "late", time: "9:30 AM" },
      ],
    },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "poor":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStudentStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge variant="default" className="bg-primary">
            Present
          </Badge>
        )
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Late
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleClassClick = (classItem: ClassData) => {
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  const overallAttendance = Math.round(classData.reduce((sum, cls) => sum + cls.attendance, 0) / classData.length)

  const totalStudents = classData.reduce((sum, cls) => sum + cls.students, 0)
  const totalPresent = classData.reduce((sum, cls) => sum + cls.present, 0)
  const totalAbsent = classData.reduce((sum, cls) => sum + cls.absent, 0)

  const anomalies = classData.filter((cls) => cls.anomaly)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Overview</h1>
          <p className="text-muted-foreground">Monitor daily attendance across all classes</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{overallAttendance}%</div>
          <p className="text-sm text-muted-foreground">Overall Attendance</p>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalies.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Attendance Anomalies Detected:</strong> {anomalies.length} classes showing unusual patterns.
            {anomalies.map((cls) => (
              <span key={cls.id} className="ml-2">
                {cls.name} ({cls.anomaly?.change}% {cls.anomaly?.type} vs {cls.anomaly?.comparison})
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPresent}</div>
            <p className="text-xs text-muted-foreground">{totalAbsent} absent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes at Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {classData.filter((cls) => cls.attendance < 75).length}
            </div>
            <p className="text-xs text-muted-foreground">Below 75% attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Attendance Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
          <CardDescription>Click on any class to view detailed student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classData.map((classItem) => (
              <Card
                key={classItem.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                style={{
                  borderLeftColor:
                    classItem.status === "good" ? "#059669" : classItem.status === "warning" ? "#d97706" : "#dc2626",
                }}
                onClick={() => handleClassClick(classItem)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    {getStatusIcon(classItem.status)}
                  </div>
                  <CardDescription>{classItem.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <span className={`font-bold ${getAttendanceColor(classItem.status)}`}>{classItem.attendance}%</span>
                  </div>
                  <Progress value={classItem.attendance} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {classItem.present}/{classItem.students} present
                    </span>
                    <span className="text-muted-foreground">Updated: {classItem.lastUpdate}</span>
                  </div>
                  {classItem.anomaly && (
                    <div className="flex items-center space-x-1 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                      {classItem.anomaly.type === "drop" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      <span>
                        {classItem.anomaly.change}% vs {classItem.anomaly.comparison}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedClass?.name} - Detailed Submissions</span>
              {selectedClass && getStatusIcon(selectedClass.status)}
            </DialogTitle>
            <DialogDescription>
              Teacher: {selectedClass?.teacher} | Last Updated: {selectedClass?.lastUpdate}
            </DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-4">
              {/* Class Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedClass.present}</div>
                  <div className="text-sm text-muted-foreground">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{selectedClass.absent}</div>
                  <div className="text-sm text-muted-foreground">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedClass.attendance}%</div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                </div>
              </div>

              {/* Anomaly Alert in Modal */}
              {selectedClass.anomaly && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Anomaly Detected:</strong> {selectedClass.anomaly.change}% {selectedClass.anomaly.type}{" "}
                    compared to {selectedClass.anomaly.comparison}
                  </AlertDescription>
                </Alert>
              )}

              {/* Student List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Student Submissions</h4>
                {selectedClass.submissions.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{student.studentName}</div>
                      {student.time && <span className="text-sm text-muted-foreground">({student.time})</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.reason && <span className="text-sm text-muted-foreground italic">{student.reason}</span>}
                      {getStudentStatusBadge(student.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
