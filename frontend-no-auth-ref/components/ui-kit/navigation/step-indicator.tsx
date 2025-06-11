"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex", orientation === "horizontal" ? "items-center" : "flex-col", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = onStepClick && (isCompleted || isCurrent)

        return (
          <React.Fragment key={step.id}>
            <motion.div
              className={cn(
                "flex items-center",
                orientation === "vertical" ? "flex-col text-center" : "",
                isClickable ? "cursor-pointer" : "",
              )}
              onClick={() => isClickable && onStepClick(index)}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              <div className="flex items-center">
                <motion.div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
                    isCompleted
                      ? "border-teal-500 bg-teal-500 text-white"
                      : isCurrent
                        ? "border-teal-500 bg-white text-teal-500 dark:bg-slate-900"
                        : "border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.icon ? step.icon : index + 1}
                </motion.div>

                {orientation === "horizontal" && (
                  <div className="ml-3">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isCurrent
                          ? "text-teal-500"
                          : isCompleted
                            ? "text-slate-900 dark:text-slate-50"
                            : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">{step.description}</div>
                    )}
                  </div>
                )}
              </div>

              {orientation === "vertical" && (
                <div className="mt-2">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCurrent
                        ? "text-teal-500"
                        : isCompleted
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">{step.description}</div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div
                className={cn(
                  orientation === "horizontal"
                    ? "mx-4 h-px w-12 bg-slate-300 dark:bg-slate-600"
                    : "my-4 h-12 w-px bg-slate-300 dark:bg-slate-600",
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: (index + 0.5) * 0.1 }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
