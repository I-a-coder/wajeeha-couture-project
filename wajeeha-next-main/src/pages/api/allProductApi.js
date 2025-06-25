import productsData from "@/data/productsData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function AllProductApi() {
  try {
    console.log("Data loaded:", productsData);
    return NextResponse.json(productsData, { status: 200 });
  } catch (error) {
    console.error("Error loading data:", error);
    return NextResponse.json(
      { error: "Failed to load product data" },
      { status: 500 }
    );
  }
}
