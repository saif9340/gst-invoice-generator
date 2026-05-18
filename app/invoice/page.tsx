"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────
type Product = {
  name: string;
  hsn: string;
  qty: number;
  price: number;
  gst: number;
  serialNo?: string;
  description?: string;
};

type SavedInvoice = {
  invoiceNo: string;
  customerName: string;
  grandTotal: number;
  businessName: string;
  gstNumber: string;
  sellerState: string;
  buyerState: string;
  products: Product[];
  invoiceDate: string;
};

type SellerProfile = {
  username: string;
  password: string;
  businessName: string;
  gstNumber: string;
  sellerState: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  bankHolder: string;
  logo: string;
  invoices: SavedInvoice[];
};

// ── API Helpers ───────────────────────────────────────────────────────────────
async function apiAuth(body: object) {
  const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

async function apiSeller(body: object) {
  const res = await fetch("/api/seller", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

async function apiAdmin(body: object) {
  const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

async function apiAdminGet() {
  const res = await fetch("/api/admin");
  return res.json();
}

// ══════════════════════════════════════════════════════════════════════════════
// INVOICE FORM
// ══════════════════════════════════════════════════════════════════════════════
function InvoiceForm({
  sellerProfile,
  onSave,
  topBar,
}: {
  sellerProfile: SellerProfile;
  onSave: (updatedProfile: SellerProfile) => void;
  topBar: React.ReactNode;
}) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState(sellerProfile.businessName);
  const [gstNumber, setGstNumber] = useState(sellerProfile.gstNumber);
  const [sellerState, setSellerState] = useState(sellerProfile.sellerState);
  const [sellerAddress, setSellerAddress] = useState(sellerProfile.sellerAddress);
  const [sellerPhone, setSellerPhone] = useState(sellerProfile.sellerPhone);
  const [sellerEmail, setSellerEmail] = useState(sellerProfile.sellerEmail);
  const [logo, setLogo] = useState(sellerProfile.logo);
  const [bankName, setBankName] = useState(sellerProfile.bankName);
  const [bankAccount, setBankAccount] = useState(sellerProfile.bankAccount);
  const [bankIfsc, setBankIfsc] = useState(sellerProfile.bankIfsc);
  const [bankHolder, setBankHolder] = useState(sellerProfile.bankHolder);
  const [termsText, setTermsText] = useState("Thank you for doing business with us.");

  const [customerName, setCustomerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerGst, setBuyerGst] = useState("");
  const [buyerState, setBuyerState] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("INV-2026-0001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [invoiceTime, setInvoiceTime] = useState(() =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
  const [dueDate, setDueDate] = useState("");
  const [poDate, setPoDate] = useState("");
  const [transportName, setTransportName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [received, setReceived] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Credit");

  const [products, setProducts] = useState<Product[]>([
    { name: "", hsn: "", qty: 1, price: 0, gst: 18, serialNo: "", description: "" },
  ]);

  const [history, setHistory] = useState<SavedInvoice[]>(sellerProfile.invoices || []);
  const [invoiceFormat, setInvoiceFormat] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const handleClearInvoice = () => {
    if (!confirm("Clear all invoice entries and start a new invoice?")) return;
    setCustomerName(""); setBuyerAddress(""); setBuyerPhone(""); setBuyerGst(""); setBuyerState("");
    setInvoiceNo("INV-2026-0001"); setInvoiceDate(new Date().toISOString().split("T")[0]);
    setInvoiceTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    setDueDate(""); setPoDate(""); setTransportName(""); setVehicleNo("");
    setReceived(0); setPrevBalance(0); setPaymentMode("Credit");
    setProducts([{ name: "", hsn: "", qty: 1, price: 0, gst: 18, serialNo: "", description: "" }]);
  };

  const addProduct = () =>
    setProducts([...products, { name: "", hsn: "", qty: 1, price: 0, gst: 18, serialNo: "", description: "" }]);

  const removeProduct = (index: number) => {
    const updated = [...products]; updated.splice(index, 1); setProducts(updated);
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const subtotal = products.reduce((sum, i) => sum + i.qty * i.price, 0);
  const sameState = sellerState.trim().toLowerCase() === buyerState.trim().toLowerCase();
  const totalGstAmount = products.reduce((sum, i) => sum + (i.qty * i.price * i.gst) / 100, 0);
  const cgst = sameState ? totalGstAmount / 2 : 0;
  const sgst = sameState ? totalGstAmount / 2 : 0;
  const igst = sameState ? 0 : totalGstAmount;
  const grandTotal = subtotal + totalGstAmount;
  const balance = grandTotal - received + prevBalance;

  const numberToWords = (num: number) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const convert = (n: number): string => {
      if (n === 0) return "";
      if (n < 20) return ones[n];
      if (n < 100) return (tens[Math.floor(n / 10)] + " " + ones[n % 10]).trim();
      if (n < 1000) return (ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100)).trim();
      if (n < 100000) return (convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000)).trim();
      return (convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000)).trim();
    };
    return convert(Math.floor(num)) + " Rupees Only";
  };

  const handleSaveInvoice = async () => {
    setLoading(true);
    const newInvoice: SavedInvoice = {
      invoiceNo, customerName, grandTotal, businessName,
      gstNumber, sellerState, buyerState, products, invoiceDate,
    };
    const res = await apiSeller({ action: "saveInvoice", username: sellerProfile.username, invoice: newInvoice });
    if (res.success) {
      const updatedHistory = [newInvoice, ...history];
      setHistory(updatedHistory);
      onSave({ ...sellerProfile, invoices: updatedHistory });
      alert("Invoice saved!");
    } else {
      alert("Failed to save invoice: " + res.message);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const res = await apiSeller({
      action: "saveProfile", username: sellerProfile.username,
      businessName, gstNumber, sellerState, sellerAddress,
      sellerPhone, sellerEmail, bankName, bankAccount, bankIfsc, bankHolder, logo,
    });
    if (res.success) {
      onSave({ ...sellerProfile, businessName, gstNumber, sellerState, sellerAddress, sellerPhone, sellerEmail, bankName, bankAccount, bankIfsc, bankHolder, logo });
      alert("Profile saved!");
    } else {
      alert("Failed to save profile: " + res.message);
    }
    setLoading(false);
  };

  const loadInvoice = (item: SavedInvoice) => {
    setBusinessName(item.businessName); setGstNumber(item.gstNumber);
    setSellerState(item.sellerState); setCustomerName(item.customerName);
    setBuyerState(item.buyerState); setProducts(item.products);
    setInvoiceDate(item.invoiceDate); setInvoiceNo(item.invoiceNo);
  };

  const deleteInvoice = async (index: number) => {
    const res = await apiSeller({ action: "deleteInvoice", username: sellerProfile.username, index });
    if (res.success) {
      const updated = [...history]; updated.splice(index, 1); setHistory(updated);
    }
  };

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = invoiceRef.current;
    if (!element) return;
    html2pdf().set({
      margin: 6, filename: `${invoiceNo}.pdf`,
      image: { type: "jpeg" as const, quality: 1 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    }).from(element).save();
  };

  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #d1d5db", padding: "8px 10px",
    borderRadius: "6px", fontSize: "13px", color: "#111827",
    backgroundColor: "#fff", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { fontSize: "11px", fontWeight: 600, color: "#6b7280", marginBottom: "3px", display: "block" };
  const card: React.CSSProperties = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" };
  const btn = (bg: string): React.CSSProperties => ({
    width: "100%", backgroundColor: bg, color: "#fff", padding: "10px",
    borderRadius: "6px", fontWeight: 600, fontSize: "13px", border: "none",
    cursor: "pointer", marginTop: "6px", opacity: loading ? 0.7 : 1,
  });
  const iTh: React.CSSProperties = { border: "1px solid #000", padding: "5px 6px", backgroundColor: "#d1d5db", fontWeight: 700, fontSize: "11px", color: "#111", textAlign: "center" };
  const iTd: React.CSSProperties = { border: "1px solid #000", padding: "5px 6px", fontSize: "11px", color: "#111", verticalAlign: "top" };
  const sRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: "12px" };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#e5e7eb", fontFamily: "Arial, sans-serif" }}>
      {topBar}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 200px", gap: "14px", maxWidth: "1600px", margin: "0 auto", padding: "16px", alignItems: "start" }}>

        {/* LEFT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>🏢 Seller Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Upload Logo</label>
                <input type="file" accept="image/*" style={inp} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { const r = new FileReader(); r.onloadend = () => setLogo(r.result as string); r.readAsDataURL(file); }
                }} />
              </div>
              <div><label style={lbl}>Business Name</label><input style={inp} value={businessName} onChange={e => setBusinessName(e.target.value)} /></div>
              <div><label style={lbl}>Address</label><input style={inp} value={sellerAddress} onChange={e => setSellerAddress(e.target.value)} /></div>
              <div><label style={lbl}>Phone</label><input style={inp} value={sellerPhone} onChange={e => setSellerPhone(e.target.value)} /></div>
              <div><label style={lbl}>Email</label><input style={inp} value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} /></div>
              <div><label style={lbl}>GSTIN</label><input style={inp} value={gstNumber} onChange={e => setGstNumber(e.target.value)} /></div>
              <div><label style={lbl}>State</label><input style={inp} value={sellerState} onChange={e => setSellerState(e.target.value)} /></div>
              <button type="button" style={btn("#16a34a")} onClick={handleSaveProfile} disabled={loading}>💾 Save Profile</button>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>👤 Buyer Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Customer / Company Name</label><input style={inp} placeholder="e.g. Sunrise Electronics" value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
              <div><label style={lbl}>Address</label><input style={inp} placeholder="e.g. 45 Market Street" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} /></div>
              <div><label style={lbl}>Contact No.</label><input style={inp} placeholder="97XXXXXXXX" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} /></div>
              <div><label style={lbl}>GSTIN</label><input style={inp} placeholder="09BBBBB0000B1Z3" value={buyerGst} onChange={e => setBuyerGst(e.target.value)} /></div>
              <div><label style={lbl}>State</label><input style={inp} placeholder="09-Uttar Pradesh" value={buyerState} onChange={e => setBuyerState(e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>🧾 Invoice Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Invoice No.</label><input style={inp} value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} /></div>
              <div><label style={lbl}>Date</label><input style={inp} type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
              <div><label style={lbl}>Time</label><input style={inp} value={invoiceTime} onChange={e => setInvoiceTime(e.target.value)} /></div>
              <div><label style={lbl}>Due Date</label><input style={inp} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              <div><label style={lbl}>PO Date</label><input style={inp} type="date" value={poDate} onChange={e => setPoDate(e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>🚚 Transport</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Transport Name</label><input style={inp} value={transportName} onChange={e => setTransportName(e.target.value)} /></div>
              <div><label style={lbl}>Vehicle Number</label><input style={inp} value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>💰 Payment</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Payment Mode</label>
                <select style={inp} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                  <option>Credit</option><option>Cash</option><option>UPI</option><option>NEFT</option><option>Cheque</option>
                </select>
              </div>
              <div><label style={lbl}>Amount Received (₹)</label><input style={inp} type="number" value={received} onChange={e => setReceived(Number(e.target.value))} /></div>
              <div><label style={lbl}>Previous Balance (₹)</label><input style={inp} type="number" value={prevBalance} onChange={e => setPrevBalance(Number(e.target.value))} /></div>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>🏦 Bank Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <div><label style={lbl}>Bank Name</label><input style={inp} placeholder="e.g. HDFC Bank" value={bankName} onChange={e => setBankName(e.target.value)} /></div>
              <div><label style={lbl}>Account No.</label><input style={inp} value={bankAccount} onChange={e => setBankAccount(e.target.value)} /></div>
              <div><label style={lbl}>IFSC Code</label><input style={inp} value={bankIfsc} onChange={e => setBankIfsc(e.target.value)} /></div>
              <div><label style={lbl}>Account Holder Name</label><input style={inp} value={bankHolder} onChange={e => setBankHolder(e.target.value)} /></div>
              <div><label style={lbl}>Terms & Conditions</label>
                <textarea style={{ ...inp, height: "56px", resize: "vertical" }} value={termsText} onChange={e => setTermsText(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>📦 Products</p>
            {products.map((item, index) => (
              <div key={index} style={{ border: "1px solid #e5e7eb", padding: "10px", borderRadius: "8px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Product {index + 1}</span>
                  {products.length > 1 && (
                    <button type="button" onClick={() => removeProduct(index)}
                      style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "11px" }}>✕</button>
                  )}
                </div>
                <input style={inp} placeholder="Product Name" value={item.name} onChange={e => updateProduct(index, "name", e.target.value)} />
                <input style={inp} placeholder="Description / Brand / Specs" value={item.description || ""} onChange={e => updateProduct(index, "description", e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                  <div><label style={lbl}>HSN/SAC</label><input style={inp} value={item.hsn} onChange={e => updateProduct(index, "hsn", e.target.value)} /></div>
                  <div><label style={lbl}>Qty</label><input style={inp} type="number" value={item.qty} onChange={e => updateProduct(index, "qty", Number(e.target.value))} /></div>
                  <div><label style={lbl}>Price ₹</label><input style={inp} type="number" value={item.price} onChange={e => updateProduct(index, "price", Number(e.target.value))} /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  <div><label style={lbl}>GST %</label><input style={inp} type="number" value={item.gst} onChange={e => updateProduct(index, "gst", Number(e.target.value))} /></div>
                  <div><label style={lbl}>Serial No.</label><input style={inp} placeholder="optional" value={item.serialNo || ""} onChange={e => updateProduct(index, "serialNo", e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button type="button" style={btn("#2563eb")} onClick={addProduct}>+ Add Product</button>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: "13px", color: "#374151" }}>🖨 Invoice Format</p>
            <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #d1d5db", marginBottom: "8px" }}>
              {([1, 2] as const).map(f => (
                <button key={f} type="button" onClick={() => setInvoiceFormat(f)}
                  style={{ flex: 1, padding: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", background: invoiceFormat === f ? "#2563eb" : "#f9fafb", color: invoiceFormat === f ? "#fff" : "#6b7280" }}>
                  {f === 1 ? "Format 1" : "Format 2"}
                </button>
              ))}
            </div>
            <button type="button" style={btn("#16a34a")} onClick={handleSaveInvoice} disabled={loading}>💾 {loading ? "Saving..." : "Save Invoice"}</button>
            <button type="button" style={btn("#0891b2")} onClick={() => window.print()}>🖨 Print Invoice</button>
            <button type="button" style={btn("#7c3aed")} onClick={downloadPDF}>⬇ Download PDF</button>
            <button type="button" style={btn("#f59e0b")} onClick={handleClearInvoice}>🗑 Clear / New Invoice</button>
          </div>
        </div>

        {/* CENTER INVOICE */}
        <div ref={invoiceRef} style={{ background: "#fff", padding: "24px 28px", fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#111", width: "100%", boxSizing: "border-box" }}>
          {invoiceFormat === 1 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "17px", marginBottom: "3px" }}>{businessName || "Business Name"}</div>
                  {sellerAddress && <div style={{ fontSize: "11px" }}>{sellerAddress}</div>}
                  {sellerPhone && <div style={{ fontSize: "11px" }}>Phone no. : {sellerPhone}</div>}
                  {sellerEmail && <div style={{ fontSize: "11px" }}>Email : {sellerEmail}</div>}
                  <div style={{ fontSize: "11px" }}>GSTIN : {gstNumber || "—"}</div>
                  <div style={{ fontSize: "11px" }}>State: {sellerState || "—"}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <div style={{ fontStyle: "italic", fontSize: "10px", color: "#555" }}>ORIGINAL FOR RECIPIENT</div>
                  {logo && <Image src={logo} alt="Logo" width={60} height={60} style={{ objectFit: "contain", borderRadius: "50%", border: "2px solid #d1d5db" }} />}
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: "15px", fontWeight: 700, borderTop: "2px solid #111", borderBottom: "2px solid #111", padding: "5px 0", margin: "8px 0" }}>Tax Invoice</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "1px solid #000" }}>
                <div style={{ padding: "7px", borderRight: "1px solid #000", fontSize: "11px" }}>
                  <div style={{ fontWeight: 700, marginBottom: "3px" }}>Bill To</div>
                  <div style={{ fontWeight: 700 }}>{customerName || "Customer Name"}</div>
                  {buyerAddress && <div>{buyerAddress}</div>}
                  {buyerPhone && <div>Contact No. : {buyerPhone}</div>}
                  {buyerGst && <div>GSTIN : {buyerGst}</div>}
                  {buyerState && <div>State: {buyerState}</div>}
                </div>
                <div style={{ padding: "7px", borderRight: "1px solid #000", fontSize: "11px" }}>
                  <div style={{ fontWeight: 700, marginBottom: "3px" }}>Transportation Details</div>
                  <div>Transport Name: {transportName || "—"}</div>
                  <div>Vehicle Number: {vehicleNo || "—"}</div>
                </div>
                <div style={{ padding: "7px", fontSize: "11px" }}>
                  <div style={{ fontWeight: 700, marginBottom: "3px", textAlign: "right" }}>Invoice Details</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Invoice No. :</span><span style={{ fontWeight: 600 }}>{invoiceNo}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Date :</span><span>{invoiceDate}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Time :</span><span>{invoiceTime}</span></div>
                  {dueDate && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Due Date :</span><span>{dueDate}</span></div>}
                  {poDate && <div style={{ display: "flex", justifyContent: "space-between" }}><span>PO Date :</span><span>{poDate}</span></div>}
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...iTh, width: "24px" }}>#</th>
                    <th style={iTh}>Item Name</th>
                    <th style={{ ...iTh, width: "70px" }}>HSN/SAC</th>
                    <th style={{ ...iTh, width: "48px" }}>Qty</th>
                    <th style={{ ...iTh, width: "72px" }}>Price/Unit</th>
                    <th style={{ ...iTh, width: "80px" }}>Taxable Price/Unit</th>
                    <th style={{ ...iTh, width: "64px" }}>GST</th>
                    <th style={{ ...iTh, width: "72px" }}>Final Rate</th>
                    <th style={{ ...iTh, width: "72px" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    const taxable = item.qty * item.price;
                    const gstAmt = (taxable * item.gst) / 100;
                    const finalRate = item.price * (1 + item.gst / 100);
                    const amount = taxable + gstAmt;
                    return (
                      <tr key={index}>
                        <td style={{ ...iTd, textAlign: "center" }}>{index + 1}</td>
                        <td style={iTd}>
                          <div style={{ fontWeight: 700 }}>{item.name || "—"}</div>
                          {item.description && <div style={{ color: "#555", fontSize: "10px" }}>{item.description}</div>}
                          {item.serialNo && <div style={{ fontSize: "10px" }}>S/N: {item.serialNo}</div>}
                        </td>
                        <td style={{ ...iTd, textAlign: "center" }}>{item.hsn}</td>
                        <td style={{ ...iTd, textAlign: "center" }}>{item.qty}</td>
                        <td style={{ ...iTd, textAlign: "right" }}>₹ {item.price.toFixed(2)}</td>
                        <td style={{ ...iTd, textAlign: "right" }}>₹ {item.price.toFixed(2)}</td>
                        <td style={{ ...iTd, textAlign: "right" }}>₹ {gstAmt.toFixed(2)}<br /><span style={{ fontSize: "9px" }}>({item.gst}%)</span></td>
                        <td style={{ ...iTd, textAlign: "right" }}>₹ {finalRate.toFixed(2)}</td>
                        <td style={{ ...iTd, textAlign: "right" }}>₹ {amount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 700, background: "#f3f4f6" }}>
                    <td style={{ ...iTd, textAlign: "center" }} colSpan={3}>Total</td>
                    <td style={{ ...iTd, textAlign: "center" }}>{products.reduce((s, i) => s + i.qty, 0)}</td>
                    <td style={iTd} colSpan={2}></td>
                    <td style={{ ...iTd, textAlign: "right" }}>₹ {totalGstAmount.toFixed(2)}</td>
                    <td style={iTd}></td>
                    <td style={{ ...iTd, textAlign: "right" }}>₹ {grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", border: "1px solid #000", borderTop: "none" }}>
                <div style={{ padding: "8px", borderRight: "1px solid #000", fontSize: "11px" }}>
                  <div style={{ marginBottom: "6px" }}><div style={{ fontWeight: 700 }}>Invoice Amount In Words</div><div style={{ fontStyle: "italic" }}>{numberToWords(grandTotal)}</div></div>
                  <div><div style={{ fontWeight: 700 }}>Terms and Conditions</div><div style={{ fontStyle: "italic", fontSize: "10px" }}>{termsText}</div></div>
                  {(bankName || bankAccount) && <div style={{ marginTop: "6px" }}><div style={{ fontWeight: 700 }}>Pay To:</div>{bankName && <div>Bank: {bankName}</div>}{bankAccount && <div>A/C: {bankAccount}</div>}{bankIfsc && <div>IFSC: {bankIfsc}</div>}{bankHolder && <div>Holder: {bankHolder}</div>}</div>}
                </div>
                <div style={{ padding: "8px", fontSize: "12px" }}>
                  <div style={{ ...sRow, borderBottom: "1px solid #e5e7eb", paddingBottom: "3px" }}><span>Sub Total</span><span>₹ {subtotal.toFixed(2)}</span></div>
                  {sameState ? (<><div style={sRow}><span>SGST@{(products[0]?.gst ?? 0) / 2}%</span><span>₹ {sgst.toFixed(2)}</span></div><div style={sRow}><span>CGST@{(products[0]?.gst ?? 0) / 2}%</span><span>₹ {cgst.toFixed(2)}</span></div></>) : (<div style={sRow}><span>IGST@{products[0]?.gst ?? 0}%</span><span>₹ {igst.toFixed(2)}</span></div>)}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, background: "#374151", color: "#fff", padding: "3px 6px", margin: "4px 0" }}><span>Total</span><span>₹ {grandTotal.toFixed(2)}</span></div>
                  <div style={sRow}><span>Received</span><span>₹ {received.toFixed(2)}</span></div>
                  <div style={sRow}><span>Balance</span><span>₹ {(grandTotal - received).toFixed(2)}</span></div>
                  <div style={sRow}><span>Payment mode</span><span>{paymentMode}</span></div>
                  <div style={sRow}><span>Previous Balance</span><span>₹ {prevBalance.toFixed(2)}</span></div>
                  <div style={{ ...sRow, fontWeight: 700, borderTop: "1px solid #000", paddingTop: "3px", marginTop: "3px" }}><span>Current Balance</span><span>₹ {balance.toFixed(2)}</span></div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px", paddingBottom: "8px" }}>
                <div style={{ textAlign: "center", width: "160px" }}>
                  <div style={{ fontSize: "11px" }}>For : {businessName || "Business Name"}</div>
                  <div style={{ marginTop: "44px", borderTop: "1px solid #000", paddingTop: "4px", fontSize: "10px" }}>Authorized Signatory</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #2563eb", paddingBottom: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {logo && <Image src={logo} alt="Logo" width={56} height={56} style={{ objectFit: "contain", borderRadius: "8px" }} />}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "18px", color: "#1e3a5f" }}>{businessName || "Business Name"}</div>
                    {sellerAddress && <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{sellerAddress}</div>}
                    {sellerPhone && <div style={{ fontSize: "10px", color: "#555" }}>📞 {sellerPhone}</div>}
                    {sellerEmail && <div style={{ fontSize: "10px", color: "#555" }}>✉ {sellerEmail}</div>}
                    <div style={{ fontSize: "10px", color: "#555" }}>GSTIN: {gstNumber || "—"} | State: {sellerState || "—"}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#2563eb", letterSpacing: "2px" }}>TAX INVOICE</div>
                  <div style={{ fontSize: "11px", marginTop: "4px", color: "#374151" }}>Invoice No: <strong>{invoiceNo}</strong></div>
                  <div style={{ fontSize: "11px", color: "#374151" }}>Date: <strong>{invoiceDate}</strong></div>
                  {dueDate && <div style={{ fontSize: "11px", color: "#374151" }}>Due: <strong>{dueDate}</strong></div>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div style={{ background: "#f8faff", borderRadius: "8px", padding: "10px", border: "1px solid #dbeafe" }}>
                  <div style={{ fontWeight: 700, color: "#2563eb", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase" }}>Bill To</div>
                  <div style={{ fontWeight: 700, fontSize: "13px" }}>{customerName || "Customer Name"}</div>
                  {buyerAddress && <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{buyerAddress}</div>}
                  {buyerPhone && <div style={{ fontSize: "11px", color: "#555" }}>📞 {buyerPhone}</div>}
                  {buyerGst && <div style={{ fontSize: "11px", color: "#555" }}>GSTIN: {buyerGst}</div>}
                  {buyerState && <div style={{ fontSize: "11px", color: "#555" }}>State: {buyerState}</div>}
                </div>
                <div style={{ background: "#f8faff", borderRadius: "8px", padding: "10px", border: "1px solid #dbeafe" }}>
                  <div style={{ fontWeight: 700, color: "#2563eb", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase" }}>Shipment Info</div>
                  {transportName && <div style={{ fontSize: "11px" }}>🚚 Transport: {transportName}</div>}
                  {vehicleNo && <div style={{ fontSize: "11px" }}>🔢 Vehicle: {vehicleNo}</div>}
                  {poDate && <div style={{ fontSize: "11px" }}>PO Date: {poDate}</div>}
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>Payment: <strong>{paymentMode}</strong></div>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px" }}>
                <thead>
                  <tr style={{ background: "#2563eb", color: "#fff" }}>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "left", width: "24px" }}>#</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "left" }}>Item Description</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "center", width: "60px" }}>HSN</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "center", width: "40px" }}>Qty</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "right", width: "70px" }}>Rate</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "right", width: "70px" }}>Taxable</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "right", width: "70px" }}>GST</th>
                    <th style={{ padding: "8px 10px", fontSize: "11px", fontWeight: 700, textAlign: "right", width: "80px" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    const taxable = item.qty * item.price;
                    const gstAmt = (taxable * item.gst) / 100;
                    const amount = taxable + gstAmt;
                    return (
                      <tr key={index} style={{ background: index % 2 === 0 ? "#fff" : "#f8faff", borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "center", color: "#6b7280" }}>{index + 1}</td>
                        <td style={{ padding: "7px 10px", fontSize: "11px" }}>
                          <div style={{ fontWeight: 600 }}>{item.name || "—"}</div>
                          {item.description && <div style={{ color: "#888", fontSize: "10px" }}>{item.description}</div>}
                          {item.serialNo && <div style={{ color: "#888", fontSize: "10px" }}>S/N: {item.serialNo}</div>}
                        </td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "center" }}>{item.hsn}</td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "center" }}>{item.qty}</td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "right" }}>₹{item.price.toFixed(2)}</td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "right" }}>₹{taxable.toFixed(2)}</td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "right" }}>₹{gstAmt.toFixed(2)}<br /><span style={{ fontSize: "9px", color: "#888" }}>{item.gst}%</span></td>
                        <td style={{ padding: "7px 10px", fontSize: "11px", textAlign: "right", fontWeight: 600 }}>₹{amount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "12px", marginBottom: "14px" }}>
                <div style={{ fontSize: "11px" }}>
                  <div style={{ background: "#f8faff", borderRadius: "8px", padding: "10px", border: "1px solid #dbeafe", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: "3px" }}>Amount in Words</div>
                    <div style={{ fontStyle: "italic" }}>{numberToWords(grandTotal)}</div>
                  </div>
                  {(bankName || bankAccount) && (
                    <div style={{ background: "#f8faff", borderRadius: "8px", padding: "10px", border: "1px solid #dbeafe", marginBottom: "8px" }}>
                      <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: "3px" }}>Bank Details</div>
                      {bankName && <div>Bank: {bankName}</div>}
                      {bankAccount && <div>A/C No: {bankAccount}</div>}
                      {bankIfsc && <div>IFSC: {bankIfsc}</div>}
                      {bankHolder && <div>Holder: {bankHolder}</div>}
                    </div>
                  )}
                  <div style={{ background: "#f8faff", borderRadius: "8px", padding: "10px", border: "1px solid #dbeafe" }}>
                    <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: "3px" }}>Terms & Conditions</div>
                    <div style={{ color: "#555" }}>{termsText}</div>
                  </div>
                </div>
                <div style={{ background: "#f8faff", borderRadius: "8px", padding: "12px", border: "1px solid #dbeafe", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "6px", borderBottom: "1px solid #dbeafe", marginBottom: "6px" }}>
                    <span style={{ color: "#555" }}>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  {sameState ? (
                    <><div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}><span style={{ color: "#555" }}>SGST @ {(products[0]?.gst ?? 0) / 2}%</span><span>₹ {sgst.toFixed(2)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}><span style={{ color: "#555" }}>CGST @ {(products[0]?.gst ?? 0) / 2}%</span><span>₹ {cgst.toFixed(2)}</span></div></>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}><span style={{ color: "#555" }}>IGST @ {products[0]?.gst ?? 0}%</span><span>₹ {igst.toFixed(2)}</span></div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "14px", background: "#2563eb", color: "#fff", padding: "6px 8px", borderRadius: "6px", margin: "8px 0" }}>
                    <span>Grand Total</span><span>₹ {grandTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", color: "#555" }}><span>Received</span><span>₹ {received.toFixed(2)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", color: "#555" }}><span>Balance</span><span>₹ {(grandTotal - received).toFixed(2)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", color: "#555" }}><span>Prev. Balance</span><span>₹ {prevBalance.toFixed(2)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #dbeafe", paddingTop: "6px", marginTop: "4px", color: "#dc2626" }}>
                    <span>Current Balance</span><span>₹ {balance.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
                <div style={{ textAlign: "center", width: "160px" }}>
                  <div style={{ fontSize: "11px", color: "#374151" }}>For : <strong>{businessName || "Business Name"}</strong></div>
                  <div style={{ marginTop: "40px", borderTop: "2px solid #2563eb", paddingTop: "4px", fontSize: "10px", color: "#2563eb", fontWeight: 600 }}>Authorized Signatory</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT HISTORY */}
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h3 style={{ margin: "0 0 6px", color: "#111827", fontSize: "13px" }}>📋 Invoice History</h3>
          {history.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "12px" }}>No invoices yet.</p>
          ) : (
            history.map((item, index) => (
              <div key={index} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px", cursor: "pointer" }} onClick={() => loadInvoice(item)}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "11px" }}>{item.invoiceNo}</p>
                <p style={{ margin: "2px 0", fontSize: "10px", color: "#374151" }}>{item.customerName}</p>
                <p style={{ margin: 0, color: "#2563eb", fontWeight: 600, fontSize: "11px" }}>₹{item.grandTotal.toFixed(2)}</p>
                <button type="button"
                  style={{ marginTop: "4px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); deleteInvoice(index); }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin, onAdmin }: { onLogin: (seller: SellerProfile) => void; onAdmin: () => void; }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regBusiness, setRegBusiness] = useState("");
  const [regGst, setRegGst] = useState("");
  const [regState, setRegState] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const res = await apiAuth({ action: "login", username, password });
    setLoading(false);
    if (res.success && res.role === "admin") { onAdmin(); return; }
    if (res.success && res.role === "seller") { onLogin(res.seller); return; }
    setError(res.message || "Invalid username or password.");
  };

  const handleRegister = async () => {
    setError(""); setLoading(true);
    const res = await apiAuth({ action: "register", username: regUser, password: regPass, businessName: regBusiness, gstNumber: regGst, sellerState: regState, sellerAddress: regAddress, sellerPhone: regPhone, sellerEmail: regEmail });
    setLoading(false);
    if (res.success) { onLogin(res.seller); return; }
    setError(res.message || "Registration failed.");
  };

  const inp: React.CSSProperties = { width: "100%", border: "1px solid #d1d5db", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", color: "#111827", backgroundColor: "#fff", boxSizing: "border-box", marginTop: "4px" };
  const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🧾</div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#111827" }}>GST Invoice Generator</h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>Professional Invoice Management</p>
        </div>
        <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
          {(["login", "register"] as const).map(tab => (
            <button key={tab} type="button" onClick={() => { setMode(tab); setError(""); }}
              style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", background: mode === tab ? "#2563eb" : "#f9fafb", color: mode === tab ? "#fff" : "#6b7280" }}>
              {tab === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "13px" }}>⚠️ {error}</div>}
        {mode === "login" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={lbl}>Username</label><input style={inp} placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
            <div><label style={lbl}>Password</label><input style={inp} type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
            <button type="button" onClick={handleLogin} disabled={loading} style={{ width: "100%", background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Logging in..." : "Login →"}</button>
            <button type="button" onClick={onAdmin} style={{ width: "100%", background: "#f3f4f6", color: "#374151", padding: "10px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>🔐 Admin Login</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={lbl}>Username *</label><input style={inp} placeholder="e.g. seller1" value={regUser} onChange={e => setRegUser(e.target.value)} /></div>
              <div><label style={lbl}>Password *</label><input style={inp} type="password" placeholder="••••••" value={regPass} onChange={e => setRegPass(e.target.value)} /></div>
            </div>
            <div><label style={lbl}>Business Name *</label><input style={inp} placeholder="e.g. Apex Traders" value={regBusiness} onChange={e => setRegBusiness(e.target.value)} /></div>
            <div><label style={lbl}>GSTIN</label><input style={inp} placeholder="e.g. 07AAAAA0000A1Z5" value={regGst} onChange={e => setRegGst(e.target.value)} /></div>
            <div><label style={lbl}>State</label><input style={inp} placeholder="e.g. 07-Delhi" value={regState} onChange={e => setRegState(e.target.value)} /></div>
            <div><label style={lbl}>Address</label><input style={inp} placeholder="Shop / Office Address" value={regAddress} onChange={e => setRegAddress(e.target.value)} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={lbl}>Phone</label><input style={inp} placeholder="98XXXXXXXX" value={regPhone} onChange={e => setRegPhone(e.target.value)} /></div>
              <div><label style={lbl}>Email</label><input style={inp} placeholder="email@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} /></div>
            </div>
            <button type="button" onClick={handleRegister} disabled={loading} style={{ width: "100%", background: "#16a34a", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Registering..." : "Register & Login →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);
  const [newAdminPass, setNewAdminPass] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "invoice">("dashboard");
  const [invoiceSeller, setInvoiceSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    setLoading(true);
    const res = await apiAdmin({ action: "verifyAdmin", password });
    setLoading(false);
    if (res.success) {
      setAuthenticated(true);
      const data = await apiAdminGet();
      if (data.success) setSellers(data.sellers);
    } else {
      setError("Wrong admin password.");
    }
  };

  const deleteSeller = async (username: string) => {
    if (!confirm(`Delete seller "${username}"?`)) return;
    const res = await apiAdmin({ action: "deleteSeller", username });
    if (res.success) setSellers(sellers.filter(s => s.username !== username));
  };

  const changeAdminPassword = async () => {
    if (!newAdminPass) return;
    const res = await apiAdmin({ action: "changePassword", newPassword: newAdminPass });
    if (res.success) { alert("Admin password updated!"); setNewAdminPass(""); }
  };

  const inp: React.CSSProperties = { width: "100%", border: "1px solid #d1d5db", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", color: "#111827", backgroundColor: "#fff", boxSizing: "border-box", marginTop: "4px" };

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3a5f 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "32px" }}>🔐</div>
            <h2 style={{ margin: "8px 0 0", fontSize: "20px", fontWeight: 800 }}>Admin Panel</h2>
          </div>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px", marginBottom: "16px", color: "#dc2626", fontSize: "13px" }}>⚠️ {error}</div>}
          <input style={inp} type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} />
          <button type="button" onClick={handleAdminLogin} disabled={loading} style={{ width: "100%", background: "#7c3aed", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "12px", opacity: loading ? 0.7 : 1 }}>{loading ? "Verifying..." : "Enter Admin Panel"}</button>
          <button type="button" onClick={onLogout} style={{ width: "100%", background: "#f3f4f6", color: "#374151", padding: "10px", borderRadius: "8px", border: "none", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginTop: "8px" }}>← Back to Login</button>
        </div>
      </div>
    );
  }

  if (activeTab === "invoice" && invoiceSeller) {
    return (
      <InvoiceForm
        sellerProfile={invoiceSeller}
        onSave={() => {}}
        topBar={
          <div style={{ background: "#7c3aed", color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🧾</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>Creating Invoice — {invoiceSeller.businessName}</div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Admin Mode</div>
              </div>
            </div>
            <button type="button" onClick={() => setActiveTab("dashboard")} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>← Back to Admin</button>
          </div>
        }
      />
    );
  }

  const totalInvoices = sellers.reduce((s, sel) => s + (sel.invoices?.length || 0), 0);
  const totalRevenue = sellers.reduce((s, sel) => s + (sel.invoices || []).reduce((a, inv) => a + inv.grandTotal, 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#7c3aed", color: "#fff", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>🔐 Admin Panel</h1>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>Manage sellers, accounts and invoices</p>
        </div>
        <button type="button" onClick={onLogout} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Logout</button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "24px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "Total Sellers", value: sellers.length, color: "#2563eb" },
            { label: "Total Invoices", value: totalInvoices, color: "#16a34a" },
            { label: "Total Revenue", value: "₹" + totalRevenue.toFixed(0), color: "#7c3aed" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>All Sellers</h2>
          {sellers.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No sellers registered yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Username", "Business Name", "GSTIN", "State", "Invoices", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellers.map(seller => (
                  <tr key={seller.username} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>{seller.username}</td>
                    <td style={{ padding: "10px 12px", fontSize: "13px" }}>{seller.businessName}</td>
                    <td style={{ padding: "10px 12px", fontSize: "13px" }}>{seller.gstNumber || "—"}</td>
                    <td style={{ padding: "10px 12px", fontSize: "13px" }}>{seller.sellerState || "—"}</td>
                    <td style={{ padding: "10px 12px", fontSize: "13px" }}>{seller.invoices?.length || 0}</td>
                    <td style={{ padding: "10px 12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button type="button" onClick={() => setSelectedSeller(seller)} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>View</button>
                      <button type="button" onClick={() => { setInvoiceSeller(seller); setActiveTab("invoice"); }} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>🧾 Make Bill</button>
                      <button type="button" onClick={() => deleteSeller(seller.username)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedSeller && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>📋 {selectedSeller.businessName} — Invoice History</h2>
              <button type="button" onClick={() => setSelectedSeller(null)} style={{ background: "#f3f4f6", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
            </div>
            {(selectedSeller.invoices?.length || 0) === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No invoices yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Invoice No.", "Customer", "Date", "Amount"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedSeller.invoices.map((inv, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>{inv.invoiceNo}</td>
                      <td style={{ padding: "10px 12px", fontSize: "13px" }}>{inv.customerName}</td>
                      <td style={{ padding: "10px 12px", fontSize: "13px" }}>{inv.invoiceDate}</td>
                      <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: 600, color: "#16a34a" }}>₹{inv.grandTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>🔑 Change Admin Password</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <input style={{ ...inp, marginTop: 0 }} type="password" placeholder="New admin password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} />
            <button type="button" onClick={changeAdminPassword} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SELLER APP
// ══════════════════════════════════════════════════════════════════════════════
function SellerApp({ seller, onLogout }: { seller: SellerProfile; onLogout: () => void }) {
  const [currentSeller, setCurrentSeller] = useState(seller);

  return (
    <InvoiceForm
      sellerProfile={currentSeller}
      onSave={(updated) => setCurrentSeller(updated)}
      topBar={
        <div style={{ background: "#1e3a5f", color: "#fff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>🧾</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>GST Invoice Generator</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>Logged in as: {seller.username}</div>
            </div>
          </div>
          <button type="button" onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>Logout</button>
        </div>
      }
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [screen, setScreen] = useState<"login" | "admin" | "app">("login");
  const [currentSeller, setCurrentSeller] = useState<SellerProfile | null>(null);

  const handleLogin = (seller: SellerProfile) => { setCurrentSeller(seller); setScreen("app"); };
  const handleLogout = () => { setCurrentSeller(null); setScreen("login"); };

  if (screen === "login") return <LoginScreen onLogin={handleLogin} onAdmin={() => setScreen("admin")} />;
  if (screen === "admin") return <AdminPanel onLogout={handleLogout} />;
  if (screen === "app" && currentSeller) return <SellerApp seller={currentSeller} onLogout={handleLogout} />;
  return null;
}