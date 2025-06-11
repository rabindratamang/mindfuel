"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface RadioOption {
  id: string
  label: string
  description?: string
  value: string
}

interface AnimatedRadioGroupProps {
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function AnimatedRadioGroup({
  options,
  value,
  onValueChange,
  name,
  className,
  orientation = "vertical",
}: AnimatedRadioGroupProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      name={name}
      className={cn(orientation === "horizontal" ? "flex space-x-4" : "space-y-3", className)}
    >
      {options.map((option) => (
        <motion.div
          key={option.id}
          className={cn(
            "flex items-start space-x-3",
            orientation === "horizontal" ? "flex-col space-x-0 space-y-2 items-center" : "",
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              id={option.id}
              value={option.value}
              className="data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500"
            />
            <Label
              htmlFor={option.id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                value === option.value ? "text-teal-500" : "",
              )}
            >
              {option.label}
            </Label>
          </div>
          {option.description && (
            <p
              className={cn(
                "text-xs text-slate-500 dark:text-slate-400",
                orientation === "horizontal" ? "text-center" : "ml-6",
              )}
            >
              {option.description}
            </p>
          )}
        </motion.div>
      ))}
    </RadioGroup>
  )
}
