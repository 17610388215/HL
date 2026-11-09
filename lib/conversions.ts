export const lengthUnits = {
  meter: { label: "Meters", factor: 1 },
  kilometer: { label: "Kilometers", factor: 1000 },
  centimeter: { label: "Centimeters", factor: 0.01 },
  millimeter: { label: "Millimeters", factor: 0.001 },
  inch: { label: "Inches", factor: 0.0254 },
  foot: { label: "Feet", factor: 0.3048 },
  yard: { label: "Yards", factor: 0.9144 },
  mile: { label: "Miles", factor: 1609.344 },
  nauticalMile: { label: "Nautical miles", factor: 1852 },
} as const;

export const weightUnits = {
  kilogram: { label: "Kilograms", factor: 1 },
  gram: { label: "Grams", factor: 0.001 },
  milligram: { label: "Milligrams", factor: 0.000001 },
  metricTon: { label: "Metric tons", factor: 1000 },
  pound: { label: "Pounds", factor: 0.45359237 },
  ounce: { label: "Ounces", factor: 0.028349523125 },
  stone: { label: "Stone", factor: 6.35029318 },
} as const;

export const speedUnits = {
  metersPerSecond: { label: "Meters/second", factor: 1 },
  kilometersPerHour: { label: "Kilometers/hour", factor: 1 / 3.6 },
  milesPerHour: { label: "Miles/hour", factor: 0.44704 },
  knot: { label: "Knots", factor: 0.5144444444 },
  feetPerSecond: { label: "Feet/second", factor: 0.3048 },
} as const;

export type UnitTable = Record<string, { label: string; factor: number }>;

export function convertLinear(value: number, from: string, to: string, units: UnitTable) {
  if (!Number.isFinite(value)) throw new Error("Enter a valid number.");
  if (!units[from] || !units[to]) throw new Error("Choose valid units.");
  return (value * units[from].factor) / units[to].factor;
}

export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin";

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit) {
  if (!Number.isFinite(value)) throw new Error("Enter a valid temperature.");
  const celsius =
    from === "celsius" ? value : from === "fahrenheit" ? ((value - 32) * 5) / 9 : value - 273.15;
  if (celsius < -273.15 - Number.EPSILON) throw new Error("Temperature cannot be below absolute zero.");
  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}
