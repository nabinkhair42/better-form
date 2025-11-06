import type { RegistryItem } from "@/lib/registry/registry-builder";
import { NextRequest, NextResponse } from "next/server";

// Temporary in-memory storage with expiration (5 minutes)
const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface StoredRegistry {
  item: RegistryItem;
  expiresAt: number;
}

const registryStore = new Map<string, StoredRegistry>();

// Cleanup expired registries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of registryStore.entries()) {
    if (now > value.expiresAt) {
      registryStore.delete(key);
    }
  }
}, 60 * 1000);

/**
 * POST /api/r/store
 * Temporarily stores a registry item (expires in 5 minutes)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registryId, registryItem } = body as {
      registryId: string;
      registryItem: RegistryItem;
    };

    if (!registryId || !registryItem) {
      return NextResponse.json(
        { error: "Missing registryId or registryItem" },
        { status: 400 },
      );
    }

    // Store with expiration timestamp
    registryStore.set(registryId, {
      item: registryItem,
      expiresAt: Date.now() + EXPIRATION_TIME,
    });

    const url = `${request.nextUrl.origin}/api/r/${registryId}.json`;

    return NextResponse.json({
      success: true,
      url,
      registryId,
      expiresIn: EXPIRATION_TIME / 1000, // seconds
    });
  } catch (error) {
    console.error("Failed to store registry:", error);
    return NextResponse.json(
      { error: "Failed to store registry" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/r/store
 * Retrieves a stored registry item (checks expiration)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const registryId = searchParams.get("id");

  if (!registryId) {
    return NextResponse.json({ error: "Missing registry ID" }, { status: 400 });
  }

  const stored = registryStore.get(registryId);

  if (!stored) {
    return NextResponse.json(
      { error: "Registry not found or expired" },
      { status: 404 },
    );
  }

  // Check if expired
  if (Date.now() > stored.expiresAt) {
    registryStore.delete(registryId);
    return NextResponse.json({ error: "Registry expired" }, { status: 410 }); // 410 Gone
  }

  return NextResponse.json(stored.item);
}
