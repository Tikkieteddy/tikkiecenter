import { NextResponse } from "next/server";
import { getPublicVapidKeyStatus } from "@/lib/newsroom/mobile-notifications";

export async function GET() {
  return NextResponse.json(getPublicVapidKeyStatus());
}
