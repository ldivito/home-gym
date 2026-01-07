import { NextResponse } from "next/server";
import { PLATE_WEIGHTS, type PlateWeight } from "@/features/equipment/lib/constants";
import { updatePlateCount } from "@/features/equipment/server/state";

const isValidCount = (value: unknown) =>
  Number.isInteger(value) && typeof value === "number" && value >= 0;

export const POST = async (request: Request) => {
  const body = await request.json();
  const { plateWeightKg, count } = body ?? {};

  if (!isValidCount(count) || !PLATE_WEIGHTS.includes(plateWeightKg as PlateWeight)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  await updatePlateCount(plateWeightKg, count);
  return NextResponse.json({ ok: true });
};
