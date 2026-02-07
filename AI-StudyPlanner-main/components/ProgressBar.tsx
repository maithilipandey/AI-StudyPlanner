interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                index <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < labels.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`text-xs font-medium transition-all ${
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
