import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VaccinationSchedule, MedicationSchedule, AppointmentSchedule } from "@/lib/types"
import { Calendar, Pill, Syringe, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface DashboardProps {
  vaccinations: VaccinationSchedule[]
  medications: MedicationSchedule[]
  appointments: AppointmentSchedule[]
}

export default function Dashboard({ vaccinations, medications, appointments }: DashboardProps) {
  // Get the next upcoming item of each type (not completed and soonest date)
  const nextVaccination = vaccinations
    .filter((v) => !v.isComplete)
    .sort((a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime())[0]

  const nextMedication = medications
    .filter((m) => !m.isComplete)
    .sort((a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime())[0]

  const nextAppointment = appointments
    .filter((a) => !a.isComplete)
    .sort((a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime())[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Health Events</CardTitle>
        <CardDescription>The next scheduled items for your pet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {nextVaccination && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Next Vaccination</CardTitle>
                  <Syringe className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <h3 className="font-medium">{nextVaccination.title}</h3>
                <p className="text-sm text-muted-foreground">{nextVaccination.medicationName}</p>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(nextVaccination.dateToAdminister)}
                </div>
              </CardContent>
            </Card>
          )}

          {nextMedication && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Next Medication</CardTitle>
                  <Pill className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <h3 className="font-medium">{nextMedication.title}</h3>
                <p className="text-sm text-muted-foreground">{nextMedication.medicationName}</p>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(nextMedication.dateToAdminister)}
                </div>
              </CardContent>
            </Card>
          )}

          {nextAppointment && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Next Appointment</CardTitle>
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <h3 className="font-medium">{nextAppointment.title}</h3>
                <p className="text-sm text-muted-foreground">With {nextAppointment.doctorName}</p>
                <div className="mt-2 flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(nextAppointment.dateToAdminister)}
                </div>
              </CardContent>
            </Card>
          )}

          {!nextVaccination && !nextMedication && !nextAppointment && (
            <div className="col-span-3 text-center py-6">
              <p className="text-muted-foreground">No upcoming health events. Add some using the tabs below.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

