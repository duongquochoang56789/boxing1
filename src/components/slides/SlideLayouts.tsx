import React from "react";
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

interface EditableProps {
  editable?: boolean;
  onUpdateField?: (field: 'title' | 'subtitle' | 'content', value: string) => void;
  onBlockSelect?: (blockIndex: number, rect: DOMRect) => void;
  selectedBlock?: number | null;
}

/** Parse style metadata from <!-- style:bold,color:#fb923c,size:lg,align:center --> */
const parseStyleMeta = (text: string): { cleanText: string; styles: Record<string, string> } => {
  const match = text.match(/<!--\s*style:(.+?)\s*-->$/);
  if (!match) return { cleanText: text, styles: {} };
  const cleanText = text.replace(/\s*<!--\s*style:.+?-->\s*$/, "").trim();
  const styles: Record<string, string> = {};
  match[1].split(",").forEach(pair => {
    const [key, ...rest] = pair.split(":");
    if (key && rest.length) styles[key.trim()] = rest.join(":").trim();
    else if (key) styles[key.trim()] = "true";
  });
  return { cleanText, styles };
};

const getStyleClasses = (styles: Record<string, string>): React.CSSProperties => {
  const css: React.CSSProperties = {};
  if (styles.bold) css.fontWeight = "bold";
  if (styles.italic) css.fontStyle = "italic";
  if (styles.color) css.color = styles.color;
  if (styles.align) css.textAlign = styles.align as any;
  if (styles.size) {
    const sizeMap: Record<string, string> = { xs: "20px", sm: "24px", md: "28px", lg: "36px", xl: "48px" };
    css.fontSize = sizeMap[styles.size] || css.fontSize;
  }
  return css;
};

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

