"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: DataPoint[]
  height?: number
  color?: string
  showValues?: boolean
  animated?: boolean
  className?: string
}

export function BarChart({
  data,
  height = 200,
  color = "#14b8a6",
  showValues = false,
  animated = true,
  className,
}: BarChartProps) {
  if (!data.length) {
    return <div className={cn("w-full", className)} style={{ height }} />
  }

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end justify-between h-full gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height
          const barColor = item.color || color

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex items-end justify-center">
                {showValues && (
                  <motion.div
                    className="absolute -top-6 text-xs font-medium text-slate-600 dark:text-slate-400"
                    initial={animated ? { opacity: 0, y: 10 } : {}}
                    animate={animated ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: animated ? index * 0.1 : 0 }}
                  >
                    {item.value}
                  </motion.div>
                )}
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{
                    backgroundColor: barColor,
                    height: barHeight,
                  }}
                  initial={animated ? { height: 0 } : {}}
                  animate={animated ? { height: barHeight } : {}}
                  transition={{
                    duration: 0.8,
                    delay: animated ? index * 0.1 : 0,
                    ease: "easeOut",
                  }}
                  whileHover={{ opacity: 0.8 }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
        {data.map((item, index) => (
          <span key={index} className="text-center flex-1">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
