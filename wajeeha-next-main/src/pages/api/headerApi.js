import headerData from "@/data/headerData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function HeaderApi() {
  try {
    return NextResponse.json(headerData, { status: 200 });
  } catch (error) {
    console.error("Error loading header data:", error);
    return NextResponse.json(
      { error: "Failed to load header data" },
      { status: 500 }
    );
  }
}
