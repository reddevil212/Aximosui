"use client"

import * as React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  isAfter,
  parse,
  startOfDay,
  isValid,
  addYears,
  subYears
} from "date-fns"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"

// Define the days of the week
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Define the interface for the day props
interface DayProps {
  date: Date
  isSelected: boolean
  isToday: boolean
  isDisabled: boolean
  isWithinRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isWeekend: boolean
  isHoliday?: boolean
  holidayName?: string
  onClick: (date: Date) => void
  onHover?: (date: Date) => void
}

// Define the calendar props
interface CalendarProps {
  initialDate?: Date
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[]) => void
  mode?: "single" | "multiple" | "range"
  minDate?: Date
  maxDate?: Date
  disabled?: Date[]
  className?: string
  highlightToday?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  inputMode?: boolean
  theme?: "light" | "dark" | "auto"
  holidays?: Array<{ date: Date; name: string }>
  onViewChange?: (month: Date) => void
  yearNavigation?: boolean
  showWeekNumbers?: boolean
}

// Holiday utility function
const isHoliday = (date: Date, holidays: Array<{ date: Date; name: string }> = []) => {
  return holidays.find(holiday => isSameDay(holiday.date, date))
}

const CalendarDay: React.FC<DayProps> = ({
  date,
  isSelected,
  isToday,
  isDisabled,
  isWithinRange,
  isRangeStart,
  isRangeEnd,
  isWeekend,
  isHoliday,
  holidayName,
  onClick,
  onHover,
}) => {
  const variants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  const dayButton = (
    <motion.button
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover && onHover(date)}
      disabled={isDisabled}
      aria-label={format(date, "PPPP")}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-zinc-700 dark:focus:ring-zinc-300 focus:ring-offset-2",
        isDisabled && "cursor-not-allowed opacity-50",
        isSelected && "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950",
        !isSelected && !isDisabled && "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isToday && !isSelected && "border border-zinc-300 dark:border-zinc-700",
        isWithinRange && "bg-zinc-100 dark:bg-zinc-800",
        (isRangeStart || isRangeEnd) && "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950",
        isWeekend && !isSelected && !isDisabled && "text-zinc-500 dark:text-zinc-400",
        isHoliday && !isSelected && !isDisabled && "text-red-500 dark:text-red-400",
      )}
    >
      {format(date, "d")}
      {isToday && (
        <motion.div
          layoutId="today-indicator"
          className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-950 dark:bg-white"
        />
      )}
      {isHoliday && (
        <motion.div
          className="absolute -top-1 right-0 h-2 w-2 rounded-full bg-red-500"
        />
      )}
    </motion.button>
  )

  return holidayName ? (
    <Tooltip content={holidayName}>
      {dayButton}
    </Tooltip>
  ) : (
    dayButton
  )
}

