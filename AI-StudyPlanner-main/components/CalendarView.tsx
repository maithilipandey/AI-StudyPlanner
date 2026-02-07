'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DailyTask {
  date: string
  dayOfWeek: string
  subject: string
  topic: string
  taskType: 'learning' | 'practice' | 'revision' | 'buffer'
  hours: number
  priority: 'high' | 'medium' | 'low'
  focusLevel: 'high' | 'medium' | 'low'
}

interface CalendarViewProps {
  schedule: DailyTask[]
}

export function CalendarView({ schedule }: CalendarViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(0)

  // Group schedule by date
  const scheduleByDate = schedule.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = []
    }
    acc[task.date].push(task)
    return acc
  }, {} as Record<string, DailyTask[]>)

  const uniqueDates = Object.keys(scheduleByDate).sort()
  const weeksToDisplay = 2
  const daysPerWeek = 7
  const startIndex = currentWeekStart
  const endIndex = Math.min(startIndex + weeksToDisplay * daysPerWeek, uniqueDates.length)
  const displayDates = uniqueDates.slice(startIndex, endIndex)

  const handlePrevWeek = () => {
    if (currentWeekStart > 0) {
      setCurrentWeekStart(Math.max(0, currentWeekStart - daysPerWeek))
    }
  }

  const handleNextWeek = () => {
    if (endIndex < uniqueDates.length) {
      setCurrentWeekStart(currentWeekStart + daysPerWeek)
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'learning':
        return 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
      case 'practice':
        return 'bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-100'
      case 'revision':
        return 'bg-green-100 border-green-300 text-green-900 dark:bg-green-900 dark:border-green-700 dark:text-green-100'
      case 'buffer':
        return 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">High</span>
      case 'medium':
        return <span className="inline-block px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">Medium</span>
      case 'low':
        return <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">Low</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {displayDates.length > 0
            ? `${displayDates[0]} to ${displayDates[displayDates.length - 1]}`
            : 'No schedule available'}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevWeek} disabled={currentWeekStart === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            disabled={endIndex >= uniqueDates.length}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">
        {displayDates.map((date) => {
          const tasks = scheduleByDate[date]
          const dateObj = new Date(date)
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNum = dateObj.getDate()
          const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0)

          return (
            <div key={date} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Day Header */}
              <div className="bg-secondary p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">
                    {dayName}, {dayNum}
                  </p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{totalHours.toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground">{tasks.length} tasks</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-2">
                {tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg ${getTaskTypeColor(task.taskType)} flex justify-between items-start`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{task.subject}</p>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-sm mb-2">{task.topic}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded">
                          {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded">
                          {task.hours.toFixed(1)}h
                        </span>
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded">
                          {task.focusLevel} focus
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
        <p className="font-semibold text-foreground mb-3">Task Types</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span>Practice</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Revision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span>Buffer</span>
          </div>
        </div>
      </div>
    </div>
  )
}
