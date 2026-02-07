'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface WeeklySubject {
  subjectName: string
  focusTopics: string[]
  hoursAllocated: number
  priority: string
}

interface WeeklyFocus {
  week: number
  subjects: WeeklySubject[]
  keyMilestones: string[]
}

interface WeeklyGuidanceProps {
  weeklyFocuses: WeeklyFocus[]
}

export function WeeklyGuidance({ weeklyFocuses }: WeeklyGuidanceProps) {
  return (
    <div className="space-y-6">
      {weeklyFocuses.slice(0, 4).map((week) => (
        <Card key={week.week} className="p-6 border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {week.week}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Week {week.week}</h3>
              <p className="text-sm text-muted-foreground">Focus and milestones</p>
            </div>
          </div>

          {/* Subjects for the week */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Study Focus</h4>
            <div className="space-y-3">
              {week.subjects.map((subject, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{subject.subjectName}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                        {subject.priority}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary">{subject.hoursAllocated}h</p>
                  </div>

                  {/* Topics */}
                  {subject.focusTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subject.focusTopics.map((topic, topicIdx) => (
                        <span
                          key={topicIdx}
                          className="text-xs px-2 py-1 bg-secondary rounded border border-border"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Milestones */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Milestones</h4>
            <div className="space-y-2">
              {week.keyMilestones.map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{milestone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {week.week === 1
                ? 'Start with foundational concepts. Build strong basics before moving to advanced topics.'
                : week.week <= Math.ceil(weeklyFocuses.length / 2)
                  ? 'Continue consolidating understanding. Use practice problems to reinforce learning.'
                  : 'Focus on revision and full-length practice. Test your understanding thoroughly.'}
            </p>
          </div>
        </Card>
      ))}

      {weeklyFocuses.length > 4 && (
        <Card className="p-6 border bg-secondary/50">
          <p className="text-center text-muted-foreground">
            + {weeklyFocuses.length - 4} more weeks in your study plan
          </p>
        </Card>
      )}
    </div>
  )
}
