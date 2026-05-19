import mongoose, { Schema, Document, Model } from "mongoose";

// ── AppSettings ──────────────────────────────────────────────────────────────
export interface IAppSettings extends Document {
  key: string;
  value: string;
}

const AppSettingsSchema = new Schema<IAppSettings>({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export const AppSettings: Model<IAppSettings> =
  mongoose.models.AppSettings ||
  mongoose.model<IAppSettings>("AppSettings", AppSettingsSchema);

// ── Product ───────────────────────────────────────────────────────────────────
export interface IProduct {
  name:        string;
  hsn:         string;
  qty:         number;
  price:       number;
  gst:         number;
  serialNo?:   string;
  description?: string;
}

const ProductSchema = new Schema<IProduct>({
  name:        { type: String, default: "" },
  hsn:         { type: String, default: "" },
  qty:         { type: Number, default: 1 },
  price:       { type: Number, default: 0 },
  gst:         { type: Number, default: 18 },
  serialNo:    { type: String, default: "" },
  description: { type: String, default: "" },
});

// ── Invoice ───────────────────────────────────────────────────────────────────
export interface IInvoice {
  invoiceNo:    string;
  customerName: string;
  grandTotal:   number;
  businessName: string;
  gstNumber:    string;
  sellerState:  string;
  buyerState:   string;
  products:     IProduct[];
  invoiceDate:  string;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNo:    { type: String, default: "" },
  customerName: { type: String, default: "" },
  grandTotal:   { type: Number, default: 0 },
  businessName: { type: String, default: "" },
  gstNumber:    { type: String, default: "" },
  sellerState:  { type: String, default: "" },
  buyerState:   { type: String, default: "" },
  products:     { type: [ProductSchema], default: [] },
  invoiceDate:  { type: String, default: "" },
});

// ── Seller ────────────────────────────────────────────────────────────────────
export interface ISeller extends Document {
  username:      string;
  password:      string;
  businessName:  string;
  gstNumber:     string;
  sellerState:   string;
  sellerAddress: string;
  sellerPhone:   string;
  sellerEmail:   string;
  bankName:      string;
  bankAccount:   string;
  bankIfsc:      string;
  bankHolder:    string;
  logo:          string;
  invoices:      IInvoice[];
}

const SellerSchema = new Schema<ISeller>({
  username:      { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  businessName:  { type: String, default: "" },
  gstNumber:     { type: String, default: "" },
  sellerState:   { type: String, default: "" },
  sellerAddress: { type: String, default: "" },
  sellerPhone:   { type: String, default: "" },
  sellerEmail:   { type: String, default: "" },
  bankName:      { type: String, default: "" },
  bankAccount:   { type: String, default: "" },
  bankIfsc:      { type: String, default: "" },
  bankHolder:    { type: String, default: "" },
  logo:          { type: String, default: "" },
  invoices:      { type: [InvoiceSchema], default: [] },
});

export const Seller: Model<ISeller> =
  mongoose.models.Seller ||
  mongoose.model<ISeller>("Seller", SellerSchema);