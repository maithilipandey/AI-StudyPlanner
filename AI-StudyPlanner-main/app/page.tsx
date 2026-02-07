'use client'

import { useState } from 'react'
import { StudyPlannerWizard } from '@/components/StudyPlannerWizard'
import { StudyPlanDisplay } from '@/components/StudyPlanDisplay'

export default function Page() {
  const [studyPlan, setStudyPlan] = useState(null)

  return (
    <main className="min-h-screen bg-background">
      {!studyPlan ? (
        <StudyPlannerWizard onPlanGenerated={setStudyPlan} />
      ) : (
        <StudyPlanDisplay plan={studyPlan} onNewPlan={() => setStudyPlan(null)} />
      )}
    </main>
  )
}
