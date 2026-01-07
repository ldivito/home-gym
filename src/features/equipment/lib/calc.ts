import { PLATE_WEIGHTS, type PlateWeight } from "./constants";

export type PlateInventory = Record<PlateWeight, number>;
export type PlatePlan = Record<PlateWeight, number>;

const GRAMS_PER_KG = 1000;
const MIN_INCREMENT_GRAMS = 2500;

const toGrams = (kg: number) => Math.round(kg * GRAMS_PER_KG);
const fromGrams = (grams: number) => grams / GRAMS_PER_KG;

const emptyPlan = (): PlatePlan => ({
  5: 0,
  2.5: 0,
});

const planForTarget = (targetPerSideGrams: number, inventory: PlateInventory) => {
  let remaining = targetPerSideGrams;
  const plan = emptyPlan();

  for (const weight of PLATE_WEIGHTS) {
    const grams = toGrams(weight);
    const availablePairs = Math.floor(inventory[weight] / 2);
    const needed = Math.floor(remaining / grams);
    const use = Math.min(availablePairs, needed);
    plan[weight] = use;
    remaining -= use * grams;
  }

  return {
    plan,
    remaining,
    achievedPerSide: targetPerSideGrams - remaining,
  };
};

const buildNoExactMessage = (achievedTotalKg: number) =>
  `No exacto con incrementos de 2.5kg por lado. Mejor aproximación: ${achievedTotalKg.toFixed(2)}kg.`;

export const calcBarbellExact = (
  targetTotalKg: number,
  barbellKg: number,
  inventory: PlateInventory,
) => {
  const targetGrams = toGrams(targetTotalKg);
  const baseGrams = toGrams(barbellKg);

  if (targetGrams < baseGrams) {
    return {
      ok: false,
      perSide: emptyPlan(),
      achievedTotalKg: fromGrams(baseGrams),
      message: "El objetivo es menor que el peso base de la barra.",
    };
  }

  const remainingTotal = targetGrams - baseGrams;
  if (remainingTotal === 0) {
    return {
      ok: true,
      perSide: emptyPlan(),
      achievedTotalKg: fromGrams(targetGrams),
      message: "Sin discos necesarios.",
    };
  }

  if (remainingTotal % 2 !== 0) {
    const achievedTotalKg = fromGrams(baseGrams);
    return {
      ok: false,
      perSide: emptyPlan(),
      achievedTotalKg,
      message: buildNoExactMessage(achievedTotalKg),
    };
  }

  const targetPerSideExact = remainingTotal / 2;
  const hasExactIncrement = targetPerSideExact % MIN_INCREMENT_GRAMS === 0;
  const targetPerSideGrams =
    Math.floor(targetPerSideExact / MIN_INCREMENT_GRAMS) * MIN_INCREMENT_GRAMS;

  const { plan, remaining, achievedPerSide } = planForTarget(
    targetPerSideGrams,
    inventory,
  );

  const achievedTotalKg = fromGrams(baseGrams + achievedPerSide * 2);

  if (!hasExactIncrement) {
    return {
      ok: false,
      perSide: plan,
      achievedTotalKg,
      message: buildNoExactMessage(achievedTotalKg),
    };
  }

  if (remaining > 0) {
    return {
      ok: false,
      perSide: plan,
      achievedTotalKg,
      message: "Inventario insuficiente para alcanzar el objetivo.",
    };
  }

  return {
    ok: true,
    perSide: plan,
    achievedTotalKg,
    message: "Objetivo exacto alcanzado.",
  };
};

export const calcDumbbellExact = (
  targetPerDumbbellKg: number,
  handleKg: number,
  inventory: PlateInventory,
) => {
  const targetGrams = toGrams(targetPerDumbbellKg);
  const baseGrams = toGrams(handleKg);

  if (targetGrams < baseGrams) {
    return {
      ok: false,
      perDumbbell: emptyPlan(),
      achievedKg: fromGrams(baseGrams),
      message: "El objetivo es menor que el peso base del maneral.",
    };
  }

  const remainingTotal = targetGrams - baseGrams;
  if (remainingTotal === 0) {
    return {
      ok: true,
      perDumbbell: emptyPlan(),
      achievedKg: fromGrams(targetGrams),
      message: "Sin discos necesarios.",
    };
  }

  if (remainingTotal % 2 !== 0) {
    const achievedKg = fromGrams(baseGrams);
    return {
      ok: false,
      perDumbbell: emptyPlan(),
      achievedKg,
      message: buildNoExactMessage(achievedKg),
    };
  }

  const targetPerSideExact = remainingTotal / 2;
  const hasExactIncrement = targetPerSideExact % MIN_INCREMENT_GRAMS === 0;
  const targetPerSideGrams =
    Math.floor(targetPerSideExact / MIN_INCREMENT_GRAMS) * MIN_INCREMENT_GRAMS;

  const { plan, remaining, achievedPerSide } = planForTarget(
    targetPerSideGrams,
    inventory,
  );

  const achievedKg = fromGrams(baseGrams + achievedPerSide * 2);

  if (!hasExactIncrement) {
    return {
      ok: false,
      perDumbbell: plan,
      achievedKg,
      message: buildNoExactMessage(achievedKg),
    };
  }

  if (remaining > 0) {
    return {
      ok: false,
      perDumbbell: plan,
      achievedKg,
      message: "Inventario insuficiente para alcanzar el objetivo.",
    };
  }

  return {
    ok: true,
    perDumbbell: plan,
    achievedKg,
    message: "Objetivo exacto alcanzado.",
  };
};
