"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  EQUIPMENT_KEYS,
  EQUIPMENT_LABELS,
  PLATE_WEIGHTS,
  type EquipmentKey,
  type PlateWeight,
} from "@/features/equipment/lib/constants";
import type { EquipmentState } from "@/features/equipment/lib/types";

const parseNumber = (value: string) =>
  value.trim() === "" ? NaN : Number(value);

export function EquipmentSettings({ initialState }: { initialState: EquipmentState }) {
  const [profile, setProfile] = useState({
    barbellWeightKg: initialState.profile.barbellWeightKg.toString(),
    dumbbellHandleWeightKg: initialState.profile.dumbbellHandleWeightKg.toString(),
  });
  const [plates, setPlates] = useState<Record<PlateWeight, string>>({
    5: initialState.plates[5].toString(),
    2.5: initialState.plates[2.5].toString(),
  });
  const [available, setAvailable] = useState(initialState.available);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateProfileState = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const updatePlateState = (weight: PlateWeight, value: string) => {
    setPlates((prev) => ({ ...prev, [weight]: value }));
  };

  const handleProfileSave = async () => {
    const barbell = parseNumber(profile.barbellWeightKg);
    const dumbbell = parseNumber(profile.dumbbellHandleWeightKg);

    if (!Number.isFinite(barbell) || barbell < 0 || !Number.isFinite(dumbbell) || dumbbell < 0) {
      setStatusMessage("Ingresá pesos base válidos (>= 0).");
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/equipment/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbellWeightKg: barbell,
          dumbbellHandleWeightKg: dumbbell,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setStatusMessage(data.error ?? "No se pudo guardar los pesos base.");
        return;
      }

      setStatusMessage("Pesos base guardados.");
    } finally {
      setSaving(false);
    }
  };

  const handlePlateSave = async () => {
    const updates = PLATE_WEIGHTS.map((weight) => {
      const parsed = parseNumber(plates[weight]);
      return { weight, count: parsed };
    });

    if (updates.some(({ count }) => !Number.isInteger(count) || count < 0)) {
      setStatusMessage("Los conteos deben ser enteros >= 0.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      for (const { weight, count } of updates) {
        const response = await fetch("/equipment/api/plates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plateWeightKg: weight, count }),
        });

        if (!response.ok) {
          const data = await response.json();
          setStatusMessage(data.error ?? "No se pudo guardar el inventario.");
          return;
        }
      }

      setStatusMessage("Inventario guardado.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (key: EquipmentKey) => {
    const nextValue = !available[key];
    setAvailable((prev) => ({ ...prev, [key]: nextValue }));

    const response = await fetch("/equipment/api/available", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled: nextValue }),
    });

    if (!response.ok) {
      setAvailable((prev) => ({ ...prev, [key]: !nextValue }));
      const data = await response.json();
      setStatusMessage(data.error ?? "No se pudo guardar el equipamiento.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pesos base</CardTitle>
          <CardDescription>
            Definí el peso de la barra y de los manerales de las mancuernas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Barra (kg)</span>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={profile.barbellWeightKg}
                onChange={(event) => updateProfileState("barbellWeightKg", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Maneral (kg)</span>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={profile.dumbbellHandleWeightKg}
                onChange={(event) =>
                  updateProfileState("dumbbellHandleWeightKg", event.target.value)
                }
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleProfileSave} disabled={saving}>
              Guardar pesos base
            </Button>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/equipment/calculator">
              Ir al Load Calculator →
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventario de discos</CardTitle>
          <CardDescription>Contá cuántos discos tenés disponibles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {PLATE_WEIGHTS.map((weight) => (
              <label key={weight} className="space-y-2">
                <span className="text-sm font-medium">{weight} kg</span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={plates[weight]}
                  onChange={(event) => updatePlateState(weight, event.target.value)}
                />
              </label>
            ))}
          </div>
          <Button type="button" onClick={handlePlateSave} disabled={saving}>
            Guardar inventario
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipamiento disponible</CardTitle>
          <CardDescription>Activá lo que tenés en casa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {EQUIPMENT_KEYS.map((key) => (
              <label
                key={key}
                className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2"
              >
                <span className="text-sm font-medium">{EQUIPMENT_LABELS[key]}</span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={available[key]}
                  onChange={() => handleToggle(key)}
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {statusMessage && (
        <p className="text-sm text-muted-foreground" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
}
