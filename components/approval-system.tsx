"use client"

import { useState } from "react"
import { approvalApi, randomFailure } from "@/lib/mock-api"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Lock, Clock, AlertTriangle, Eye, RotateCcw, FileCheck, Shield, Calendar } from "lucide-react"

interface ApprovalRecord {
  id: string
  date: string
  status: "pending_review" | "reviewed" | "approved" | "locked" | "rollback_available"
  submittedClasses: number
  totalClasses: number
  reviewedBy?: string
  reviewedAt?: string
  approvedBy?: string
  approvedAt?: string
  lockedAt?: string
  rollbackDeadline?: string
  notes?: string
  auditLog: {
    timestamp: string
    action: string
    user: string
    details: string
  }[]
}

export function ApprovalSystem() {
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")

  const [approvalRecords, setApprovalRecords] = useState<ApprovalRecord[]>([
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      status: "pending_review",
      submittedClasses: 4,
      totalClasses: 6,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: "Submissions Received",
          user: "System",
          details: "4 out of 6 classes submitted attendance data",
        },
      ],
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      status: "locked",
      submittedClasses: 6,
      totalClasses: 6,
      reviewedBy: "Admin User",
      reviewedAt: new Date(Date.now() - 82800000).toISOString(),
      approvedBy: "Principal Smith",
      approvedAt: new Date(Date.now() - 79200000).toISOString(),
      lockedAt: new Date(Date.now() - 75600000).toISOString(),
      rollbackDeadline: new Date(Date.now() + 7200000).toISOString(),
      auditLog: [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          action: "All Submissions Received",
          user: "System",
          details: "All 6 classes submitted attendance data",
        },
        {
          timestamp: new Date(Date.now() - 82800000).toISOString(),
          action: "Review Completed",
          user: "Admin User",
          details: "Data reviewed and validated",
        },
        {
          timestamp: new Date(Date.now() - 79200000).toISOString(),
          action: "Approved",
          user: "Principal Smith",
          details: "Attendance data approved for government submission",
        },
        {
          timestamp: new Date(Date.now() - 75600000).toISOString(),
          action: "Locked",
          user: "Principal Smith",
          details: "Data locked and marked as official",
        },
      ],
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      status: "locked",
      submittedClasses: 6,
      totalClasses: 6,
      reviewedBy: "Admin User",
      reviewedAt: new Date(Date.now() - 169200000).toISOString(),
      approvedBy: "Principal Smith",
      approvedAt: new Date(Date.now() - 165600000).toISOString(),
      lockedAt: new Date(Date.now() - 162000000).toISOString(),
      auditLog: [
        {
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          action: "All Submissions Received",
          user: "System",
          details: "All 6 classes submitted attendance data",
        },
        {
          timestamp: new Date(Date.now() - 169200000).toISOString(),
          action: "Review Completed",
          user: "Admin User",
          details: "Data reviewed and validated",
        },
        {
          timestamp: new Date(Date.now() - 165600000).toISOString(),
          action: "Approved",
          user: "Principal Smith",
          details: "Attendance data approved for government submission",
        },
        {
          timestamp: new Date(Date.now() - 162000000).toISOString(),
          action: "Locked",
          user: "Principal Smith",
          details: "Data locked and marked as official",
        },
      ],
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Reviewed
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-primary">
            Approved
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="default" className="bg-green-600">
            Locked
          </Badge>
        )
      case "rollback_available":
        return <Badge variant="destructive">Rollback Available</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "reviewed":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "locked":
        return <Lock className="h-4 w-4 text-green-600" />
      case "rollback_available":
        return <RotateCcw className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleReview = async (recordId: string) => {
    try {
      setLoadingAction(`review-${recordId}`)
      await randomFailure(approvalApi.review({ recordId, notes: reviewNotes }))
      setApprovalRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: "reviewed" as const,
                reviewedBy: "Admin User",
                reviewedAt: new Date().toISOString(),
                notes: reviewNotes,
                auditLog: [
                  ...record.auditLog,
                  {
                    timestamp: new Date().toISOString(),
                    action: "Review Completed",
                    user: "Admin User",
                    details: reviewNotes || "Data reviewed and validated",
                  },
                ],
              }
            : record,
        ),
      )
      toast({ title: "Review Completed", description: "Record moved to reviewed state." })
      setReviewNotes("")
    } catch (e: any) {
      toast({ title: "Review Failed", description: e.message, variant: "destructive" as any })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleApprove = async (recordId: string) => {
    try {
      setLoadingAction(`approve-${recordId}`)
      const result = await randomFailure(approvalApi.approve({ recordId, notes: approvalNotes }))
      setApprovalRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: "approved" as const,
                approvedBy: "Principal Smith",
                approvedAt: new Date().toISOString(),
                rollbackDeadline: new Date(result.data.rollbackDeadline).toISOString(),
                auditLog: [
                  ...record.auditLog,
                  {
                    timestamp: new Date().toISOString(),
                    action: "Approved",
                    user: "Principal Smith",
                    details: approvalNotes || "Attendance data approved for government submission",
                  },
                ],
              }
            : record,
        ),
      )
      toast({ title: "Approved", description: "Record approved and ready to lock." })
      setApprovalNotes("")
    } catch (e: any) {
      toast({ title: "Approval Failed", description: e.message, variant: "destructive" as any })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleLock = async (recordId: string) => {
    try {
      setLoadingAction(`lock-${recordId}`)
      await randomFailure(approvalApi.lock({ recordId }))
      setApprovalRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: "locked" as const,
                lockedAt: new Date().toISOString(),
                auditLog: [
                  ...record.auditLog,
                  {
                    timestamp: new Date().toISOString(),
                    action: "Locked",
                    user: "Principal Smith",
                    details: "Data locked and marked as official",
                  },
                ],
              }
            : record,
        ),
      )
      toast({ title: "Locked", description: "Data locked and marked official." })
    } catch (e: any) {
      toast({ title: "Lock Failed", description: e.message, variant: "destructive" as any })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRollback = async (recordId: string) => {
    try {
      setLoadingAction(`rollback-${recordId}`)
      await randomFailure(approvalApi.rollback({ recordId }))
      setApprovalRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: "pending_review" as const,
                reviewedBy: undefined,
                reviewedAt: undefined,
                approvedBy: undefined,
                approvedAt: undefined,
                lockedAt: undefined,
                rollbackDeadline: undefined,
                auditLog: [
                  ...record.auditLog,
                  {
                    timestamp: new Date().toISOString(),
                    action: "Rollback Initiated",
                    user: "Principal Smith",
                    details: "Data unlocked for corrections",
                  },
                ],
              }
            : record,
        ),
      )
      toast({ title: "Rollback Initiated", description: "Record returned to pending review." })
    } catch (e: any) {
      toast({ title: "Rollback Failed", description: e.message, variant: "destructive" as any })
    } finally {
      setLoadingAction(null)
    }
  }

  const canRollback = (record: ApprovalRecord) => {
    if (!record.rollbackDeadline) return false
    return new Date() < new Date(record.rollbackDeadline)
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

  const todayRecord = approvalRecords.find((r) => r.date === new Date().toISOString().split("T")[0])
  const pendingCount = approvalRecords.filter((r) => r.status === "pending_review").length
  const lockedCount = approvalRecords.filter((r) => r.status === "locked").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approval & Lock System</h1>
          <p className="text-muted-foreground">Review, approve, and lock daily attendance data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Secure Approval Process</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Records</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lockedCount}</div>
            <p className="text-xs text-muted-foreground">Official records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {todayRecord && getStatusIcon(todayRecord.status)}
              <span className="text-sm font-medium">
                {todayRecord ? todayRecord.status.replace("_", " ").toUpperCase() : "NO DATA"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {todayRecord
                ? `${todayRecord.submittedClasses}/${todayRecord.totalClasses} submitted`
                : "No submissions yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Approval Workflow */}
      {todayRecord && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Approval Workflow</CardTitle>
            <CardDescription>Two-step approval process for {todayRecord.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(todayRecord.status)}
                <div>
                  <h3 className="font-semibold">Current Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {todayRecord.submittedClasses}/{todayRecord.totalClasses} classes submitted
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">{getStatusBadge(todayRecord.status)}</div>
            </div>

            {/* Step 1: Review */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    todayRecord.status !== "pending_review"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  1
                </div>
                <h3 className="font-semibold">Review Submissions</h3>
                {todayRecord.reviewedAt && (
                  <Badge variant="outline" className="ml-auto">
                    Completed {formatDateTime(todayRecord.reviewedAt)}
                  </Badge>
                )}
              </div>

              {todayRecord.status === "pending_review" && (
                <div className="ml-10 space-y-3">
                  <Textarea
                    placeholder="Add review notes (optional)..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="min-h-20"
                  />
                  <Button
                    onClick={() => handleReview(todayRecord.id)}
                    disabled={todayRecord.submittedClasses < todayRecord.totalClasses || loadingAction === `review-${todayRecord.id}`}
                    className="flex items-center space-x-2"
                  >
                    {loadingAction === `review-${todayRecord.id}` ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>{loadingAction === `review-${todayRecord.id}` ? 'Reviewing...' : 'Complete Review'}</span>
                  </Button>
                  {todayRecord.submittedClasses < todayRecord.totalClasses && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Cannot review until all {todayRecord.totalClasses} classes have submitted their data.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Approve & Lock */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    todayRecord.status === "approved" || todayRecord.status === "locked"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <h3 className="font-semibold">Approve & Lock</h3>
                {todayRecord.approvedAt && (
                  <Badge variant="outline" className="ml-auto">
                    Approved {formatDateTime(todayRecord.approvedAt)}
                  </Badge>
                )}
              </div>

              {todayRecord.status === "reviewed" && (
                <div className="ml-10 space-y-3">
                  <Textarea
                    placeholder="Add approval notes (optional)..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="min-h-20"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={() => handleApprove(todayRecord.id)} className="flex items-center space-x-2" disabled={loadingAction === `approve-${todayRecord.id}`}> 
                      {loadingAction === `approve-${todayRecord.id}` ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span>{loadingAction === `approve-${todayRecord.id}` ? 'Approving...' : 'Approve'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {todayRecord.status === "approved" && (
                <div className="ml-10 space-y-3">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Data approved and ready to lock. Once locked, data becomes official and cannot be edited.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => handleLock(todayRecord.id)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    disabled={loadingAction === `lock-${todayRecord.id}`}
                  >
                    {loadingAction === `lock-${todayRecord.id}` ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span>{loadingAction === `lock-${todayRecord.id}` ? 'Locking...' : 'Lock Data'}</span>
                  </Button>
                </div>
              )}

              {todayRecord.status === "locked" && (
                <div className="ml-10 space-y-3">
                  <Alert className="border-green-200 bg-green-50">
                    <Lock className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Data is now locked and marked as official.
                      {canRollback(todayRecord) && (
                        <span> Rollback available until {formatDateTime(todayRecord.rollbackDeadline!)}.</span>
                      )}
                    </AlertDescription>
                  </Alert>
                  {canRollback(todayRecord) && (
                    <Button
                      variant="destructive"
                      onClick={() => handleRollback(todayRecord.id)}
                      className="flex items-center space-x-2"
                      disabled={loadingAction === `rollback-${todayRecord.id}`}
                    >
                      {loadingAction === `rollback-${todayRecord.id}` ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                      <span>{loadingAction === `rollback-${todayRecord.id}` ? 'Rolling back...' : 'Rollback for Corrections'}</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval History */}
      <Card>
        <CardHeader>
          <CardTitle>Approval History</CardTitle>
          <CardDescription>View past approval records and audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvalRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(record.status)}
                  <div>
                    <h3 className="font-semibold">{record.date}</h3>
                    <p className="text-sm text-muted-foreground">
                      {record.submittedClasses}/{record.totalClasses} classes •
                      {record.lockedAt
                        ? ` Locked ${formatDateTime(record.lockedAt)}`
                        : record.approvedAt
                          ? ` Approved ${formatDateTime(record.approvedAt)}`
                          : record.reviewedAt
                            ? ` Reviewed ${formatDateTime(record.reviewedAt)}`
                            : " Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(record.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedRecord(record)}>
                        View Audit Log
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Audit Log - {record.date}</span>
                        </DialogTitle>
                        <DialogDescription>Complete approval workflow history</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium">Status:</span>
                            <div className="mt-1">{getStatusBadge(record.status)}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Submissions:</span>
                            <div className="mt-1 text-sm">
                              {record.submittedClasses}/{record.totalClasses} classes
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Audit Trail</h4>
                          {record.auditLog.map((log, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{log.action}</span>
                                  <span className="text-xs text-muted-foreground">{formatDateTime(log.timestamp)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                                <p className="text-xs text-muted-foreground">By: {log.user}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
