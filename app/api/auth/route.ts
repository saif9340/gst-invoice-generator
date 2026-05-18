/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Seller, AppSettings } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const username = body.username;
    const password = body.password;

    // =========================
    // ADMIN LOGIN
    // =========================

    if (username === "admin") {
      const adminSettings = await AppSettings.findOne();

      const adminPassword =
        adminSettings?.value || "admin123";

      if (password === adminPassword) {
        return NextResponse.json({
          success: true,
          role: "admin",
        });
      }

      return NextResponse.json({
        success: false,
        message: "Invalid admin password",
      });
    }

    // =========================
    // SELLER LOGIN
    // =========================

    const seller = await Seller.findOne({
  username,
  password,
} as any);

    if (!seller) {
      return NextResponse.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    return NextResponse.json({
      success: true,
      role: "seller",
      seller,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}