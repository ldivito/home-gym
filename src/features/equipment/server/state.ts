import "server-only";

import { eq } from "drizzle-orm";
import { availableEquipment, equipmentProfile, plateInventory } from "@/db/schema/equipment";
import { EQUIPMENT_KEYS, type EquipmentKey, type PlateWeight } from "@/features/equipment/lib/constants";
import { equipmentDb } from "@/features/equipment/server/db";

const DEFAULT_PROFILE = {
  barbellWeightKg: 20,
  dumbbellHandleWeightKg: 2.5,
};

const DEFAULT_PLATES: Record<PlateWeight, number> = {
  5: 0,
  2.5: 0,
};

const DEFAULT_EQUIPMENT: Record<EquipmentKey, boolean> = {
  bench: false,
  rack: false,
  barbell: true,
  dumbbells: true,
  elliptical: false,
  sandbag: false,
  abwheel: false,
  mat_board: false,
  bodyweight: true,
};

export const ensureEquipmentDefaults = async () => {
  const profileRows = await equipmentDb.select().from(equipmentProfile).limit(1);
  if (profileRows.length === 0) {
    await equipmentDb.insert(equipmentProfile).values({
      barbellWeightKg: DEFAULT_PROFILE.barbellWeightKg,
      dumbbellHandleWeightKg: DEFAULT_PROFILE.dumbbellHandleWeightKg,
    });
  }

  const plateRows = await equipmentDb.select().from(plateInventory);
  const existingWeights = new Set(plateRows.map((row) => row.plateWeightKg));
  for (const weight of Object.keys(DEFAULT_PLATES)) {
    const numericWeight = Number(weight);
    if (!existingWeights.has(numericWeight)) {
      await equipmentDb.insert(plateInventory).values({
        plateWeightKg: numericWeight,
        count: DEFAULT_PLATES[numericWeight as PlateWeight],
      });
    }
  }

  const equipmentRows = await equipmentDb.select().from(availableEquipment);
  const existingKeys = new Set(equipmentRows.map((row) => row.key));
  for (const key of EQUIPMENT_KEYS) {
    if (!existingKeys.has(key)) {
      await equipmentDb.insert(availableEquipment).values({
        key,
        enabled: DEFAULT_EQUIPMENT[key],
      });
    }
  }
};

export const getEquipmentState = async () => {
  await ensureEquipmentDefaults();

  const [profile] = await equipmentDb.select().from(equipmentProfile).limit(1);
  const plateRows = await equipmentDb.select().from(plateInventory);
  const equipmentRows = await equipmentDb.select().from(availableEquipment);

  const plates = plateRows.reduce<Record<PlateWeight, number>>(
    (acc, row) => {
      const weight = row.plateWeightKg as PlateWeight;
      acc[weight] = row.count;
      return acc;
    },
    {
      5: 0,
      2.5: 0,
    },
  );

  const available = equipmentRows.reduce<Record<EquipmentKey, boolean>>(
    (acc, row) => {
      if (EQUIPMENT_KEYS.includes(row.key as EquipmentKey)) {
        acc[row.key as EquipmentKey] = row.enabled;
      }
      return acc;
    },
    { ...DEFAULT_EQUIPMENT },
  );

  return {
    profile: {
      barbellWeightKg: profile?.barbellWeightKg ?? DEFAULT_PROFILE.barbellWeightKg,
      dumbbellHandleWeightKg:
        profile?.dumbbellHandleWeightKg ?? DEFAULT_PROFILE.dumbbellHandleWeightKg,
    },
    plates,
    available,
  };
};

export const updateProfile = async (values: {
  barbellWeightKg: number;
  dumbbellHandleWeightKg: number;
}) => {
  const [existing] = await equipmentDb.select().from(equipmentProfile).limit(1);
  if (existing) {
    await equipmentDb
      .update(equipmentProfile)
      .set({
        barbellWeightKg: values.barbellWeightKg,
        dumbbellHandleWeightKg: values.dumbbellHandleWeightKg,
        updatedAt: new Date(),
      })
      .where(eq(equipmentProfile.id, existing.id));
  } else {
    await equipmentDb.insert(equipmentProfile).values(values);
  }
};

export const updatePlateCount = async (plateWeightKg: number, count: number) => {
  const [existing] = await equipmentDb
    .select()
    .from(plateInventory)
    .where(eq(plateInventory.plateWeightKg, plateWeightKg))
    .limit(1);

  if (existing) {
    await equipmentDb
      .update(plateInventory)
      .set({ count, updatedAt: new Date() })
      .where(eq(plateInventory.id, existing.id));
  } else {
    await equipmentDb.insert(plateInventory).values({
      plateWeightKg,
      count,
    });
  }
};

export const updateAvailableEquipment = async (key: EquipmentKey, enabled: boolean) => {
  const [existing] = await equipmentDb
    .select()
    .from(availableEquipment)
    .where(eq(availableEquipment.key, key))
    .limit(1);

  if (existing) {
    await equipmentDb
      .update(availableEquipment)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(availableEquipment.id, existing.id));
  } else {
    await equipmentDb.insert(availableEquipment).values({ key, enabled });
  }
};
