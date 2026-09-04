export type StructuredValuationError = {
  message?: string;
  data?: {
    code?: string;
    zodError?: { fieldErrors?: Record<string, string[]> } | null;
  };
  code?: string;
  cause?: { flatten?: () => { fieldErrors?: Record<string, string[]> } };
};

export function mapValuationError(error: StructuredValuationError) {
  const fieldErrors = error.data?.zodError?.fieldErrors ?? error.cause?.flatten?.().fieldErrors ?? {};
  const friendlyFields: Record<string, string> = {};
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.length) friendlyFields[field] = "Please check this detail.";
  }
  if (Object.keys(friendlyFields).length || (error.data?.code === "BAD_REQUEST" || error.code === "BAD_REQUEST") || /invalid|expected|too small|too big|must be|required/i.test(error.message || "")) {
    return { message: "Some vehicle details need attention. Please check the highlighted fields.", fieldErrors: friendlyFields };
  }
  if (/python runtime unavailable/i.test(error.message || "")) {
    return { message: "The valuation service is temporarily unavailable. Please try again shortly.", fieldErrors: {} };
  }
  return { message: "We couldn't calculate this estimate right now. Please review your details and try again.", fieldErrors: {} };
}
