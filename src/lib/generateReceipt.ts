import jsPDF from "jspdf";

interface ReceiptData {
  receiptNumber: string;
  fullName: string;
  dob: string;
  mobileNumber: string;
  batchTime: string;
  batchLocation: string;
  sessionStartDate: string;
  sessionEndDate: string;
  category: string;
  fees: number;
  paymentStatus: string;
  registeredAt: string;
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(24);
  doc.setTextColor(27, 67, 50);
  doc.text("Yogsadhak", pageWidth / 2, 30, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22);
  doc.text("Pratyek Shwasat Arogya | Yog \u2022 Pranayam \u2022 Dhyan", pageWidth / 2, 38, {
    align: "center",
  });

  doc.setDrawColor(27, 67, 50);
  doc.line(20, 44, pageWidth - 20, 44);

  const leftX = 25;
  let y = 55;
  const lineHeight = 8;

  const fields: [string, string][] = [
    ["Receipt Number", data.receiptNumber],
    ["Student Name", data.fullName],
    ["Date of Birth", data.dob],
    ["Mobile Number", data.mobileNumber],
    ["Batch", data.batchTime],
    ["Location", data.batchLocation],
    ["Session Start Date", data.sessionStartDate],
    ["Session End Date", data.sessionEndDate],
    ["Category", data.category],
    ["Fees Due", `\u20B9${data.fees}`],
    ["Payment Status", data.paymentStatus === "paid" ? "PAID \u2713" : "PENDING"],
    ["Registration Date", data.registeredAt],
  ];

  for (const [label, value] of fields) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(label, leftX, y);
    doc.setTextColor(30, 30, 30);
    doc.text(value, leftX + 70, y);
    y += lineHeight;
  }

  const footerY = doc.internal.pageSize.getHeight() - 40;

  doc.setDrawColor(200, 200, 200);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Please carry this receipt on your first day. Fees to be paid at the venue.",
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
  );

  doc.setFontSize(10);
  doc.setTextColor(27, 67, 50);
  doc.text(
    "Thank you for joining Yogsadhak. Stay healthy, stay fit.",
    pageWidth / 2,
    footerY + 20,
    { align: "center" }
  );

  return doc;
}
