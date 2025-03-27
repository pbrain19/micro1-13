import PetHealthTracker from "@/components/pet-health-tracker";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6 max-w-[800px]">
      <h1 className="text-3xl font-bold mb-6">Pet Health Tracker</h1>
      <PetHealthTracker />
    </main>
  );
}
