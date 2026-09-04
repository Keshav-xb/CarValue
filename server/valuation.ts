import { spawn } from "node:child_process";
import { z } from "zod";
import { mapValuationError, type StructuredValuationError } from "../shared/valuationErrors";

export const featureColumns = [
  "year",
  "km_driven",
  "mileage(km/ltr/kg)",
  "engine",
  "max_power",
  "seats",
  "fuel_Diesel",
  "fuel_LPG",
  "fuel_Petrol",
  "seller_type_Individual",
  "seller_type_Trustmark Dealer",
  "transmission_Manual",
  "owner_Fourth & Above Owner",
  "owner_Second Owner",
  "owner_Test Drive Car",
  "owner_Third Owner",
] as const;

const currentYear = new Date().getFullYear();
export const valuationInput = z.object({
  carName: z.string().trim().min(2, "Enter a car name.").max(120),
  year: z.number().int().min(1980).max(currentYear),
  kmDriven: z.number().finite().min(0).max(1_000_000),
  mileage: z.number().finite().positive().max(100),
  engine: z.number().finite().positive().max(10_000),
  maxPower: z.number().finite().positive().max(2_000),
  seats: z.number().int().min(1).max(15),
  fuel: z.enum(["CNG", "Diesel", "LPG", "Petrol"]),
  sellerType: z.enum(["Dealer", "Individual", "Trustmark Dealer"]),
  transmission: z.enum(["Automatic", "Manual"]),
  owner: z.enum(["First Owner", "Second Owner", "Third Owner", "Fourth & Above Owner", "Test Drive Car"]),
});

export type ValuationInput = z.infer<typeof valuationInput>;

export function buildFeatureVector(input: ValuationInput): number[] {
  return [
    input.year,
    input.kmDriven,
    input.mileage,
    input.engine,
    input.maxPower,
    input.seats,
    Number(input.fuel === "Diesel"),
    Number(input.fuel === "LPG"),
    Number(input.fuel === "Petrol"),
    Number(input.sellerType === "Individual"),
    Number(input.sellerType === "Trustmark Dealer"),
    Number(input.transmission === "Manual"),
    Number(input.owner === "Fourth & Above Owner"),
    Number(input.owner === "Second Owner"),
    Number(input.owner === "Test Drive Car"),
    Number(input.owner === "Third Owner"),
  ];
}

function runPythonPrediction(input: ValuationInput): Promise<number> {
  return new Promise((resolve, reject) => {
    const python = spawn(process.env.PYTHON_BIN || "python3", ["scripts/predict.py"], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    python.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    python.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    python.on("error", (error) => reject(new Error(`Python runtime unavailable: ${error.message}`)));
    python.on("close", (code) => {
      try {
        const result = JSON.parse(stdout || "{}");
        if (code !== 0 || typeof result.price !== "number") {
          reject(new Error(result.error || stderr.trim() || "The valuation model could not produce a result."));
          return;
        }
        resolve(result.price);
      } catch {
        reject(new Error("The valuation model returned an unreadable response."));
      }
    });
    python.stdin.end(JSON.stringify(input));
  });
}

export function friendlyValuationError(error: unknown): string {
  const normalized: StructuredValuationError = error instanceof Error ? { message: error.message } : (error as StructuredValuationError);
  return mapValuationError(normalized).message;
}

export async function predictValuation(input: ValuationInput) {
  const price = await runPythonPrediction(input);
  return { price, carName: input.carName };
}