/** Render inline markdown: **bold**, *italic* */
const renderInline = (text: string, accent: string) => {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1]) parts.push(<span key={key++} className={`font-bold ${accent}`}>{match[1]}</span>);
    else if (match[2]) parts.push(<em key={key++} className="italic">{match[2]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

/** Render rich inline: **bold**, *italic*, `code`, [links](url) */
const renderInlineRich = (text: string, accent: string) => {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1]) parts.push(<span key={key++} className={`font-bold ${accent}`}>{match[1]}</span>);
    else if (match[2]) parts.push(<em key={key++} className="italic">{match[2]}</em>);
    else if (match[3]) parts.push(<code key={key++} className="bg-white/10 text-emerald-300 px-2 py-0.5 rounded font-mono text-[0.85em]">{match[3]}</code>);
    else if (match[4] && match[5]) parts.push(<a key={key++} href={match[5]} target="_blank" rel="noopener noreferrer" className={`${accent} underline underline-offset-4 hover:opacity-80`}>{match[4]}</a>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

// Parse markdown-like content into lines
const ContentBlock = ({ content, accent }: { content: string; accent: string }) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and table rows
    if (!trimmed || trimmed.startsWith("|")) { i++; continue; }

    // Horizontal rule: --- or ***
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(
        <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
          className="w-full flex items-center gap-4 my-4"
        >
          <div className={`flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent`} />
        </motion.div>
      );
      i++; continue;
    }

    // Code block: ```
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <motion.pre key={`code-${i}`} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto"
        >
          <code className="text-[22px] font-mono text-emerald-300 leading-relaxed whitespace-pre">
            {codeLines.join("\n")}
          </code>
        </motion.pre>
      );
      continue;
    }

    // Inline code: `code`
    // Headings: ### text
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const sizes = ["text-[48px]", "text-[42px]", "text-[36px]", "text-[30px]"];
      elements.push(
        <motion.div key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className={`font-bold text-white ${sizes[level - 1] || sizes[2]} leading-tight mt-2`}
        >{renderInline(headingMatch[2], accent)}</motion.div>
      );
      i++; continue;
    }

    // Numbered list: 1. text, 2. text
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length) {
        const nm = lines[i].trim().match(/^(\d+)[.)]\s+(.+)$/);
        if (!nm) break;
        listItems.push({ num: nm[1], text: nm[2] });
        i++;
      }
      elements.push(
        <div key={`ol-${i}`} className="space-y-3 pl-2">
          {listItems.map((item, li) => (
            <motion.div key={li} custom={elements.length + li} variants={fadeIn} initial="hidden" animate="visible"
              className="flex items-start gap-4"
            >
              <span className={`${accent} text-[26px] font-bold min-w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-1`}>
                {item.num}
              </span>
              <span className="text-white/80 text-[28px] leading-relaxed">{renderInline(item.text, accent)}</span>
            </motion.div>
          ))}
        </div>
      );
      continue;
    }

    // Nested bullet: starts with spaces/tab + * or -
    const nestedBulletMatch = line.match(/^(\s{2,}|\t+)[\*\-]\s+(.+)$/);
    if (nestedBulletMatch) {
      const indent = nestedBulletMatch[1].length >= 4 ? 2 : 1;
      elements.push(
        <motion.div key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className="flex items-start gap-3" style={{ paddingLeft: `${indent * 32 + 8}px` }}
        >
          <span className={`${accent} text-[22px] mt-1.5 flex-shrink-0 opacity-60`}>◦</span>
          <span className="text-white/70 text-[26px] leading-relaxed">{renderInline(nestedBulletMatch[2], accent)}</span>
        </motion.div>
      );
      i++; continue;
    }

    // Bullet list: * text or - text
    const bulletMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (bulletMatch) {
      elements.push(
        <motion.div key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className="flex items-start gap-3 pl-2"
        >
          <span className={`${accent} text-[28px] mt-1 flex-shrink-0`}>•</span>
          <span className="text-white/80 text-[28px] leading-relaxed">{renderInlineRich(bulletMatch[1], accent)}</span>
        </motion.div>
      );
      i++; continue;
    }

    // Standalone bold line: **text** rest
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (boldMatch) {
      elements.push(
        <motion.div key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible">
          <span className={`font-bold text-[36px] ${accent}`}>{boldMatch[1]}</span>
          {boldMatch[2] && <span className="text-white/80 text-[30px] ml-2">{boldMatch[2]}</span>}
        </motion.div>
      );
      i++; continue;
    }

    // Emoji-prefixed lines
    const emojiMatch = trimmed.match(/^([^\w\s#*\-|"].+?)\s+(.+)$/u);
    if (emojiMatch && /\p{Emoji}/u.test(emojiMatch[1])) {
      const textPart = emojiMatch[2];
      const innerBold = textPart.match(/\*\*(.+?)\*\*\s*—?\s*(.*)/);
      elements.push(
        <motion.div key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible" className="flex items-start gap-3">
          <span className="text-[32px] flex-shrink-0">{emojiMatch[1]}</span>
          <div>
            {innerBold ? (
              <>
                <span className={`font-bold text-[30px] ${accent}`}>{innerBold[1]}</span>
                {innerBold[2] && <span className="text-white/70 text-[28px]"> — {innerBold[2]}</span>}
              </>
            ) : (
              <span className="text-white/80 text-[30px]">{renderInline(textPart, accent)}</span>
            )}
          </div>
        </motion.div>
      );
      i++; continue;
    }

    // Quoted text
    if (trimmed.startsWith('"') || trimmed.startsWith('\u201C')) {
      elements.push(
        <motion.p key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className="text-[36px] text-white/90 italic leading-relaxed"
        >{trimmed}</motion.p>
      );
      i++; continue;
    }
    // Attribution
    if (trimmed.startsWith("—")) {
      elements.push(
        <motion.p key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
          className="text-[26px] text-white/50 mt-2"
        >{trimmed}</motion.p>
      );
      i++; continue;
    }

    // Default paragraph with inline formatting (supports `code`, links)
    elements.push(
      <motion.p key={i} custom={elements.length} variants={fadeIn} initial="hidden" animate="visible"
        className="text-[30px] text-white/80 leading-relaxed"
      >{renderInlineRich(trimmed, accent)}</motion.p>
    );
    i++;
  }

  return <div className="space-y-4">{elements}</div>;
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

// Editable text helper
const EditableText = ({ 
  value, field, editable, onUpdateField, className, tag = "div" 
}: { 
  value: string; field: 'title' | 'subtitle'; editable?: boolean; 
  onUpdateField?: (field: 'title' | 'subtitle' | 'content', value: string) => void;
  className?: string; tag?: string;
}) => {
  if (!editable) {
    return React.createElement(tag, { className }, value);
  }
  return React.createElement(tag, {
    className: `${className} outline-none border border-transparent hover:border-dashed hover:border-white/20 focus:border-solid focus:border-orange-400/50 rounded px-2 -mx-2 cursor-text transition-colors`,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const newVal = e.currentTarget.innerText;
      if (newVal !== value) onUpdateField?.(field, newVal);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLElement).blur(); }
    },
    children: value,
  });
};

