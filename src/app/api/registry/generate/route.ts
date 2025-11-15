import { buildRegistryItem } from "@/lib/registry/registry-builder";
import clientPromise from "@/lib/mongodb";
import type { RegistryItem } from "@/lib/registry/registry-builder";
import { NextRequest, NextResponse } from "next/server";

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

interface StoredRegistry {
  _id: string;
  registryId: string;
  item: RegistryItem;
  createdAt: Date;
  expiresAt: Date;
}

function getRegistryId(formName: string, uniqueId: string): string {
  const itemName = formName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `${itemName}-${uniqueId}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formName, filePlan, dependencyPlan, uniqueId } = body;

    if (!formName || !filePlan || !dependencyPlan || !uniqueId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Step 1: Generate registry item
    const registryItem = buildRegistryItem(formName, filePlan, dependencyPlan);

    // Step 2: Create registry ID
    const registryId = getRegistryId(formName, uniqueId);

    // Step 3: Store in MongoDB
    const client = await clientPromise;
    const db = client.db("better-form");
    const collection = db.collection<StoredRegistry>("registries");

    // Create TTL index if it doesn't exist
    await collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, background: true },
    );

    const now = new Date();
    const expiresAt = new Date(now.getTime() + EXPIRATION_TIME);

    // Upsert the registry
    await collection.updateOne(
      { registryId },
      {
        $set: {
          registryId,
          item: registryItem,
          createdAt: now,
          expiresAt,
        },
      },
      { upsert: true },
    );

    // Step 4: Return just the URL
    const url = `${request.nextUrl.origin}/api/r/${registryId}.json`;

    return NextResponse.json({ url }, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating and storing registry:", error);
    return NextResponse.json(
      { error: "Failed to generate registry" },
      { status: 500 },
    );
  }
}
