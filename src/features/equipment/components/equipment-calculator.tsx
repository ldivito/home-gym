"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calcBarbellExact, calcDumbbellExact } from "@/features/equipment/lib/calc";
import { PLATE_WEIGHTS, type PlateWeight } from "@/features/equipment/lib/constants";
import type { EquipmentState } from "@/features/equipment/lib/types";

const formatPlates = (plan: Record<PlateWeight, number>) =>
  PLATE_WEIGHTS.map((weight) => `${weight}kg x ${plan[weight]}`).join(", ");

const parseNumber = (value: string) => (value.trim() === "" ? NaN : Number(value));

type TabKey = "barbell" | "dumbbells";

export function EquipmentCalculator({ initialState }: { initialState: EquipmentState }) {
  const [activeTab, setActiveTab] = useState<TabKey>("barbell");
  const [targetTotal, setTargetTotal] = useState("60");
  const [targetPerDumbbell, setTargetPerDumbbell] = useState("20");
  const [includeBarbell, setIncludeBarbell] = useState(true);
  const [includeHandle, setIncludeHandle] = useState(true);
  const [inventory, setInventory] = useState(initialState.plates);
  const [baseWeights, setBaseWeights] = useState(initialState.profile);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultDetail, setResultDetail] = useState<string | null>(null);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const derivedInventoryText = useMemo(
    () => PLATE_WEIGHTS.map((weight) => `${weight}kg: ${inventory[weight]}`).join(" · "),
    [inventory],
  );

  const handleLoadSaved = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch("/equipment/api/state");
      if (!response.ok) {
        setResultMessage("No se pudo cargar los datos guardados.");
        return;
      }
      const data: EquipmentState = await response.json();
      setInventory(data.plates);
      setBaseWeights(data.profile);
      setResultMessage("Datos guardados cargados.");
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleBarbellCalc = () => {
    const target = parseNumber(targetTotal);
    if (!Number.isFinite(target) || target <= 0) {
      setResultMessage("Ingresá un objetivo válido.");
      setResultDetail(null);
      return;
    }

    const base = includeBarbell ? baseWeights.barbellWeightKg : 0;
    const result = calcBarbellExact(target, base, inventory);
    setResultMessage(result.message);
    setResultDetail(
      `Discos por lado: ${formatPlates(result.perSide)} · Total ${result.achievedTotalKg.toFixed(
        2,
      )}kg · Diferencia ${(result.achievedTotalKg - target).toFixed(2)}kg.`,
    );
  };

  const handleDumbbellCalc = () => {
    const target = parseNumber(targetPerDumbbell);
    if (!Number.isFinite(target) || target <= 0) {
      setResultMessage("Ingresá un objetivo válido.");
      setResultDetail(null);
      return;
    }

    const base = includeHandle ? baseWeights.dumbbellHandleWeightKg : 0;
    const result = calcDumbbellExact(target, base, inventory);
    setResultMessage(result.message);
    setResultDetail(
      `Pares por mancuerna (uno por lado): ${formatPlates(result.perDumbbell)} · Total ${result.achievedKg.toFixed(
        2,
      )}kg · Diferencia ${(result.achievedKg - target).toFixed(2)}kg.`,
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Load Calculator</CardTitle>
          <CardDescription>
            Inventario actual: {derivedInventoryText}. Peso base barra {baseWeights.barbellWeightKg}
            kg · maneral {baseWeights.dumbbellHandleWeightKg}kg.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={handleLoadSaved} disabled={loadingSaved}>
            Usar datos guardados
          </Button>
          <span className="text-sm text-muted-foreground">
            Actualizá los datos desde /equipment si hiciste cambios.
          </span>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={activeTab === "barbell" ? "default" : "outline"}
          onClick={() => setActiveTab("barbell")}
        >
          Barbell
        </Button>
        <Button
          type="button"
          variant={activeTab === "dumbbells" ? "default" : "outline"}
          onClick={() => setActiveTab("dumbbells")}
        >
          Dumbbells
        </Button>
      </div>

      {activeTab === "barbell" ? (
        <Card>
          <CardHeader>
            <CardTitle>Barbell</CardTitle>
            <CardDescription>Objetivo total en la barra.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">Target total (kg)</span>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={targetTotal}
                onChange={(event) => setTargetTotal(event.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeBarbell}
                onChange={() => setIncludeBarbell((prev) => !prev)}
              />
              Incluir peso base de la barra
            </label>
            <Button type="button" onClick={handleBarbellCalc}>
              Calcular
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dumbbells</CardTitle>
            <CardDescription>Objetivo por mancuerna.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-medium">Target por mancuerna (kg)</span>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={targetPerDumbbell}
                onChange={(event) => setTargetPerDumbbell(event.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeHandle}
                onChange={() => setIncludeHandle((prev) => !prev)}
              />
              Incluir peso base del maneral
            </label>
            <Button type="button" onClick={handleDumbbellCalc}>
              Calcular
            </Button>
          </CardContent>
        </Card>
      )}

      {resultMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>{resultMessage}</CardDescription>
          </CardHeader>
          {resultDetail && <CardContent className="text-sm">{resultDetail}</CardContent>}
        </Card>
      )}
    </div>
  );
}
