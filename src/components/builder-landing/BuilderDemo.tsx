import { motion } from "framer-motion";
import { Sparkles, MousePointerClick, Layers, Type, Image, Palette, Share2 } from "lucide-react";
import { useState } from "react";

const TABS = [
  { id: "ai", label: "AI Tạo", icon: Sparkles },
  { id: "edit", label: "Chỉnh sửa", icon: Type },
  { id: "share", label: "Chia sẻ", icon: Share2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const tabContent: Record<TabId, { slides: { title: string; color: string; icon: React.ElementType }[]; status: string }> = {
  ai: {
    slides: [
      { title: "Cover Slide", color: "from-indigo-500/30 to-violet-500/30", icon: Layers },
      { title: "Tổng quan", color: "from-cyan-500/30 to-blue-500/30", icon: Type },
      { title: "Tính năng", color: "from-emerald-500/30 to-teal-500/30", icon: Image },
      { title: "Pricing", color: "from-orange-500/30 to-amber-500/30", icon: Palette },
    ],
    status: "AI đã tạo 4 slides trong 8 giây ✨",
  },
  edit: {
    slides: [
      { title: "Drag & Drop", color: "from-pink-500/30 to-rose-500/30", icon: MousePointerClick },
      { title: "12+ Layouts", color: "from-violet-500/30 to-purple-500/30", icon: Layers },
      { title: "Thêm ảnh AI", color: "from-sky-500/30 to-cyan-500/30", icon: Image },
      { title: "Tuỳ chỉnh màu", color: "from-amber-500/30 to-yellow-500/30", icon: Palette },
    ],
    status: "Chỉnh sửa trực tiếp trên slide",
  },
  share: {
    slides: [
      { title: "Xuất PDF", color: "from-red-500/30 to-pink-500/30", icon: Share2 },
      { title: "Xuất PPTX", color: "from-blue-500/30 to-indigo-500/30", icon: Layers },
      { title: "Link chia sẻ", color: "from-green-500/30 to-emerald-500/30", icon: Share2 },
      { title: "Trình chiếu", color: "from-purple-500/30 to-violet-500/30", icon: MousePointerClick },
    ],
    status: "Xuất & chia sẻ chỉ 1 click",
  },
};

const BuilderDemo = () => {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const current = tabContent[activeTab];

  return (
    <section id="demo" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.08),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
            Xem Cách Hoạt Động
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Từ ý tưởng đến bài thuyết trình hoàn chỉnh — trải nghiệm quy trình nhanh chóng ngay tại đây.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mockup Editor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/5"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-slate-800/80">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-6 px-6 rounded-md bg-white/5 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                SlideAI Editor — Demo
              </div>
            </div>
          </div>

          {/* Sidebar + Main */}
          <div className="flex min-h-[340px] sm:min-h-[400px]">
            {/* Sidebar thumbnails */}
            <div className="hidden sm:flex flex-col gap-2 p-3 w-28 border-r border-white/5 bg-slate-900/40">
              {current.slides.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={`${activeTab}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`aspect-video rounded-md bg-gradient-to-br ${s.color} flex items-center justify-center border ${
                      i === 0 ? "border-indigo-400/50 ring-1 ring-indigo-400/20" : "border-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-white/40" />
                  </motion.div>
                );
              })}
            </div>

            {/* Main preview */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg aspect-video rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-white/10 flex flex-col items-center justify-center gap-4 p-8"
              >
                {(() => {
                  const Icon = current.slides[0].icon;
                  return <Icon className="w-10 h-10 text-indigo-400/60" />;
                })()}
                <div className="space-y-2 text-center">
                  <div className="h-3 w-48 rounded-full bg-white/15 mx-auto" />
                  <div className="h-2.5 w-36 rounded-full bg-white/8 mx-auto" />
                  <div className="h-2 w-56 rounded-full bg-white/5 mx-auto" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-slate-800/80">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">{current.status}</span>
            </motion.div>
            <span className="text-[10px] text-slate-600">{current.slides.length} slides</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BuilderDemo;
