import { NextResponse } from "next/server";
import { EQUIPMENT_KEYS, type EquipmentKey } from "@/features/equipment/lib/constants";
import { updateAvailableEquipment } from "@/features/equipment/server/state";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

export const POST = async (request: Request) => {
  const body = await request.json();
  const { key, enabled } = body ?? {};

  if (!EQUIPMENT_KEYS.includes(key as EquipmentKey) || !isBoolean(enabled)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  await updateAvailableEquipment(key as EquipmentKey, enabled);
  return NextResponse.json({ ok: true });
};
