'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LightbulbIcon, Users, TrendingUp, RotateCcw, Gift, Star, Bell } from "lucide-react"
import { Separator } from "./ui/separator"

const InsightItem = ({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>, title: string, description: string }) => (
  <div className="flex items-start space-x-2 p-2">
    <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
    <div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
)

const RecommendationItem = ({ icon: Icon, description }: { icon: React.ComponentType<{ className?: string }>, description: string }) => (
  <li className="flex items-start space-x-2 mb-2">
    <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
    <span className="text-xs">{description}</span>
  </li>
)

export function AIInsights() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <LightbulbIcon className="mr-2 h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 grid-cols-3">
          <InsightItem
            icon={Users}
            title="Family-Oriented"
            description="60% are families with children"
          />
          <InsightItem
            icon={TrendingUp}
            title="Teen Increase"
            description="30% more teens vs last month"
          />
          <InsightItem
            icon={RotateCcw}
            title="Repeat Visitors"
            description="25% are repeat guests"
          />
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-2 text-sm">Key Recommendations:</h3>
          <ul className="space-y-1">
            <RecommendationItem
              icon={Gift}
              description="Offer welcome packages for families with age-appropriate items."
            />
            <RecommendationItem
              icon={Star}
              description="Personalized welcome notes for repeat guests."
            />
            <RecommendationItem
              icon={Bell}
              description="Brief staff on returning guests' preferences."
            />
            <RecommendationItem
              icon={Bell}
              description="Prepare extra pool and recreational equipment."
            />
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}