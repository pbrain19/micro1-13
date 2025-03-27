"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard";
import VaccinationManager from "@/components/vaccination-manager";
import MedicationManager from "@/components/medication-manager";
import AppointmentManager from "@/components/appointment-manager";
import { Syringe, Pill, Calendar } from "lucide-react";
import type {
  VaccinationSchedule,
  MedicationSchedule,
  AppointmentSchedule,
} from "@/lib/types";

export default function PetHealthTracker() {
  // State for all record types
  const [vaccinations, setVaccinations] = useState<VaccinationSchedule[]>([
    {
      id: "v1",
      title: "Annual Rabies Shot",
      medicationName: "Rabies Vaccine",
      details: "Required by law, administered annually",
      dateToAdminister: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isComplete: false,
      doctorName: "Dr. Smith",
    },
  ]);

  const [medications, setMedications] = useState<MedicationSchedule[]>([
    {
      id: "m1",
      title: "Heartworm Prevention",
      medicationName: "HeartGuard Plus",
      details: "Monthly oral medication",
      dateToAdminister: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      isComplete: false,
      doctorName: "Dr. Smith",
    },
  ]);

  const [appointments, setAppointments] = useState<AppointmentSchedule[]>([
    {
      id: "a1",
      title: "Annual Checkup",
      medicationName: "N/A",
      details: "Routine wellness exam",
      dateToAdminister: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isComplete: false,
      doctorName: "Dr. Smith",
    },
  ]);

  // Handler functions for CRUD operations
  const handleAddVaccination = (vaccination: VaccinationSchedule) => {
    setVaccinations([...vaccinations, vaccination]);
  };

  const handleUpdateVaccination = (updatedVaccination: VaccinationSchedule) => {
    setVaccinations(
      vaccinations.map((v) =>
        v.id === updatedVaccination.id ? updatedVaccination : v
      )
    );
  };

  const handleDeleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter((v) => v.id !== id));
  };

  const handleAddMedication = (medication: MedicationSchedule) => {
    setMedications([...medications, medication]);
  };

  const handleUpdateMedication = (updatedMedication: MedicationSchedule) => {
    setMedications(
      medications.map((m) =>
        m.id === updatedMedication.id ? updatedMedication : m
      )
    );
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleAddAppointment = (appointment: AppointmentSchedule) => {
    setAppointments([...appointments, appointment]);
  };

  const handleUpdateAppointment = (updatedAppointment: AppointmentSchedule) => {
    setAppointments(
      appointments.map((a) =>
        a.id === updatedAppointment.id ? updatedAppointment : a
      )
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <Dashboard
        vaccinations={vaccinations}
        medications={medications}
        appointments={appointments}
        onUpdateVaccination={handleUpdateVaccination}
        onUpdateMedication={handleUpdateMedication}
        onUpdateAppointment={handleUpdateAppointment}
      />

      <Tabs defaultValue="vaccinations" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger
            value="vaccinations"
            className="flex items-center justify-center max-sm:w-[95px]"
          >
            <Syringe className="h-4 w-4 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Vaccinations</span>
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="flex items-center justify-center max-sm:w-[95px]"
          >
            <Pill className="h-4 w-4 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex items-center justify-center max-sm:w-[95px]"
          >
            <Calendar className="h-4 w-4 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vaccinations">
          <VaccinationManager
            vaccinations={vaccinations}
            onAdd={handleAddVaccination}
            onUpdate={handleUpdateVaccination}
            onDelete={handleDeleteVaccination}
          />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationManager
            medications={medications}
            onAdd={handleAddMedication}
            onUpdate={handleUpdateMedication}
            onDelete={handleDeleteMedication}
          />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentManager
            appointments={appointments}
            onAdd={handleAddAppointment}
            onUpdate={handleUpdateAppointment}
            onDelete={handleDeleteAppointment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