export const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  selected,
  onSelect,
  mode = "single",
  minDate,
  maxDate,
  disabled = [],
  className,
  highlightToday = true,
  weekStartsOn = 0,
  inputMode = false,
  theme = "auto",
  holidays = [],
  onViewChange,
  yearNavigation = false,
  showWeekNumbers = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate))
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [inputDate, setInputDate] = useState<string>("")
  const [animationDirection, setAnimationDirection] = useState(0)

  // Handle theme changes
  useEffect(() => {
    if (theme === "auto" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Notify parent component when view changes
  useEffect(() => {
    onViewChange?.(currentMonth)
  }, [currentMonth, onViewChange])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn })
    return eachDayOfInterval({ start, end })
  }, [currentMonth, weekStartsOn])

  const weeks = useMemo(() => {
    const weeks = []
    let currentWeek = []

    for (const day of days) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    return weeks
  }, [days])

  const weekNumbers = useMemo(() => {
    if (!showWeekNumbers) return []

    return weeks.map(week => {
      return format(week[0], 'w')
    })
  }, [weeks, showWeekNumbers])

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true
    if (maxDate && isAfter(date, startOfDay(maxDate))) return true
    return disabled.some(disabledDate => isSameDay(date, disabledDate))
  }, [minDate, maxDate, disabled])

  const handleDateSelect = useCallback((date: Date) => {
    if (!onSelect) return

    if (mode === "single") {
      onSelect(date)
    } else if (mode === "multiple") {
      const dates = (selected as Date[] || [])
      const isSelected = dates.some(d => isSameDay(d, date))
      onSelect(isSelected
        ? dates.filter(d => !isSameDay(d, date))
        : [...dates, date]
      )
    } else if (mode === "range") {
      const dates = (selected as Date[] || [])
      if (dates.length === 0 || dates.length === 2) {
        onSelect([date])
      } else {
        const [start] = dates
        onSelect(isBefore(date, start) ? [date, start] : [start, date])
      }
    }
  }, [mode, onSelect, selected])

  const handleDateHover = useCallback((date: Date) => {
    if (mode === "range") {
      setHoveredDate(date)
    }
  }, [mode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputDate(value)

    const parsedDate = parse(value, "yyyy-MM-dd", new Date())
    if (isValid(parsedDate)) {
      setCurrentMonth(startOfMonth(parsedDate))
      onSelect?.(parsedDate)
    }
  }

  const navigateMonth = useCallback((direction: number) => {
    setAnimationDirection(direction)
    setCurrentMonth(direction > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1))
  }, [currentMonth])

  const navigateYear = useCallback((direction: number) => {
    setAnimationDirection(direction)
    setCurrentMonth(direction > 0 ? addYears(currentMonth, 1) : subYears(currentMonth, 1))
  }, [currentMonth])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  }

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-md bg-white dark:bg-zinc-950 text-black dark:text-white",
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        {yearNavigation && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateYear(-1)}
            className="rounded-full p-1 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Previous year"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-3" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateMonth(-1)}
          className="rounded-full p-2 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <AnimatePresence mode="wait" custom={animationDirection}>
          <motion.h2
            key={format(currentMonth, "MMMM yyyy")}
            custom={animationDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-lg font-semibold flex items-center gap-2 text-black dark:text-white"
          >
            <CalendarIcon className="h-5 w-5" />
            {format(currentMonth, "MMMM yyyy")}
          </motion.h2>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateMonth(1)}
          className="rounded-full p-2 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>

        {yearNavigation && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateYear(1)}
            className="rounded-full p-1 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Next year"
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-3" />
          </motion.button>
        )}
      </div>

      {inputMode && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="date"
              value={inputDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 text-black dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)' }}>
        {showWeekNumbers && (
          <div className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Wk</div>
        )}

        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{day}</div>
        ))}

        <AnimatePresence mode="wait" custom={animationDirection}>
          <motion.div
            key={format(currentMonth, "yyyy-MM")}
            custom={animationDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid col-span-full"
            style={{ gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)' }}
          >
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {showWeekNumbers && (
                  <div className="flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {weekNumbers[weekIndex]}
                  </div>
                )}

                {week.map((day, dayIndex) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isToday = highlightToday && isSameDay(day, new Date())
                  const isDisabled = !isCurrentMonth || isDateDisabled(day)
                  const isWeekend = dayIndex === 0 || dayIndex === 6
                  const holidayInfo = isHoliday(day, holidays)

                  let isSelected = false
                  let isWithinRange = false
                  let isRangeStart = false
                  let isRangeEnd = false

                  if (mode === "single") {
                    isSelected = selected ? isSameDay(day, selected as Date) : false
                  } else if (mode === "multiple") {
                    isSelected = (selected as Date[] || []).some(d => isSameDay(d, day))
                  } else if (mode === "range") {
                    const dates = selected as Date[] || []
                    if (dates.length === 2) {
                      const [start, end] = dates
                      isWithinRange = isWithinInterval(day, { start, end })
                      isRangeStart = isSameDay(day, start)
                      isRangeEnd = isSameDay(day, end)
                    } else if (dates.length === 1 && hoveredDate) {
                      const [start] = dates
                      const range = isBefore(hoveredDate, start)
                        ? { start: hoveredDate, end: start }
                        : { start, end: hoveredDate }
                      isWithinRange = isWithinInterval(day, range)
                      isRangeStart = isSameDay(day, range.start)
                      isRangeEnd = isSameDay(day, range.end)
                    }
                  }

                  return (
                    <CalendarDay
                      key={dayIndex}
                      date={day}
                      isSelected={isSelected}
                      isToday={isToday}
                      isDisabled={isDisabled}
                      isWithinRange={isWithinRange}
                      isRangeStart={isRangeStart}
                      isRangeEnd={isRangeEnd}
                      isWeekend={isWeekend}
                      isHoliday={!!holidayInfo}
                      holidayName={holidayInfo?.name}
                      onClick={handleDateSelect}
                      onHover={handleDateHover}
                    />
                  )
                })}
              </React.Fragment>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {mode === "multiple" && Array.isArray(selected) && selected.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="font-medium text-black dark:text-white">
            {selected.length} {selected.length === 1 ? 'day' : 'days'} selected
          </p>
        </div>
      )}
    </div>
  )
}

Calendar.displayName = "Calendar"