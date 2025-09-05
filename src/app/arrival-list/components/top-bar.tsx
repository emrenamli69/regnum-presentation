'use client'

import Image from 'next/image'
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, DownloadIcon, FileTextIcon } from "lucide-react"
import { useState } from "react"

interface TopBarProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  onExportPDF: () => void
}

export function TopBar({ date, setDate, onExportPDF }: TopBarProps) {
  const [email, setEmail] = useState("")

  return (
    <div className="w-full bg-white border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-8">
          <Image
            src="/REGNUM_LOGO_COLOR_R.svg"
            alt="Regnum Logo"
            width={80}
            height={50}
          />
          <h1 className="text-xl font-bold">Arrival List Report</h1>
        </div>
        <div className="flex items-center space-x-2 hide-in-pdf">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toDateString() : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Export Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter an email to send the report to or export as PDF.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={() => alert(`Sending report to ${email}`)}>
                    Send Report
                  </Button>
                  <Button onClick={onExportPDF} className="mt-2">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Export to PDF
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="container mx-auto p-4 show-in-pdf pdf-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Image
              src="/REGNUM_LOGO_COLOR_R.svg"
              alt="Regnum Logo"
              width={80}
              height={50}
            />
            <h1 className="text-xl font-bold">Arrival List Report</h1>
          </div>
          <p>Date: {date ? date.toDateString() : "Not selected"}</p>
        </div>
      </div>
    </div>
  )
}