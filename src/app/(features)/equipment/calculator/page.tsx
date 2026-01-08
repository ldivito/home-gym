import { getEquipmentData } from "@/features/equipment/actions/equipment-actions";
import { LoadCalculator } from "@/features/equipment/components/load-calculator";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calculadora de carga | Home Gym",
  description: "Calculá los discos necesarios para tu peso objetivo",
};

export default async function CalculatorPage() {
  const data = await getEquipmentData();

  return (
    <main className="container max-w-2xl py-8 px-4">
      <LoadCalculator savedData={data} />
    </main>
  );
}
