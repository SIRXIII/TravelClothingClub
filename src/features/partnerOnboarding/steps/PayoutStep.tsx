import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  payoutEmail: yup.string().email().required(),
  bankName: yup.string().required(),
});

export default function PayoutStep() {
  const { upsert, setStep, data } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      payoutEmail: data.payoutEmail ?? "",
      bankName: data.bankName ?? "",
    },
  });

  const onSubmit = (values: any) => {
    upsert({
      payoutEmail: values.payoutEmail,
      bankName: values.bankName,
    });
    setStep(99);
  };

  return (
    <form
      className="flex-1 max-w-xl mx-auto flex flex-col gap-4 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Payout Email"
        type="email"
        error={errors.payoutEmail?.message}
        {...register("payoutEmail")}
      />
      <TextInput
        label="Bank Name"
        error={errors.bankName?.message}
        {...register("bankName")}
      />
      <div className="mt-6 ml-auto">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 