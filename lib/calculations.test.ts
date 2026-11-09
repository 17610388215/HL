import { describe, expect, it } from "vitest";
import {
  calculateCompoundInterest,
  calculateGpa,
  calculateLoan,
  percentageChange,
  percentageOf,
  whatPercent,
} from "./calculations";
import { convertLinear, convertTemperature, lengthUnits } from "./conversions";

describe("percentage calculations", () => {
  it("calculates a percentage of a value", () => expect(percentageOf(15, 200)).toBe(30));
  it("calculates what percent one value is of another", () => expect(whatPercent(25, 200)).toBe(12.5));
  it("calculates percentage change", () => expect(percentageChange(80, 100)).toBe(25));
  it("rejects division by zero", () => expect(() => whatPercent(3, 0)).toThrow());
});

describe("financial calculations", () => {
  it("calculates a standard amortizing loan", () => {
    const result = calculateLoan(300000, 6, 30);
    expect(result.monthlyPayment).toBeCloseTo(1798.65, 2);
    expect(result.numberOfPayments).toBe(360);
  });
  it("handles a zero-interest loan", () => {
    expect(calculateLoan(12000, 0, 1).monthlyPayment).toBe(1000);
  });
  it("calculates compound growth without contributions", () => {
    expect(calculateCompoundInterest(10000, 5, 10, 12).futureValue).toBeCloseTo(16470.09, 2);
  });
});

describe("GPA and conversions", () => {
  it("calculates a credit-weighted GPA", () => {
    expect(calculateGpa([{ credits: 3, gradePoint: 4 }, { credits: 1, gradePoint: 2 }]).gpa).toBe(3.5);
  });
  it("converts miles to kilometers", () => {
    expect(convertLinear(1, "mile", "kilometer", lengthUnits)).toBeCloseTo(1.609344, 6);
  });
  it("converts freezing point accurately", () => {
    expect(convertTemperature(32, "fahrenheit", "celsius")).toBeCloseTo(0, 10);
  });
});
