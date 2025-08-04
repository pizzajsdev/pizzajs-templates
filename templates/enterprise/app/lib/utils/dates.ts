import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const dayJsExtended = dayjs

export function addSecondsToDate(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000)
}

export function isDateExpired(expirationDate: Date): boolean {
  return Date.now() >= expirationDate.getTime()
}

export function newDate(value?: number | string | Date): Date {
  if (value) {
    return new Date(value)
  }
  return new Date()
}

export function formatDateToUTCString(date: Date): string {
  return date.toLocaleDateString('es-ES', { timeZone: 'UTC' })
}

export function newDateUTC(value?: number | string | Date): Date {
  const date = newDate(value)
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  )
}

export function dateToUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  )
}

export function newDateUTCDayBeginning(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
}

export function newDateUTCDayEnd(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 998))
}

export function newDateUTCMonthBeginning(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0))
}

export function newDateUTCMonthEnd(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 998))
}

export function newFutureDate(addedMilliseconds: number): Date {
  return new Date(Date.now() + addedMilliseconds)
}

export function nowMs(): number {
  return Date.now()
}

export function relativeTimeFromNow(date: string | Date): string {
  return dayJsExtended(date).fromNow()
}

export function dateToDbTimestamp(date: string | Date): string {
  return dayJsExtended(date).format('YYYY-MM-DD HH:mm:ss')
}
