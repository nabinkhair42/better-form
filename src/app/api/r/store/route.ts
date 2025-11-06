import clientPromise from "@/lib/mongodb";
import type { RegistryItem } from "@/lib/registry/registry-builder";
import { NextRequest, NextResponse } from "next/server";

// Expiration time: 24 hours (permanent storage with TTL index in MongoDB)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface StoredRegistry {
  _id: string;
  registryId: string;
  item: RegistryItem;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * POST /api/r/store
 * Stores a registry item in MongoDB (expires in 24 hours via TTL index)
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

    const client = await clientPromise;
    const db = client.db("better-form");
    const collection = db.collection<StoredRegistry>("registries");

    // Create TTL index if it doesn't exist (expires documents after expiresAt)
    await collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, background: true },
    );

    const now = new Date();
    const expiresAt = new Date(now.getTime() + EXPIRATION_TIME);

    // Upsert the registry (replace if exists)
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
 * Retrieves a stored registry item from MongoDB
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registryId = searchParams.get("id");

    if (!registryId) {
      return NextResponse.json(
        { error: "Missing registry ID" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("better-form");
    const collection = db.collection<StoredRegistry>("registries");

    const stored = await collection.findOne({ registryId });

    if (!stored) {
      return NextResponse.json(
        { error: "Registry not found or expired" },
        { status: 404 },
      );
    }

    // Check if expired (MongoDB TTL might not have cleaned it up yet)
    if (new Date() > stored.expiresAt) {
      await collection.deleteOne({ registryId });
      return NextResponse.json({ error: "Registry expired" }, { status: 410 }); // 410 Gone
    }

    return NextResponse.json(stored.item);
  } catch (error) {
    console.error("Failed to retrieve registry:", error);
    return NextResponse.json(
      { error: "Failed to retrieve registry" },
      { status: 500 },
    );
  }
}
