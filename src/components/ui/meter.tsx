import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";

import { cn } from "@/lib/utils";

function Meter({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Root>) {
  return (
    <BaseMeter.Root
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  );
}

function MeterTrack({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMeter.Track>) {
  return (
    <BaseMeter.Track
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-oat",
        className,
      )}
      {...props}
    >
      {children}
    </BaseMeter.Track>
  );
}

function MeterIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Indicator>) {
  return (
    <BaseMeter.Indicator
      className={cn("rounded-full bg-caramel transition-all", className)}
      {...props}
    />
  );
}

const MeterLabel = BaseMeter.Label;
const MeterValue = BaseMeter.Value;

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue };
