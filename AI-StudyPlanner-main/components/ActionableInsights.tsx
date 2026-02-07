'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, Lightbulb, Target, TrendingUp } from 'lucide-react'

interface StudyPlan {
  studentName: string
  targetDate: string
  daysRemaining: number
  totalAvailableHours: number
  nextWeekFocus: string
  completionTimeline: string
  confidenceBoost: string
  tips: string[]
  subjectPlans: any[]
}

interface ActionableInsightsProps {
  plan: StudyPlan
}

export function ActionableInsights({ plan }: ActionableInsightsProps) {
  const lowestConfidenceSubject = plan.subjectPlans.reduce((prev: any, current: any) =>
    current.estimatedConfidenceImprovement > prev.estimatedConfidenceImprovement ? current : prev
  )

  const highestPrioritySubjects = plan.subjectPlans
    .filter((s: any) => s.percentageAllocation > 25)
    .map((s: any) => s.subjectName)

  return (
    <div className="space-y-6">
      {/* Next Week Action Items */}
      <Card className="p-6 border border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">Next Week Action Items</h3>
            <p className="text-foreground mb-3">{plan.nextWeekFocus}</p>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Identify all weak areas and create a prerequisite map</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Schedule high-focus study sessions during your peak hours</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Complete first round of foundational learning</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Highest Priority Areas */}
      <Card className="p-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">High Priority Subjects</h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              These subjects require the most attention based on credits and confidence levels.
            </p>
            <div className="flex flex-wrap gap-2">
              {highestPrioritySubjects.map((subject: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 text-sm font-semibold rounded-full border border-red-300 dark:border-red-700"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Study Tips */}
      <Card className="p-6 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4">Expert Study Tips</h3>
            <div className="space-y-3">
              {plan.tips.map((tip: string, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0">{idx + 1}.</span>
                  <p className="text-sm text-green-800 dark:text-green-200">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Expectation */}
      <Card className="p-6 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">Expected Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Completion Timeline</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{plan.daysRemaining} days</p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Available Study Time</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{plan.totalAvailableHours}+ hours</p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Confidence Improvement</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {plan.confidenceBoost.match(/\+\d+/)?.[0] || '+2'} levels
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Subjects Covered</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{plan.subjectPlans.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Adaptive Scheduling Tips */}
      <Card className="p-6 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3">
          How to Adapt Your Schedule
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
              If a subject gets easier:
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Reduce time allocation and move that time to struggling areas.
            </p>
          </div>
          <div>
            <p className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
              If you fall behind:
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Focus only on weak areas and prerequisites, skip review of strong topics.
            </p>
          </div>
          <div>
            <p className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
              For better retention:
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Use spaced repetition - revisit topics 1 day, 3 days, and 1 week after learning.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
