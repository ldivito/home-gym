import { getEquipmentData } from "@/features/equipment/actions/equipment-actions";
import { EquipmentForm } from "@/features/equipment/components/equipment-form";

export const metadata = {
  title: "Equipamiento | Home Gym",
  description: "Configurá tu equipamiento de gimnasio",
};

export default async function EquipmentPage() {
  const data = await getEquipmentData();

  return (
    <main className="container max-w-2xl py-8 px-4">
      <EquipmentForm initialData={data} />
    </main>
  );
}