// Slide header helper
const SlideHeader = ({ slide, colors, editable, onUpdateField }: { slide: SlideData; colors: { accent: string }; editable?: boolean; onUpdateField?: EditableProps['onUpdateField'] }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
    >
      Slide {slide.slide_order}
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <EditableText value={slide.title} field="title" editable={editable} onUpdateField={onUpdateField}
        className="text-[52px] font-bold text-white leading-tight mb-3" />
    </motion.div>
    {slide.subtitle && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <EditableText value={slide.subtitle} field="subtitle" editable={editable} onUpdateField={onUpdateField}
          className="text-[30px] text-white/50 mb-8" />
      </motion.div>
    )}
  </>
);

/* ==================== Background helper ==================== */
const getSlideBg = (slide: SlideData, colors: { bg: string }) => {
  const isCustom = slide.background_color && slide.background_color !== "#1a1a2e";
  if (isCustom) return { style: { backgroundColor: slide.background_color }, className: "" };
  return { style: {}, className: `bg-gradient-to-br ${colors.bg}` };
};

/* ==================== COVER ==================== */
export const CoverSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const bg = getSlideBg(slide, colors);
  return (
    <div className={`w-full h-full ${bg.className} relative overflow-hidden flex items-center justify-center`} style={bg.style}>
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 text-center px-20">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className={`font-bold text-white tracking-tight leading-none ${
            slide.title.length > 20 ? "text-[72px]" : slide.title.length > 12 ? "text-[84px]" : "text-[96px]"
          }`}
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
  const bg = getSlideBg(slide, colors);
  return (
    <div className={`w-full h-full ${bg.className} flex`} style={bg.style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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
              <div className={`font-black leading-none ${colors.accent} ${
                stat.value.length > 12 ? "text-[48px]" : stat.value.length > 8 ? "text-[58px]" : "text-[76px]"
              }`}>{stat.value}</div>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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
              <h3 className={`font-bold ${colors.accent} ${
                item.title.length > 25 ? "text-[22px]" : "text-[30px]"
              }`}>{item.title}</h3>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} relative overflow-hidden flex items-center`} style={getSlideBg(slide, colors).style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex`} style={getSlideBg(slide, colors).style}>
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
    <div className={`w-full h-full ${getSlideBg(slide, colors).className} flex flex-col justify-center px-16 py-12`} style={getSlideBg(slide, colors).style}>
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

/* ==================== IMAGE-FULL — full background image with text overlay ==================== */
export const ImageFullSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const bg = getSlideBg(slide, colors);
  return (
    <div className={`w-full h-full ${bg.className} relative overflow-hidden flex items-end`} style={bg.style}>
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="relative z-10 px-20 pb-16 w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[22px] font-medium ${colors.accent} uppercase tracking-widest mb-4`}
        >Slide {slide.slide_order}</motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-[72px] font-bold text-white leading-tight mb-4"
        >{slide.title}</motion.h2>
        {slide.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className={`text-[36px] ${colors.accent} mb-6`}
          >{slide.subtitle}</motion.p>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="max-w-[60%]"
        >
          <ContentBlock content={slide.content} accent={colors.accent} />
        </motion.div>
      </div>
    </div>
  );
};

