import PptxGenJS from "pptxgenjs";

interface SlideData {
  title: string;
  subtitle: string | null;
  content: string;
  layout: string;
  background_color: string;
  image_url: string | null;
  notes: string | null;
}

/** Convert hex color to PptxGenJS-friendly format (without #) */
const hexToRgb = (hex: string) => hex.replace("#", "");

/** Parse markdown-like content into plain text lines */
const parseContent = (content: string): string[] => {
  return content
    .split("\n")
    .map(line => line.replace(/\*\*/g, "").replace(/^[#]+\s*/, "").replace(/^[-•]\s*/, "• ").trim())
    .filter(l => l.length > 0);
};

export const exportToPptx = async (slides: SlideData[], deckTitle: string) => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches (widescreen 16:9)
  pptx.author = "FlyFit Slide Builder";
  pptx.title = deckTitle;

  for (const slideData of slides) {
    const pptSlide = pptx.addSlide();
    
    // Background
    pptSlide.background = { color: hexToRgb(slideData.background_color) };

    // Title
    if (slideData.title) {
      pptSlide.addText(slideData.title, {
        x: 0.8,
        y: 0.5,
        w: 11.5,
        h: 1.2,
        fontSize: 36,
        fontFace: "Arial",
        color: "FFFFFF",
        bold: true,
        align: "left",
        valign: "middle",
      });
    }

    // Subtitle
    if (slideData.subtitle) {
      pptSlide.addText(slideData.subtitle, {
        x: 0.8,
        y: 1.6,
        w: 11.5,
        h: 0.6,
        fontSize: 18,
        fontFace: "Arial",
        color: "CCCCCC",
        align: "left",
      });
    }

    // Content
    const contentLines = parseContent(slideData.content);
    if (contentLines.length > 0) {
      const startY = slideData.subtitle ? 2.5 : 2.0;
      const contentText = contentLines.join("\n");
      
      // If has image, split layout
      if (slideData.image_url) {
        pptSlide.addText(contentText, {
          x: 0.8,
          y: startY,
          w: 5.5,
          h: 4.5,
          fontSize: 14,
          fontFace: "Arial",
          color: "DDDDDD",
          align: "left",
          valign: "top",
          lineSpacingMultiple: 1.4,
        });

        // Add image on the right
        try {
          pptSlide.addImage({
            path: slideData.image_url,
            x: 7,
            y: startY,
            w: 5.5,
            h: 4.5,
            rounding: true,
          });
        } catch {
          // If image fails, add placeholder text
          pptSlide.addText("[Image]", {
            x: 7, y: startY, w: 5.5, h: 4.5,
            fontSize: 14, color: "666666", align: "center", valign: "middle",
          });
        }
      } else {
        pptSlide.addText(contentText, {
          x: 0.8,
          y: startY,
          w: 11.5,
          h: 4.5,
          fontSize: 16,
          fontFace: "Arial",
          color: "DDDDDD",
          align: "left",
          valign: "top",
          lineSpacingMultiple: 1.5,
        });
      }
    }

    // Notes
    if (slideData.notes) {
      pptSlide.addNotes(slideData.notes);
    }
  }

  await pptx.writeFile({ fileName: `${deckTitle || "slides"}.pptx` });
};
