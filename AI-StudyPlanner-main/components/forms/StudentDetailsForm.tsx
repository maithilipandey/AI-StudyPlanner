'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface StudentDetailsFormProps {
  onSubmit: (data: {
    name: string
    college: string
    branch: string
    graduationYear: number
    email: string
  }) => void
}

export function StudentDetailsForm({ onSubmit }: StudentDetailsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    branch: '',
    graduationYear: new Date().getFullYear(),
    email: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.college.trim()) newErrors.college = 'College name is required'
    if (!formData.branch.trim()) newErrors.branch = 'Branch/Program is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (formData.graduationYear < 2024) newErrors.graduationYear = 'Year must be 2024 or later'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value,
    }))
    // Clear error for this field
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Student Details</h2>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Aman Kumar"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="college" className="text-sm font-medium">
          College/University
        </Label>
        <Input
          id="college"
          name="college"
          type="text"
          placeholder="e.g., XYZ Institute of Technology"
          value={formData.college}
          onChange={handleChange}
          className={errors.college ? 'border-destructive' : ''}
        />
        {errors.college && <p className="text-sm text-destructive">{errors.college}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch" className="text-sm font-medium">
          Branch/Program
        </Label>
        <Input
          id="branch"
          name="branch"
          type="text"
          placeholder="e.g., Computer Science Engineering"
          value={formData.branch}
          onChange={handleChange}
          className={errors.branch ? 'border-destructive' : ''}
        />
        {errors.branch && <p className="text-sm text-destructive">{errors.branch}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="graduation" className="text-sm font-medium">
            Graduation Year
          </Label>
          <Input
            id="graduation"
            name="graduationYear"
            type="number"
            value={formData.graduationYear}
            onChange={handleChange}
            min="2024"
            className={errors.graduationYear ? 'border-destructive' : ''}
          />
          {errors.graduationYear && <p className="text-sm text-destructive">{errors.graduationYear}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., aman@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full mt-8">
        Continue to Subjects
      </Button>
    </form>
  )
}
