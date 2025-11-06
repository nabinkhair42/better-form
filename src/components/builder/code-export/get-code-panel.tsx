"use client";

import { CodeBlockClient } from "@/components/ui/code-block";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import type {
  DependencyAction,
  DependencyPlan,
  DependencySummary,
} from "@/lib/dependencies";
import { useState } from "react";
import { DependenciesList } from "./dependencies-list";

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
  const [activeLabel, setActiveLabel] = useState(
    action.commands[0]?.label ?? "",
  );

  if (!action.commands.length) {
    return null;
  }

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
        <CodeBlockClient
          code={activeCommand.command}
          language="bash"
          label={activeCommand.label}
        />
      ) : null}
    </div>
  );
}
