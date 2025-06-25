import allCollectionsData from "@/data/allCollectionsData";
import { NextResponse } from "next/server";

// Enable Edge Runtime
export const runtime = "edge";

export default function AllCollectionsApi() {
  try {
    console.log("Data loaded:", allCollectionsData);
    return NextResponse.json(allCollectionsData, { status: 200 });
  } catch (error) {
    console.error("Error loading data:", error);
    return NextResponse.json(
      { error: "Failed to load collection data" },
      { status: 500 }
    );
  }
}