/* ==================== COMPARISON — side-by-side split ==================== */
export const ComparisonSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const bg = getSlideBg(slide, colors);
  const hex = accentHex[slide.section_name] || accentHex.brand;

  // Split content by "VS" or "---"
  const parts = slide.content.split(/\n(?:VS|vs|---)\n/);
  const leftContent = parts[0] || "";
  const rightContent = parts[1] || "";

  return (
    <div className={`w-full h-full ${bg.className} flex flex-col`} style={bg.style}>
      <div className="px-16 pt-12 pb-6">
        <SlideHeader slide={slide} colors={colors} />
      </div>
      <div className="flex-1 flex gap-0 px-16 pb-12">
        {/* Left side */}
        <div className="flex-1 rounded-l-2xl p-8 border border-white/10 relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${hex}12, ${hex}04)` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: hex }} />
          <ContentBlock content={leftContent} accent={colors.accent} />
        </div>
        {/* Divider */}
        <div className="w-[2px] bg-white/10 flex items-center justify-center relative">
          <span className="absolute bg-[#1a1a2e] border border-white/20 text-white/50 text-[20px] font-bold px-3 py-1 rounded-full">VS</span>
        </div>
        {/* Right side */}
        <div className="flex-1 rounded-r-2xl p-8 border border-white/10 relative overflow-hidden"
          style={{ background: `rgba(255,255,255,0.04)` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />
          <ContentBlock content={rightContent} accent="text-white/80" />
        </div>
      </div>
    </div>
  );
};

/* ==================== FUNNEL — marketing funnel ==================== */
export const FunnelSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hex = accentHex[slide.section_name] || accentHex.brand;
  const bg = getSlideBg(slide, colors);
  const lines = slide.content.split("\n").filter(l => l.trim());
  const steps: { label: string; value: string }[] = [];
  for (const line of lines) {
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/);
    if (bm) { steps.push({ label: bm[1], value: bm[2] }); continue; }
    const plain = line.trim();
    if (plain) steps.push({ label: plain, value: "" });
  }

  return (
    <div className={`w-full h-full ${bg.className} flex flex-col justify-center px-16 py-12`} style={bg.style}>
      <SlideHeader slide={slide} colors={colors} />
      <div className="flex-1 flex flex-col items-center justify-center gap-0 mt-4">
        {steps.slice(0, 6).map((step, i) => {
          const widthPct = 100 - (i * (60 / Math.max(steps.length - 1, 1)));
          const opacity = 1 - (i * 0.12);
          return (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="relative flex items-center justify-center py-4 rounded-xl text-center"
              style={{
                width: `${widthPct}%`,
                background: `linear-gradient(135deg, ${hex}${Math.round(opacity * 40).toString(16).padStart(2, '0')}, ${hex}${Math.round(opacity * 15).toString(16).padStart(2, '0')})`,
                borderBottom: i < steps.length - 1 ? `2px solid ${hex}20` : 'none',
              }}
            >
              <span className={`font-bold text-[28px] ${colors.accent}`}>{step.label}</span>
              {step.value && <span className="text-white/60 text-[24px] ml-3">{step.value}</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ==================== SWOT — 2x2 matrix ==================== */
export const SwotSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const bg = getSlideBg(slide, colors);
  const sections = slide.content.split(/\n(?:---)\n|\n\n/).filter(s => s.trim());
  const quadrants = [
    { title: "Strengths", color: "#34d399", icon: "💪" },
    { title: "Weaknesses", color: "#fb923c", icon: "⚠️" },
    { title: "Opportunities", color: "#38bdf8", icon: "🚀" },
    { title: "Threats", color: "#f87171", icon: "🔥" },
  ];

  return (
    <div className={`w-full h-full ${bg.className} flex flex-col px-16 py-12`} style={bg.style}>
      <SlideHeader slide={slide} colors={colors} />
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 mt-4">
        {quadrants.map((q, i) => {
          const sectionContent = sections[i] || "";
          const items = sectionContent.split("\n").filter(l => l.trim() && !l.startsWith("**"));
          return (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="rounded-2xl p-6 border border-white/10 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${q.color}12, ${q.color}04)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: q.color }} />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[28px]">{q.icon}</span>
                <h3 className="font-bold text-[28px]" style={{ color: q.color }}>{q.title}</h3>
              </div>
              <div className="space-y-2">
                {items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-[20px] mt-0.5" style={{ color: q.color }}>•</span>
                    <span className="text-white/70 text-[22px] leading-relaxed">{item.replace(/^[\*\-]\s*/, "")}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ==================== PROCESS — step-by-step flow ==================== */
export const ProcessSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hex = accentHex[slide.section_name] || accentHex.brand;
  const bg = getSlideBg(slide, colors);
  const lines = slide.content.split("\n").filter(l => l.trim());
  const steps: { title: string; desc: string; emoji?: string }[] = [];
  for (const line of lines) {
    const nm = line.match(/^(\d+)[.)]\s*\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/);
    if (nm) { steps.push({ title: nm[2], desc: nm[3] }); continue; }
    const em = line.match(/^([^\w\s]+)\s*\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/u);
    if (em) { steps.push({ emoji: em[1], title: em[2], desc: em[3] }); continue; }
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/);
    if (bm) { steps.push({ title: bm[1], desc: bm[2] }); continue; }
  }

  return (
    <div className={`w-full h-full ${bg.className} flex flex-col justify-center px-16 py-12`} style={bg.style}>
      <SlideHeader slide={slide} colors={colors} />
      <div className="flex-1 flex items-center gap-2 mt-4">
        {steps.slice(0, 5).map((step, i) => (
          <React.Fragment key={i}>
            <motion.div custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="flex-1 rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden"
              style={{ background: `linear-gradient(180deg, ${hex}12, ${hex}04)` }}
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center mx-auto mb-3 text-[22px] font-bold"
                style={{ background: hex, color: "#fff" }}
              >
                {step.emoji || (i + 1)}
              </div>
              <h4 className={`font-bold text-[26px] ${colors.accent} mb-2`}>{step.title}</h4>
              <p className="text-white/60 text-[20px] leading-snug">{step.desc}</p>
            </motion.div>
            {i < steps.length - 1 && i < 4 && (
              <motion.div custom={i} variants={fadeIn} initial="hidden" animate="visible"
                className="text-[32px] flex-shrink-0" style={{ color: hex }}
              >→</motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ==================== TEAM — member grid ==================== */
export const TeamSlide = ({ slide }: { slide: SlideData }) => {
  const colors = sectionColors[slide.section_name] || sectionColors.brand;
  const hex = accentHex[slide.section_name] || accentHex.brand;
  const bg = getSlideBg(slide, colors);
  const lines = slide.content.split("\n").filter(l => l.trim());
  const members: { name: string; role: string; emoji?: string }[] = [];
  for (const line of lines) {
    const em = line.match(/^([^\w\s]+)\s*\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/u);
    if (em) { members.push({ emoji: em[1], name: em[2], role: em[3] }); continue; }
    const bm = line.match(/^\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)/);
    if (bm) { members.push({ name: bm[1], role: bm[2] }); continue; }
  }

  const cols = members.length <= 3 ? "grid-cols-3" : members.length <= 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className={`w-full h-full ${bg.className} flex flex-col justify-center px-16 py-12`} style={bg.style}>
      <SlideHeader slide={slide} colors={colors} />
      {members.length > 0 ? (
        <div className={`grid ${cols} gap-6 mt-4 flex-1 items-center`}>
          {members.slice(0, 6).map((m, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="visible"
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10"
              style={{ background: `linear-gradient(180deg, ${hex}08, transparent)` }}
            >
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-[44px] mb-4"
                style={{ background: `${hex}20`, border: `3px solid ${hex}` }}
              >
                {m.emoji || "👤"}
              </div>
              <h4 className={`font-bold text-[28px] ${colors.accent}`}>{m.name}</h4>
              <p className="text-white/60 text-[22px] mt-1">{m.role}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <ContentBlock content={slide.content} accent={colors.accent} />
      )}
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
  "image-full": ImageFullSlide,
  comparison: ComparisonSlide,
  funnel: FunnelSlide,
  swot: SwotSlide,
  process: ProcessSlide,
  team: TeamSlide,
};

export const SlideRenderer = ({ slide }: { slide: SlideData }) => {
  const Layout = layoutMap[slide.layout] || TwoColumnSlide;
  return <Layout slide={slide} />;
};

export default SlideRenderer;
