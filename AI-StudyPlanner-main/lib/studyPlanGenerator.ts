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

interface WeeklyFocus {
  week: number
  subjects: {
    subjectName: string
    focusTopics: string[]
    hoursAllocated: number
    priority: string
  }[]
  keyMilestones: string[]
}

interface SubjectPlan {
  subjectName: string
  totalHours: number
  percentageAllocation: number
  allocation: string
  keyTopics: string[]
  weeklyBreakdown: number[]
  estimatedConfidenceImprovement: number
}

interface StudyPlan {
  studentName: string
  targetDate: string
  daysRemaining: number
  totalAvailableHours: number
  schedule: DailyTask[]
  weeklyFocuses: WeeklyFocus[]
  subjectPlans: SubjectPlan[]
  nextWeekFocus: string
  completionTimeline: string
  confidenceBoost: string
  tips: string[]
}

export function generateStudyPlan(input: {
  student: StudentData
  subjects: Subject[]
  availability: AvailabilityData
}): StudyPlan {
  const { student, subjects, availability } = input

  // Calculate available hours
  const targetDate = new Date(availability.targetDate)
  const today = new Date()
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const weekdaysPerWeek = 5
  const weekendDays = 2
  const weeksRemaining = daysRemaining / 7

  const totalAvailableHours =
    availability.weekdayHours * weekdaysPerWeek * weeksRemaining +
    availability.weekendHours * weekendDays * weeksRemaining

  // Calculate cognitive load and priority scores
  const subjectsWithScores = subjects.map((subject) => {
    // Lower confidence = higher priority
    const confidenceFactor = (5 - subject.confidenceLevel) / 5
    // More credits = higher priority
    const creditsFactor = subject.credits / 8
    // Has weak areas = higher priority
    const hasWeakAreas = subject.weakAreas ? 0.3 : 0
    const priorityScore = confidenceFactor * 0.4 + creditsFactor * 0.4 + hasWeakAreas * 0.2
    const cognitiveLevelIndex = subject.confidenceLevel <= 2 ? 0 : subject.confidenceLevel <= 3 ? 1 : 2

    return { ...subject, priorityScore, cognitiveLevelIndex }
  })

  // Sort by priority
  const sortedSubjects = subjectsWithScores.sort((a, b) => b.priorityScore - a.priorityScore)

  // Allocate hours based on priority
  const subjectPlans = sortedSubjects.map((subject) => {
    const allocationPercentage = (subject.priorityScore / sortedSubjects.reduce((sum, s) => sum + s.priorityScore, 0)) * 100
    const allocatedHours = (allocationPercentage / 100) * totalAvailableHours

    // Extract topics from weak areas (these get more focus)
    const keyTopics = []
    if (subject.weakAreas) {
      keyTopics.push(...subject.weakAreas.split(',').map((t) => t.trim()))
    }
    if (subject.strongAreas && keyTopics.length < 3) {
      keyTopics.push(...subject.strongAreas.split(',').map((t) => t.trim()).slice(0, 3 - keyTopics.length))
    }

    // Generate weekly breakdown (learning vs practice vs revision)
    const weeks = Math.ceil(weeksRemaining)
    const weeklyHours = allocatedHours / weeks
    const weeklyBreakdown = Array(weeks)
      .fill(0)
      .map((_, week) => {
        const baseHours = weeklyHours
        // Intensive early on weak areas, then shift to revision
        const progressFactor = week / weeks
        return Math.round(baseHours * (1 - progressFactor * 0.2))
      })

    // Estimate confidence improvement
    const improvementPotential = 5 - subject.confidenceLevel
    const estimatedImprovement = Math.min(improvementPotential, Math.round(improvementPotential * (allocatedHours / 50)))

    // Determine allocation justification
    let allocation = ''
    if (subject.confidenceLevel <= 2 && subject.credits >= 4) {
      allocation =
        'High priority: Low confidence + High credits. Intensive focus on foundational concepts and weak areas.'
    } else if (subject.confidenceLevel <= 2) {
      allocation = 'Medium-high priority: Low confidence. Focus on understanding weak topics thoroughly.'
    } else if (subject.credits >= 4) {
      allocation =
        'Medium priority: Higher credits require more time. Balanced learning and practice approach.'
    } else {
      allocation = 'Medium-low priority: Good confidence, lighter load to consolidate understanding.'
    }

    return {
      subjectName: subject.name,
      totalHours: Math.round(allocatedHours),
      percentageAllocation: Math.round(allocationPercentage),
      allocation,
      keyTopics,
      weeklyBreakdown,
      estimatedConfidenceImprovement: estimatedImprovement,
    }
  })

  // Generate schedule
  const schedule: DailyTask[] = []
  let currentDate = new Date(today)
  const maxTasksPerDay = 3

  const subjectQueue = subjectsWithScores.flatMap((subject) => {
    const hours = subjectPlans.find((p) => p.subjectName === subject.name)?.totalHours || 0
    const tasksNeeded = Math.ceil(hours / 1.5) // Average 1.5 hours per task

    const topics = subject.weakAreas
      ? subject.weakAreas.split(',').map((t) => t.trim())
      : subject.strongAreas.split(',').map((t) => t.trim())

    return Array(tasksNeeded)
      .fill(0)
      .map((_, i) => ({
        subject: subject.name,
        topic: topics[i % topics.length] || subject.name,
        subjectId: subject.id,
        hours: 1.5,
        priority: i < Math.ceil(tasksNeeded * 0.4) ? 'high' : i < Math.ceil(tasksNeeded * 0.7) ? 'medium' : 'low',
      }))
  })

  let taskIndex = 0
  let dayOfWeekIndex = 0
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

  while (currentDate <= targetDate && taskIndex < subjectQueue.length) {
    const dayOfWeek = daysOfWeek[currentDate.getDay()]
    const availableHours = isWeekend(currentDate) ? availability.weekendHours : availability.weekdayHours
    let hoursUsed = 0

    for (let i = 0; i < maxTasksPerDay && taskIndex < subjectQueue.length; i++) {
      const task = subjectQueue[taskIndex]
      const taskHours = Math.min(task.hours, availableHours - hoursUsed)

      if (taskHours > 0.5) {
        // Determine task type based on progress through schedule
        const progressPercentage = taskIndex / subjectQueue.length
        let taskType: 'learning' | 'practice' | 'revision' | 'buffer'
        if (progressPercentage < 0.4) {
          taskType = 'learning'
        } else if (progressPercentage < 0.7) {
          taskType = 'practice'
        } else if (progressPercentage < 0.9) {
          taskType = 'revision'
        } else {
          taskType = 'buffer'
        }

        const focusLevelMap: Record<string, 'high' | 'medium' | 'low'> = {
          high: 'high',
          medium: 'medium',
          low: 'low',
        }

        schedule.push({
          date: currentDate.toISOString().split('T')[0],
          dayOfWeek,
          subject: task.subject,
          topic: task.topic,
          taskType,
          hours: taskHours,
          priority: task.priority as 'high' | 'medium' | 'low',
          focusLevel: focusLevelMap[task.priority] || 'medium',
        })

        hoursUsed += taskHours
        taskIndex++
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Generate weekly focuses
  const weeklyFocuses: WeeklyFocus[] = []
  for (let week = 0; week < Math.ceil(weeksRemaining); week++) {
    const weekSubjects = sortedSubjects.slice(0, Math.min(2, sortedSubjects.length))

    weeklyFocuses.push({
      week: week + 1,
      subjects: weekSubjects.map((subject) => ({
        subjectName: subject.name,
        focusTopics: subject.weakAreas
          ? subject.weakAreas.split(',').map((t) => t.trim()).slice(0, 2)
          : subject.strongAreas.split(',').map((t) => t.trim()).slice(0, 2),
        hoursAllocated: Math.round(
          ((subjectPlans.find((p) => p.subjectName === subject.name)?.totalHours || 0) / Math.ceil(weeksRemaining)) *
            0.7
        ),
        priority: subject.confidenceLevel <= 2 ? 'High Priority' : 'Medium Priority',
      })),
      keyMilestones: [
        `Complete foundational topics in ${weekSubjects[0]?.name}`,
        `Start practice problems for weak areas`,
        `Review and consolidate Week ${week} concepts`,
      ],
    })
  }

  // Build insights
  const topPrioritySubject = sortedSubjects[0]
  const topPriorityTopics = topPrioritySubject.weakAreas
    ? topPrioritySubject.weakAreas.split(',').slice(0, 2).join(', ')
    : topPrioritySubject.strongAreas?.split(',').slice(0, 2).join(', ') || topPrioritySubject.name

  const nextWeekFocus = `Next 7 days focus: ${topPriorityTopics}`

  const completionTimeline = `${daysRemaining} days remaining | ~${Math.round(totalAvailableHours)} total study hours available`

  const avgConfidenceBoost = Math.round(
    subjectPlans.reduce((sum, p) => sum + p.estimatedConfidenceImprovement, 0) / subjectPlans.length
  )
  const confidenceBoost = `Expected confidence improvement: +${avgConfidenceBoost} levels across subjects`

  const tips = [
    'Schedule high-focus topics during your preferred study time for maximum effectiveness.',
    'Review weak areas from previous weeks before moving to new topics.',
    'Take 5-10 minute breaks every 45-50 minutes to maintain focus and retention.',
    'Use active recall and spaced repetition for better long-term retention.',
    'Adjust your schedule if confidence levels change - track weekly checkpoints.',
  ]

  return {
    studentName: student.name,
    targetDate: availability.targetDate,
    daysRemaining,
    totalAvailableHours: Math.round(totalAvailableHours),
    schedule,
    weeklyFocuses,
    subjectPlans,
    nextWeekFocus,
    completionTimeline,
    confidenceBoost,
    tips,
  }
}
