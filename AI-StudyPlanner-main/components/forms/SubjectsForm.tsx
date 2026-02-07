'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

interface Subject {
  id: string
  name: string
  credits: number
  strongAreas: string
  weakAreas: string
  confidenceLevel: number
}

interface SubjectsFormProps {
  onSubmit: (subjects: Subject[]) => void
  initialSubjects: Subject[]
  studentName: string
}

export function SubjectsForm({ onSubmit, initialSubjects, studentName }: SubjectsFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects.length > 0 ? initialSubjects : [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      credits: 3,
      strongAreas: '',
      weakAreas: '',
      confidenceLevel: 3,
    }
    setSubjects([...subjects, newSubject])
    setEditingId(newSubject.id)
  }

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    // Clear error for this field
    const errorKey = `${id}-${field}`
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (subjects.length === 0) {
      newErrors.subjects = 'Please add at least one subject'
    }

    subjects.forEach((subject) => {
      if (!subject.name.trim()) newErrors[`${subject.id}-name`] = 'Subject name is required'
      if (subject.credits < 1 || subject.credits > 8) newErrors[`${subject.id}-credits`] = 'Credits must be between 1-8'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(subjects)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Your Subjects</h2>
        <p className="text-muted-foreground">
          Hi {studentName}, please add all subjects you need to study for, along with their difficulty areas.
        </p>
      </div>

      {errors.subjects && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{errors.subjects}</p>}

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {subjects.map((subject) => (
          <Card key={subject.id} className="p-4 border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-foreground">Subject {subjects.indexOf(subject) + 1}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSubject(subject.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`name-${subject.id}`} className="text-xs font-medium">
                    Subject Name
                  </Label>
                  <Input
                    id={`name-${subject.id}`}
                    placeholder="e.g., Data Structures"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    className={errors[`${subject.id}-name`] ? 'border-destructive text-sm' : 'text-sm'}
                  />
                  {errors[`${subject.id}-name`] && (
                    <p className="text-xs text-destructive">{errors[`${subject.id}-name`]}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`credits-${subject.id}`} className="text-xs font-medium">
                    Credits
                  </Label>
                  <Input
                    id={`credits-${subject.id}`}
                    type="number"
                    min="1"
                    max="8"
                    value={subject.credits}
                    onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value))}
                    className={errors[`${subject.id}-credits`] ? 'border-destructive text-sm' : 'text-sm'}
                  />
                  {errors[`${subject.id}-credits`] && (
                    <p className="text-xs text-destructive">{errors[`${subject.id}-credits`]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor={`strong-${subject.id}`} className="text-xs font-medium">
                  Strong Areas (e.g., Arrays, Linked Lists)
                </Label>
                <Input
                  id={`strong-${subject.id}`}
                  placeholder="Topics you're confident with"
                  value={subject.strongAreas}
                  onChange={(e) => updateSubject(subject.id, 'strongAreas', e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={`weak-${subject.id}`} className="text-xs font-medium">
                  Weak Areas (e.g., Trees, Graphs)
                </Label>
                <Input
                  id={`weak-${subject.id}`}
                  placeholder="Topics you struggle with"
                  value={subject.weakAreas}
                  onChange={(e) => updateSubject(subject.id, 'weakAreas', e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={`confidence-${subject.id}`} className="text-xs font-medium">
                  Confidence Level: {subject.confidenceLevel}/5
                </Label>
                <input
                  id={`confidence-${subject.id}`}
                  type="range"
                  min="1"
                  max="5"
                  value={subject.confidenceLevel}
                  onChange={(e) => updateSubject(subject.id, 'confidenceLevel', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Struggling</span>
                  <span>Very Confident</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addSubject}
        className="w-full bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Subject
      </Button>

      <Button type="submit" className="w-full">
        Continue to Availability
      </Button>
    </form>
  )
}
