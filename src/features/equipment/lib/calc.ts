/**
 * Equipment Load Calculator
 *
 * Pure calculation logic for barbell and dumbbell plate loading.
 * All weights are handled internally as grams (integers) to avoid floating point errors.
 *
 * Inventory represents total count of plates available.
 * For barbell: plates are consumed in pairs (one per side).
 * For dumbbell: plates are consumed in pairs (one per dumbbell in a pair).
 */

export interface PlateCount {
  weight: number; // in kg
  count: number;  // total count available
}

export interface CalcResult {
  ok: boolean;
  perSide: PlateCount[];      // plates needed per side (barbell) or per dumbbell
  achievedTotalKg: number;    // actual weight achieved
  targetKg: number;           // original target
  differenceKg: number;       // difference from target (can be negative if under)
  message: string;            // human-readable message
}

// Helper: convert kg to grams (multiply by 1000 and round)
function toGrams(kg: number): number {
  return Math.round(kg * 1000);
}

// Helper: convert grams to kg
function toKg(grams: number): number {
  return grams / 1000;
}

/**
 * Calculate barbell load configuration
 *
 * @param targetTotalKg - Target total weight including barbell
 * @param barbellKg - Weight of the barbell alone
 * @param inventory - Available plates [{weight: 5, count: 4}, {weight: 2.5, count: 4}]
 * @returns CalcResult with plates per side and achieved weight
 *
 * Example:
 * calcBarbellExact(50, 20, [{weight: 5, count: 4}, {weight: 2.5, count: 4}])
 * => needs 30kg of plates = 15kg per side = 3x5kg per side
 */
export function calcBarbellExact(
  targetTotalKg: number,
  barbellKg: number,
  inventory: PlateCount[]
): CalcResult {
  const targetGrams = toGrams(targetTotalKg);
  const barbellGrams = toGrams(barbellKg);

  // Validation: target must be >= barbell weight
  if (targetGrams < barbellGrams) {
    return {
      ok: false,
      perSide: [],
      achievedTotalKg: barbellKg,
      targetKg: targetTotalKg,
      differenceKg: targetTotalKg - barbellKg,
      message: `El peso objetivo (${targetTotalKg}kg) es menor que el peso de la barra (${barbellKg}kg)`,
    };
  }

  // Calculate weight needed in plates (total, both sides)
  const platesNeededGrams = targetGrams - barbellGrams;

  // For barbell, we need equal weight on each side
  // So platesNeededGrams must be divisible by 2
  const perSideGrams = platesNeededGrams / 2;

  // Sort inventory by weight descending (greedy: use heaviest plates first)
  const sortedInventory = [...inventory]
    .map(p => ({ weightGrams: toGrams(p.weight), count: p.count, weight: p.weight }))
    .sort((a, b) => b.weightGrams - a.weightGrams);

  // Greedy algorithm: fill with heaviest plates first
  let remainingGrams = perSideGrams;
  const perSideResult: PlateCount[] = [];

  for (const plate of sortedInventory) {
    if (remainingGrams <= 0) break;

    // How many of this plate can we use per side?
    // We need pairs (one per side), so available per side = plate.count / 2
    const availablePerSide = Math.floor(plate.count / 2);
    const maxNeeded = Math.floor(remainingGrams / plate.weightGrams);
    const useCount = Math.min(availablePerSide, maxNeeded);

    if (useCount > 0) {
      perSideResult.push({ weight: plate.weight, count: useCount });
      remainingGrams -= useCount * plate.weightGrams;
    }
  }

  // Calculate achieved weight
  const achievedPerSideGrams = perSideGrams - remainingGrams;
  const achievedPlatesGrams = achievedPerSideGrams * 2;
  const achievedTotalGrams = barbellGrams + achievedPlatesGrams;
  const achievedTotalKg = toKg(achievedTotalGrams);

  // Check if we achieved exact target
  if (remainingGrams > 0) {
    // Could not reach exact target
    const closestLower = achievedTotalKg;
    const differenceKg = toKg(remainingGrams * 2); // difference is 2x remaining per side

    return {
      ok: false,
      perSide: perSideResult,
      achievedTotalKg: closestLower,
      targetKg: targetTotalKg,
      differenceKg: -differenceKg, // negative means we're under target
      message: `No se puede armar exactamente ${targetTotalKg}kg. Lo más cercano: ${closestLower}kg (faltan ${differenceKg}kg en discos)`,
    };
  }

  return {
    ok: true,
    perSide: perSideResult,
    achievedTotalKg,
    targetKg: targetTotalKg,
    differenceKg: 0,
    message: `✓ ${targetTotalKg}kg armado correctamente`,
  };
}

/**
 * Calculate dumbbell load configuration
 *
 * @param targetPerDumbbellKg - Target weight per dumbbell (including handle)
 * @param handleKg - Weight of the dumbbell handle alone
 * @param inventory - Available plates (shared between both dumbbells)
 * @returns CalcResult with plates per dumbbell and achieved weight
 *
 * Example:
 * calcDumbbellExact(15, 2.5, [{weight: 5, count: 8}, {weight: 2.5, count: 8}])
 * => needs 12.5kg of plates per dumbbell = 6.25kg per side per dumbbell
 */
