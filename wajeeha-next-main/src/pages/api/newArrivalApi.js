import newArrivalData from "@/data/newArrivalData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function NewArrivalApi() {
  try {
    console.log("Data loaded:", newArrivalData);
    return NextResponse.json(newArrivalData, { status: 200 });
  } catch (error) {
    console.error("Error loading new arrival data:", error);
    return NextResponse.json(
      { error: "Failed to load new arrival data" },
      { status: 500 }
    );
  }
}
