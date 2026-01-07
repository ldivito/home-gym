import Link from "next/link";
import { Header } from "@/components/header";
import { EquipmentCalculator } from "@/features/equipment/components/equipment-calculator";
import { getEquipmentState } from "@/features/equipment/server/state";

export default async function EquipmentCalculatorPage() {
  const state = await getEquipmentState();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto space-y-6 px-4 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Load Calculator</h1>
          <p className="text-muted-foreground">
            Calculá la carga por lado o por mancuerna con tu inventario actual.
          </p>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/equipment">
            ← Volver a configuración
          </Link>
        </div>
        <EquipmentCalculator initialState={state} />
      </main>
    </div>
  );
}
