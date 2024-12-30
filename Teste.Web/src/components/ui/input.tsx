import * as React from "react";
import { useMask, MaskOptions } from "@react-input/mask";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^\d]/g, "");

    event.target.value = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseInt(value) / 100);

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border-2 border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  );
});
CurrencyInput.displayName = "Currency Input";

interface MaskInputProps extends React.ComponentProps<"input"> {
  maskOptions: MaskOptions;
}

const MaskInput = React.forwardRef<HTMLInputElement, MaskInputProps>(
  ({ className, type, maskOptions, ...props }, _ref) => {
    const inputRef = useMask(maskOptions);

    return (
      <Input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={inputRef}
        {...props}
      />
    );
  }
);
MaskInput.displayName = "Mask Input";

export { Input, CurrencyInput, MaskInput };
