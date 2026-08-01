import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    result: "Backend is working! 🚀",
  });
}