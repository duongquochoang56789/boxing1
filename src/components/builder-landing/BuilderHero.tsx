import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MockupSlide = ({ delay, title, className }: { delay: number; title: string; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-lg border border-white/10 bg-white/5 backdrop-blur p-4 ${className}`}
  >
    <div className="w-full aspect-[16/9] rounded bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-3">
      <Sparkles className="w-6 h-6 text-indigo-400/60" />
    </div>
    <div className="h-2.5 w-3/4 rounded-full bg-white/15 mb-2" />
    <div className="h-2 w-1/2 rounded-full bg-white/8" />
    <p className="text-[10px] text-slate-500 mt-2 font-medium">{title}</p>
  </motion.div>
);

const BuilderHero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">Powered by AI</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-50 leading-[1.1] mb-6">
              Tạo Slide Thuyết Trình{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Trong 30 Giây
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Chỉ cần nhập ý tưởng — AI tự động thiết kế toàn bộ bài thuyết trình chuyên nghiệp với 12+ bố cục đẹp mắt.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0 text-white px-8 h-12 text-base">
                <Link to="/slides/new">
                  Thử miễn phí
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-12 text-base">
                <a href="#demo">
                  <Play className="w-4 h-4 mr-1" />
                  Xem demo
                </a>
              </Button>
            </div>

            <p className="text-xs text-slate-500 mt-4">Không cần thẻ tín dụng · 3 bài thuyết trình miễn phí</p>
          </motion.div>

          {/* Mockup */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Editor mockup */}
              <div className="rounded-xl border border-white/10 bg-slate-800/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-block h-5 px-4 rounded bg-white/5 text-[10px] text-slate-500 leading-5">
                      SlideAI Editor
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 grid grid-cols-3 gap-3">
                  <MockupSlide delay={0.5} title="Cover Slide" />
                  <MockupSlide delay={0.7} title="Overview" />
                  <MockupSlide delay={0.9} title="Key Features" />
                </div>

                {/* Bottom bar */}
                <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded bg-indigo-500/20 text-[9px] text-indigo-300 flex items-center justify-center">+ AI Tạo</div>
                    <div className="h-6 w-14 rounded bg-white/5 text-[9px] text-slate-500 flex items-center justify-center">Xuất PDF</div>
                  </div>
                  <div className="text-[10px] text-slate-600">3 slides</div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs font-medium text-white">AI đã tạo 3 slides!</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuilderHero;