export function calcDumbbellExact(
  targetPerDumbbellKg: number,
  handleKg: number,
  inventory: PlateCount[]
): CalcResult {
  const targetGrams = toGrams(targetPerDumbbellKg);
  const handleGrams = toGrams(handleKg);

  // Validation: target must be >= handle weight
  if (targetGrams < handleGrams) {
    return {
      ok: false,
      perSide: [],
      achievedTotalKg: handleKg,
      targetKg: targetPerDumbbellKg,
      differenceKg: targetPerDumbbellKg - handleKg,
      message: `El peso objetivo (${targetPerDumbbellKg}kg) es menor que el peso del maneral (${handleKg}kg)`,
    };
  }

  // Calculate weight needed in plates per dumbbell
  const platesPerDumbbellGrams = targetGrams - handleGrams;

  // For dumbbells, we need equal weight on each side of each dumbbell
  // And we have a pair of dumbbells, so plates are consumed 4x
  // (2 sides per dumbbell × 2 dumbbells)
  // Per side per dumbbell = platesPerDumbbellGrams / 2
  const perSidePerDumbbellGrams = platesPerDumbbellGrams / 2;

  // Sort inventory by weight descending
  const sortedInventory = [...inventory]
    .map(p => ({ weightGrams: toGrams(p.weight), count: p.count, weight: p.weight }))
    .sort((a, b) => b.weightGrams - a.weightGrams);

  // Greedy algorithm
  let remainingGrams = perSidePerDumbbellGrams;
  const perSideResult: PlateCount[] = [];

  for (const plate of sortedInventory) {
    if (remainingGrams <= 0) break;

    // For dumbbells, we need 4 plates of each weight used
    // (1 per side × 2 sides × 2 dumbbells)
    // So available per side per dumbbell = plate.count / 4
    const availablePerSidePerDumbbell = Math.floor(plate.count / 4);
    const maxNeeded = Math.floor(remainingGrams / plate.weightGrams);
    const useCount = Math.min(availablePerSidePerDumbbell, maxNeeded);

    if (useCount > 0) {
      perSideResult.push({ weight: plate.weight, count: useCount });
      remainingGrams -= useCount * plate.weightGrams;
    }
  }

  // Calculate achieved weight per dumbbell
  const achievedPerSideGrams = perSidePerDumbbellGrams - remainingGrams;
  const achievedPlatesPerDumbbellGrams = achievedPerSideGrams * 2;
  const achievedPerDumbbellGrams = handleGrams + achievedPlatesPerDumbbellGrams;
  const achievedPerDumbbellKg = toKg(achievedPerDumbbellGrams);

  if (remainingGrams > 0) {
    const differenceKg = toKg(remainingGrams * 2);

    return {
      ok: false,
      perSide: perSideResult,
      achievedTotalKg: achievedPerDumbbellKg,
      targetKg: targetPerDumbbellKg,
      differenceKg: -differenceKg,
      message: `No se puede armar exactamente ${targetPerDumbbellKg}kg por mancuerna. Lo más cercano: ${achievedPerDumbbellKg}kg (faltan ${differenceKg}kg en discos)`,
    };
  }

  return {
    ok: true,
    perSide: perSideResult,
    achievedTotalKg: achievedPerDumbbellKg,
    targetKg: targetPerDumbbellKg,
    differenceKg: 0,
    message: `✓ ${targetPerDumbbellKg}kg por mancuerna armado correctamente`,
  };
}

/*
 * ============ TEST CASES / EXAMPLES ============
 *
 * Example 1: Barbell 50kg with 20kg bar
 * calcBarbellExact(50, 20, [{weight: 5, count: 4}, {weight: 2.5, count: 4}])
 * Expected: ok=true, perSide=[{weight:5, count:3}], achievedTotalKg=50
 *
 * Example 2: Barbell 35kg with 20kg bar
 * calcBarbellExact(35, 20, [{weight: 5, count: 4}, {weight: 2.5, count: 4}])
 * Expected: ok=true, perSide=[{weight:5, count:1}, {weight:2.5, count:1}], achievedTotalKg=35
 * (7.5kg per side = 5kg + 2.5kg)
 *
 * Example 3: Barbell 100kg with insufficient inventory
 * calcBarbellExact(100, 20, [{weight: 5, count: 4}, {weight: 2.5, count: 4}])
 * Expected: ok=false, achievedTotalKg=45 (max possible: 2x5kg + 2x5kg + 2x2.5kg + 2x2.5kg = 25kg plates + 20kg bar)
 *
 * Example 4: Target less than bar
 * calcBarbellExact(15, 20, [{weight: 5, count: 4}])
 * Expected: ok=false, message about target < bar weight
 *
 * Example 5: Dumbbell 15kg with 2.5kg handle
 * calcDumbbellExact(15, 2.5, [{weight: 5, count: 8}, {weight: 2.5, count: 8}])
 * Expected: ok=true, perSide=[{weight:5, count:1}, {weight:2.5, count:1}] (6.25kg per side? No exact)
 * Actually 12.5kg plates needed per dumbbell, 6.25kg per side - not achievable with 5+2.5
 * Would get ok=false, closest would be 12.5kg per dumbbell (5kg per side)
 *
 * Example 6: Dumbbell 12.5kg with 2.5kg handle
 * calcDumbbellExact(12.5, 2.5, [{weight: 5, count: 8}, {weight: 2.5, count: 8}])
 * Expected: ok=true, perSide=[{weight:5, count:1}], achievedTotalKg=12.5
 * (10kg plates per dumbbell = 5kg per side)
 */
