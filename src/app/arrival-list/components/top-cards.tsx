'use client'

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Baby, UserPlus, User, Trophy } from "lucide-react"
import { DonutChart, PercentageChange } from "./shared-components"

export const TopCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Arrivals</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mt-4 mb-2">24</div>
          <p className="text-xs text-muted-foreground">Total people arriving today</p>
          <PercentageChange value={15} />
        </CardContent>
      </Card>
      <div className="col-span-1 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adults</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">18</div>
            <p className="text-xs text-muted-foreground">Adult guests arriving</p>
            <PercentageChange value={8} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kids</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Infants</p>
                <Baby className="h-4 w-4 mx-auto mt-1 text-muted-foreground" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Free</p>
                <User className="h-4 w-4 mx-auto mt-1 text-muted-foreground" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Paid</p>
                <User className="h-4 w-4 mx-auto mt-1 text-muted-foreground" />
              </div>
            </div>
            <PercentageChange value={-12} />
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Loyalty Members</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32">
              <DonutChart percentage={75} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Percentage of loyalty members arriving</p>
            <PercentageChange value={5} />
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}