import footerData from "@/data/footerData.json";
import { NextResponse } from "next/server";

export const runtime = "edge";

export default function FooterApi() {
  try {
    return NextResponse.json(footerData, { status: 200 });
  } catch (error) {
    console.error("Error loading footer data:", error);
    return NextResponse.json(
      { error: "Failed to load footer data" },
      { status: 500 }
    );
  }
}
