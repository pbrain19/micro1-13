"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isBefore, startOfDay, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerFormProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
}

export function DateTimePickerForm({
  value = new Date(),
  onChange,
  minDate,
}: DateTimePickerFormProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date && onChange) {
      // Preserve the current time when changing the date
      const newDate = new Date(date);
      newDate.setHours(value.getHours(), value.getMinutes());

      // If the new date is before minDate, set time to minDate's time
      if (minDate && isBefore(newDate, minDate)) {
        newDate.setHours(minDate.getHours(), minDate.getMinutes());
      }

      onChange(newDate);
    }
  }

  function handleTimeChange(
    type: "hour" | "minute" | "ampm",
    timeValue: string
  ) {
    if (!onChange) return;

    const newDate = new Date(value);

    if (type === "hour") {
      const hour = parseInt(timeValue, 10);
      const isPM = value.getHours() >= 12;
      newDate.setHours(isPM ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
    } else if (type === "ampm") {
      const currentHour = value.getHours();
      const hour = currentHour % 12;
      if (timeValue === "AM" && currentHour >= 12) {
        newDate.setHours(hour);
      } else if (timeValue === "PM" && currentHour < 12) {
        newDate.setHours(hour + 12);
      }
    }

    // Don't allow setting time before minDate
    if (minDate && isBefore(newDate, minDate)) {
      return;
    }

    onChange(newDate);
  }

  // Determine which hours should be disabled based on minDate
  function isHourDisabled(hour: number): boolean {
    if (!minDate) return false;
    if (!isToday(value)) return false;

    const isPM = value.getHours() >= 12;
    const actualHour = isPM ? hour + 12 : hour;
    const dateWithHour = new Date(value);
    dateWithHour.setHours(actualHour, 0, 0, 0);
    return isBefore(dateWithHour, minDate);
  }

  // Determine which minutes should be disabled based on minDate
  function isMinuteDisabled(minute: number): boolean {
    if (!minDate) return false;
    if (!isToday(value)) return false;
    if (value.getHours() !== minDate.getHours()) return false;

    const dateWithMinute = new Date(value);
    dateWithMinute.setMinutes(minute, 0, 0);
    return isBefore(dateWithMinute, minDate);
  }

  // Determine if AM/PM should be disabled based on minDate
  function isAMPMDisabled(ampm: string): boolean {
    if (!minDate || !isToday(value)) return false;

    const currentHour = value.getHours();
    const minHour = minDate.getHours();

    if (ampm === "AM") {
      // Disable AM if:
      // 1. Current time is PM and min time is in PM
      // 2. Current time is PM and min time is in AM but past the current hour
      return (
        (currentHour >= 12 && minHour >= 12) ||
        (currentHour >= 12 && minHour < 12 && currentHour % 12 < minHour)
      );
    } else {
      // Disable PM if:
      // 1. Min time is in PM and current hour (in 12h format) is less than min hour (in 12h format)
      return minHour >= 12 && currentHour % 12 < minHour % 12;
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (
            format(value, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) =>
              minDate ? isBefore(date, startOfDay(minDate)) : false
            }
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        value && value.getHours() % 12 === hour % 12
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "sm:w-full shrink-0 aspect-square",
                        isHourDisabled(hour) && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleTimeChange("hour", hour.toString())}
                      disabled={isHourDisabled(hour)}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      isMinuteDisabled(minute) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                    disabled={isMinuteDisabled(minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      value &&
                      ((ampm === "AM" && value.getHours() < 12) ||
                        (ampm === "PM" && value.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      isAMPMDisabled(ampm) && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handleTimeChange("ampm", ampm)}
                    disabled={isAMPMDisabled(ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
