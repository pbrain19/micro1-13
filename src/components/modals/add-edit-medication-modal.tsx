"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MedicationSchedule } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { TimePickerDemo } from "@/components/time-picker";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  medicationName: z.string().min(1, "Medication name is required"),
  details: z.string().optional(),
  dateToAdminister: z.date({
    required_error: "Date is required",
  }),
  timeToAdminister: z.date({
    required_error: "Time is required",
  }),
  doctorName: z.string().min(1, "Doctor name is required"),
  isComplete: z.boolean().optional(),
});

interface AddEditMedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medication: MedicationSchedule) => void;
  medication?: MedicationSchedule;
}

export default function AddEditMedicationModal({
  open,
  onOpenChange,
  onSave,
  medication,
}: AddEditMedicationModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: medication?.title || "",
      medicationName: medication?.medicationName || "",
      details: medication?.details || "",
      dateToAdminister: medication?.dateToAdminister || new Date(),
      timeToAdminister: medication?.dateToAdminister || new Date(),
      doctorName: medication?.doctorName || "",
    },
  });

  useEffect(() => {
    if (medication) {
      const date = medication.dateToAdminister;
      form.reset({
        title: medication.title,
        medicationName: medication.medicationName,
        details: medication.details,
        dateToAdminister: date,
        timeToAdminister: date,
        doctorName: medication.doctorName,
      });
    } else {
      form.reset({
        title: "",
        medicationName: "",
        details: "",
        dateToAdminister: new Date(),
        timeToAdminister: new Date(),
        doctorName: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medication, open]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine date and time
    const dateToAdminister = new Date(values.dateToAdminister);
    const timeToAdminister = new Date(values.timeToAdminister);

    dateToAdminister.setHours(
      timeToAdminister.getHours(),
      timeToAdminister.getMinutes()
    );

    onSave({
      id: medication?.id || "",
      title: values.title,
      medicationName: values.medicationName,
      details: values.details || "",
      dateToAdminister,
      isComplete: values.isComplete || false,
      doctorName: values.doctorName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {medication ? "Edit Medication" : "Add Medication"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Heartworm Prevention" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="HeartGuard Plus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about the medication"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex min-sm:flex-row flex-col justify-between ">
              <FormField
                control={form.control}
                name="dateToAdminister"
                render={({ field }) => (
                  <FormItem className="flex flex-col max-sm:mb-4 mb-0 ">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeToAdminister"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <TimePickerDemo
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
