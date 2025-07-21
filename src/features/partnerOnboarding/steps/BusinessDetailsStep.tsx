import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  storeName: yup.string().required(),
  contactName: yup.string().required(),
  email: yup.string().email().required(),
  city: yup.string().required(),
});

export default function BusinessDetailsStep() {
  const { upsert, setStep, data } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      storeName: data.name ?? "",
      contactName: data.contact ?? "",
      email: data.email ?? "",
      city: data.city ?? "",
    },
  });

  const onSubmit = (values: any) => {
    upsert({
      name: values.storeName,
      contact: values.contactName,
      email: values.email,
      city: values.city,
    });
    setStep(2);
  };

  return (
    <form
      className="flex-1 max-w-xl mx-auto flex flex-col gap-4 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Store / Brand Name"
        error={errors.storeName?.message}
        {...register("storeName")}
      />
      <TextInput
        label="Contact Person"
        error={errors.contactName?.message}
        {...register("contactName")}
      />
      <TextInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextInput
        label="City"
        error={errors.city?.message}
        {...register("city")}
      />
      <div className="mt-6 ml-auto">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 