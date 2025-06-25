import saleData from "@/data/saleData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function ClearanceSaleApi() {
  try {
    console.log("Data loaded:", saleData);
    return NextResponse.json(saleData, { status: 200 });
  } catch (error) {
    console.error("Error loading data:", error);
    return NextResponse.json(
      { error: "Failed to load sale data" },
      { status: 500 }
    );
  }
}
