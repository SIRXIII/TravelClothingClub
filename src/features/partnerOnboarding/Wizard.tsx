import { Suspense, useEffect, useState, startTransition } from "react";
import { usePartnerWizard } from "./hooks/usePartnerWizard";
import WelcomeStep from "./steps/WelcomeStep";
// import BusinessDetailsStep from "./steps/BusinessDetailsStep";
// import IdentityStep from "./steps/IdentityStep";
// import InventoryStep from "./steps/InventoryStep";
// import LogisticsStep from "./steps/LogisticsStep";
// import PayoutStep from "./steps/PayoutStep";
// import ReviewStep from "./steps/ReviewStep";
import { Button } from "../../components/ui/button";
import { useEffect as useAuthEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

const steps = [
  { id: 0, label: "Welcome", Component: WelcomeStep },
  // { id: 1, label: "Business", Component: BusinessDetailsStep },
  // { id: 2, label: "Identity", Component: IdentityStep },
  // { id: 3, label: "Inventory", Component: InventoryStep },
  // { id: 4, label: "Logistics", Component: LogisticsStep },
  // { id: 5, label: "Payout", Component: PayoutStep },
  // { id: 99, label: "Review", Component: ReviewStep },
] as const;

export default function PartnerWizard() {
  const { step, setStep, loadDraft } = usePartnerWizard();
  const Current = steps.find((s) => s.id === step)?.Component ?? WelcomeStep;
  const user = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Onboarding • ${steps[step]?.label ?? "Welcome"}`;
  }, [step]);

  useEffect(() => {
    if (user) {
      loadDraft(user).then(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="flex-1 flex items-center justify-center">Loading onboarding…</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <Suspense fallback={<p className="m-auto">Loading…</p>}>
        <Current />
      </Suspense>

      {/* Nav Buttons */}
      <div className="p-4 flex justify-between border-t">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => startTransition(() => setStep(step - 1))}
        >
          Back
        </Button>
        <Button
          onClick={() => startTransition(() => setStep(step + 1))}
          disabled={step >= steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 