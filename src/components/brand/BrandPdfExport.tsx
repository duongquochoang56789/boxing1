import { jsPDF } from "jspdf";

interface BrandKitData {
  name: string;
  slogan: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  heading_font: string;
  body_font: string;
  accent_font: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export async function exportBrandPdf(brand: BrandKitData) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;

  // ===== PAGE 1: Cover =====
  const [bgR, bgG, bgB] = hexToRgb(brand.secondary_color);
  pdf.setFillColor(bgR, bgG, bgB);
  pdf.rect(0, 0, W, H, "F");

  // Logo
  if (brand.logo_url) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = brand.logo_url!;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", W / 2 - 25, 60, 50, 50);
    } catch {
      // Skip logo if can't load
    }
  }

  // Brand name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont("helvetica", "bold");
  pdf.text(brand.name, W / 2, 140, { align: "center" });

  // Slogan
  if (brand.slogan) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "italic");
    pdf.text(brand.slogan, W / 2, 155, { align: "center", maxWidth: 160 });
  }

  // Brand Kit label
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(200, 200, 200);
  pdf.text("BRAND IDENTITY GUIDELINES", W / 2, 200, { align: "center" });

  // ===== PAGE 2: Color Palette =====
  pdf.addPage();
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, W, H, "F");

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bảng Màu", 20, 30);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Hệ thống màu sắc chính thức của thương hiệu", 20, 40);

  const colors = [
    { label: "Primary", hex: brand.primary_color, desc: "Màu chủ đạo, dùng cho logo, tiêu đề và CTA" },
    { label: "Secondary", hex: brand.secondary_color, desc: "Màu phụ, dùng cho nền tối và text" },
    { label: "Accent", hex: brand.accent_color, desc: "Màu nhấn, dùng cho highlight và decoration" },
    { label: "Background", hex: brand.bg_color, desc: "Màu nền chính cho các bề mặt" },
  ];

  colors.forEach((c, i) => {
    const y = 60 + i * 50;
    const [r, g, b] = hexToRgb(c.hex);

    // Swatch
    pdf.setFillColor(r, g, b);
    pdf.roundedRect(20, y, 40, 35, 3, 3, "F");

    // Label
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(c.label, 70, y + 12);

    // Hex
    pdf.setFontSize(12);
    pdf.setFont("courier", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text(c.hex.toUpperCase(), 70, y + 22);

    // RGB
    pdf.setFontSize(9);
    pdf.text(`RGB(${r}, ${g}, ${b})`, 70, y + 30);

    // Description
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text(c.desc, 130, y + 17, { maxWidth: 60 });
  });

  // ===== PAGE 3: Typography =====
  pdf.addPage();
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, W, H, "F");

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Typography", 20, 30);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Bộ font chữ chính thức của thương hiệu", 20, 40);

  const fonts = [
    { label: "Heading Font", font: brand.heading_font, sample: "Aa Bb Cc Dd Ee Ff Gg", desc: "Dùng cho tiêu đề, heading, banner" },
    { label: "Body Font", font: brand.body_font, sample: "The quick brown fox jumps over the lazy dog", desc: "Dùng cho nội dung chính, đoạn văn" },
    { label: "Accent Font", font: brand.accent_font, sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", desc: "Dùng cho nhãn, tag, caption" },
  ];

  fonts.forEach((f, i) => {
    const y = 60 + i * 65;

    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(f.label, 20, y);

    pdf.setFontSize(24);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(f.font, 20, y + 15);

    pdf.setFontSize(14);
    pdf.setTextColor(80, 80, 80);
    pdf.text(f.sample, 20, y + 28, { maxWidth: 170 });

    pdf.setFontSize(9);
    pdf.setTextColor(130, 130, 130);
    pdf.text(f.desc, 20, y + 40);

    // Divider
    if (i < fonts.length - 1) {
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y + 50, W - 20, y + 50);
    }
  });

  // ===== PAGE 4: Usage Guidelines =====
  pdf.addPage();
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, W, H, "F");

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("Hướng Dẫn Sử Dụng", 20, 30);

  const dos = [
    "✅ Sử dụng đúng mã màu HEX đã quy định",
    "✅ Giữ khoảng cách an toàn (clear space) xung quanh logo",
    "✅ Sử dụng font chữ theo đúng phân vai (heading/body/accent)",
    "✅ Đảm bảo tương phản tối thiểu 4.5:1 cho text",
    "✅ Luôn dùng logo gốc chất lượng cao",
  ];

  const donts = [
    "❌ Không thay đổi tỷ lệ hoặc biến dạng logo",
    "❌ Không sử dụng màu ngoài bảng màu quy định",
    "❌ Không đặt logo trên nền quá rối hoặc tương phản kém",
    "❌ Không thêm hiệu ứng (shadow, stroke) vào logo",
    "❌ Không sử dụng font chữ khác ngoài quy định",
  ];

  let yPos = 50;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 139, 34);
  pdf.text("Nên làm (Do's)", 20, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  dos.forEach(d => {
    pdf.text(d, 25, yPos);
    yPos += 10;
  });

  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(200, 50, 50);
  pdf.text("Không nên (Don'ts)", 20, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  donts.forEach(d => {
    pdf.text(d, 25, yPos);
    yPos += 10;
  });

  // Footer
  yPos += 20;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPos, W - 20, yPos);
  yPos += 10;
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`${brand.name} Brand Kit • Generated by FLYFIT AI`, W / 2, yPos, { align: "center" });

  pdf.save(`${brand.name}-brand-kit.pdf`);
}
