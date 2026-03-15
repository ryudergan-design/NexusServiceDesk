export const CLOSED_TICKET_STATUSES = ["COMPLETED", "RESOLVED"] as const

export function isClosedTicketStatus(status?: string | null) {
  return CLOSED_TICKET_STATUSES.includes((status || "") as (typeof CLOSED_TICKET_STATUSES)[number])
}
