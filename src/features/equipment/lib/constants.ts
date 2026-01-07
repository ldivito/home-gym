export const PLATE_WEIGHTS = [5, 2.5] as const;
export type PlateWeight = (typeof PLATE_WEIGHTS)[number];

export const EQUIPMENT_KEYS = [
  "bench",
  "rack",
  "barbell",
  "dumbbells",
  "elliptical",
  "sandbag",
  "abwheel",
  "mat_board",
  "bodyweight",
] as const;

export type EquipmentKey = (typeof EQUIPMENT_KEYS)[number];

export const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  bench: "Banco",
  rack: "Rack",
  barbell: "Barra",
  dumbbells: "Mancuernas",
  elliptical: "Elíptica",
  sandbag: "Sandbag",
  abwheel: "Ab Wheel",
  mat_board: "Mat / Board",
  bodyweight: "Peso corporal",
};
