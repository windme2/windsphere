"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <ToastPrimitives.Provider>
      {toasts.map(({ id, title, description, action }) => (
        <ToastPrimitives.Root
          key={id}
          className={cn(
            "fixed bottom-4 right-4 z-50",
            "flex w-96 items-center gap-4",
            "rounded-lg bg-white p-4 shadow-lg",
            "data-[state=open]:animate-in",
            "data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0",
            "data-[state=open]:slide-in-from-bottom-4"
          )}
        >
          <div className="grid gap-1">
            {title && (
              <ToastPrimitives.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitives.Title>
            )}
            {description && (
              <ToastPrimitives.Description className="text-sm opacity-90">
                {description}
              </ToastPrimitives.Description>
            )}
          </div>
          {action}
          <ToastPrimitives.Close
            className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100"
            onClick={() => removeToast(id)}
          >
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
      ))}
      <ToastPrimitives.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]" />
    </ToastPrimitives.Provider>
  );
}
