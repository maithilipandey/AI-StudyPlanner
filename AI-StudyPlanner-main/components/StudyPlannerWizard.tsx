'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StudentDetailsForm } from './forms/StudentDetailsForm'
import { SubjectsForm } from './forms/SubjectsForm'
import { AvailabilityForm } from './forms/AvailabilityForm'
import { ProgressBar } from './ProgressBar'
import { generateStudyPlan } from '@/lib/studyPlanGenerator'
import { BookOpen } from 'lucide-react'

type FormStep = 'student' | 'subjects' | 'availability'

interface StudentData {
  name: string
  college: string
  branch: string
  graduationYear: number
  email: string
}

interface Subject {
  id: string
  name: string
  credits: number
  strongAreas: string
  weakAreas: string
  confidenceLevel: number
}

interface AvailabilityData {
  weekdayHours: number
  weekendHours: number
  preferredTime: string
  targetDate: string
}

interface StudyPlannerWizardProps {
  onPlanGenerated: (plan: any) => void
}

export function StudyPlannerWizard({ onPlanGenerated }: StudyPlannerWizardProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('student')
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(false)

  const steps = ['Student Details', 'Subjects', 'Availability']
  const currentIndex = steps.indexOf(
    currentStep === 'student' ? 'Student Details' : currentStep === 'subjects' ? 'Subjects' : 'Availability'
  )

  const handleStudentSubmit = (data: StudentData) => {
    setStudentData(data)
    setCurrentStep('subjects')
  }

  const handleSubjectsSubmit = (subjectList: Subject[]) => {
    setSubjects(subjectList)
    setCurrentStep('availability')
  }

  const handleAvailabilitySubmit = async (data: AvailabilityData) => {
    setAvailabilityData(data)
    setLoading(true)

    // Generate the study plan
    const plan = generateStudyPlan({
      student: studentData!,
      subjects,
      availability: data,
    })

    setLoading(false)
    onPlanGenerated(plan)
  }

  const handleBack = () => {
    if (currentStep === 'subjects') setCurrentStep('student')
    else if (currentStep === 'availability') setCurrentStep('subjects')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Study Planner</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Build your personalized study schedule for engineering success
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentIndex} totalSteps={steps.length} labels={steps} />

        {/* Form Card */}
        <Card className="p-8 mb-6 shadow-lg">
          {currentStep === 'student' && <StudentDetailsForm onSubmit={handleStudentSubmit} />}

          {currentStep === 'subjects' && (
            <SubjectsForm
              onSubmit={handleSubjectsSubmit}
              initialSubjects={subjects}
              studentName={studentData?.name || ''}
            />
          )}

          {currentStep === 'availability' && (
            <AvailabilityForm
              onSubmit={handleAvailabilitySubmit}
              isLoading={loading}
              studentName={studentData?.name || ''}
              subjectCount={subjects.length}
            />
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 'student' || loading}
            className="flex-1 bg-transparent"
          >
            Back
          </Button>
          {currentStep === 'student' && (
            <Button
              onClick={() => {
                // Form will handle submission via onSubmit
              }}
              className="flex-1"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
