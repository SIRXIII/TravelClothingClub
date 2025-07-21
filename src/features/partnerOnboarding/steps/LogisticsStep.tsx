import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  shippingMethod: yup.string().required(),
  handlingTime: yup.string().required(),
});

export default function LogisticsStep() {
  const { upsert, setStep, data } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shippingMethod: data.shippingMethod ?? "",
      handlingTime: data.handlingTime ?? "",
    },
  });

  const onSubmit = (values: any) => {
    upsert({
      shippingMethod: values.shippingMethod,
      handlingTime: values.handlingTime,
    });
    setStep(5);
  };

  return (
    <form
      className="flex-1 max-w-xl mx-auto flex flex-col gap-4 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Preferred Shipping Method"
        error={errors.shippingMethod?.message}
        {...register("shippingMethod")}
      />
      <TextInput
        label="Handling Time (e.g. 1-2 days)"
        error={errors.handlingTime?.message}
        {...register("handlingTime")}
      />
      <div className="mt-6 ml-auto">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 