import { buildRegistryItem } from "@/lib/registry/registry-builder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formName, filePlan, dependencyPlan } = body;

    if (!formName || !filePlan || !dependencyPlan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const registryItem = buildRegistryItem(formName, filePlan, dependencyPlan);

    return NextResponse.json(registryItem, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating registry item:", error);
    return NextResponse.json(
      { error: "Failed to generate registry item" },
      { status: 500 },
    );
  }
}
