"use client";

import { CopyButton } from "@/components/ui/extended/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DependencyAction,
  DependencyPlan,
  DependencySummary,
} from "@/lib/dependencies";
import { DependenciesList } from "./dependencies-list";
import { useState } from "react";

interface GetCodePanelProps {
  plan: DependencyPlan;
  summary: DependencySummary;
}

export function GetCodePanel({ plan, summary }: GetCodePanelProps) {
  const registryActions = plan.actions.filter(
    (action) => action.type === "registry-add",
  );

  return (
    <Tabs defaultValue="cli" className="space-y-6">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="cli" className="space-y-4">
        {registryActions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This form does not require any shadcn commands.
          </p>
        ) : (
          <div className="space-y-4">
            {registryActions.map((action) => (
              <ActionCommands key={action.id} action={action} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="manual" className="space-y-4">
        <DependenciesList
          summary={summary}
          projectComponents={plan.projectComponents}
        />
      </TabsContent>
    </Tabs>
  );
}

function ActionCommands({ action }: { action: DependencyAction }) {
  if (!action.commands.length) {
    return null;
  }

  const [activeLabel, setActiveLabel] = useState(action.commands[0]?.label ?? "");
  const activeCommand =
    action.commands.find((variant) => variant.label === activeLabel) ??
    action.commands[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {action.label}
        </span>
        <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1">
          {action.commands.map((variant) => {
            const isActive = variant.label === activeLabel;
            return (
              <button
                key={variant.label}
                type="button"
                onClick={() => setActiveLabel(variant.label)}
                className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {variant.label}
              </button>
            );
          })}
        </div>
      </div>

      {action.description ? (
        <p className="text-xs text-muted-foreground">{action.description}</p>
      ) : null}

      {activeCommand ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
          <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm">
            {activeCommand.command}
          </code>
          <CopyButton value={activeCommand.command} />
        </div>
      ) : null}
    </div>
  );
}
