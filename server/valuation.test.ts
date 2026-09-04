import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { buildFeatureVector, featureColumns, friendlyValuationError, valuationInput } from "./valuation";
import { mapValuationError } from "../shared/valuationErrors";

const validInput = {
  carName: "Maruti Swift Dzire VDI",
  year: 2018,
  kmDriven: 48000,
  mileage: 20.4,
  engine: 1197,
  maxPower: 83.1,
  seats: 5,
  fuel: "Diesel" as const,
  sellerType: "Individual" as const,
  transmission: "Manual" as const,
  owner: "Second Owner" as const,
};

describe("valuation contract", () => {
  it("accepts human-readable vehicle details", () => {
    expect(valuationInput.parse(validInput)).toEqual(validInput);
  });

  it("rejects missing, non-finite, and out-of-range numeric inputs", () => {
    expect(() => valuationInput.parse({ ...validInput, carName: "" })).toThrow();
    expect(() => valuationInput.parse({ ...validInput, mileage: 0 })).toThrow();
    expect(() => valuationInput.parse({ ...validInput, year: 1975 })).toThrow();
    expect(() => valuationInput.parse({ ...validInput, kmDriven: Number.NaN })).toThrow();
  });

  it("rejects and maps invalid input through the real valuation tRPC procedure", async () => {
    const caller = appRouter.createCaller({ user: undefined, req: {} as never, res: {} as never });
    try {
      await caller.valuation.predict({ ...validInput, mileage: 0 });
      throw new Error("Expected the procedure to reject");
    } catch (error) {
      expect(error).toMatchObject({ code: "BAD_REQUEST" });
      const runtimeError = error as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } }; cause?: { flatten?: () => { fieldErrors?: Record<string, string[]> } } };
      const runtimeFields = runtimeError.data?.zodError?.fieldErrors ?? runtimeError.cause?.flatten?.().fieldErrors;
      expect(runtimeFields?.mileage).toBeDefined();
      const mapped = mapValuationError(error as { message?: string; code?: string; cause?: { flatten?: () => { fieldErrors?: Record<string, string[]> } } });
      expect(mapped.message).toContain("highlighted fields");
      expect(mapped.fieldErrors).toHaveProperty("mileage");
    }
  });

  it("maps structured tRPC/Zod field errors to friendly field feedback", () => {
    const mapped = mapValuationError({ data: { code: "BAD_REQUEST", zodError: { fieldErrors: { mileage: ["Too small"] } } } });
    expect(mapped.message).toContain("highlighted fields");
    expect(mapped.fieldErrors).toEqual({ mileage: "Please check this detail." });
  });

  it("maps server failures to user-friendly messages", () => {
    expect(friendlyValuationError(new Error("Invalid input: expected number"))).toContain("highlighted fields");
    expect(friendlyValuationError(new Error("Python runtime unavailable: missing python3"))).toContain("temporarily unavailable");
    expect(friendlyValuationError(new Error("model exploded"))).toContain("couldn't calculate");
  });

  it("constructs the exact feature order with the documented baselines", () => {
    expect(featureColumns).toHaveLength(16);
    expect(buildFeatureVector(validInput)).toEqual([
      2018, 48000, 20.4, 1197, 83.1, 5,
      1, 0, 0, 1, 0, 1, 0, 1, 0, 0,
    ]);
    expect(buildFeatureVector({ ...validInput, fuel: "CNG", sellerType: "Dealer", transmission: "Automatic", owner: "First Owner" })).toEqual([
      2018, 48000, 20.4, 1197, 83.1, 5,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});
