"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  updateEquipmentProfile,
  updatePlateInventory,
  updateAvailableEquipment,
  type EquipmentData,
} from "../actions/equipment-actions";
import { type EquipmentKey } from "@/db/schema/equipment";
import Link from "next/link";
import { Calculator, Minus, Plus } from "lucide-react";

interface EquipmentFormProps {
  initialData: EquipmentData;
}

const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  bench: "Banco",
  rack: "Rack",
  barbell: "Barra olímpica",
  dumbbells: "Mancuernas",
  elliptical: "Elíptica",
  sandbag: "Bolsa de arena",
  abwheel: "Rueda abdominal",
  mat_board: "Colchoneta/Tabla",
  bodyweight: "Peso corporal",
};

export function EquipmentForm({ initialData }: EquipmentFormProps) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileUpdate = (field: "barbellWeightKg" | "dumbbellHandleWeightKg", value: string) => {
    const numValue = parseFloat(value) || 0;

    startTransition(async () => {
      const result = await updateEquipmentProfile({ [field]: numValue });

      if (result.success) {
        setData(prev => ({
          ...prev,
          profile: { ...prev.profile, [field]: numValue },
        }));
        showMessage("success", "Guardado");
      } else {
        showMessage("error", result.error || "Error al guardar");
      }
    });
  };

  const handlePlateUpdate = (plateWeightKg: number, newCount: number) => {
    if (newCount < 0) return;

    startTransition(async () => {
      const result = await updatePlateInventory({ plateWeightKg, count: newCount });

      if (result.success) {
        setData(prev => ({
          ...prev,
          plates: prev.plates.map(p =>
            p.plateWeightKg === plateWeightKg ? { ...p, count: newCount } : p
          ),
        }));
        showMessage("success", "Guardado");
      } else {
        showMessage("error", result.error || "Error al guardar");
      }
    });
  };

  const handleEquipmentToggle = (key: EquipmentKey, enabled: boolean) => {
    startTransition(async () => {
      const result = await updateAvailableEquipment({ key, enabled });

      if (result.success) {
        setData(prev => ({
          ...prev,
          equipment: prev.equipment.map(e => (e.key === key ? { ...e, enabled } : e)),
        }));
      } else {
        showMessage("error", result.error || "Error al guardar");
      }
    });
  };

  const getPlateCount = (weightKg: number) => {
    return data.plates.find(p => p.plateWeightKg === weightKg)?.count || 0;
  };

  return (
    <div className="space-y-6">
      {/* Message toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            message.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header with nav */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipamiento</h1>
          <p className="text-muted-foreground">Configurá tu inventario y equipo disponible</p>
        </div>
        <Link href="/equipment/calculator">
          <Button variant="outline">
            <Calculator className="mr-2 h-4 w-4" />
            Calculadora
          </Button>
        </Link>
      </div>

      {/* Base Weights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pesos base</CardTitle>
          <CardDescription>Configurá el peso de tu barra y manerales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="barbellWeight">Peso de la barra (kg)</Label>
              <Input
                id="barbellWeight"
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={data.profile.barbellWeightKg}
                onChange={e => handleProfileUpdate("barbellWeightKg", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dumbbellHandle">Peso del maneral (kg)</Label>
              <Input
                id="dumbbellHandle"
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={data.profile.dumbbellHandleWeightKg}
                onChange={e => handleProfileUpdate("dumbbellHandleWeightKg", e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plate Inventory Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de discos</CardTitle>
          <CardDescription>Cantidad total de discos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* 5kg plates */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Discos de 5 kg</p>
                <p className="text-sm text-muted-foreground">
                  {getPlateCount(5)} unidades
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePlateUpdate(5, getPlateCount(5) - 1)}
                  disabled={isPending || getPlateCount(5) <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-mono text-lg">{getPlateCount(5)}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePlateUpdate(5, getPlateCount(5) + 1)}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 2.5kg plates */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Discos de 2.5 kg</p>
                <p className="text-sm text-muted-foreground">
                  {getPlateCount(2.5)} unidades
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePlateUpdate(2.5, getPlateCount(2.5) - 1)}
                  disabled={isPending || getPlateCount(2.5) <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-mono text-lg">{getPlateCount(2.5)}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePlateUpdate(2.5, getPlateCount(2.5) + 1)}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Equipment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Equipamiento disponible</CardTitle>
          <CardDescription>Indicá qué equipo tenés en tu gym</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.equipment.map(item => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <Label htmlFor={`equipment-${item.key}`} className="font-medium cursor-pointer">
                  {EQUIPMENT_LABELS[item.key as EquipmentKey] || item.key}
                </Label>
                <Switch
                  id={`equipment-${item.key}`}
                  checked={item.enabled}
                  onCheckedChange={checked =>
                    handleEquipmentToggle(item.key as EquipmentKey, checked)
                  }
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
