import { motion } from "framer-motion";
import { ArrowLeft, Layout, Layers, Monitor, Sparkles, Zap, ExternalLink } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const heroOptions = [
  {
    id: 1,
    name: "Cinematic Full-Bleed",
    icon: Monitor,
    description: "Video/ảnh full-screen làm nền, text overlay trung tâm, form ẩn sau CTA button",
    layout: "Ảnh/video chiếm 100% viewport. Heading + tagline căn giữa. Nút CTA lớn → click mở modal form đăng ký.",
    pros: [
      "Tạo ấn tượng mạnh mẽ ngay lập tức — cinematic, premium",
      "Tập trung thông điệp, không bị phân tán bởi form",
      "Tốt cho mobile — không cần chia cột",
    ],
    cons: [
      "Form ẩn → có thể giảm tỷ lệ chuyển đổi",
      "Phụ thuộc chất lượng hình ảnh/video",
    ],
    bestFor: "Khi muốn tạo cảm xúc mạnh, storytelling — phù hợp chiến dịch ra mắt thương hiệu",
    color: "from-terracotta/20 to-transparent",
  },
  {
    id: 2,
    name: "Split Screen (Hiện tại)",
    icon: Layout,
    description: "Chia đôi màn hình: bên trái text + tagline, bên phải form đăng ký glassmorphism",
    layout: "Grid 2 cột trên desktop. Cột trái: label, heading lớn, mô tả. Cột phải: form đăng ký với backdrop blur. Ảnh nền phía sau.",
    pros: [
      "Form luôn hiển thị → tỷ lệ chuyển đổi cao nhất",
      "Cân bằng giữa thẩm mỹ và chức năng",
      "Đã được thử nghiệm và hoạt động tốt",
    ],
    cons: [
      "Trên mobile form bị đẩy xuống dưới",
      "Có thể trông hơi 'tiêu chuẩn' với các gym khác",
    ],
    bestFor: "Tối ưu lead generation — phù hợp giai đoạn cần thu thập khách hàng nhanh",
    color: "from-amber-500/20 to-transparent",
    current: true,
  },
  {
    id: 3,
    name: "Vertical Storytelling",
    icon: Layers,
    description: "Hero section kéo dài 150vh, nội dung xuất hiện theo scroll — parallax storytelling",
    layout: "Phần 1 (100vh): Ảnh full + heading lớn animating in. Scroll xuống → Phần 2 (50vh): Số liệu nổi bật + form đăng ký slide vào từ bên phải.",
    pros: [
      "Trải nghiệm premium, khác biệt hoàn toàn",
      "Kể câu chuyện thương hiệu theo trình tự",
      "Tăng thời gian ở lại trang (engagement)",
    ],
    cons: [
      "Phức tạp hơn để implement",
      "Người dùng có thể không scroll đủ xa để thấy form",
      "Performance có thể bị ảnh hưởng trên thiết bị yếu",
    ],
    bestFor: "Khi muốn thể hiện đẳng cấp và sự khác biệt — phù hợp phân khúc cao cấp",
    color: "from-emerald-500/20 to-transparent",
  },
  {
    id: 4,
    name: "Card-Based Modular",
    icon: Sparkles,
    description: "Hero tối giản với heading lớn, bên dưới là 3 cards nổi bật: Dịch vụ chính, Ưu đãi, Đăng ký",
    layout: "Heading + tagline chiếm 60% viewport. Bên dưới: 3 glassmorphism cards ngang hàng — Card 1: Dịch vụ hot, Card 2: Ưu đãi tháng, Card 3: Form đăng ký nhanh (chỉ tên + SĐT).",
    pros: [
      "Nhiều thông tin hơn mà không rối mắt",
      "Người dùng có nhiều lựa chọn hành động",
      "Dễ A/B test từng card riêng lẻ",
    ],
    cons: [
      "Có thể bị phân tán — không rõ CTA chính",
      "Cần thiết kế cards cẩn thận để không trông cluttered",
    ],
    bestFor: "Khi đã có nhiều dịch vụ/ưu đãi muốn highlight cùng lúc",
    color: "from-violet-500/20 to-transparent",
  },
  {
    id: 5,
    name: "Minimal Typography",
    icon: Zap,
    description: "Nền đơn sắc (charcoal/cream), heading typography cực lớn chiếm toàn bộ, không có ảnh nền",
    layout: "Background đơn sắc. Heading Cormorant Garamond chiếm 70% viewport ở size 8-12vw. Một dòng tagline nhỏ. CTA button đơn giản. Form ở section tiếp theo.",
    pros: [
      "Cực kỳ khác biệt — luxury, editorial feel",
      "Load nhanh nhất (không ảnh nền lớn)",
      "Typography trở thành focal point — tận dụng tối đa Cormorant Garamond",
    ],
    cons: [
      "Không có hình ảnh → khó truyền tải không gian gym",
      "Có thể quá 'lạnh' cho đối tượng gym thông thường",
      "Cần typography skills cao để không bị boring",
    ],
    bestFor: "Khi muốn positioning như luxury brand — Aesop, Byredo style — phù hợp rebranding cao cấp",
    color: "from-slate-500/20 to-transparent",
  },
];

const HeroOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-warm-beige border-b border-border">
        <div className="container-custom py-6">
          <button
            onClick={() => navigate("/#contact")}
            className="flex items-center gap-2 text-soft-brown hover:text-terracotta transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">
            5 Phương án Hero Section
          </h1>
          <p className="text-body-sm text-soft-brown mt-2 max-w-2xl">
            So sánh 5 hướng thiết kế UI/UX cho trang chủ FLYFIT. Mỗi option phù hợp với chiến lược kinh doanh và mục tiêu khác nhau.
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="container-custom py-12 space-y-8">
        {heroOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`bg-cream border border-border overflow-hidden ${option.current ? "ring-2 ring-terracotta" : ""}`}
          >
            {/* Option Header */}
            <div className={`bg-gradient-to-r ${option.color} p-6 md:p-8 flex items-start gap-4`}>
              <div className="w-10 h-10 bg-charcoal/10 flex items-center justify-center shrink-0">
                <option.icon className="w-5 h-5 text-charcoal" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl md:text-3xl text-charcoal">
                    Option {option.id}: {option.name}
                  </h2>
                  {option.current && (
                    <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-terracotta text-cream px-2 py-0.5">
                      Hiện tại
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-soft-brown mt-1">{option.description}</p>
              </div>
            </div>

            {/* Option Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Layout */}
              <div>
                <h3 className="text-label text-terracotta mb-2">Bố cục</h3>
                <p className="text-body-sm text-charcoal">{option.layout}</p>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-label text-emerald-700 mb-2">Ưu điểm</h3>
                  <ul className="space-y-1.5">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="text-body-sm text-charcoal flex items-start gap-2">
                        <span className="text-emerald-600 mt-1 shrink-0">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-label text-red-700 mb-2">Hạn chế</h3>
                  <ul className="space-y-1.5">
                    {option.cons.map((con, i) => (
                      <li key={i} className="text-body-sm text-charcoal flex items-start gap-2">
                        <span className="text-red-500 mt-1 shrink-0">✕</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-warm-beige p-4">
                <div>
                  <h3 className="text-label text-terracotta mb-1">Phù hợp nhất khi</h3>
                  <p className="text-body-sm text-charcoal font-medium">{option.bestFor}</p>
                </div>
                <Link
                  to={`/hero-demo/${option.id}`}
                  className="shrink-0 flex items-center gap-2 bg-charcoal text-cream px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors rounded-full"
                >
                  Xem demo
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-charcoal text-cream p-8 md:p-10"
        >
          <h2 className="font-display text-2xl md:text-3xl mb-4">Khuyến nghị</h2>
          <div className="space-y-3 text-body-sm text-cream/80">
            <p>
              <strong className="text-peach">Giai đoạn hiện tại (thu lead):</strong> Giữ <strong>Option 2 — Split Screen</strong> vì form luôn hiển thị, tỷ lệ chuyển đổi tốt nhất.
            </p>
            <p>
              <strong className="text-peach">Khi rebranding:</strong> Chuyển sang <strong>Option 1 (Cinematic)</strong> hoặc <strong>Option 5 (Minimal Typography)</strong> để nâng tầm thương hiệu.
            </p>
            <p>
              <strong className="text-peach">A/B Testing:</strong> Có thể thử <strong>Option 3 (Vertical Storytelling)</strong> cho chiến dịch đặc biệt để đo engagement.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroOptions;
