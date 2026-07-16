import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BillingPage } from "@features/memberPlans";

const billingSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/billing")({
  validateSearch: billingSearchSchema,
  component: BillingRoute,
});

function BillingRoute() {
  const { search } = Route.useSearch();
  return <BillingPage initialSearch={search} />;
}
