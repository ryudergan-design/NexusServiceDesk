import { addMinutes, isBefore, isAfter, setHours, setMinutes, startOfNextDay, isWeekend, getDay, differenceInMinutes } from "date-fns"

const BUSINESS_START_HOUR = 9
const BUSINESS_END_HOUR = 18

/**
 * Calcula uma data futura considerando o horário comercial:
 * Seg-Sex: 09:00 - 18:00
 * Sáb: 09:00 - 12:00
 * Domingos e feriados são ignorados (simplificado para MVP)
 */
export function calculateSLA(startDate: Date, minutesToAdd: number): Date {
  let currentDate = new Date(startDate)
  let minutesRemaining = minutesToAdd

  while (minutesRemaining > 0) {
    const dayOfWeek = getDay(currentDate) // 0 = Domingo, 6 = Sábado
    const isSaturday = dayOfWeek === 6
    const isSunday = dayOfWeek === 0

    // Se for Domingo, pula para Segunda 09:00
    if (isSunday) {
      currentDate = setMinutes(setHours(startOfNextDay(currentDate), BUSINESS_START_HOUR), 0)
      continue
    }

    const endHour = isSaturday ? 12 : BUSINESS_END_HOUR
    const businessEnd = setMinutes(setHours(new Date(currentDate), endHour), 0)
    const businessStart = setMinutes(setHours(new Date(currentDate), BUSINESS_START_HOUR), 0)

    // Se estiver antes do horário comercial do dia, ajusta para o início
    if (isBefore(currentDate, businessStart)) {
      currentDate = businessStart
    }

    // Se estiver após o horário comercial do dia, pula para o próximo dia 09:00
    if (isAfter(currentDate, businessEnd) || currentDate.getTime() === businessEnd.getTime()) {
      currentDate = setMinutes(setHours(startOfNextDay(currentDate), BUSINESS_START_HOUR), 0)
      continue
    }

    // Calcula quantos minutos restam no dia comercial atual
    const minutesLeftInDay = (businessEnd.getTime() - currentDate.getTime()) / 60000
    const minutesToConsume = Math.min(minutesRemaining, minutesLeftInDay)

    currentDate = addMinutes(currentDate, minutesToConsume)
    minutesRemaining -= minutesToConsume
  }

  return currentDate
}

/**
 * Calcula quantos minutos de horário comercial existem entre duas datas.
 */
export function calculateBusinessMinutes(startDate: Date, endDate: Date): number {
  if (isAfter(startDate, endDate)) return 0

  let current = new Date(startDate)
  const target = new Date(endDate)
  let minutes = 0

  while (isBefore(current, target)) {
    const dayOfWeek = getDay(current)
    const isSaturday = dayOfWeek === 6
    const isSunday = dayOfWeek === 0

    if (isSunday) {
      current = setMinutes(setHours(startOfNextDay(current), BUSINESS_START_HOUR), 0)
      continue
    }

    const endHour = isSaturday ? 12 : BUSINESS_END_HOUR
    const businessStart = setMinutes(setHours(new Date(current), BUSINESS_START_HOUR), 0)
    const businessEnd = setMinutes(setHours(new Date(current), endHour), 0)

    if (isBefore(current, businessStart)) {
      current = businessStart
      if (isAfter(current, target)) break
    }

    if (isAfter(current, businessEnd) || current.getTime() === businessEnd.getTime()) {
      current = setMinutes(setHours(startOfNextDay(current), BUSINESS_START_HOUR), 0)
      continue
    }

    // Agora current está dentro do horário comercial
    const nextStep = Math.min(target.getTime(), businessEnd.getTime())
    minutes += (nextStep - current.getTime()) / 60000
    current = new Date(nextStep)
  }

  return Math.round(minutes)
}
