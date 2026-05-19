import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Seller, AppSettings } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      action,
      username,
      password,
      businessName,
      gstNumber,
      sellerState,
      sellerAddress,
      sellerPhone,
      sellerEmail,
    } = body as {
      action:        string;
      username:      string;
      password:      string;
      businessName?: string;
      gstNumber?:    string;
      sellerState?:  string;
      sellerAddress?:string;
      sellerPhone?:  string;
      sellerEmail?:  string;
    };

    // ── ADMIN LOGIN ──────────────────────────────────────────────────────────
    if (action === "login" && username === "admin") {
      const setting = await AppSettings.findOne({ key: "adminPassword" });
      const adminPassword = setting?.value ?? "admin123";

      if (password === adminPassword) {
        return NextResponse.json({ success: true, role: "admin" });
      }
      return NextResponse.json({ success: false, message: "Invalid admin password" });
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    if (action === "register") {
      const existing = await Seller.findOne({ username });
      if (existing) {
        return NextResponse.json({ success: false, message: "Username already exists" });
      }

      const newSeller = await Seller.create({
        username,
        password,
        businessName:  businessName  ?? "",
        gstNumber:     gstNumber     ?? "",
        sellerState:   sellerState   ?? "",
        sellerAddress: sellerAddress ?? "",
        sellerPhone:   sellerPhone   ?? "",
        sellerEmail:   sellerEmail   ?? "",
        bankName:    "",
        bankAccount: "",
        bankIfsc:    "",
        bankHolder:  "",
        logo:        "",
        invoices:    [],
      });

      return NextResponse.json({ success: true, role: "seller", seller: newSeller });
    }

    // ── SELLER LOGIN ─────────────────────────────────────────────────────────
    if (action === "login") {
      const seller = await Seller.findOne({ username, password });
      if (!seller) {
        return NextResponse.json({ success: false, message: "Invalid username or password" });
      }
      return NextResponse.json({ success: true, role: "seller", seller });
    }

    // ── FALLBACK ─────────────────────────────────────────────────────────────
    return NextResponse.json({ success: false, message: "Invalid action" });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
}