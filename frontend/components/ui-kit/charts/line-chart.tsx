"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
  label: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  color?: string
  strokeWidth?: number
  showDots?: boolean
  showGrid?: boolean
  animated?: boolean
  className?: string
}

export function LineChart({
  data,
  height = 200,
  color = "#14b8a6",
  strokeWidth = 2,
  showDots = true,
  showGrid = true,
  animated = true,
  className,
}: LineChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = React.useState({ width: 0, height })

  React.useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [height])

  if (!data.length || !dimensions.width) {
    return <div className={cn("w-full", className)} style={{ height }} />
  }

  const padding = 20
  const chartWidth = dimensions.width - padding * 2
  const chartHeight = dimensions.height - padding * 2

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const valueRange = maxValue - minValue || 1

  const points = data.map((point, index) => ({
    x: padding + (index / (data.length - 1)) * chartWidth,
    y: padding + ((maxValue - point.value) / valueRange) * chartHeight,
    value: point.value,
    label: point.label,
  }))

  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")

  return (
    <div className={cn("w-full", className)}>
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {/* Horizontal grid lines */}
            {Array.from({ length: 5 }, (_, i) => {
              const y = padding + (i / 4) * chartHeight
              return (
                <line
                  key={`h-${i}`}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={1}
                />
              )
            })}
            {/* Vertical grid lines */}
            {points.map((point, index) => (
              <line
                key={`v-${index}`}
                x1={point.x}
                y1={padding}
                x2={point.x}
                y2={padding + chartHeight}
                stroke="currentColor"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Line path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {showDots &&
          points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
              initial={animated ? { scale: 0 } : {}}
              animate={animated ? { scale: 1 } : {}}
              transition={{ duration: 0.3, delay: animated ? index * 0.1 : 0 }}
              className="cursor-pointer"
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </motion.circle>
          ))}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
        {data.map((point, index) => (
          <span key={index}>{point.label}</span>
        ))}
      </div>
    </div>
  )
}
