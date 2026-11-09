export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  numberOfPayments: number;
};

export type CompoundResult = {
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
};

const assertFinite = (value: number, label: string) => {
  if (!Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
};

export function percentageOf(percent: number, value: number) {
  assertFinite(percent, "Percentage");
  assertFinite(value, "Value");
  return (percent / 100) * value;
}

export function whatPercent(part: number, whole: number) {
  assertFinite(part, "Part");
  assertFinite(whole, "Whole");
  if (whole === 0) throw new Error("The whole value cannot be zero.");
  return (part / whole) * 100;
}

export function percentageChange(original: number, next: number) {
  assertFinite(original, "Original value");
  assertFinite(next, "New value");
  if (original === 0) throw new Error("The original value cannot be zero.");
  return ((next - original) / Math.abs(original)) * 100;
}

export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): LoanResult {
  [principal, annualRatePercent, termYears].forEach((value, index) =>
    assertFinite(value, ["Principal", "Interest rate", "Loan term"][index]),
  );
  if (principal <= 0) throw new Error("Principal must be greater than zero.");
  if (annualRatePercent < 0) throw new Error("Interest rate cannot be negative.");
  if (termYears <= 0) throw new Error("Loan term must be greater than zero.");

  const numberOfPayments = Math.round(termYears * 12);
  if (numberOfPayments < 1) throw new Error("Loan term is too short.");
  const monthlyRate = annualRatePercent / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / numberOfPayments
      : (principal * monthlyRate * (1 + monthlyRate) ** numberOfPayments) /
        ((1 + monthlyRate) ** numberOfPayments - 1);
  const totalPayment = monthlyPayment * numberOfPayments;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    numberOfPayments,
  };
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear: number,
  monthlyContribution = 0,
): CompoundResult {
  [principal, annualRatePercent, years, compoundsPerYear, monthlyContribution].forEach(
    (value, index) =>
      assertFinite(
        value,
        ["Principal", "Interest rate", "Years", "Compounding frequency", "Contribution"][index],
      ),
  );
  if (principal < 0) throw new Error("Principal cannot be negative.");
  if (annualRatePercent <= -100) throw new Error("Interest rate must be greater than -100%.");
  if (years < 0) throw new Error("Years cannot be negative.");
  if (!Number.isInteger(compoundsPerYear) || compoundsPerYear < 1)
    throw new Error("Compounding frequency must be a positive whole number.");
  if (monthlyContribution < 0) throw new Error("Monthly contribution cannot be negative.");

  const months = Math.round(years * 12);
  const periodicRate = annualRatePercent / 100 / compoundsPerYear;
  const principalGrowth = (1 + periodicRate) ** (compoundsPerYear * years);
  const grownPrincipal = principal * principalGrowth;
  let contributionValue = monthlyContribution * months;

  if (monthlyContribution > 0 && months > 0 && periodicRate !== 0) {
    const monthlyEquivalentRate = (1 + periodicRate) ** (compoundsPerYear / 12) - 1;
    contributionValue =
      monthlyEquivalentRate === 0
        ? monthlyContribution * months
        : monthlyContribution * (((1 + monthlyEquivalentRate) ** months - 1) / monthlyEquivalentRate);
  }

  const futureValue = grownPrincipal + contributionValue;
  const totalContributions = principal + monthlyContribution * months;
  return {
    futureValue,
    totalContributions,
    interestEarned: futureValue - totalContributions,
  };
}

export type Course = { credits: number; gradePoint: number };

export function calculateGpa(courses: Course[]) {
  if (!courses.length) throw new Error("Add at least one course.");
  let totalCredits = 0;
  let weightedPoints = 0;
  for (const course of courses) {
    assertFinite(course.credits, "Credits");
    assertFinite(course.gradePoint, "Grade point");
    if (course.credits <= 0) throw new Error("Credits must be greater than zero.");
    if (course.gradePoint < 0 || course.gradePoint > 4)
      throw new Error("Grade points must be between 0 and 4.");
    totalCredits += course.credits;
    weightedPoints += course.credits * course.gradePoint;
  }
  return { gpa: weightedPoints / totalCredits, totalCredits };
}
