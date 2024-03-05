import { format, formatDistance, subDays } from "date-fns"
import React, { useLayoutEffect, useState } from "react"

export default function DateFormatter({ data, distance, _format }) {
    const [date, updateDate] = useState("")

    useLayoutEffect(() => {
        try {
            if (distance)
                updateDate(
                    formatDistance(data, new Date(), {
                        addSuffix: true,
                        includeSeconds: true,
                    }),
                )
            else updateDate(format(new Date(data), _format || "PPp"))
        } catch (error) {
            Formatter.date = new Date(data)
            updateDate(Formatter.format())
        }
    }, [data, _format, distance])

    return date !== "less than 5 seconds ago" ? date : "just now"
}

class CSDateTime {
    constructor(date, dateOnly = true, timeOnly = false, dateAndTime = false) {
        if (!date) {
            this.date = new Date()
        } else {
            this.date = new Date(date)
        }
        this.dateOnly = dateOnly
        this.timeOnly = timeOnly
        this.dateAndTime = dateAndTime
    }

    getTime() {
        const hr = this.date.getHours() + 1
        let min = this.date.getMinutes() + 1

        if (min < 10) {
            min = `0${min}`
        }

        return `${hr}:${min}`
    }

    getMinutes() {
        return this.date.getMinutes().toString()
    }

    getHours() {
        return this.date.getHours().toString()
    }

    getDay() {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
        return days[this.date.getDay()]
    }

    getMonth() {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        return months[this.date.getMonth()]
    }

    getDate() {
        return this.date.getDate().toString()
    }

    format(type = "celesup") {
        if (type === "celesup") {
            // ? 50min ago, 1hr ago, yesterday, thu, 14 mar

            let formattedDate
            const currentDate = new Date()

            if (checkThisYear(this.date, currentDate)) {
                if (checkThisWeek(this.date, currentDate)) {
                    // TODAY
                    if (checkToday(this.date, currentDate)) {
                        if (checkHourPast(this.date, currentDate)) {
                            const fmt =
                                currentDate.getMinutes() -
                                Number(this.getMinutes())

                            if (fmt < 1) {
                                formattedDate = "just now"
                            } else {
                                formattedDate = `${
                                    currentDate.getMinutes() -
                                    Number(this.getMinutes())
                                }min ago`
                            }
                        } else {
                            formattedDate = `${
                                currentDate.getHours() - Number(this.getHours())
                            }hr ago`
                        }
                        // Yesterday
                    } else if (checkYesterDay(this.date, currentDate)) {
                        formattedDate = this.getTime() + ` yesterday`
                    } else {
                        formattedDate = `${this.getDay()} ${this.getTime()}`
                    }

                    // Last Month
                } else {
                    formattedDate = `${this.getDay()} ${this.getDate()} ${this.getMonth()} ${this.date.getFullYear()}`
                }
            } else {
                formattedDate = `${this.getDate()} ${this.getMonth()} ${this.date.getFullYear()}`
            }
            return formattedDate
        }
    }
}

function checkToday(prevDate, currentDate) {
    if (currentDate.getDate() - prevDate.getDate() !== 0) return false
    return true
}

function checkHourPast(prevDate, currentDate) {
    if (currentDate.getHours() - prevDate.getHours() !== 0) return false
    return true
}

function checkYesterDay(prevDate, currentDate) {
    if (currentDate.getDate() - prevDate.getDate() !== 1) return false
    return true
}

function checkThisWeek(prevDate, currentDate) {
    if (currentDate.getDate() - prevDate.getDate() > 6) return false
    return true
}

function checkThisYear(prevDate, currentDate) {
    if (currentDate.getFullYear() - prevDate.getFullYear() !== 0) return false
    return true
}

const Formatter = new CSDateTime()
