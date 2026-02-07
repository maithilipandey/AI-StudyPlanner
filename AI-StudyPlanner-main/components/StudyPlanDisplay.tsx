'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarView } from './CalendarView'
import { SubjectBreakdown } from './SubjectBreakdown'
import { WeeklyGuidance } from './WeeklyGuidance'
import { ActionableInsights } from './ActionableInsights'
import { ArrowLeft, Download } from 'lucide-react'

interface StudyPlanDisplayProps {
  plan: any
  onNewPlan: () => void
}

export function StudyPlanDisplay({ plan, onNewPlan }: StudyPlanDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const handleDownload = () => {
    const planText = `
AI STUDY PLANNER - PERSONALIZED STUDY SCHEDULE
===============================================

Student: ${plan.studentName}
Target Completion Date: ${plan.targetDate}
Days Remaining: ${plan.daysRemaining}

OVERVIEW
--------
${plan.completionTimeline}
${plan.confidenceBoost}

NEXT WEEK FOCUS
---------------
${plan.nextWeekFocus}

SUBJECT ALLOCATION
------------------
${plan.subjectPlans
  .map(
    (s: any) => `
${s.subjectName}
  - Hours: ${s.totalHours}h (${s.percentageAllocation}%)
  - ${s.allocation}
  - Key Topics: ${s.keyTopics.join(', ')}
  - Expected Confidence Improvement: +${s.estimatedConfidenceImprovement} levels
`
  )
  .join('\n')}

STUDY TIPS
----------
${plan.tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}
    `

    const blob = new Blob([planText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-plan-${plan.studentName.replace(/\s/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onNewPlan} className="mb-6 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Study Plan for {plan.studentName}
              </h1>
              <p className="text-muted-foreground text-lg">{plan.completionTimeline}</p>
            </div>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download Plan
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border">
              <p className="text-sm text-muted-foreground mb-1">Days Remaining</p>
              <p className="text-3xl font-bold text-primary">{plan.daysRemaining}</p>
            </Card>
            <Card className="p-4 border">
              <p className="text-sm text-muted-foreground mb-1">Total Study Hours</p>
              <p className="text-3xl font-bold text-primary">{plan.totalAvailableHours}</p>
            </Card>
            <Card className="p-4 border">
              <p className="text-sm text-muted-foreground mb-1">Subjects</p>
              <p className="text-3xl font-bold text-primary">{plan.subjectPlans.length}</p>
            </Card>
            <Card className="p-4 border">
              <p className="text-sm text-muted-foreground mb-1">Confidence Boost</p>
              <p className="text-3xl font-bold text-primary">
                {plan.confidenceBoost.match(/\+\d+/)?.[0] || '+2'}
              </p>
            </Card>
          </div>
        </div>

        {/* Key Insights */}
        <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-4">Key Focus Areas</h2>
          <p className="text-foreground font-semibold mb-2">{plan.nextWeekFocus}</p>
          <p className="text-muted-foreground">{plan.confidenceBoost}</p>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 border">
              <h3 className="text-xl font-bold text-foreground mb-4">Weekly Study Guide</h3>
              <WeeklyGuidance weeklyFocuses={plan.weeklyFocuses} />
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="p-6 border">
              <h3 className="text-xl font-bold text-foreground mb-4">Study Schedule</h3>
              <CalendarView schedule={plan.schedule} />
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <SubjectBreakdown subjectPlans={plan.subjectPlans} totalHours={plan.totalAvailableHours} />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <ActionableInsights plan={plan} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
