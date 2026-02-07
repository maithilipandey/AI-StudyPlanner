'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface AvailabilityFormProps {
  onSubmit: (data: {
    weekdayHours: number
    weekendHours: number
    preferredTime: string
    targetDate: string
  }) => void
  isLoading: boolean
  studentName: string
  subjectCount: number
}

export function AvailabilityForm({
  onSubmit,
  isLoading,
  studentName,
  subjectCount,
}: AvailabilityFormProps) {
  const [formData, setFormData] = useState({
    weekdayHours: 3,
    weekendHours: 6,
    preferredTime: 'night',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.weekdayHours < 1 || formData.weekdayHours > 12)
      newErrors.weekdayHours = 'Weekday hours must be between 1-12'
    if (formData.weekendHours < 1 || formData.weekendHours > 16)
      newErrors.weekendHours = 'Weekend hours must be between 1-16'

    const targetDate = new Date(formData.targetDate)
    const today = new Date()
    if (targetDate <= today) newErrors.targetDate = 'Target date must be in the future'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'preferredTime' ? value : name === 'targetDate' ? value : parseInt(value),
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  // Calculate total available hours
  const totalHours =
    formData.weekdayHours * 5 + formData.weekendHours * 2 + (formData.weekdayHours * 5 + formData.weekendHours * 2) * 4

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Study Availability</h2>
        <p className="text-muted-foreground">
          Let us know when you can study so we can create a realistic schedule for your {subjectCount} subjects.
        </p>
      </div>

      <Card className="p-4 bg-primary/10 border-primary/20">
        <p className="text-sm">
          <span className="font-semibold text-primary">Estimated availability:</span> ~{Math.round(totalHours)} hours
          until target date
        </p>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weekday" className="text-sm font-medium">
            Weekday Study Hours (Mon-Fri)
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="weekday"
              name="weekdayHours"
              type="number"
              min="1"
              max="12"
              value={formData.weekdayHours}
              onChange={handleChange}
              className={`w-20 ${errors.weekdayHours ? 'border-destructive' : ''}`}
            />
            <span className="text-muted-foreground">hours per day</span>
          </div>
          {errors.weekdayHours && <p className="text-sm text-destructive">{errors.weekdayHours}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weekend" className="text-sm font-medium">
            Weekend Study Hours (Sat-Sun)
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="weekend"
              name="weekendHours"
              type="number"
              min="1"
              max="16"
              value={formData.weekendHours}
              onChange={handleChange}
              className={`w-20 ${errors.weekendHours ? 'border-destructive' : ''}`}
            />
            <span className="text-muted-foreground">hours per day</span>
          </div>
          {errors.weekendHours && <p className="text-sm text-destructive">{errors.weekendHours}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTime" className="text-sm font-medium">
            Preferred Study Time
          </Label>
          <select
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="morning">Morning (6am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 6pm)</option>
            <option value="evening">Evening (6pm - 10pm)</option>
            <option value="night">Night (10pm - 2am)</option>
            <option value="flexible">Flexible/Mix</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetDate" className="text-sm font-medium">
            Target Completion Date
          </Label>
          <Input
            id="targetDate"
            name="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={handleChange}
            className={errors.targetDate ? 'border-destructive' : ''}
          />
          {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate}</p>}
        </div>
      </div>

      <div className="bg-secondary/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Note:</span> Your personalized study plan will be generated
          based on your availability, subjects, and target date. You'll receive weekly guidance and confidence
          checkpoints to track your progress.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating Your Study Plan...' : 'Generate Study Plan'}
      </Button>
    </form>
  )
}
