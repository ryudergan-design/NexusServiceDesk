"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  fromDate?: Date
}

export function DatePicker({ date, setDate, placeholder = "Selecione", disabled, fromDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-bold bg-black/40 border-white/10 h-10 transition-all",
            !date && "text-white/20",
            disabled && "opacity-50 cursor-not-allowed bg-white/5",
            date && "text-primary border-primary/20 bg-primary/5"
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
          {date ? format(date, "dd 'de' MMM, yyyy", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-950 border-white/10 shadow-2xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            setOpen(false) // Fecha o popup automaticamente ao selecionar
          }}
          initialFocus
          locale={ptBR}
          disabled={(date) => (fromDate ? date < fromDate : false)}
        />
      </PopoverContent>
    </Popover>
  )
}
