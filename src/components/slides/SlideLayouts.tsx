import { motion } from "framer-motion";

interface SlideData {
  slide_order: number;
  title: string;
  subtitle: string | null;
  content: string;
  layout: string;
  image_url: string | null;
  background_color: string;
  section_name: string;
}

const sectionColors: Record<string, { bg: string; accent: string }> = {
  brand: { bg: "from-[#1a1a2e] to-[#16213e]", accent: "text-orange-400" },
  product: { bg: "from-[#0f3460] to-[#1a1a2e]", accent: "text-cyan-400" },
  operations: { bg: "from-[#1a1a2e] to-[#2d1b4e]", accent: "text-purple-400" },
  market: { bg: "from-[#1b2a1b] to-[#1a1a2e]", accent: "text-emerald-400" },
  finance: { bg: "from-[#2e1a1a] to-[#1a1a2e]", accent: "text-amber-400" },
  roadmap: { bg: "from-[#1a1a2e] to-[#0d1b2a]", accent: "text-sky-400" },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

// Parse markdown-like content into lines
const ContentBlock = ({ content, accent }: { content: string; accent: string }) => {
  const lines = content.split("\n").filter(l => l.trim());

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        // Table row
        if (line.startsWith("|")) return null; // handled by table layout

        // Bold headings
        const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
        if (boldMatch) {
          return (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible">
              <span className={`font-bold text-[36px] ${accent}`}>{boldMatch[1]}</span>
              {boldMatch[2] && <span className="text-white/80 text-[30px] ml-2">{boldMatch[2]}</span>}
            </motion.div>
          );
        }

        // Lines with emoji prefix
        const emojiMatch = line.match(/^([🎯🚀✅📱📘💬🎵🤝👩👨🟢🔵🟡🔴💰📊📈💵⏰🏷️💎⭐🌐📧📞👥📹🔧⏱️📅🧘🤸🌅💆🔥🏠⚡🥗👩‍⚕️📲🏢🌟👨‍💼👩‍🏫👨‍🏫📢🤝🎁❤️🔄📸💻📋🏋️📝✅🖥️💳🎯]+)\s*(.+)$/u);
        if (emojiMatch) {
          const textPart = emojiMatch[2];
          const innerBold = textPart.match(/\*\*(.+?)\*\*\s*—?\s*(.*)/);
          return (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible" className="flex items-start gap-3">
              <span className="text-[32px] flex-shrink-0">{emojiMatch[1]}</span>
              <div>
                {innerBold ? (
                  <>
                    <span className={`font-bold text-[30px] ${accent}`}>{innerBold[1]}</span>
                    {innerBold[2] && <span className="text-white/70 text-[28px]"> — {innerBold[2]}</span>}
                  </>
                ) : (
                  <span className="text-white/80 text-[30px]">{textPart}</span>
                )}
              </div>
            </motion.div>
          );
        }

        // Quote
        if (line.startsWith('"') || line.startsWith('"')) {
          return (
            <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="text-[36px] text-white/90 italic leading-relaxed"
            >
              {line}
            </motion.p>
          );
        }

        // Dash line
        if (line.startsWith("—")) {
          return (
            <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="text-[26px] text-white/50 mt-2"
            >
              {line}
            </motion.p>
          );
        }

        return (
          <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
            className="text-[30px] text-white/80 leading-relaxed"
          >
            {line}
          </motion.p>
        );
      })}
    </div>
  );
};

