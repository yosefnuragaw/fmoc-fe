import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border rounded-lg mt-1 bg-accent-base body-2 text-neutral-800 focus:ring focus:ring-approved-base focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;