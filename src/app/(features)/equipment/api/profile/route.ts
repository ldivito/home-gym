import { NextResponse } from "next/server";
import { updateProfile } from "@/features/equipment/server/state";

const isValidWeight = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const POST = async (request: Request) => {
  const body = await request.json();
  const { barbellWeightKg, dumbbellHandleWeightKg } = body ?? {};

  if (!isValidWeight(barbellWeightKg) || !isValidWeight(dumbbellHandleWeightKg)) {
    return NextResponse.json({ error: "Pesos inválidos." }, { status: 400 });
  }

  await updateProfile({ barbellWeightKg, dumbbellHandleWeightKg });
  return NextResponse.json({ ok: true });
};