// Parse table from content
const TableContent = ({ content, accent }: { content: string; accent: string }) => {
  const lines = content.split("\n").filter(l => l.trim().startsWith("|"));
  if (lines.length < 2) return <ContentBlock content={content} accent={accent} />;

  const parseRow = (line: string) => line.split("|").filter(c => c.trim()).map(c => c.trim());
  const headers = parseRow(lines[0]);
  const dataRows = lines.slice(2).map(parseRow); // skip separator line

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="bg-white/5">
            {headers.map((h, i) => (
              <th key={i} className={`px-8 py-4 text-left text-[26px] font-bold ${accent}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} className="border-t border-white/5 hover:bg-white/5">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-8 py-4 text-[24px] ${
                  cell.startsWith("**") ? `font-bold ${accent}` : "text-white/70"
                }`}>
                  {cell.replace(/\*\*/g, "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CoverSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} relative overflow-hidden flex items-center justify-center`}>
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 text-center px-20">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-[96px] font-bold text-white tracking-tight leading-none"
        >
          {slide.title}
        </motion.h1>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-[48px] mt-6 ${colors.accent} font-medium`}
          >
            {slide.subtitle}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-10 text-[30px] text-white/60 leading-relaxed whitespace-pre-line"
        >
          {slide.content}
        </motion.div>
      </div>
    </div>
  );
};

export const TwoColumnSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[45%] relative">
          <img src={slide.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-transparent to-transparent" />
        </div>
      )}
    </div>
  );
};

export const StatsSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[40%] relative flex items-center justify-center p-8">
          <img src={slide.image_url} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export const GridSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[40%] relative flex items-center justify-center p-8">
          <img src={slide.image_url} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export const TableSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
      >
        Slide {slide.slide_order}/30
      </motion.div>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-[52px] font-bold text-white leading-tight mb-3"
      >
        {slide.title}
      </motion.h2>
      {slide.subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[30px] text-white/50 mb-8"
        >
          {slide.subtitle}
        </motion.p>
      )}
      <TableContent content={slide.content} accent={colors.accent} />
    </div>
  );
};

export const TimelineSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[40%] relative flex items-center justify-center p-8">
          <img src={slide.image_url} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export const QuoteSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} relative overflow-hidden flex items-center`}>
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="relative z-10 px-20 max-w-[70%]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-6`}
        >
          {slide.title}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`text-[120px] leading-none ${colors.accent} opacity-30 -mb-16`}
        >
          "
        </motion.div>
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
    </div>
  );
};

export const PricingSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[40%] relative flex items-center justify-center p-8">
          <img src={slide.image_url} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export const PersonaSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >
          Slide {slide.slide_order}/30
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-[52px] font-bold text-white leading-tight mb-3"
        >
          {slide.title}
        </motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[30px] text-white/50 mb-8"
          >
            {slide.subtitle}
          </motion.p>
        )}
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
      {slide.image_url && (
        <div className="w-[40%] relative flex items-center justify-center p-8">
          <img src={slide.image_url} alt="" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export const ChartSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hasTable = slide.content.includes("|");
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
      >
        Slide {slide.slide_order}/30
      </motion.div>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-[52px] font-bold text-white leading-tight mb-3"
      >
        {slide.title}
      </motion.h2>
      {slide.subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[30px] text-white/50 mb-8"
        >
          {slide.subtitle}
        </motion.p>
      )}
      <div className="flex gap-8 flex-1 items-center">
        <div className="flex-1">
          {hasTable ? (
            <TableContent content={slide.content} accent={colors.accent} />
          ) : (
            <ContentBlock content={slide.content} accent={colors.accent} />
          )}
        </div>
        {slide.image_url && (
          <div className="w-[35%] flex items-center justify-center">
            <img src={slide.image_url} alt="" className="max-w-full max-h-[500px] object-contain rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  );
};

const layoutMap: Record<string, React.ComponentType<{ slide: SlideData }>> = {
  cover: CoverSlide,
  "two-column": TwoColumnSlide,
  stats: StatsSlide,
  grid: GridSlide,
  table: TableSlide,
  timeline: TimelineSlide,
  quote: QuoteSlide,
  pricing: PricingSlide,
  persona: PersonaSlide,
  chart: ChartSlide,
};

export const SlideRenderer = ({ slide }: { slide: SlideData }) => {
  const Layout = layoutMap[slide.layout] || TwoColumnSlide;
  return <Layout slide={slide} />;
};

export default SlideRenderer;
