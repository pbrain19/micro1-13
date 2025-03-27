interface BaseSchedule {
  id: string;
  title: string;
  medicationName: string;
  details: string;
  dateToAdminister: Date;
  isComplete: boolean;
  doctorName: string;
}

export type VaccinationSchedule = BaseSchedule;

export type MedicationSchedule = BaseSchedule;

export type AppointmentSchedule = BaseSchedule;
