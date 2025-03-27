"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePickerDemo({ date, setDate }: TimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const [hour, setHour] = useState<number>(date ? date.getHours() : 0);
  const [minute, setMinute] = useState<number>(date ? date.getMinutes() : 0);
  const [isPM, setIsPM] = useState<boolean>(
    date ? date.getHours() >= 12 : false
  );

  useEffect(() => {
    if (date) {
      setHour(
        date.getHours() > 12
          ? date.getHours() - 12
          : date.getHours() === 0
          ? 12
          : date.getHours()
      );
      setMinute(date.getMinutes());
      setIsPM(date.getHours() >= 12);
    }
  }, [date]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setHour(0);
      return;
    }

    if (value > 12) {
      setHour(12);
    } else if (value < 0) {
      setHour(0);
    } else {
      setHour(value);
    }

    if (value.toString().length >= 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setMinute(0);
      return;
    }

    if (value > 59) {
      setMinute(59);
    } else if (value < 0) {
      setMinute(0);
    } else {
      setMinute(value);
    }
  };

  const togglePM = () => {
    setIsPM(!isPM);
  };

  useEffect(() => {
    const newDate = new Date(date);
    const hours = isPM
      ? hour === 12
        ? 12
        : hour + 12
      : hour === 12
      ? 0
      : hour;
    newDate.setHours(hours);
    newDate.setMinutes(minute);

    // Prevent infinite loop by checking if the time actually changed before setting
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const hasTimeChanged =
      (isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour) !==
        currentHours || minute !== currentMinutes;

    if (hasTimeChanged) {
      setDate(newDate);
    }
  }, [hour, minute, isPM]);

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-1 text-center">
        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
          <div className="px-3 py-2 flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            ref={hourRef}
            className="w-10 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={hour}
            onChange={handleHourChange}
            type="number"
            min={1}
            max={12}
          />
          <span className="text-sm">:</span>
          <Input
            ref={minuteRef}
            className="w-10 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={minute.toString().padStart(2, "0")}
            onChange={handleMinuteChange}
            type="number"
            min={0}
            max={59}
          />
          <Button
            type="button"
            variant="ghost"
            className="rounded-l-none px-3"
            onClick={togglePM}
          >
            {isPM ? "PM" : "AM"}
          </Button>
        </div>
      </div>
    </div>
  );
}
