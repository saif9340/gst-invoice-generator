"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

type Product = {
  name: string;
  hsn: string;
  qty: number;
  price: number;
  gst: number;
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
};

export default function Home() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [sellerState, setSellerState] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [buyerState, setBuyerState] = useState("");
  const [logo, setLogo] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { name: "", hsn: "", qty: 1, price: 0, gst: 18 },
  ]);

  const [history, setHistory] = useState<SavedInvoice[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("invoiceHistory");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const invoiceDate = new Date().toLocaleDateString();

  useEffect(() => {
    const lastNumber = localStorage.getItem("invoiceCounter") || "0";
    const nextNumber = Number(lastNumber) + 1;
    localStorage.setItem("invoiceCounter", String(nextNumber));
  }, []);

  const invoiceNo = useMemo(() => {
    if (typeof window === "undefined") return "";
    const lastNumber = localStorage.getItem("invoiceCounter") || "1";
    const year = new Date().getFullYear();
    return "INV-" + year + "-" + String(lastNumber).padStart(4, "0");
  }, []);

  const addProduct = () =>
    setProducts([...products, { name: "", hsn: "", qty: 1, price: 0, gst: 18 }]);

  const removeProduct = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const subtotal = products.reduce((sum, item) => sum + item.qty * item.price, 0);
  const gstRate = products[0]?.gst || 18;
  const sameState = sellerState.trim().toLowerCase() === buyerState.trim().toLowerCase();

  let cgst = 0, sgst = 0, igst = 0;
  if (sameState) {
    cgst = (subtotal * gstRate) / 200;
    sgst = (subtotal * gstRate) / 200;
  } else {
    igst = (subtotal * gstRate) / 100;
  }
  const grandTotal = subtotal + cgst + sgst + igst;

  const numberToWords = (num: number) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
      "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
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

  const saveInvoice = () => {
    const newInvoice: SavedInvoice = { invoiceNo, customerName, grandTotal, businessName, gstNumber, sellerState, buyerState, products };
    const updatedHistory = [newInvoice, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("invoiceHistory", JSON.stringify(updatedHistory));
    alert("Invoice saved!");
  };

  const deleteInvoice = (index: number) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem("invoiceHistory", JSON.stringify(updated));
  };
 const statCard = {
  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontWeight: 700,
  fontSize: "14px",
  color: "#111827",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};
const filteredHistory = history.filter((item) =>
  item.customerName
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  item.invoiceNo
    .toLowerCase()
    .includes(search.toLowerCase())
);
const totalInvoices = history.length;

const totalRevenue = history.reduce(
  (sum, item) => sum + item.grandTotal,
  0
);

const highestInvoice =
  history.length > 0
    ? Math.max(...history.map((item) => item.grandTotal))
    : 0;
  const loadInvoice = (item: SavedInvoice) => {
    setBusinessName(item.businessName);
    setGstNumber(item.gstNumber);
    setSellerState(item.sellerState);
    setCustomerName(item.customerName);
    setBuyerState(item.buyerState);
    setProducts(item.products);
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("invoice.pdf");
  };

  const inp: React.CSSProperties = {
    width: "100%", border: "1px solid #d1d5db", padding: "10px 12px",
    borderRadius: "6px", fontSize: "14px", color: "#111827",
    backgroundColor: "#fff", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px", display: "block" };
  const card: React.CSSProperties = {
    backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex",
    flexDirection: "column", gap: "12px",
  };
  const btn = (bg: string): React.CSSProperties => ({
    width: "100%", backgroundColor: bg, color: "#fff", padding: "12px",
    borderRadius: "6px", fontWeight: 600, fontSize: "14px", border: "none",
    cursor: "pointer", marginTop: "4px",
  });
  const sBtn = (bg: string): React.CSSProperties => ({
    backgroundColor: bg, color: "#fff", padding: "5px 10px",
    borderRadius: "4px", fontSize: "12px", border: "none", cursor: "pointer",
  });
  const th: React.CSSProperties = {
    border: "1px solid #d1d5db", padding: "8px", backgroundColor: "#f3f4f6",
    fontWeight: 700, color: "#374151", textAlign: "left",
  };
  const td: React.CSSProperties = { border: "1px solid #d1d5db", padding: "8px", color: "#111827", fontSize: "13px" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px", fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "32px", color: "#111827" }}>
        🇮🇳 GST Invoice Generator
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>

        {/* ── LEFT: FORM ── */}
        <div style={card}>
          <div>
            <label style={lbl}>Upload Logo</label>
            <input type="file" accept="image/*" style={inp}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setLogo(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div>
            <label style={lbl}>Business Name</label>
            <input style={inp} type="text" placeholder="e.g. Sharma Traders" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>GST Number</label>
            <input style={inp} type="text" placeholder="e.g. 23ABCDE1234F1Z5" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Seller State</label>
            <input style={inp} type="text" placeholder="e.g. Madhya Pradesh" value={sellerState} onChange={(e) => setSellerState(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Customer Name</label>
            <input style={inp} type="text" placeholder="e.g. Rahul Gupta" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Buyer State</label>
            <input style={inp} type="text" placeholder="e.g. Maharashtra" value={buyerState} onChange={(e) => setBuyerState(e.target.value)} />
          </div>

          <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: "12px", margin: 0 }}>Products</p>

          {products.map((item, index) => (
            <div key={index} style={{ border: "1px solid #e5e7eb", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <input style={inp} type="text" placeholder="Product Name" value={item.name} onChange={(e) => updateProduct(index, "name", e.target.value)} />
              <input style={inp} type="text" placeholder="HSN Code" value={item.hsn} onChange={(e) => updateProduct(index, "hsn", e.target.value)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={lbl}>Qty</label>
                  <input style={inp} type="number" value={item.qty} onChange={(e) => updateProduct(index, "qty", Number(e.target.value))} />
                </div>
                <div>
                  <label style={lbl}>Price ₹</label>
                  <input style={inp} type="number" value={item.price} onChange={(e) => updateProduct(index, "price", Number(e.target.value))} />
                </div>
                <div>
                  <label style={lbl}>GST %</label>
                  <input style={inp} type="number" value={item.gst} onChange={(e) => updateProduct(index, "gst", Number(e.target.value))} />
                </div>
              </div>
              <button style={sBtn("#ef4444")} onClick={() => removeProduct(index)}>🗑 Remove</button>
            </div>
          ))}

          <button style={btn("#1d4ed8")} onClick={addProduct}>+ Add Product</button>
          <button style={btn("#ea580c")} onClick={saveInvoice}>💾 Save Invoice</button>
          <button style={btn("#16a34a")} onClick={() => window.print()}>🖨 Print</button>
          <button style={btn("#7c3aed")} onClick={downloadPDF}>⬇ Download PDF</button>
        </div>

        {/* ── CENTER: INVOICE PREVIEW ── */}
        <div ref={invoiceRef} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {logo && <Image src={logo} alt="Logo" width={56} height={56} style={{ objectFit: "contain", borderRadius: "6px" }} />}
              <div>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>{businessName || "Your Business"}</p>
                {gstNumber && <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>GSTIN: {gstNumber}</p>}
                {sellerState && <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>State: {sellerState}</p>}
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "13px", color: "#374151" }}>
              <p style={{ margin: 0 }}><strong>Invoice:</strong> {invoiceNo}</p>
              <p style={{ margin: 0 }}><strong>Date:</strong> {invoiceDate}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginBottom: "8px" }}>
            <p style={{ fontWeight: 700, color: "#374151", margin: "0 0 4px 0" }}>Bill To:</p>
            <p style={{ color: "#111827", margin: 0 }}>{customerName || "Customer Name"}</p>
            <p style={{ color: "#6b7280", margin: 0 }}>{buyerState || "—"}</p>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "16px" }}>
            <thead>
              <tr>
                <th style={th}>Item</th>
                <th style={{ ...th, textAlign: "center" }}>HSN</th>
                <th style={{ ...th, textAlign: "center" }}>Qty</th>
                <th style={{ ...th, textAlign: "right" }}>Rate</th>
                <th style={{ ...th, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index}>
                  <td style={td}>{item.name || "—"}</td>
                  <td style={{ ...td, textAlign: "center" }}>{item.hsn || "—"}</td>
                  <td style={{ ...td, textAlign: "center" }}>{item.qty}</td>
                  <td style={{ ...td, textAlign: "right" }}>₹{item.price.toFixed(2)}</td>
                  <td style={{ ...td, textAlign: "right" }}>₹{(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px", fontSize: "14px", color: "#374151" }}>
            <p style={{ margin: 0 }}>Subtotal: ₹{subtotal.toFixed(2)}</p>
            {sameState ? (
              <>
                <p style={{ margin: 0 }}>CGST ({gstRate / 2}%): ₹{cgst.toFixed(2)}</p>
                <p style={{ margin: 0 }}>SGST ({gstRate / 2}%): ₹{sgst.toFixed(2)}</p>
              </>
            ) : (
              <p style={{ margin: 0 }}>IGST ({gstRate}%): ₹{igst.toFixed(2)}</p>
            )}
            <p style={{ fontSize: "20px", fontWeight: 800, color: "#111827", borderTop: "2px solid #111827", paddingTop: "8px", margin: "4px 0 0 0" }}>
              Grand Total: ₹{grandTotal.toFixed(2)}
            </p>
            <p style={{
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: 700,
  margin: "4px 0"
}}>
              {numberToWords(grandTotal)}
            </p>
          </div>
        </div>

        {/* ── RIGHT: HISTORY ── */}
        <div style={card}>
          <div
  style={{
    display: "grid",
    gap: "10px",
    marginBottom: "14px"
  }}
>
  <div style={statCard}>Total Invoices: {totalInvoices}</div>
  <div style={statCard}>Revenue: ₹{totalRevenue.toFixed(2)}</div>
  <div style={statCard}>Highest Invoice: ₹{highestInvoice.toFixed(2)}</div>
</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 8px 0" }}>Invoice History</h2>
<input
  type="text"
  placeholder="Search invoices..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "14px",
  }}
/>

          {filteredHistory.length === 0 ? (
  <p style={{ color: "#9ca3af", fontSize: "14px" }}>
    {search
      ? `No invoices found for "${search}"`
      : "No invoices saved yet."}
  </p>
) : (
            filteredHistory.map((item, index) => (
              <div key={index}
                style={{
  border: "1px solid #e5e7eb",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  marginBottom: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  transition: "all 0.2s ease"
}}
                onClick={() => loadInvoice(item)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <p style={{ fontWeight: 700, color: "#111827", fontSize: "14px", margin: "0 0 2px 0" }}>{item.invoiceNo}</p>
                <p style={{ color: "#374151", fontSize: "13px", margin: "0 0 2px 0" }}>{item.customerName}</p>
                <p style={{
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: 700,
  margin: "4px 0"
}}>₹{item.grandTotal.toFixed(2)}</p>
                <button style={sBtn("#ef4444")} onClick={(e) => { e.stopPropagation(); deleteInvoice(index); }}>
                  🗑 Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}