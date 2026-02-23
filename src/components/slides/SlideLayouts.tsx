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

const accentHex: Record<string, string> = {
  brand: "#fb923c", product: "#22d3ee", operations: "#c084fc",
  market: "#34d399", finance: "#fbbf24", roadmap: "#38bdf8",
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
        if (line.startsWith("|")) return null;
        const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
        if (boldMatch) {
          return (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible">
              <span className={`font-bold text-[36px] ${accent}`}>{boldMatch[1]}</span>
              {boldMatch[2] && <span className="text-white/80 text-[30px] ml-2">{boldMatch[2]}</span>}
            </motion.div>
          );
        }
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
        if (line.startsWith('"') || line.startsWith('\u201C')) {
          return (
            <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="text-[36px] text-white/90 italic leading-relaxed"
            >{line}</motion.p>
          );
        }
        if (line.startsWith("—")) {
          return (
            <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="text-[26px] text-white/50 mt-2"
            >{line}</motion.p>
          );
        }
        return (
          <motion.p key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
            className="text-[30px] text-white/80 leading-relaxed"
          >{line}</motion.p>
        );
      })}
    </div>
  );
};

const TableContent = ({ content, accent }: { content: string; accent: string }) => {
  const lines = content.split("\n").filter(l => l.trim().startsWith("|"));
  if (lines.length < 2) return <ContentBlock content={content} accent={accent} />;
  const parseRow = (line: string) => line.split("|").filter(c => c.trim()).map(c => c.trim());
  const headers = parseRow(lines[0]);
  const dataRows = lines.slice(2).map(parseRow);
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
                <td key={ci} className={`px-8 py-4 text-[24px] ${cell.startsWith("**") ? `font-bold ${accent}` : "text-white/70"}`}>
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

// Slide header helper
const SlideHeader = ({ slide, colors }: { slide: SlideData; colors: { accent: string } }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
    >
      Slide {slide.slide_order}
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
  </>
);

/* ==================== COVER ==================== */
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
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
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

/* ==================== TWO-COLUMN ==================== */
export const TwoColumnSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      <div className="flex-1 flex flex-col justify-center px-16 py-12">
        <SlideHeader slide={slide} colors={colors} />
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

/* ==================== STATS — big number cards ==================== */
const parseStats = (content: string) => {
  const lines = content.split("\n").filter(l => l.trim());
  const stats: { value: string; label: string; emoji?: string }[] = [];
  for (const line of lines) {
    const em = line.match(/^([^\w\s]+)\s*\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/u);
    if (em) { stats.push({ emoji: em[1], value: em[2], label: em[3] }); continue; }
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
    if (bm) { stats.push({ value: bm[1], label: bm[2] }); continue; }
  }
  return stats;
};

export const StatsSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const stats = parseStats(slide.content);
  const hasStats = stats.length >= 2;
  const hex = accentHex[slide.section_name] || accentHex.brand;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
      {hasStats ? (
        <div className="flex gap-6 mt-4 flex-wrap">
          {stats.map((stat, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="flex-1 min-w-[260px] rounded-2xl p-8 text-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${hex}15, ${hex}08)`, border: `1px solid ${hex}30` }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: hex }} />
              {stat.emoji && <span className="text-[44px] block mb-2">{stat.emoji}</span>}
              <div className={`text-[76px] font-black leading-none ${colors.accent}`}>{stat.value}</div>
              <div className="text-[24px] text-white/60 mt-4 leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <ContentBlock content={slide.content} accent={colors.accent} />
      )}
    </div>
  );
};

/* ==================== GRID — 2×2 or 2×3 card grid ==================== */
const parseGridItems = (content: string) => {
  const lines = content.split("\n").filter(l => l.trim());
  const items: { emoji?: string; title: string; desc: string }[] = [];
  for (const line of lines) {
    const em = line.match(/^([^\w\s]+)\s*\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/u);
    if (em) { items.push({ emoji: em[1], title: em[2], desc: em[3] }); continue; }
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
    if (bm) { items.push({ title: bm[1], desc: bm[2] }); continue; }
  }
  return items;
};

export const GridSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const items = parseGridItems(slide.content);
  const hasGrid = items.length >= 2;
  const hex = accentHex[slide.section_name] || accentHex.brand;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
      {hasGrid ? (
        <div className={`grid ${items.length <= 4 ? "grid-cols-2" : "grid-cols-3"} gap-5 mt-2 flex-1`}>
          {items.slice(0, 6).map((item, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="rounded-2xl p-7 flex flex-col gap-3 border border-white/10 hover:border-white/20 transition-colors"
              style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)` }}
            >
              {item.emoji && (
                <span className="text-[44px] w-[64px] h-[64px] rounded-xl flex items-center justify-center"
                  style={{ background: `${hex}20` }}
                >{item.emoji}</span>
              )}
              <h3 className={`text-[30px] font-bold ${colors.accent}`}>{item.title}</h3>
              <p className="text-[22px] text-white/55 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <ContentBlock content={slide.content} accent={colors.accent} />
      )}
    </div>
  );
};

/* ==================== TABLE ==================== */
export const TableSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
      <TableContent content={slide.content} accent={colors.accent} />
    </div>
  );
};

/* ==================== TIMELINE — horizontal dots ==================== */
const parseTimelineItems = (content: string) => {
  const lines = content.split("\n").filter(l => l.trim());
  const items: { emoji?: string; title: string; desc: string }[] = [];
  for (const line of lines) {
    const em = line.match(/^([^\w\s]+)\s*\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/u);
    if (em) { items.push({ emoji: em[1], title: em[2], desc: em[3] }); continue; }
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
    if (bm) { items.push({ title: bm[1], desc: bm[2] }); continue; }
  }
  return items;
};

export const TimelineSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const items = parseTimelineItems(slide.content);
  const hasTimeline = items.length >= 2;
  const hex = accentHex[slide.section_name] || accentHex.brand;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
      {hasTimeline ? (
        <div className="relative mt-6 flex-1 flex flex-col justify-center">
          {/* Horizontal line */}
          <div className="absolute left-0 right-0 h-[3px] top-1/2 -translate-y-1/2 rounded-full" style={{ background: `${hex}40` }} />
          <div className="flex justify-between relative">
            {items.slice(0, 6).map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                className="flex flex-col items-center text-center flex-1 px-3"
              >
                {/* Top label */}
                <div className={`text-[26px] font-bold ${colors.accent} mb-6`}>{item.title}</div>
                {/* Dot */}
                <div className="w-[28px] h-[28px] rounded-full border-[4px] relative z-10"
                  style={{ borderColor: hex, background: `${hex}30` }}
                />
                {/* Bottom desc */}
                <div className="text-[20px] text-white/55 mt-6 leading-snug max-w-[220px]">
                  {item.emoji && <span className="text-[28px] block mb-1">{item.emoji}</span>}
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <ContentBlock content={slide.content} accent={colors.accent} />
      )}
    </div>
  );
};

/* ==================== QUOTE ==================== */
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
          &ldquo;
        </motion.div>
        <ContentBlock content={slide.content} accent={colors.accent} />
      </div>
    </div>
  );
};

/* ==================== PRICING — side-by-side cards ==================== */
const parsePricingCards = (content: string) => {
  const lines = content.split("\n").filter(l => l.trim());
  const cards: { name: string; price: string; features: string[]; popular?: boolean }[] = [];
  let current: { name: string; price: string; features: string[]; popular?: boolean } | null = null;

  for (const line of lines) {
    const headerMatch = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
    if (headerMatch) {
      if (current) cards.push(current);
      current = {
        name: headerMatch[1],
        price: headerMatch[2] || "",
        features: [],
        popular: headerMatch[1].toLowerCase().includes("pro") || headerMatch[1].toLowerCase().includes("premium"),
      };
      continue;
    }
    const emojiLine = line.match(/^[✅🟢⭐💎🔵]\s*(.+)/u);
    if (emojiLine && current) {
      current.features.push(emojiLine[1]);
      continue;
    }
    if (current && line.trim().startsWith("—") || line.trim().startsWith("-")) {
      // skip separator
    } else if (current) {
      current.features.push(line.trim());
    }
  }
  if (current) cards.push(current);
  return cards;
};

export const PricingSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const cards = parsePricingCards(slide.content);
  const hasCards = cards.length >= 2;
  const hex = accentHex[slide.section_name] || accentHex.brand;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
      {hasCards ? (
        <div className="flex gap-6 mt-4 flex-1 items-stretch">
          {cards.slice(0, 4).map((card, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className={`flex-1 rounded-2xl p-8 flex flex-col border relative overflow-hidden ${
                card.popular ? "border-2" : "border border-white/10"
              }`}
              style={card.popular
                ? { borderColor: hex, background: `linear-gradient(180deg, ${hex}18, ${hex}05)` }
                : { background: "rgba(255,255,255,0.04)" }
              }
            >
              {card.popular && (
                <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: hex }} />
              )}
              {card.popular && (
                <span className="text-[18px] font-bold px-4 py-1 rounded-full self-start mb-3"
                  style={{ background: `${hex}30`, color: hex }}
                >PHỔ BIẾN</span>
              )}
              <h3 className={`text-[36px] font-bold ${card.popular ? colors.accent : "text-white"}`}>{card.name}</h3>
              {card.price && <div className={`text-[28px] mt-1 ${colors.accent} font-semibold`}>{card.price}</div>}
              <div className="mt-6 space-y-3 flex-1">
                {card.features.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-3">
                    <span style={{ color: hex }} className="text-[22px] mt-0.5">✓</span>
                    <span className="text-[22px] text-white/70">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <ContentBlock content={slide.content} accent={colors.accent} />
      )}
    </div>
  );
};

/* ==================== PERSONA — avatar + profile ==================== */
export const PersonaSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hex = accentHex[slide.section_name] || accentHex.brand;
  const lines = slide.content.split("\n").filter(l => l.trim());

  // Extract persona traits from content
  const traits: { label: string; value: string }[] = [];
  const otherLines: string[] = [];
  for (const line of lines) {
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/);
    if (bm) { traits.push({ label: bm[1], value: bm[2] }); continue; }
    const em = line.match(/^([^\w\s]+)\s*(.+)/u);
    if (em) { otherLines.push(line); continue; }
    otherLines.push(line);
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex`}>
      {/* Left: Avatar area */}
      <div className="w-[420px] flex flex-col items-center justify-center relative shrink-0">
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${hex}12, transparent)` }} />
        <div className="relative z-10 flex flex-col items-center">
          {slide.image_url ? (
            <img src={slide.image_url} alt="" className="w-[240px] h-[240px] rounded-full object-cover border-4"
              style={{ borderColor: hex }}
            />
          ) : (
            <div className="w-[240px] h-[240px] rounded-full flex items-center justify-center text-[80px]"
              style={{ background: `${hex}20`, border: `4px solid ${hex}` }}
            >
              👤
            </div>
          )}
          <h3 className="text-[36px] font-bold text-white mt-6">{slide.title}</h3>
          {slide.subtitle && <p className={`text-[24px] ${colors.accent} mt-1`}>{slide.subtitle}</p>}
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-center px-12 py-12">
        {traits.length > 0 && (
          <div className="space-y-4 mb-8">
            {traits.map((t, i) => (
              <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                className="flex items-baseline gap-4"
              >
                <span className={`text-[24px] font-bold ${colors.accent} w-[200px] shrink-0`}>{t.label}</span>
                <span className="text-[24px] text-white/70">{t.value}</span>
              </motion.div>
            ))}
          </div>
        )}
        {otherLines.length > 0 && (
          <ContentBlock content={otherLines.join("\n")} accent={colors.accent} />
        )}
      </div>
    </div>
  );
};

/* ==================== CHART — table + content side by side ==================== */
export const ChartSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hasTable = slide.content.includes("|");
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col justify-center px-16 py-12`}>
      <SlideHeader slide={slide} colors={colors} />
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

/* ==================== LAYOUT MAP ==================== */
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
