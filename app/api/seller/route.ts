/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Seller } from "@/lib/models";

const SellerModel: any = Seller;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { action, username } = body;

    if (action === "saveProfile") {
      const seller = await SellerModel.findOneAndUpdate(
        {
          username,
        },
        {
          businessName: body.businessName,
          gstNumber: body.gstNumber,
          sellerState: body.sellerState,
          sellerAddress: body.sellerAddress,
          sellerPhone: body.sellerPhone,
          sellerEmail: body.sellerEmail,
          bankName: body.bankName,
          bankAccount: body.bankAccount,
          bankIfsc: body.bankIfsc,
          bankHolder: body.bankHolder,
          logo: body.logo,
        },
        {
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
        seller,
      });
    }

    if (action === "saveInvoice") {
      const seller = await SellerModel.findOneAndUpdate(
        {
          username,
        },
        {
          $push: {
            invoices: {
              $each: [body.invoice],
              $position: 0,
            },
          },
        },
        {
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
        invoices: seller?.invoices || [],
      });
    }

    if (action === "deleteInvoice") {
      const seller = await SellerModel.findOne({
        username,
      });

      if (seller) {
        seller.invoices.splice(body.index, 1);

        await seller.save();
      }

      return NextResponse.json({
        success: true,
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const username =
      searchParams.get("username");

    if (username) {
      const seller = await SellerModel.findOne({
        username,
      });

      return NextResponse.json({
        success: true,
        seller,
      });
    }

    return NextResponse.json({
      success: false,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}