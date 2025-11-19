"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Calendar22({date, onSetDate, label}) {
  const [open, setOpen] = React.useState(false)
//   const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 h-full justify-between font-semibold text-text/50 bg-main shadow-sm ring-main-dark outline-main-dark border-none hover:bg-main-"
          >
            {date ? date : label}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            onSelect={(date) => {
                onSetDate(date)
                setOpen(false)
            }}
            />
        </PopoverContent>
      </Popover>
    </div>
  )
}
