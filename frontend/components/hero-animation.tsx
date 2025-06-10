"use client"
import { motion } from "framer-motion"

export function HeroAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Background gradient circle */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-300/30 to-sky-300/30 dark:from-teal-900/30 dark:to-sky-900/30 blur-xl"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Orbiting elements */}
          <OrbitalElement color="bg-teal-500" size="w-6 h-6" duration={12} delay={0} distance={140} />
          <OrbitalElement color="bg-sky-400" size="w-4 h-4" duration={8} delay={2} distance={120} />
          <OrbitalElement color="bg-indigo-400" size="w-5 h-5" duration={15} delay={1} distance={160} />

          {/* Center brain icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 0 rgba(45, 212, 191, 0.4)",
                "0 0 20px rgba(45, 212, 191, 0.6)",
                "0 0 0 rgba(45, 212, 191, 0.4)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 md:w-16 md:h-16 text-teal-500"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44l-2-4A2.5 2.5 0 0 1 2.5 14h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-1a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5h1a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-1A2.5 2.5 0 0 1 5 .5" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44l2-4A2.5 2.5 0 0 0 21.5 14h-1a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h1a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5h-1a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h1A2.5 2.5 0 0 0 19 .5" />
            </motion.svg>
          </motion.div>

          {/* Pulse rings */}
          <PulseRing delay={0} />
          <PulseRing delay={1.5} />
        </div>
      </div>
    </div>
  )
}

function OrbitalElement({
  color,
  size,
  duration,
  delay,
  distance,
}: {
  color: string
  size: string
  duration: number
  delay: number
  distance: number
}) {
  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 rounded-full ${color} ${size}`}
      style={{ x: -10, y: -10 }}
      animate={{
        x: [
          Math.cos(0) * distance - 10,
          Math.cos(Math.PI / 2) * distance - 10,
          Math.cos(Math.PI) * distance - 10,
          Math.cos((3 * Math.PI) / 2) * distance - 10,
          Math.cos(2 * Math.PI) * distance - 10,
        ],
        y: [
          Math.sin(0) * distance - 10,
          Math.sin(Math.PI / 2) * distance - 10,
          Math.sin(Math.PI) * distance - 10,
          Math.sin((3 * Math.PI) / 2) * distance - 10,
          Math.sin(2 * Math.PI) * distance - 10,
        ],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: duration,
        ease: "linear",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Number.POSITIVE_INFINITY,
        delay: delay,
        scale: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      }}
      whileHover={{ scale: 1.5 }}
    />
  )
}

function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full border border-teal-400 dark:border-teal-600"
      initial={{ width: 80, height: 80, x: -40, y: -40, opacity: 0.8 }}
      animate={{
        width: [80, 200],
        height: [80, 200],
        x: [-40, -100],
        y: [-40, -100],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeOut",
        repeat: Number.POSITIVE_INFINITY,
        delay: delay,
      }}
    />
  )
}
