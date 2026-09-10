"use client";

import React from "react";
import { Printer, ArrowLeft, CheckCircle2, Phone, Mail, Globe, MapPin, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface InvoiceTemplateProps {
  order: any;
  onBack?: () => void;
  backHref?: string;
  showActions?: boolean;
}

export function InvoiceTemplate({
  order,
  onBack,
  backHref = `/orders/${order?.id}`,
  showActions = true,
}: InvoiceTemplateProps) {
  if (!order) return null;

  const invoiceNumber = `INV-${order.id?.slice(0, 8).toUpperCase()}`;
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const formattedTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const customerName = order.user?.firstName
    ? `${order.user.firstName} ${order.user.lastName || ""}`.trim()
    : "Valued Customer";

  const subtotal =
    order.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ) || 0;

  const shipping = Math.max(0, order.total - subtotal);
  const isPaid =
    order.status === "DELIVERED" ||
    order.paymentMethod?.toLowerCase().includes("bkash") ||
    order.paymentMethod?.toLowerCase().includes("paid") ||
    order.paymentMethod?.toLowerCase().includes("online");

  const handlePrint = () => {
    window.print();
  };

  // Keyboard shortcut listener for Ctrl+P / Cmd+P
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-200/70 dark:bg-neutral-950 py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center print:bg-white print:p-0 print:m-0 print:min-h-0">
      {/* Explicit Print & Standard A4 Page Sizing (210mm x 297mm) */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        @media print {
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          html, body {
            width: 210mm !important;
            height: auto !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-page-container {
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden on Print) */}
      {showActions && (
        <div className="w-full max-w-[210mm] mb-6 flex flex-wrap items-center justify-between gap-3 no-print px-2">
          {onBack ? (
            <Button variant="outline" size="sm" onClick={onBack} className="bg-background shadow-xs hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Order
            </Button>
          ) : (
            <Link href={backHref}>
              <Button variant="outline" size="sm" className="bg-background shadow-xs hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Order
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-background px-3 py-1.5 rounded-lg border border-border shadow-xs">
              <FileCheck className="w-3.5 h-3.5 text-primary" /> Standard A4 (210 × 297 mm)
            </span>
            <Button onClick={handlePrint} className="gap-2 shadow-sm font-medium">
              <Printer className="w-4 h-4" /> Print / Save PDF (A4)
            </Button>
          </div>
        </div>
      )}

      {/* A4 Printable Sheet (210mm x 297mm standard dimensions) */}
      <div className="a4-page-container w-full md:w-[210mm] max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg border border-slate-300/80 flex flex-col justify-between p-4 sm:p-8 md:p-12 print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0 print:w-full">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-200 pb-6 page-break-avoid">
            <div>
              {/* Brand Logo & Tagline */}
              <div className="flex items-center gap-2 mb-1.5">
                <svg
                  width="135"
                  height="36"
                  viewBox="0 0 140 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-slate-950"
                >
                  <rect x="1.5" y="1.5" width="132" height="33" stroke="currentColor" strokeWidth="2.5" />
                  <text
                    x="50%"
                    y="54%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="currentColor"
                    fontFamily="sans-serif"
                    fontWeight="700"
                    style={{ letterSpacing: "0.25em", fontSize: "18px" }}
                  >
                    NIVORΛ
                  </text>
                </svg>
              </div>
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Better Things, Better Everyday.
              </p>
              <div className="mt-2.5 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Dhaka, Bangladesh
                </p>
                <p className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" /> www.nivora.com
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> support@nivora.com
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                INVOICE
              </h1>
              <div className="mt-2 space-y-0.5 text-xs sm:text-sm text-slate-700">
                <p>
                  <span className="text-slate-500 font-medium">Invoice No:</span>{" "}
                  <span className="font-bold text-slate-950 font-mono text-sm">{invoiceNumber}</span>
                </p>
                <p>
                  <span className="text-slate-500 font-medium">Order ID:</span>{" "}
                  <span className="font-mono text-xs">{order.id}</span>
                </p>
                <p>
                  <span className="text-slate-500 font-medium">Date:</span>{" "}
                  <span className="font-medium text-slate-900">{formattedDate} {formattedTime}</span>
                </p>
              </div>

              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border">
                {isPaid ? (
                  <span className="text-emerald-700 bg-emerald-50 border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-50 border-amber-300 px-3 py-0.5 rounded-full">
                    Cash on Delivery
                  </span>
                )}
              </div>

              {/* Barcode representation */}
              <div className="mt-3 flex flex-col sm:items-end">
                <svg className="w-32 h-6 text-slate-800" viewBox="0 0 144 28" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="0" width="2" height="28" />
                  <rect x="4" y="0" width="1" height="28" />
                  <rect x="7" y="0" width="3" height="28" />
                  <rect x="12" y="0" width="2" height="28" />
                  <rect x="16" y="0" width="1" height="28" />
                  <rect x="19" y="0" width="4" height="28" />
                  <rect x="25" y="0" width="2" height="28" />
                  <rect x="29" y="0" width="1" height="28" />
                  <rect x="32" y="0" width="3" height="28" />
                  <rect x="37" y="0" width="2" height="28" />
                  <rect x="41" y="0" width="2" height="28" />
                  <rect x="45" y="0" width="4" height="28" />
                  <rect x="51" y="0" width="1" height="28" />
                  <rect x="54" y="0" width="3" height="28" />
                  <rect x="59" y="0" width="2" height="28" />
                  <rect x="63" y="0" width="1" height="28" />
                  <rect x="66" y="0" width="3" height="28" />
                  <rect x="71" y="0" width="4" height="28" />
                  <rect x="77" y="0" width="2" height="28" />
                  <rect x="81" y="0" width="1" height="28" />
                  <rect x="84" y="0" width="3" height="28" />
                  <rect x="89" y="0" width="2" height="28" />
                  <rect x="93" y="0" width="1" height="28" />
                  <rect x="96" y="0" width="4" height="28" />
                  <rect x="102" y="0" width="2" height="28" />
                  <rect x="106" y="0" width="3" height="28" />
                  <rect x="111" y="0" width="1" height="28" />
                  <rect x="114" y="0" width="4" height="28" />
                  <rect x="120" y="0" width="2" height="28" />
                  <rect x="124" y="0" width="1" height="28" />
                  <rect x="127" y="0" width="3" height="28" />
                  <rect x="132" y="0" width="2" height="28" />
                  <rect x="136" y="0" width="3" height="28" />
                  <rect x="141" y="0" width="2" height="28" />
                </svg>
                <span className="text-[9px] font-mono tracking-widest text-slate-500 mt-0.5">{invoiceNumber}</span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs sm:text-sm page-break-avoid">
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Billed / Shipped To:
              </h2>
              <p className="font-bold text-base text-slate-950">{customerName}</p>
              <div className="mt-1 text-slate-600 leading-relaxed space-y-0.5">
                <p>{order.address}</p>
                <p>{order.city}{order.zip ? `, ${order.zip}` : ""}</p>
                {order.landmark && <p className="text-slate-500">Landmark: {order.landmark}</p>}
                <p className="pt-1 font-medium text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {order.phoneNumber}
                </p>
                {order.user?.email && (
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {order.user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:text-right">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Order & Payment Info:
              </h2>
              <div className="text-slate-700 space-y-1">
                <p>
                  <span className="text-slate-500 font-medium">Payment Method:</span>{" "}
                  <span className="font-semibold text-slate-900">{order.paymentMethod || "Cash on Delivery"}</span>
                </p>
                {order.bkashNumber && (
                  <p>
                    <span className="text-slate-500 font-medium">bKash Account:</span>{" "}
                    <span className="font-mono">{order.bkashNumber}</span>
                  </p>
                )}
                {order.trxId && (
                  <p>
                    <span className="text-slate-500 font-medium">TrxID:</span>{" "}
                    <span className="font-mono text-xs font-bold text-slate-900">{order.trxId}</span>
                  </p>
                )}
                
                <p>
                  <span className="text-slate-500 font-medium">Current Status:</span>{" "}
                  <span className="font-bold text-slate-900">{order.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-5 page-break-avoid">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Order Items Summary
            </h2>
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-[480px] sm:min-w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 text-[11px] uppercase tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items?.map((item: any, index: number) => {
                    const lineTotal = item.price * item.quantity;
                    return (
                      <tr key={item.id || index} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div>{item.product?.name || "Product"}</div>
                          {item.variant && (
                            <span className="text-xs text-slate-500 font-normal">
                              Variant: {item.variant}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">
                          ৳{item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ৳{lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-5 border-t-2 border-slate-200 gap-6 page-break-avoid">
            {/* Payment Terms & Instructions */}
            <div className="text-xs text-slate-500 max-w-sm space-y-1.5">
              <p className="font-bold text-slate-800 uppercase tracking-wider">
                Customer Instructions & Policy:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 leading-relaxed text-[11px]">
                <li>Please inspect the package contents in front of the delivery agent.</li>
                <li>For any discrepancy or product issues, contact NIVORA support within 7 days.</li>
                <li>Retain this official invoice for warranty claims and order verification.</li>
              </ul>
            </div>

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-slate-900">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-mono font-medium text-slate-900">৳{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-slate-950 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-950 uppercase">Total Payable</span>
                <span className="text-lg font-black text-slate-950 font-mono">
                  ৳{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Signature (at bottom of A4) */}
        <div className="pt-8 border-t border-slate-200 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 page-break-avoid">
          <p className="italic text-[11px]">
            Thank you for shopping with NIVORA — Better Things, Better Everyday.
          </p>
          <div className="text-center sm:text-right">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
