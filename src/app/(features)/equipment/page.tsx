import { Header } from "@/components/header";
import { EquipmentSettings } from "@/features/equipment/components/equipment-settings";
import { getEquipmentState } from "@/features/equipment/server/state";

export default async function EquipmentPage() {
  const state = await getEquipmentState();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
          <p className="text-muted-foreground mt-2">
            Configurá tus pesos base, inventario y equipamiento disponible.
          </p>
        </div>
        <EquipmentSettings initialState={state} />
      </main>
    </div>
  );
}
