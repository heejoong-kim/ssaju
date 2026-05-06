import { lunarToSolar } from "../index.ts";

type ExpectedMonth = {
  year: number;
  month: number;
  isLeapMonth: boolean;
  expectedDays: 29 | 30;
};

type Mismatch = ExpectedMonth & {
  actualDays: 29 | 30;
  error?: string;
};

const KASI_EXPECTED_MONTHS: ExpectedMonth[] = [
  { year: 1950, month: 1, isLeapMonth: false, expectedDays: 30 },
  { year: 1950, month: 4, isLeapMonth: false, expectedDays: 30 },
  { year: 1952, month: 6, isLeapMonth: false, expectedDays: 30 },
  { year: 1953, month: 12, isLeapMonth: false, expectedDays: 30 },
  { year: 1955, month: 1, isLeapMonth: false, expectedDays: 30 },
  { year: 1957, month: 12, isLeapMonth: false, expectedDays: 30 },
  { year: 1965, month: 12, isLeapMonth: false, expectedDays: 30 },
  { year: 1968, month: 3, isLeapMonth: false, expectedDays: 30 },
  { year: 1970, month: 5, isLeapMonth: false, expectedDays: 30 },
  { year: 1972, month: 11, isLeapMonth: false, expectedDays: 30 },
  { year: 1973, month: 11, isLeapMonth: false, expectedDays: 30 },
  { year: 1976, month: 9, isLeapMonth: false, expectedDays: 30 },
  { year: 1978, month: 2, isLeapMonth: false, expectedDays: 30 },
  { year: 1982, month: 9, isLeapMonth: false, expectedDays: 30 },
  { year: 1987, month: 4, isLeapMonth: false, expectedDays: 30 },
  { year: 1987, month: 12, isLeapMonth: false, expectedDays: 30 },
  { year: 1989, month: 9, isLeapMonth: false, expectedDays: 30 },
  { year: 1990, month: 8, isLeapMonth: false, expectedDays: 30 },
  { year: 1995, month: 6, isLeapMonth: false, expectedDays: 30 },
  { year: 1995, month: 9, isLeapMonth: false, expectedDays: 30 },
  { year: 1996, month: 5, isLeapMonth: false, expectedDays: 30 },
  { year: 1996, month: 7, isLeapMonth: false, expectedDays: 30 },
  { year: 1996, month: 12, isLeapMonth: false, expectedDays: 30 },
  { year: 1998, month: 11, isLeapMonth: false, expectedDays: 30 },
  { year: 2001, month: 3, isLeapMonth: false, expectedDays: 30 },
  { year: 2005, month: 10, isLeapMonth: false, expectedDays: 30 },
  { year: 2012, month: 3, isLeapMonth: true, expectedDays: 30 },
  { year: 2012, month: 6, isLeapMonth: false, expectedDays: 30 },
  { year: 2013, month: 4, isLeapMonth: false, expectedDays: 30 },
  { year: 2017, month: 6, isLeapMonth: false, expectedDays: 30 },
  { year: 2019, month: 10, isLeapMonth: false, expectedDays: 30 },
  { year: 2020, month: 1, isLeapMonth: false, expectedDays: 30 },
  { year: 2023, month: 3, isLeapMonth: false, expectedDays: 30 },
  { year: 1950, month: 2, isLeapMonth: false, expectedDays: 29 },
  { year: 1950, month: 5, isLeapMonth: false, expectedDays: 29 },
  { year: 1952, month: 7, isLeapMonth: false, expectedDays: 29 },
  { year: 1954, month: 1, isLeapMonth: false, expectedDays: 29 },
  { year: 1955, month: 2, isLeapMonth: false, expectedDays: 29 },
  { year: 1958, month: 1, isLeapMonth: false, expectedDays: 29 },
  { year: 1966, month: 1, isLeapMonth: false, expectedDays: 29 },
  { year: 1968, month: 4, isLeapMonth: false, expectedDays: 29 },
  { year: 1970, month: 6, isLeapMonth: false, expectedDays: 29 },
  { year: 1972, month: 12, isLeapMonth: false, expectedDays: 29 },
  { year: 1973, month: 12, isLeapMonth: false, expectedDays: 29 },
  { year: 1976, month: 10, isLeapMonth: false, expectedDays: 29 },
  { year: 1978, month: 3, isLeapMonth: false, expectedDays: 29 },
  { year: 1982, month: 10, isLeapMonth: false, expectedDays: 29 },
  { year: 1987, month: 5, isLeapMonth: false, expectedDays: 29 },
  { year: 1988, month: 1, isLeapMonth: false, expectedDays: 29 },
  { year: 1989, month: 10, isLeapMonth: false, expectedDays: 29 },
  { year: 1990, month: 9, isLeapMonth: false, expectedDays: 29 },
  { year: 1995, month: 7, isLeapMonth: false, expectedDays: 29 },
  { year: 1995, month: 10, isLeapMonth: false, expectedDays: 29 },
  { year: 1996, month: 6, isLeapMonth: false, expectedDays: 29 },
  { year: 1996, month: 8, isLeapMonth: false, expectedDays: 29 },
  { year: 1997, month: 1, isLeapMonth: false, expectedDays: 29 },
  { year: 1998, month: 12, isLeapMonth: false, expectedDays: 29 },
  { year: 2001, month: 4, isLeapMonth: false, expectedDays: 29 },
  { year: 2005, month: 11, isLeapMonth: false, expectedDays: 29 },
  { year: 2012, month: 5, isLeapMonth: false, expectedDays: 29 },
  { year: 2012, month: 7, isLeapMonth: false, expectedDays: 29 },
  { year: 2013, month: 5, isLeapMonth: false, expectedDays: 29 },
  { year: 2019, month: 11, isLeapMonth: false, expectedDays: 29 },
  { year: 2020, month: 2, isLeapMonth: false, expectedDays: 29 },
  { year: 2023, month: 4, isLeapMonth: false, expectedDays: 29 },
];

