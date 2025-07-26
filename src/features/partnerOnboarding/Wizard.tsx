import { Suspense, useEffect, useState, startTransition } from "react";
import { usePartnerWizard } from "./hooks/usePartnerWizard";
import WelcomeStep from "./steps/WelcomeStep";
import BusinessDetailsStep from "./steps/BusinessDetailsStep";
import IdentityStep from "./steps/IdentityStep";
import InventoryStep from "./steps/InventoryStep";
import RevenueStep from "./steps/RevenueStep";
import LogisticsStep from "./steps/LogisticsStep";
import PayoutStep from "./steps/PayoutStep";
import ReviewStep from "./steps/ReviewStep";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";

const steps = [
  { id: 0, label: "Welcome", Component: WelcomeStep },
  { id: 1, label: "Business", Component: BusinessDetailsStep },
  { id: 2, label: "Identity", Component: IdentityStep },
  { id: 3, label: "Inventory", Component: InventoryStep },
  { id: 4, label: "Revenue", Component: RevenueStep },
  { id: 5, label: "Logistics", Component: LogisticsStep },
  { id: 6, label: "Payout", Component: PayoutStep },
  { id: 99, label: "Review", Component: ReviewStep },
] as const;

export default function PartnerWizard() {
  const { step, setStep, loadDraft } = usePartnerWizard();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Current = steps.find((s) => s.id === step)?.Component ?? WelcomeStep;

  useEffect(() => {
    const stepLabel = steps.find(s => s.id === step)?.label ?? "Welcome";
    document.title = `Onboarding • ${stepLabel}`;
  }, [step]);

  useEffect(() => {
    if (user) {
      startTransition(() => {
        loadDraft(user)
          .then(() => setLoading(false))
          .catch((err) => {
            console.error('Failed to load draft:', err);
            setError('Failed to load partner data');
            setLoading(false);
          });
      });
    } else {
      setLoading(false);
    }
  }, [user, loadDraft]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to continue</p>
          <Button onClick={() => window.location.href = '/lender-portal'}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading step...</p>
        </div>
      }>
        <Current />
      </Suspense>

      {/* Nav Buttons */}
      <div className="p-4 flex justify-between border-t bg-white">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => startTransition(() => setStep(Math.max(0, step - 1)))}
        >
          Back
        </Button>
        <Button
          onClick={() => startTransition(() => setStep(Math.min(99, step + 1)))}
          disabled={step >= steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}