import { startTransition } from "react";
import { Button } from "../../../components/ui/button";
import { usePartnerWizard } from "../hooks/usePartnerWizard";

export default function WelcomeStep() {
  const { setStep } = usePartnerWizard();
  return (
    <section className="flex-1 grid place-items-center text-center p-8">
      <div className="max-w-lg space-y-6">
        <h1 className="text-3xl font-bold">Let’s get your styles traveling ✈️</h1>
        <p>
          Earn passive income by renting out clothing to verified travelers.
          We’ll walk you through a few quick steps.
        </p>
        <Button className="w-full" onClick={() => startTransition(() => setStep(1))}>
          Get Started
        </Button>
      </div>
    </section>
  );
} 