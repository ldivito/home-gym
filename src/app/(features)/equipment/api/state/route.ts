import { NextResponse } from "next/server";
import { getEquipmentState } from "@/features/equipment/server/state";

export const GET = async () => {
  const state = await getEquipmentState();
  return NextResponse.json(state);
};
