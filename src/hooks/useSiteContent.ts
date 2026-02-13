import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  section: string;
  content_type: string;
  key: string;
  value: string;
}

export const useSiteContent = (section: string) => {
  return useQuery({
    queryKey: ["site-content", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", section);

      if (error) throw error;
      
      const content: Record<string, string> = {};
      (data || []).forEach((item: SiteContent) => {
        content[`${item.content_type}:${item.key}`] = item.value;
      });
      return content;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

// Helper to get a value with fallback
export const getContent = (
  data: Record<string, string> | undefined,
  type: string,
  key: string,
  fallback: string
): string => {
  if (!data) return fallback;
  return data[`${type}:${key}`] || fallback;
};
