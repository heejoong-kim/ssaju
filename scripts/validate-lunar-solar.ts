import { lunarToSolar, solarToLunar } from "../index.ts";

type Failure = {
  direction: "solar→lunar→solar" | "lunar→solar→lunar";
  input: string;
  expected: string;
  actual: string;
  error?: string;
};

const START_YEAR = 1960;
const END_YEAR = 2010;
const MAX_FAILURE_SAMPLES = 30;
const failures: Failure[] = [];
let failureCount = 0;

function addFailure(failure: Failure) {
  failureCount += 1;
  if (failures.length < MAX_FAILURE_SAMPLES) {
    failures.push(failure);
  }
}

function formatSolar(date: { year: number; month: number; day: number }) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function formatLunar(date: { year: number; month: number; day: number; isLeapMonth: boolean }) {
  return `${date.year}-${date.isLeapMonth ? "leap-" : ""}${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function verifySolarRoundTrip() {
  const start = Date.UTC(START_YEAR, 0, 1);
  const end = Date.UTC(END_YEAR, 11, 31);
  const dayMs = 24 * 60 * 60 * 1000;

  for (let time = start; time <= end; time += dayMs) {
    const solarDate = new Date(time);
    const solar = {
      year: solarDate.getUTCFullYear(),
      month: solarDate.getUTCMonth() + 1,
      day: solarDate.getUTCDate(),
    };

    try {
      const lunar = solarToLunar(solar.year, solar.month, solar.day);
      const actualSolar = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeapMonth);
      if (
        actualSolar.year !== solar.year ||
        actualSolar.month !== solar.month ||
        actualSolar.day !== solar.day
      ) {
        addFailure({
          direction: "solar→lunar→solar",
          input: formatSolar(solar),
          expected: formatSolar(solar),
          actual: `${formatLunar(lunar)} -> ${formatSolar(actualSolar)}`,
        });
      }
    } catch (error) {
      addFailure({
        direction: "solar→lunar→solar",
        input: formatSolar(solar),
        expected: formatSolar(solar),
        actual: "threw",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

function verifyLunarRoundTrip() {
  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      for (const isLeapMonth of [false, true]) {
        for (let day = 1; day <= 30; day += 1) {
          const lunar = { year, month, day, isLeapMonth };
          let solar: { year: number; month: number; day: number };

          try {
            solar = lunarToSolar(year, month, day, isLeapMonth);
          } catch {
            continue;
          }

          try {
            const actualLunar = solarToLunar(solar.year, solar.month, solar.day);
            if (
              actualLunar.year !== lunar.year ||
              actualLunar.month !== lunar.month ||
              actualLunar.day !== lunar.day ||
              actualLunar.isLeapMonth !== lunar.isLeapMonth
            ) {
              addFailure({
                direction: "lunar→solar→lunar",
                input: formatLunar(lunar),
                expected: formatLunar(lunar),
                actual: `${formatSolar(solar)} -> ${formatLunar(actualLunar)}`,
              });
            }
          } catch (error) {
            addFailure({
              direction: "lunar→solar→lunar",
              input: formatLunar(lunar),
              expected: formatLunar(lunar),
              actual: `${formatSolar(solar)} -> threw`,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      }
    }
  }
}

verifySolarRoundTrip();
verifyLunarRoundTrip();

if (failureCount > 0) {
  console.error(`Lunar/solar validation failed: ${failureCount} failure(s)`);
  console.error(`Showing up to ${MAX_FAILURE_SAMPLES} failure sample(s):`);
  for (const failure of failures) {
    console.error(
      `[${failure.direction}] input=${failure.input} expected=${failure.expected} actual=${failure.actual}${
        failure.error ? ` error=${failure.error}` : ""
      }`,
    );
  }
  process.exit(1);
}

console.log(`Lunar/solar validation passed for ${START_YEAR}-${END_YEAR}`);
