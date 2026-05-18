import { Schema, model, models } from "mongoose";

/* =========================
   PRODUCT SCHEMA
========================= */

const ProductSchema = new Schema({
  name: {
    type: String,
    default: "",
  },

  hsn: {
    type: String,
    default: "",
  },

  qty: {
    type: Number,
    default: 1,
  },

  price: {
    type: Number,
    default: 0,
  },

  gst: {
    type: Number,
    default: 0,
  },

  serialNo: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },
});

/* =========================
   INVOICE SCHEMA
========================= */

const InvoiceSchema = new Schema({
  invoiceNo: {
    type: String,
    default: "",
  },

  customerName: {
    type: String,
    default: "",
  },

  grandTotal: {
    type: Number,
    default: 0,
  },

  businessName: {
    type: String,
    default: "",
  },

  gstNumber: {
    type: String,
    default: "",
  },

  sellerState: {
    type: String,
    default: "",
  },

  buyerState: {
    type: String,
    default: "",
  },

  products: [ProductSchema],

  invoiceDate: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* =========================
   SELLER SCHEMA
========================= */

const SellerSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  businessName: {
    type: String,
    default: "",
  },

  gstNumber: {
    type: String,
    default: "",
  },

  sellerState: {
    type: String,
    default: "",
  },

  sellerAddress: {
    type: String,
    default: "",
  },

  sellerPhone: {
    type: String,
    default: "",
  },

  sellerEmail: {
    type: String,
    default: "",
  },

  bankName: {
    type: String,
    default: "",
  },

  bankAccount: {
    type: String,
    default: "",
  },

  bankIfsc: {
    type: String,
    default: "",
  },

  bankHolder: {
    type: String,
    default: "",
  },

  logo: {
    type: String,
    default: "",
  },

  invoices: [InvoiceSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* =========================
   APP SETTINGS SCHEMA
========================= */

const AppSettingsSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  value: {
    type: String,
    default: "",
  },
});

/* =========================
   EXPORT MODELS
========================= */

export const Seller =
  models.Seller || model("Seller", SellerSchema);

export const AppSettings =
  models.AppSettings ||
  model("AppSettings", AppSettingsSchema);