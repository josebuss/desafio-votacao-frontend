import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ToastVariant } from "@/components/ui/toast";

type ToastFn = (props: {
  variant?: ToastVariant;
  title?: string;
  description?: string;
}) => void;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastSuccess(
  toast: ToastFn,
  title: string,
  description?: string
) {
  toast({
    variant: "success",
    title,
    description
  });
}

export function toastError(
  toast: ToastFn,
  title: string,
  description?: string
) {
  toast({
    variant: "destructive",
    title,
    description
  });
}

export function toastInfo(toast: ToastFn, title: string, description?: string) {
  toast({
    variant: "default",
    title,
    description
  });
}
