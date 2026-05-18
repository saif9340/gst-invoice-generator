import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  hsn: String,
  qty: Number,
  price: Number,
  gst: Number,
  serialNo: String,
  description: String,
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  customerName: String,
  grandTotal: Number,
  businessName: String,
  gstNumber: String,
  sellerState: String,
  buyerState: String,
  products: [ProductSchema],
  invoiceDate: String,
  createdAt: { type: Date, default: Date.now },
});

const SellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, default: "" },
  gstNumber: { type: String, default: "" },
  sellerState: { type: String, default: "" },
  sellerAddress: { type: String, default: "" },
  sellerPhone: { type: String, default: "" },
  sellerEmail: { type: String, default: "" },
  bankName: { type: String, default: "" },
  bankAccount: { type: String, default: "" },
  bankIfsc: { type: String, default: "" },
  bankHolder: { type: String, default: "" },
  logo: { type: String, default: "" },
  invoices: [InvoiceSchema],
  createdAt: { type: Date, default: Date.now },
});

const AppSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export const Seller = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
export const AppSettings = mongoose.models.AppSettings || mongoose.model("AppSettings", AppSettingsSchema);