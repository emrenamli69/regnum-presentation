'use client'

import { TrendingUp, TrendingDown } from "lucide-react"

export const Badge = ({ count }: { count: number }) => {
  const getColor = (count: number) => {
    if (count >= 10) return "bg-purple-500"
    if (count >= 7) return "bg-blue-500"
    if (count >= 5) return "bg-green-500"
    if (count >= 3) return "bg-yellow-500"
    return "bg-gray-500"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor(count)} text-white`}>
      {count}x
    </span>
  )
}

export const DonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted-foreground"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary"
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
    </div>
  )
}

export const PercentageChange = ({ value }: { value: number }) => {
  const isPositive = value > 0
  const Icon = isPositive ? TrendingUp : TrendingDown
  const color = isPositive ? "text-green-600" : "text-red-600"

  return (
    <div className={`flex items-center ${color} text-sm mt-1`}>
      <Icon className="w-4 h-4 mr-1" />
      <span>{Math.abs(value)}% from last week</span>
    </div>
  )
}