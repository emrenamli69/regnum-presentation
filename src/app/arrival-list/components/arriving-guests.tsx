'use client'

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export const ArrivingGuests = () => {
  const guests = [
    { name: "Smith Family", room: "101", adults: 2, children: 2, arrivalTime: "14:00" },
    { name: "John Doe", room: "301", adults: 1, children: 0, arrivalTime: "15:30" },
    { name: "Johnson Family", room: "303", adults: 2, children: 1, arrivalTime: "16:00" },
    { name: "Jane Smith", room: "401", adults: 1, children: 0, arrivalTime: "14:45" },
    { name: "Brown Family", room: "205", adults: 2, children: 3, arrivalTime: "17:15" },
    { name: "Robert Johnson", room: "512", adults: 1, children: 0, arrivalTime: "18:00" },
    { name: "Garcia Couple", room: "308", adults: 2, children: 0, arrivalTime: "16:30" },
    { name: "Wilson Group", room: "501", adults: 4, children: 0, arrivalTime: "19:00" }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arriving Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Adults</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Arrival Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest, index) => (
              <TableRow key={index}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.room}</TableCell>
                <TableCell>{guest.adults}</TableCell>
                <TableCell>{guest.children}</TableCell>
                <TableCell>{guest.arrivalTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}