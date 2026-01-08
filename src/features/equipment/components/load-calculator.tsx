"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calcBarbellExact, calcDumbbellExact, type CalcResult, type PlateCount } from "../lib/calc";
import { type EquipmentData } from "../actions/equipment-actions";
import Link from "next/link";
import { ArrowLeft, Check, AlertTriangle, Database } from "lucide-react";

interface LoadCalculatorProps {
  savedData: EquipmentData;
}

export function LoadCalculator({ savedData }: LoadCalculatorProps) {
  // Barbell state
  const [barbellTarget, setBarbellTarget] = useState<string>("");
  const [barbellWeight, setBarbellWeight] = useState<string>(
    savedData.profile.barbellWeightKg.toString()
  );
  const [includeBarbellWeight, setIncludeBarbellWeight] = useState(true);

  // Dumbbell state
  const [dumbbellTarget, setDumbbellTarget] = useState<string>("");
  const [handleWeight, setHandleWeight] = useState<string>(
    savedData.profile.dumbbellHandleWeightKg.toString()
  );
  const [includeHandleWeight, setIncludeHandleWeight] = useState(true);

  // Plate inventory state (for custom input)
  const [plates5, setPlates5] = useState<string>(
    savedData.plates.find(p => p.plateWeightKg === 5)?.count.toString() || "4"
  );
  const [plates25, setPlates25] = useState<string>(
    savedData.plates.find(p => p.plateWeightKg === 2.5)?.count.toString() || "4"
  );

  // Memoized inventory
  const inventory: PlateCount[] = useMemo(() => [
    { weight: 5, count: parseInt(plates5) || 0 },
    { weight: 2.5, count: parseInt(plates25) || 0 },
  ], [plates5, plates25]);

  // Load saved data
  const loadSavedData = () => {
    setBarbellWeight(savedData.profile.barbellWeightKg.toString());
    setHandleWeight(savedData.profile.dumbbellHandleWeightKg.toString());
    setPlates5(savedData.plates.find(p => p.plateWeightKg === 5)?.count.toString() || "4");
    setPlates25(savedData.plates.find(p => p.plateWeightKg === 2.5)?.count.toString() || "4");
  };

  // Calculate barbell result (memoized)
  const barbellResult: CalcResult | null = useMemo(() => {
    const target = parseFloat(barbellTarget);
    const barbell = parseFloat(barbellWeight);

    if (isNaN(target) || target <= 0) {
      return null;
    }

    const effectiveBarbell = includeBarbellWeight ? barbell : 0;
    return calcBarbellExact(target, effectiveBarbell, inventory);
  }, [barbellTarget, barbellWeight, includeBarbellWeight, inventory]);

  // Calculate dumbbell result (memoized)
  const dumbbellResult: CalcResult | null = useMemo(() => {
    const target = parseFloat(dumbbellTarget);
    const handle = parseFloat(handleWeight);

    if (isNaN(target) || target <= 0) {
      return null;
    }

    const effectiveHandle = includeHandleWeight ? handle : 0;
    return calcDumbbellExact(target, effectiveHandle, inventory);
  }, [dumbbellTarget, handleWeight, includeHandleWeight, inventory]);

  // Render plate breakdown
  const renderPlateBreakdown = (perSide: PlateCount[], type: "barbell" | "dumbbell") => {
    if (perSide.length === 0) {
      return <p className="text-muted-foreground">Sin discos adicionales</p>;
    }

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {type === "barbell" ? "Por lado:" : "Por mancuerna (cada lado):"}
        </p>
        <div className="flex flex-wrap gap-2">
          {perSide.map((plate, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium"
            >
              <span className="font-bold">{plate.count}×</span>
              <span>{plate.weight}kg</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render result card
  const renderResult = (result: CalcResult | null, type: "barbell" | "dumbbell") => {
    if (!result) {
      return (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
          Ingresá un peso objetivo para calcular
        </div>
      );
    }

    return (
      <div
        className={`rounded-lg border p-4 space-y-4 ${
          result.ok
            ? "border-green-500/50 bg-green-500/5"
            : "border-yellow-500/50 bg-yellow-500/5"
        }`}
      >
        {/* Status */}
        <div className="flex items-center gap-2">
          {result.ok ? (
            <>
              <Check className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">
                Peso exacto
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-yellow-700 dark:text-yellow-400">
                Peso aproximado
              </span>
            </>
          )}
        </div>

        {/* Weight summary */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-muted-foreground">Objetivo</p>
            <p className="text-2xl font-bold">{result.targetKg} kg</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-muted-foreground">Logrado</p>
            <p className="text-2xl font-bold">{result.achievedTotalKg} kg</p>
          </div>
        </div>

        {/* Difference if any */}
        {result.differenceKg !== 0 && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Diferencia: {result.differenceKg > 0 ? "+" : ""}{result.differenceKg} kg
          </p>
        )}

        {/* Plate breakdown */}
        {renderPlateBreakdown(result.perSide, type)}

        {/* Message */}
        <p className="text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with nav */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/equipment"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Equipamiento
          </Link>
          <h1 className="text-2xl font-bold">Calculadora de carga</h1>
          <p className="text-muted-foreground">Calculá los discos necesarios para tu peso objetivo</p>
        </div>
      </div>

      {/* Inventory Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Inventario de discos</CardTitle>
              <CardDescription>Discos disponibles para el cálculo</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadSavedData}>
              <Database className="mr-2 h-4 w-4" />
              Usar guardados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plates5">Discos de 5 kg</Label>
              <Input
                id="plates5"
                type="number"
                min="0"
                value={plates5}
                onChange={e => setPlates5(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plates25">Discos de 2.5 kg</Label>
              <Input
                id="plates25"
                type="number"
                min="0"
                value={plates25}
                onChange={e => setPlates25(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Tabs */}
      <Tabs defaultValue="barbell" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="barbell">BARRA</TabsTrigger>
          <TabsTrigger value="dumbbells">MANCUERNAS</TabsTrigger>
        </TabsList>

        {/* Barbell Tab */}
        <TabsContent value="barbell" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo para barra</CardTitle>
              <CardDescription>
                Ingresá el peso total deseado (barra + discos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="barbellTarget">Peso total objetivo (kg)</Label>
                  <Input
                    id="barbellTarget"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="ej: 60"
                    value={barbellTarget}
                    onChange={e => setBarbellTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbellWeight">Peso de la barra (kg)</Label>
                  <Input
                    id="barbellWeight"
                    type="number"
                    step="0.5"
                    min="0"
                    value={barbellWeight}
                    onChange={e => setBarbellWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="includeBarbellWeight" className="cursor-pointer">
                  Incluir peso de la barra en el cálculo
                </Label>
                <Switch
                  id="includeBarbellWeight"
                  checked={includeBarbellWeight}
                  onCheckedChange={setIncludeBarbellWeight}
                />
              </div>

              {!includeBarbellWeight && (
                <p className="text-sm text-muted-foreground">
                  El objetivo representa solo el peso en discos (sin barra)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Barbell Result */}
          {renderResult(barbellResult, "barbell")}
        </TabsContent>

        {/* Dumbbell Tab */}
        <TabsContent value="dumbbells" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo para mancuernas</CardTitle>
              <CardDescription>
                Ingresá el peso por mancuerna (maneral + discos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dumbbellTarget">Peso por mancuerna (kg)</Label>
                  <Input
                    id="dumbbellTarget"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="ej: 15"
                    value={dumbbellTarget}
                    onChange={e => setDumbbellTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handleWeight">Peso del maneral (kg)</Label>
                  <Input
                    id="handleWeight"
                    type="number"
                    step="0.5"
                    min="0"
                    value={handleWeight}
                    onChange={e => setHandleWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="includeHandleWeight" className="cursor-pointer">
                  Incluir peso del maneral en el cálculo
                </Label>
                <Switch
                  id="includeHandleWeight"
                  checked={includeHandleWeight}
                  onCheckedChange={setIncludeHandleWeight}
                />
              </div>

              {!includeHandleWeight && (
                <p className="text-sm text-muted-foreground">
                  El objetivo representa solo el peso en discos (sin maneral)
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Nota: Se asume un par de mancuernas. Los discos se consumen x4 (2 lados × 2 mancuernas).
              </p>
            </CardContent>
          </Card>

          {/* Dumbbell Result */}
          {renderResult(dumbbellResult, "dumbbell")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
