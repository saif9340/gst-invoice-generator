/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Seller, AppSettings } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, username, password, businessName, gstNumber, sellerState, sellerAddress, sellerPhone, sellerEmail } = body;

    if (action === "login") {
      // Admin login — check database first, fallback to "admin123"
      if (username === "admin") {
        const adminSettings = await AppSettings.findOne({ key: "adminPassword" });
        const adminPassword = adminSettings?.value || "admin123";
        if (password === adminPassword) {
          return NextResponse.json({ success: true, role: "admin" });
        }
        return NextResponse.json({ success: false, message: "Wrong admin password." });
      }

      // Seller login
      const seller = await Seller.findOne({ username, password });
      if (seller) {
        return NextResponse.json({ success: true, role: "seller", seller: seller.toObject() });
      }

      return NextResponse.json({ success: false, message: "Invalid username or password." });
    }

    if (action === "register") {
      if (!username || !password || !businessName) {
        return NextResponse.json({ success: false, message: "Username, password and business name are required." });
      }

      const existing = await Seller.findOne({ username });
      if (existing) {
        return NextResponse.json({ success: false, message: "Username already exists." });
      }

      const newSeller = await Seller.create({
        username, password, businessName,
        gstNumber: gstNumber || "",
        sellerState: sellerState || "",
        sellerAddress: sellerAddress || "",
        sellerPhone: sellerPhone || "",
        sellerEmail: sellerEmail || "",
      });

      return NextResponse.json({ success: true, role: "seller", seller: newSeller.toObject() });
    }

    return NextResponse.json({ success: false, message: "Invalid action" });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}