# UI Component Implementation Context

## Component Requested
Fix invisible toggle switches in worker induction form at `C:\Users\jakes\Developer\bbwa\apps\web\src\app\induction\worker\page.tsx`

## Current Issue Analysis

### Problem Description
The Switch components for "High Risk License", "Safe Work on Tilt Jobs", and "Other Professional License" are completely invisible despite being in the code. They should appear as compact toggle switches but are not rendering visually.

### Current Implementation
The form uses shadcn/ui Switch components implemented as:
```tsx
<FormField
  control={form.control}
  name="highRiskLicense"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-lg">
      <div className="space-y-1">
        <FormLabel>High Risk License</FormLabel>
        <FormDescription>
          Working at heights, confined spaces, etc.
        </FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

### Current Switch Component Code
Located at `C:\Users\jakes\Developer\bbwa\apps\web\src\components\ui\switch.tsx`:
```tsx
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
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
```

### Root Cause Analysis

#### Issue 1: Global CSS Conflicts
The global CSS at `C:\Users\jakes\Developer\bbwa\apps\web\src\app\globals.css` has accessibility rules that override switch sizing:

```css
/* Lines 264-274: Minimum size requirements for interactive elements */
button,
[role="button"],
input,
select,
textarea,
a {
  min-height: 44px;
  min-width: 44px;
}
```

This forces the Switch (which is a button with role="switch") to be 44x44px minimum, but then the existing CSS tries to override this:

```css
/* Lines 315-322: Attempted fix that's not working properly */
.induction-form button[role="switch"],
.induction-form [data-state] {
  min-height: unset !important;
  min-width: unset !important;
  width: 2rem !important;
  height: 1.15rem !important;
}
```

#### Issue 2: Color Theme Issues
The switch uses CSS custom properties that may not be properly defined:
- `data-[state=checked]:bg-primary` - relies on `--primary` CSS variable
- `data-[state=unchecked]:bg-input` - relies on `--input` CSS variable
- `bg-background` for thumb - relies on `--background` CSS variable

#### Issue 3: Size Inconsistency
The current implementation uses mixed sizing approaches:
- Root: `h-[1.15rem] w-8` (18.4px height, 32px width)
- Thumb: `size-4` (16px x 16px)
- CSS override attempts: `width: 2rem !important; height: 1.15rem !important;`

### Integration Requirements

1. **Fix CSS Conflicts**: The accessibility CSS rules need proper exceptions for Switch components
2. **Ensure Proper Theming**: Verify all CSS custom properties are available and correctly mapped
3. **Consistent Sizing**: Use a single, clear sizing approach that works with the form layout
4. **Visual Verification**: The switches should be clearly visible and properly sized as compact toggles

### Styling Notes

The switches should:
- Be approximately 32px wide x 18px tall (compact toggle size)
- Have a clear visual distinction between on/off states
- Use the design system primary color for the "on" state
- Have proper focus states for accessibility
- Work within the existing form grid layout

### Current Form Location

The problematic switches are in the "Licenses & Certifications" section around lines 930-1023 in the worker induction form.

## Next Steps for Frontend Developer

1. **Immediate Priority**: Fix the CSS conflicts that are making switches invisible
2. **Verification**: Ensure proper color theming for switch states
3. **Testing**: Verify switches are visible and functional in both light/dark modes
4. **Accessibility**: Maintain proper focus states while fixing sizing issues
5. **Consistency**: Ensure the fix works for all three switch instances in the form

### Specific Implementation Tasks
- Update the CSS override rules to properly target and size Switch components
- Verify CSS custom property definitions are available
- Test the switches render correctly and respond to state changes
- Ensure proper visual feedback for checked/unchecked states