function formatExpectedMonth(month: ExpectedMonth) {
  return `${month.year}-${String(month.month).padStart(2, "0")}${month.isLeapMonth ? " leap" : ""}`;
}

function detectMonthDays(month: ExpectedMonth): { days: 29 | 30; error?: string } {
  try {
    lunarToSolar(month.year, month.month, 30, month.isLeapMonth);
    return { days: 30 };
  } catch (error) {
    try {
      lunarToSolar(month.year, month.month, 29, month.isLeapMonth);
      return { days: 29, error: error instanceof Error ? error.message : String(error) };
    } catch (secondError) {
      return { days: 29, error: secondError instanceof Error ? secondError.message : String(secondError) };
    }
  }
}

const mismatches: Mismatch[] = [];
let matched = 0;

for (const expectedMonth of KASI_EXPECTED_MONTHS) {
  const actual = detectMonthDays(expectedMonth);
  if (actual.days === expectedMonth.expectedDays) {
    matched += 1;
  } else {
    mismatches.push({ ...expectedMonth, actualDays: actual.days, error: actual.error });
  }
}

const expectedThirtyCount = KASI_EXPECTED_MONTHS.filter((month) => month.expectedDays === 30).length;
const expectedTwentyNineCount = KASI_EXPECTED_MONTHS.filter((month) => month.expectedDays === 29).length;
const leapMonthResult = KASI_EXPECTED_MONTHS.find(
  (month) => month.year === 2012 && month.month === 3 && month.isLeapMonth,
);

console.log(`Total target months: ${KASI_EXPECTED_MONTHS.length}`);
console.log(`KASI expected 30-day months: ${expectedThirtyCount}`);
console.log(`KASI expected 29-day months: ${expectedTwentyNineCount}`);
console.log(`Matched months: ${matched}`);
console.log(`Mismatched months: ${mismatches.length}`);
console.log(
  `Leap month validation: ${leapMonthResult ? `${formatExpectedMonth(leapMonthResult)} expected ${leapMonthResult.expectedDays}` : "missing"}`,
);

if (mismatches.length > 0) {
  console.error("Mismatched month list:");
  for (const mismatch of mismatches) {
    console.error(
      `- ${formatExpectedMonth(mismatch)} expected=${mismatch.expectedDays} actual=${mismatch.actualDays}${
        mismatch.error ? ` error=${mismatch.error}` : ""
      }`,
    );
  }
  process.exitCode = 1;
} else {
  console.log("Mismatched month list: none");
}
