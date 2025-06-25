import homeData from "@/data/homeData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function HomeApi() {
  try {
    console.log("Data loaded:", homeData);
    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    console.error("Error loading home data:", error);
    return NextResponse.json(
      { error: "Failed to load home data" },
      { status: 500 }
    );
  }
}
