import { useState, useEffect, useCallback } from "react";

export interface SlideTemplate {
  id: string;
  name: string;
  layout: string;
  content: string;
  subtitle: string | null;
  section_name: string;
  background_color: string;
  notes: string | null;
  image_prompt: string | null;
  savedAt: string;
}

const STORAGE_KEY = "flyfit-slide-templates";

export const useSlideTemplates = () => {
  const [templates, setTemplates] = useState<SlideTemplate[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTemplates(JSON.parse(stored));
    } catch {}
  }, []);

  const saveTemplate = useCallback((name: string, slide: {
    layout: string;
    content: string;
    subtitle: string | null;
    section_name: string;
    background_color: string;
    notes: string | null;
    image_prompt: string | null;
  }) => {
    const template: SlideTemplate = {
      id: crypto.randomUUID(),
      name,
      ...slide,
      savedAt: new Date().toISOString(),
    };
    setTemplates(prev => {
      const updated = [template, ...prev].slice(0, 20); // max 20
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return template;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { templates, saveTemplate, deleteTemplate };
};
