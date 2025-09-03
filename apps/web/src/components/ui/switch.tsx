"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all duration-300 ease-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "hover:data-[state=checked]:bg-primary/90 hover:data-[state=unchecked]:bg-input/80",
        "hover:shadow-sm hover:scale-105 active:scale-95",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        className
      )}
      data-radix-switch-root=""
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full ring-0 shadow-sm transition-all duration-300 ease-out",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:shadow-md"
        )}
        data-radix-switch-thumb=""
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
