import type { EquipmentKey, PlateWeight } from "./constants";

export type EquipmentProfileState = {
  barbellWeightKg: number;
  dumbbellHandleWeightKg: number;
};

export type EquipmentState = {
  profile: EquipmentProfileState;
  plates: Record<PlateWeight, number>;
  available: Record<EquipmentKey, boolean>;
};
