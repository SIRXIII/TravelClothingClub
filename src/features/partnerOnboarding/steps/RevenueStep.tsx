import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePartnerWizard } from "../hooks/usePartnerWizard";
import { TextInput } from "../../../components/ui/text-input";
import { Button } from "../../../components/ui/button";

/**
 * RevenueStep collects pricing inputs and displays a real‑time earnings estimate.
 * Partners can experiment with daily rates and rental duration to understand
 * potential earnings.  Estimates are not persisted to the database; they are
 * purely informational at this stage.
 */

const schema = yup.object({
  dailyRate: yup
    .number()
    .typeError("Daily rate must be a number")
    .required("Please enter a daily rental rate")
    .min(1, "Rate must be greater than 0"),
  rentalDays: yup
    .number()
    .typeError("Rental days must be a number")
    .required("Please enter an average rental duration")
    .min(1, "Must be at least one day"),
});

export default function RevenueStep() {
  const { data, setStep } = usePartnerWizard();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dailyRate: 25,
      rentalDays: 7,
    },
  });

  // watch form values for live estimate
  const dailyRate = watch("dailyRate");
  const rentalDays = watch("rentalDays");
  const itemCount = data.itemCount ?? 1;

  const estimated = Number(itemCount) * Number(dailyRate) * Number(rentalDays);

  const onSubmit = () => {
    // Proceed to inventory upload step
    setStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Estimate your earnings</h2>
        <p className="text-gray-600 mb-4">
          Adjust the daily rate and typical rental duration to see how much you could
          earn. This estimate uses your current item count ({itemCount}).
        </p>
      </div>

      <TextInput
        label="Daily Rental Rate ($)"
        type="number"
        step="0.01"
        {...register("dailyRate")}
        error={errors.dailyRate?.message as string}
      />
      <TextInput
        label="Average Rental Days"
        type="number"
        {...register("rentalDays")}
        error={errors.rentalDays?.message as string}
      />

      <div className="bg-gray-100 p-4 rounded">
        <p className="text-lg">
          Potential revenue: <span className="font-semibold">${estimated.toLocaleString()}</span>
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={() => setStep(1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3"
        >
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
          Next
        </Button>
      </div>
    </form>
  );
}