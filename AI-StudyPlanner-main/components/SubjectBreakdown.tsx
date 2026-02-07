'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface SubjectPlan {
  subjectName: string
  totalHours: number
  percentageAllocation: number
  allocation: string
  keyTopics: string[]
  weeklyBreakdown: number[]
  estimatedConfidenceImprovement: number
}

interface SubjectBreakdownProps {
  subjectPlans: SubjectPlan[]
  totalHours: number
}

export function SubjectBreakdown({ subjectPlans, totalHours }: SubjectBreakdownProps) {
  return (
    <div className="space-y-4">
      {subjectPlans.map((subject) => (
        <Card key={subject.subjectName} className="p-6 border hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">{subject.subjectName}</h3>
              <p className="text-sm text-muted-foreground">{subject.allocation}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{subject.percentageAllocation}%</p>
              <p className="text-sm text-muted-foreground">{subject.totalHours} hours</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${(subject.totalHours / totalHours) * 100}%`,
              }}
            />
          </div>

          {/* Key Topics */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-2">Key Topics to Focus On:</p>
            <div className="flex flex-wrap gap-2">
              {subject.keyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Weekly Breakdown */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-2">Weekly Study Hours:</p>
            <div className="flex items-end gap-1 h-20">
              {subject.weeklyBreakdown.slice(0, 8).map((hours, week) => (
                <div key={week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full flex items-end justify-center h-16">
                    <div
                      className="w-full bg-primary rounded-t transition-all duration-300"
                      style={{
                        height: `${Math.max(5, (hours / Math.max(...subject.weeklyBreakdown)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">W{week + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Improvement */}
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Expected confidence improvement: <span className="font-bold">+{subject.estimatedConfidenceImprovement}</span> levels
            </p>
          </div>
        </Card>
      ))}

      {/* Summary */}
      <Card className="p-6 border bg-primary/5 border-primary/20">
        <h3 className="text-lg font-bold text-foreground mb-4">Study Plan Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Subjects</p>
            <p className="text-2xl font-bold text-primary">{subjectPlans.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Study Hours</p>
            <p className="text-2xl font-bold text-primary">{totalHours}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Hours per Subject</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round(totalHours / subjectPlans.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Confidence Boost</p>
            <p className="text-2xl font-bold text-primary">
              +{Math.round(subjectPlans.reduce((sum, s) => sum + s.estimatedConfidenceImprovement, 0) / subjectPlans.length)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
