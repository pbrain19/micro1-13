import PetHealthTracker from "@/components/pet-health-tracker";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6 max-w-[800px]">
      <div className="flex flex-row justify-between ">
        <h1 className="text-3xl max-sm:text-2xl font-bold mb-6">
          Pet Health Tracker
        </h1>
        <ThemeToggle />
      </div>
      <PetHealthTracker />
    </main>
  );
}
