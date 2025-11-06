import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/r/[filename].json
 * Serves registry JSON files for shadcn CLI integration
 *
 * This is called by: npx shadcn@latest add <registry-url>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const { filename } = params;

  // Extract the registry ID from filename (e.g., "contact-form-abc123.json" -> "contact-form-abc123")
  const registryId = filename.replace(/\.json$/, "");

  // Fetch from the store API
  const storeUrl = new URL("/api/r/store", request.nextUrl.origin);
  storeUrl.searchParams.set("id", registryId);

  try {
    const response = await fetch(storeUrl.toString());

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Registry not found",
          message: "This registry hasn't been generated or has expired.",
          registryId,
        },
        { status: 404 },
      );
    }

    const registryItem = await response.json();
    return NextResponse.json(registryItem);
  } catch (error) {
    console.error("Failed to fetch registry:", error);
    return NextResponse.json(
      { error: "Failed to fetch registry" },
      { status: 500 },
    );
  }
}
