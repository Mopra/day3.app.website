"use client";

import * as React from "react";
import { Clock, GitBranch, Mail, Zap, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { LivePanel, StepRow, useSequence } from "@/components/marketing/live-panel";

/*
  One person walking a welcome series, one node per beat. It's the Welcome
  series template, more or less: the trigger, the first email, the wait, the
  branch on whether they opened it, the second email. The right-hand column is
  what the flow decided at each step, because "it ran" is only convincing when
  you can see what it did.
*/
const nodes: {
  kind: string;
  icon: LucideIcon;
  label: string;
  result: string;
  tone: string;
}[] = [
  {
    kind: "Trigger",
    icon: Zap,
    label: "jane@acme.com",
    result: "Joined",
    tone: "text-caramel",
  },
  {
    kind: "Email",
    icon: Mail,
    label: "Welcome to Acme",
    result: "Delivered",
    tone: "text-olive",
  },
  {
    kind: "Wait",
    icon: Clock,
    label: "3 days, office hours",
    result: "Held to Monday",
    tone: "text-muted-foreground",
  },
  {
    kind: "If",
    icon: GitBranch,
    label: "Opened the welcome?",
    result: "Yes",
    tone: "text-caramel",
  },
  {
    kind: "Email",
    icon: Mail,
    label: "Your first project",
    result: "Delivered",
    tone: "text-olive",
  },
];

/** One step per node, plus an empty first frame to start from. */
const STEPS = nodes.length + 1;

function PanelAutomation() {
  const { ref, step } = useSequence(STEPS, { interval: 640, hold: 3000 });

  return (
    <LivePanel
      ref={ref}
      title="Automation"
      meta="Welcome series · v2 · live"
      alt="One subscriber moving through a live welcome series: they join the audience, get the welcome email, wait three days inside working hours, are checked for having opened it, and then get the follow-up email."
    >
      <ol className="relative space-y-1.5">
        {/* The spine. Sits behind the icon badges so the rows read as a flow, not a list. */}
        <span
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-[23px] w-px bg-border"
        />
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const shown = step > index;
          return (
            <li key={node.kind + node.label}>
              <StepRow
                shown={shown}
                className="relative rounded-lg border border-border bg-background px-3 py-2"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    node.kind === "Email" ? "bg-olive/15" : "bg-caramel/15",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3",
                      node.kind === "Email" ? "text-olive" : "text-caramel",
                    )}
                  />
                </span>
                {/* The kind column goes on phones: the icon carries it, and the label needs the room. */}
                <span className="hidden w-14 shrink-0 text-xs font-medium text-muted-foreground sm:block">
                  {node.kind}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {node.label}
                </span>
                <span className={cn("shrink-0 text-xs font-medium", node.tone)}>
                  {node.result}
                </span>
              </StepRow>
            </li>
          );
        })}
      </ol>
    </LivePanel>
  );
}

export { PanelAutomation };
