import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "../../../components/ui/text-input";
import { Button } from "../../../components/ui/button";

const schema = yup.object({
  legalName: yup.string().required(),
  idNumber: yup.string().required(),
});

export default function IdentityStep() {
  const { upsert, setStep, data } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      legalName: data.legalName ?? "",
      idNumber: data.idNumber ?? "",
    },
  });

  const onSubmit = (values: any) => {
    upsert({
      legalName: values.legalName,
      idNumber: values.idNumber,
    });
    setStep(3);
  };

  return (
    <form
      className="flex-1 max-w-xl mx-auto flex flex-col gap-4 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Legal Name"
        error={errors.legalName?.message}
        {...register("legalName")}
      />
      <TextInput
        label="ID Number"
        error={errors.idNumber?.message}
        {...register("idNumber")}
      />
      <div className="mt-6 ml-auto">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 