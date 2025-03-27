"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import type { MedicationSchedule } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DateTimePickerForm } from "@/components/ui/date-time-picker";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  medicationName: z.string().min(1, "Medication name is required"),
  details: z.string().optional(),
  dateToAdminister: z.date({
    required_error: "Date is required",
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
      doctorName: medication?.doctorName || "",
    },
  });

  useEffect(() => {
    if (medication) {
      form.reset({
        title: medication.title,
        medicationName: medication.medicationName,
        details: medication.details,
        dateToAdminister: medication.dateToAdminister,
        doctorName: medication.doctorName,
      });
    } else {
      form.reset({
        title: "",
        medicationName: "",
        details: "",
        dateToAdminister: new Date(),
        doctorName: "",
      });
    }
  }, [medication, form, open]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: medication?.id || Math.random().toString(),
      title: values.title,
      medicationName: values.medicationName,
      details: values.details || "",
      dateToAdminister: values.dateToAdminister,
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
            <FormField
              control={form.control}
              name="dateToAdminister"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePickerForm
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
