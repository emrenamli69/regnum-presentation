'use client'

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, LightbulbIcon, Home, ShoppingBag, Percent } from "lucide-react"
import { Badge } from "./shared-components"

interface Guest {
  name: string;
  visitCount: number;
  currentRoom: string;
  previousStays: string[];
  previousComplaints: string[];
  preferences: string;
  roomRevenue: number;
  extraExpenditures: number;
  aiInsights: string;
}

const RepeatGuestCard = ({ guest }: { guest: Guest }) => {
  const spendingCoefficient = (guest.extraExpenditures / guest.roomRevenue).toFixed(2);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{guest.name} <Badge count={guest.visitCount} /></span>
          <span className="text-sm font-normal text-muted-foreground">Room: {guest.currentRoom}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <h4 className="font-semibold mb-1">Preferences & Previous Stays</h4>
            <p className="mb-1">{guest.preferences}</p>
            <h5 className="font-semibold mb-1">Previous Stays:</h5>
            <ul className="list-disc pl-4 space-y-0">
              {guest.previousStays.map((stay: string, index: number) => (
                <li key={index}>{stay}</li>
              ))}
            </ul>
            <h5 className="font-semibold mt-2 mb-1">Complaints:</h5>
            <ul className="list-disc pl-4 space-y-0">
              {guest.previousComplaints.length > 0 ? (
                guest.previousComplaints.map((complaint: string, index: number) => (
                  <li key={index} className="text-red-500">{complaint}</li>
                ))
              ) : (
                <li>No complaints</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center">
              <LightbulbIcon className="h-3 w-3 mr-1 text-yellow-500" />
              AI Insights
            </h4>
            <p>{guest.aiInsights}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Expenditure</h4>
            <div className="flex items-center space-x-1 mb-1">
              <Home className="h-3 w-3 text-blue-500" />
              <span>Room: ${guest.roomRevenue}</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <ShoppingBag className="h-3 w-3 text-green-500" />
              <span>Extra: ${guest.extraExpenditures}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total: </span>
              <span className="font-bold">${guest.roomRevenue + guest.extraExpenditures}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center">
              <Percent className="h-3 w-3 mr-1 text-purple-500" />
              Spending Coefficient
            </h4>
            <div className="text-lg font-bold">{spendingCoefficient}</div>
            <p className="text-[10px] text-muted-foreground">
              (Extra / Room Revenue)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const RepeatGuests = () => {
  const repeatGuests = [
    {
      name: "John Doe",
      visitCount: 5,
      currentRoom: "301",
      previousStays: ["Room 205 (Jan 2023)", "Room 301 (Aug 2022)", "Room 118 (Mar 2022)"],
      previousComplaints: ["Noisy air conditioning (Aug 2022)"],
      preferences: "Prefers rooms with a city view, often uses the gym, and enjoys the breakfast buffet.",
      roomRevenue: 2500,
      extraExpenditures: 800,
      aiInsights: "John is a loyal guest who values fitness and healthy eating. Consider offering a complimentary spa session or a personalized workout plan to enhance his stay."
    },
    {
      name: "Jane Smith",
      visitCount: 3,
      currentRoom: "401",
      previousStays: ["Room 401 (Nov 2022)", "Room 210 (Jun 2022)"],
      previousComplaints: [],
      preferences: "Always books a suite, frequently uses room service, and has shown interest in local art exhibitions.",
      roomRevenue: 3200,
      extraExpenditures: 1500,
      aiInsights: "Jane appreciates luxury and cultural experiences. Recommend exclusive local art events or offer a curated in-room art experience to exceed her expectations."
    },
    {
      name: "Robert Johnson",
      visitCount: 7,
      currentRoom: "512",
      previousStays: ["Room 512 (Feb 2023)", "Room 512 (Oct 2022)", "Room 510 (Jul 2022)", "Room 512 (Apr 2022)"],
      previousComplaints: ["Slow room service (Oct 2022)", "Wi-Fi issues (Jul 2022)"],
      preferences: "Always requests room 512 if available, heavy user of business center, prefers quiet floors.",
      roomRevenue: 4200,
      extraExpenditures: 600,
      aiInsights: "Robert is a creature of habit and values consistency. Ensure room 512 is impeccable and consider upgrading the in-room coffee machine as he's a frequent user."
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Repeat Guests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {repeatGuests.map((guest, index) => (
          <RepeatGuestCard key={index} guest={guest} />
        ))}
      </CardContent>
    </Card>
  )
}