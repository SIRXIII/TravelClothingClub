import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        ref={ref}
        {...props}
        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/50"
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </label>
  )
);
TextInput.displayName = "TextInput"; 