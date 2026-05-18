/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Seller, AppSettings } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();

    const sellers = await Seller.find({});

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { action } = body;

    // CHANGE PASSWORD
    if (action === "changePassword") {
      await AppSettings.findOneAndUpdate(
        { key: "adminPassword" },
        {
          key: "adminPassword",
          value: body.newPassword,
        },
        {
          upsert: true,
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
      });
    }

    // DELETE SELLER
    if (action === "deleteSeller") {
      await Seller.deleteOne({
        username: body.username,
      });

      return NextResponse.json({
        success: true,
      });
    }

    // VERIFY ADMIN
    if (action === "verifyAdmin") {
      const adminSettings = await AppSettings.findOne({
        key: "adminPassword",
      });

      const adminPassword = adminSettings?.value || "admin123";

      if (body.password === adminPassword) {
        return NextResponse.json({
          success: true,
        });
      }

      return NextResponse.json({
        success: false,
        message: "Wrong admin password.",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid action",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}