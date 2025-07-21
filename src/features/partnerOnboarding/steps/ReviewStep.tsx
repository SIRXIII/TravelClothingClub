import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { Button } from "../../../components/ui/button";

export default function ReviewStep() {
  const { data } = usePartnerWizard();
  return (
    <section className="flex-1 p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Review & Publish</h2>
      <pre className="bg-gray-100 p-4 rounded-xl">
        {JSON.stringify(data, null, 2)}
      </pre>
      <Button className="mt-4">Publish – Coming Soon 🚀</Button>
    </section>
  );
} 