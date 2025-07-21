import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "../../../components/ui/text-input";
import { Button } from "../../../components/ui/button";

const schema = yup.object({
  itemCount: yup.number().required().min(1),
  categories: yup.string().required(),
});

export default function InventoryStep() {
  const { upsert, setStep, data } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      itemCount: data.itemCount ?? "",
      categories: data.categories ?? "",
    },
  });

  const onSubmit = (values: any) => {
    upsert({
      itemCount: values.itemCount,
      categories: values.categories,
    });
    setStep(4);
  };

  return (
    <form
      className="flex-1 max-w-xl mx-auto flex flex-col gap-4 p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label="Number of Items Available"
        type="number"
        error={errors.itemCount?.message}
        {...register("itemCount")}
      />
      <TextInput
        label="Main Categories (comma separated)"
        error={errors.categories?.message}
        {...register("categories")}
      />
      <div className="mt-6 ml-auto">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 