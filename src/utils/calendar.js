export function googleCalendarUrl({ title, details, start, end }) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title || "ShadowMeet",
    details: details || "",
    dates: `${fmt(start)}/${fmt(end)}`
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function icsContent({ title, description, start, end, code }) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const uid = `${code || "meet"}@shadowmeet`
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ShadowMeet//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title || "ShadowMeet"}`,
    `DESCRIPTION:${(description || "")} Code: ${code || ""}`.slice(0, 200),
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n")
}

export function downloadIcs(filename, content) {
  const blob = new Blob([content], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
