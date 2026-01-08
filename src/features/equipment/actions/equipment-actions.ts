"use server";

import { db } from "@/lib/db";
import {
  equipmentProfile,
  plateInventory,
  availableEquipment,
  EQUIPMENT_KEYS,
  type EquipmentKey,
} from "@/db/schema/equipment";
import { eq } from "drizzle-orm";

// ============ TYPES ============

export interface EquipmentProfileData {
  id: string;
  barbellWeightKg: number;
  dumbbellHandleWeightKg: number;
}

export interface PlateInventoryData {
  id: string;
  plateWeightKg: number;
  count: number;
}

export interface AvailableEquipmentData {
  id: string;
  key: string;
  enabled: boolean;
}

export interface EquipmentData {
  profile: EquipmentProfileData;
  plates: PlateInventoryData[];
  equipment: AvailableEquipmentData[];
}

// ============ INITIALIZATION ============

/**
 * Initialize equipment data with defaults if not exists
 * This is idempotent - safe to call multiple times
 */
export async function initEquipmentDefaults(): Promise<void> {
  // Initialize equipment profile (single row)
  const existingProfile = await db.select().from(equipmentProfile).limit(1);
  if (existingProfile.length === 0) {
    await db.insert(equipmentProfile).values({
      barbellWeightKg: 20,
      dumbbellHandleWeightKg: 2.5,
    });
  }

  // Initialize plate inventory (2.5kg and 5kg plates)
  const existingPlates = await db.select().from(plateInventory);
  const existingWeights = new Set(existingPlates.map(p => p.plateWeightKg));

  const defaultPlates = [
    { plateWeightKg: 2.5, count: 4 },
    { plateWeightKg: 5, count: 4 },
  ];

  for (const plate of defaultPlates) {
    if (!existingWeights.has(plate.plateWeightKg)) {
      await db.insert(plateInventory).values(plate);
    }
  }

  // Initialize available equipment
  const existingEquipment = await db.select().from(availableEquipment);
  const existingKeys = new Set(existingEquipment.map(e => e.key));

  for (const key of EQUIPMENT_KEYS) {
    if (!existingKeys.has(key)) {
      await db.insert(availableEquipment).values({
        key,
        enabled: false,
      });
    }
  }
}

// ============ READ ============

/**
 * Get all equipment data (profile, plates, equipment)
 */
export async function getEquipmentData(): Promise<EquipmentData> {
  // Ensure defaults exist
  await initEquipmentDefaults();

  const [profiles, plates, equipment] = await Promise.all([
    db.select().from(equipmentProfile).limit(1),
    db.select().from(plateInventory),
    db.select().from(availableEquipment),
  ]);

  return {
    profile: {
      id: profiles[0].id,
      barbellWeightKg: profiles[0].barbellWeightKg,
      dumbbellHandleWeightKg: profiles[0].dumbbellHandleWeightKg,
    },
    plates: plates.map(p => ({
      id: p.id,
      plateWeightKg: p.plateWeightKg,
      count: p.count,
    })),
    equipment: equipment.map(e => ({
      id: e.id,
      key: e.key,
      enabled: e.enabled,
    })),
  };
}

// ============ UPDATE PROFILE ============

export interface UpdateProfileInput {
  barbellWeightKg?: number;
  dumbbellHandleWeightKg?: number;
}

/**
 * Update equipment profile (base weights)
 */
export async function updateEquipmentProfile(
  input: UpdateProfileInput
): Promise<{ success: boolean; error?: string }> {
  // Validation
  if (input.barbellWeightKg !== undefined) {
    if (input.barbellWeightKg < 0 || input.barbellWeightKg > 100) {
      return { success: false, error: "El peso de la barra debe estar entre 0 y 100 kg" };
    }
  }

  if (input.dumbbellHandleWeightKg !== undefined) {
    if (input.dumbbellHandleWeightKg < 0 || input.dumbbellHandleWeightKg > 50) {
      return { success: false, error: "El peso del maneral debe estar entre 0 y 50 kg" };
    }
  }

  try {
    const profiles = await db.select().from(equipmentProfile).limit(1);
    if (profiles.length === 0) {
      return { success: false, error: "Perfil de equipamiento no encontrado" };
    }

    await db
      .update(equipmentProfile)
      .set({
        ...(input.barbellWeightKg !== undefined && { barbellWeightKg: input.barbellWeightKg }),
        ...(input.dumbbellHandleWeightKg !== undefined && {
          dumbbellHandleWeightKg: input.dumbbellHandleWeightKg,
        }),
        updatedAt: new Date(),
      })
      .where(eq(equipmentProfile.id, profiles[0].id));

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Error al actualizar el perfil" };
  }
}

// ============ UPDATE PLATES ============

export interface UpdatePlateInput {
  plateWeightKg: number;
  count: number;
}

/**
 * Update plate inventory count
 */
export async function updatePlateInventory(
  input: UpdatePlateInput
): Promise<{ success: boolean; error?: string }> {
  // Validation
  if (input.count < 0 || input.count > 100) {
    return { success: false, error: "La cantidad debe estar entre 0 y 100" };
  }

  if (![2.5, 5].includes(input.plateWeightKg)) {
    return { success: false, error: "Peso de disco no válido (debe ser 2.5 o 5)" };
  }

  try {
    const plates = await db
      .select()
      .from(plateInventory)
      .where(eq(plateInventory.plateWeightKg, input.plateWeightKg));

    if (plates.length === 0) {
      // Create if doesn't exist
      await db.insert(plateInventory).values({
        plateWeightKg: input.plateWeightKg,
        count: input.count,
      });
    } else {
      await db
        .update(plateInventory)
        .set({
          count: input.count,
          updatedAt: new Date(),
        })
        .where(eq(plateInventory.id, plates[0].id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating plates:", error);
    return { success: false, error: "Error al actualizar el inventario" };
  }
}

// ============ UPDATE EQUIPMENT ============

export interface UpdateEquipmentInput {
  key: EquipmentKey;
  enabled: boolean;
}

/**
 * Update available equipment toggle
 */
export async function updateAvailableEquipment(
  input: UpdateEquipmentInput
): Promise<{ success: boolean; error?: string }> {
  if (!EQUIPMENT_KEYS.includes(input.key)) {
    return { success: false, error: "Tipo de equipamiento no válido" };
  }

  try {
    const equipment = await db
      .select()
      .from(availableEquipment)
      .where(eq(availableEquipment.key, input.key));

    if (equipment.length === 0) {
      await db.insert(availableEquipment).values({
        key: input.key,
        enabled: input.enabled,
      });
    } else {
      await db
        .update(availableEquipment)
        .set({
          enabled: input.enabled,
          updatedAt: new Date(),
        })
        .where(eq(availableEquipment.id, equipment[0].id));
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating equipment:", error);
    return { success: false, error: "Error al actualizar el equipamiento" };
  }
}
