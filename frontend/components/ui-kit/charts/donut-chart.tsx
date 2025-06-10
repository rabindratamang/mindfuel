"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DataPoint[]
  size?: number
  strokeWidth?: number
  showLabels?: boolean
  showValues?: boolean
  animated?: boolean
  className?: string
}

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 20,
  showLabels = true,
  showValues = false,
  animated = true,
  className,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, item) => sum + item.value, 0)

  let cumulativePercentage = 0

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700"
          />

          {/* Data segments */}
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference)

            cumulativePercentage += percentage

            return (
              <motion.circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={animated ? { strokeDasharray: `0 ${circumference}` } : {}}
                animate={animated ? { strokeDasharray } : {}}
                transition={{
                  duration: 1,
                  delay: animated ? index * 0.2 : 0,
                  ease: "easeInOut",
                }}
              />
            )
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLabels && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={animated ? { opacity: 0, x: -10 } : {}}
              animate={animated ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: animated ? index * 0.1 : 0 }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.label}</span>
              {showValues && <span className="text-sm text-slate-500 dark:text-slate-400">({item.value})</span>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
