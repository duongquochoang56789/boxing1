import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image, Type, RefreshCw, Check, Zap, Eye, EyeOff, Pencil, X, Save, FileText } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsTab } from "@/components/admin/DocumentsTab";

interface SectionConfig {
  section: string;
  label: string;
  images: { key: string; prompt: string }[];
  textKeys: string[];
  textContext: string;
}

const sections: SectionConfig[] = [
  {
    section: "hero",
    label: "Hero Section",
    images: [
      { key: "background", prompt: "A stunning luxury gym interior with warm ambient lighting, modern equipment, high ceilings, wooden accents, minimalist design. Professional architectural photography, wide angle, warm tones, peach and terracotta color palette. Ultra high resolution, 16:9 aspect ratio." },
    ],
    textKeys: ["label", "heading_1", "heading_2", "description", "form_title", "form_description"],
    textContext: "Hero section: main landing area. label = small tag above heading, heading_1 + heading_2 = two-line big heading (heading_2 is the accent colored line), description = short subtitle, form_title = lead form heading, form_description = form subtitle",
  },
  {
    section: "about",
    label: "About Section",
    images: [
      { key: "feature_1", prompt: "A professional personal trainer coaching a client in a luxury gym, warm lighting, intimate setting, premium equipment visible. High quality fitness photography, warm peach tones. Ultra high resolution." },
      { key: "feature_2", prompt: "An energetic group fitness class in a modern bright studio, participants doing yoga or pilates, wooden floors, natural light. Professional photography, warm terracotta tones. Ultra high resolution." },
      { key: "feature_3", prompt: "Premium gym equipment in a spacious modern fitness center, dumbbells and machines arranged elegantly, warm ambient lighting. Architectural interior photography. Ultra high resolution." },
    ],
    textKeys: ["label", "heading_1", "heading_2", "description", "feature_1_title", "feature_1_desc", "feature_2_title", "feature_2_desc", "feature_3_title", "feature_3_desc"],
    textContext: "About section: studio introduction. label = section tag, heading = two parts (heading_2 has accent), description = paragraph about studio, feature_1/2/3 = three feature cards (personal training, group classes, premium space)",
  },
  {
    section: "gallery",
    label: "Gallery Section",
    images: [
      { key: "space_1", prompt: "Luxurious main gym floor with modern equipment, warm lighting, spacious layout, wooden and concrete accents. Interior photography. Ultra high resolution." },
      { key: "space_2", prompt: "Premium weight training area in upscale gym, organized dumbbells and barbells, warm ambient lighting. Interior fitness photography. Ultra high resolution." },
      { key: "space_3", prompt: "Modern cardio zone with treadmills and bikes, floor-to-ceiling windows, city view, warm lighting. Luxury gym interior. Ultra high resolution." },
      { key: "space_4", prompt: "Peaceful yoga studio with wooden floors, soft lighting, plants, minimalist decor. Wellness interior photography. Ultra high resolution." },
      { key: "space_5", prompt: "Personal training zone in luxury gym, functional training equipment, open space, warm tones. Fitness interior photography. Ultra high resolution." },
      { key: "space_6", prompt: "Premium gym lounge area with comfortable seating, juice bar, warm terracotta and wood accents. Luxury wellness interior. Ultra high resolution." },
    ],
    textKeys: ["label", "heading_1", "heading_2", "space_1_title", "space_1_desc", "space_2_title", "space_2_desc", "space_3_title", "space_3_desc", "space_4_title", "space_4_desc", "space_5_title", "space_5_desc", "space_6_title", "space_6_desc"],
    textContext: "Gallery section: 'Tour our Space'. label = section tag, heading = two parts. space_1-6 titles and descriptions for: main floor, weights, cardio, yoga, PT zone, lounge",
  },
  {
    section: "services",
    label: "Services Section",
    images: [
      { key: "service_1", prompt: "One-on-one personal training session, trainer and client, luxury gym setting, warm lighting. Professional fitness photography. Ultra high resolution." },
      { key: "service_2", prompt: "Dynamic group fitness class, energetic participants, modern studio, warm lighting. Professional fitness photography. Ultra high resolution." },
      { key: "service_3", prompt: "Strength training in premium gym, athlete lifting weights, dramatic warm lighting. Professional fitness photography. Ultra high resolution." },
      { key: "service_4", prompt: "Healthy meal preparation and nutrition coaching, fresh ingredients, clean modern kitchen, warm tones. Food and wellness photography. Ultra high resolution." },
    ],
    textKeys: ["label", "heading_1", "heading_2", "service_1_title", "service_1_desc", "service_2_title", "service_2_desc", "service_3_title", "service_3_desc", "service_4_title", "service_4_desc"],
    textContext: "Services section. label = section tag. heading in two parts. service_1 = Personal Training, service_2 = Group Fitness, service_3 = Strength Training, service_4 = Nutrition Coaching. Each has title and short description in Vietnamese.",
  },
  {
    section: "trainers",
    label: "Trainers Section",
    images: [
      { key: "trainer_1", prompt: "Professional male fitness trainer portrait, athletic build, confident pose, gym background blurred, warm lighting. Professional headshot photography, 3:4 portrait ratio. Ultra high resolution." },
      { key: "trainer_2", prompt: "Professional female yoga instructor portrait, calm confident pose, studio background, warm lighting. Professional headshot photography, 3:4 portrait ratio. Ultra high resolution." },
      { key: "trainer_3", prompt: "Professional male fitness coach portrait, muscular build, friendly expression, gym background, warm lighting. Professional headshot photography, 3:4 portrait ratio. Ultra high resolution." },
      { key: "trainer_4", prompt: "Professional female nutrition expert portrait, lab coat or athletic wear, friendly smile, clean background, warm lighting. Professional headshot photography, 3:4 portrait ratio. Ultra high resolution." },
    ],
    textKeys: ["label", "heading_1", "heading_2", "description", "trainer_1_name", "trainer_1_role", "trainer_1_specialty", "trainer_2_name", "trainer_2_role", "trainer_2_specialty", "trainer_3_name", "trainer_3_role", "trainer_3_specialty", "trainer_4_name", "trainer_4_role", "trainer_4_specialty"],
    textContext: "Trainers section. label = tag. heading two parts. description = intro about team. 4 trainers with Vietnamese names, role (e.g. Head Coach, Yoga Master), and specialty.",
  },
  {
    section: "testimonials",
    label: "Testimonials Section",
    images: [
      { key: "hero_member", prompt: "Happy Vietnamese woman in premium gym, athletic wear, confident smile, warm terracotta ambient lighting, bokeh background. Professional fitness lifestyle photography, 3:4 portrait ratio. Ultra high resolution." },
      { key: "member_1", prompt: "Portrait of a confident Vietnamese businesswoman, 30s, warm smile, professional headshot style, soft studio lighting. Ultra high resolution." },
      { key: "member_2", prompt: "Portrait of a Vietnamese man in his 30s, friendly professional expression, clean background, warm lighting. Headshot photography. Ultra high resolution." },
      { key: "member_3", prompt: "Portrait of a Vietnamese woman doctor, 35s, kind smile, clean white background, professional headshot. Ultra high resolution." },
      { key: "member_4", prompt: "Portrait of a young Vietnamese male athlete, confident pose, gym background, warm lighting. Professional headshot. Ultra high resolution." },
    ],
    textKeys: [
      "label", "heading_1", "heading_2", "stat_number", "stat_label",
      "t1_name", "t1_role", "t1_quote",
      "t2_name", "t2_role", "t2_quote",
      "t3_name", "t3_role", "t3_quote",
      "t4_name", "t4_role", "t4_quote",
    ],
    textContext: "Testimonials section. label = section tag (3-4 words). heading_1 + heading_2 = two-part heading. stat_number = satisfaction % (e.g. 98%). stat_label = short label. t1-t4 = 4 members with Vietnamese names, roles (e.g. Doanh nhân, Bác sĩ), and authentic short quotes (1-2 sentences) praising EliteFit gym.",
  },
];

// Inline editable text row
const EditableTextRow = ({
  item,
  onSaved,
}: {
  item: { id: string; key: string; value: string; section: string };
  onSaved: () => void;
}) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.value);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      // Auto-resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  const handleSave = async () => {
    if (value === item.value) { setEditing(false); return; }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .update({ value })
        .eq("id", item.id);
      if (error) throw error;
      toast({ title: "✓ Đã lưu", description: `${item.section}/${item.key}` });
      onSaved();
      setEditing(false);
    } catch (e: any) {
      toast({ title: "Lỗi lưu", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setValue(item.value); setEditing(false); }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
  };

  if (editing) {
    return (
      <div className="group rounded border border-terracotta/40 bg-cream/60 p-2">
        <div className="text-[10px] font-medium text-terracotta mb-1">{item.key}</div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={handleKeyDown}
          className="w-full text-xs text-charcoal bg-transparent resize-none outline-none leading-relaxed min-h-[32px]"
          rows={1}
        />
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 text-[10px] text-cream bg-terracotta px-2 py-0.5 rounded hover:bg-terracotta/90 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Save className="w-2.5 h-2.5" />}
            Lưu (Ctrl+Enter)
          </button>
          <button
            onClick={() => { setValue(item.value); setEditing(false); }}
            className="flex items-center gap-1 text-[10px] text-soft-brown px-2 py-0.5 rounded hover:bg-muted transition-colors"
          >
            <X className="w-2.5 h-2.5" /> Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex items-start gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-muted/60 transition-colors"
      onClick={() => setEditing(true)}
      title="Click để chỉnh sửa"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-medium text-soft-brown">{item.key}: </span>
        <span className="text-[10px] text-charcoal">{item.value}</span>
      </div>
      <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
    </div>
  );
};

const AdminContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, string>>({});
  const [generatingAll, setGeneratingAll] = useState(false);
  const [showExisting, setShowExisting] = useState<Record<string, boolean>>({});

  const { data: dbContent } = useQuery({
    queryKey: ["site-content-all"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*").order("section");
      return data || [];
    },
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
    sections.forEach((s) => queryClient.invalidateQueries({ queryKey: ["site-content", s.section] }));
  };

  const getDbCount = (section: string) => dbContent?.filter((d) => d.section === section).length ?? 0;
  const getDbImages = (section: string) => dbContent?.filter((d) => d.section === section && d.content_type === "image") ?? [];
  const getDbTexts = (section: string) => dbContent?.filter((d) => d.section === section && d.content_type === "text") ?? [];

  const generateImage = async (section: string, key: string, prompt: string) => {
    const id = `img:${section}:${key}`;
    setGenerating((prev) => ({ ...prev, [id]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", { body: { prompt, section, key } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults((prev) => ({ ...prev, [id]: data.url }));
      refreshAll();
      toast({ title: "✓ Ảnh tạo thành công", description: `${section}/${key}` });
    } catch (e: any) {
      toast({ title: "Lỗi tạo ảnh", description: e.message, variant: "destructive" });
    } finally {
      setGenerating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const generateText = async (config: SectionConfig) => {
    const id = `text:${config.section}`;
    setGenerating((prev) => ({ ...prev, [id]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("generate-text", {
        body: { section: config.section, keys: config.textKeys, context: config.textContext },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      refreshAll();
      toast({ title: "✓ Text tạo thành công", description: config.section });
    } catch (e: any) {
      toast({ title: "Lỗi tạo text", description: e.message, variant: "destructive" });
    } finally {
      setGenerating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const generateAllImages = async (config: SectionConfig) => {
    for (const img of config.images) await generateImage(config.section, img.key, img.prompt);
  };

  const generateAllSections = async () => {
    setGeneratingAll(true);
    toast({ title: "🚀 Bắt đầu generate toàn bộ content...", description: "Sẽ mất vài phút, hãy chờ đợi" });
    for (const config of sections) {
      await generateText(config);
      for (const img of config.images) await generateImage(config.section, img.key, img.prompt);
    }
    setGeneratingAll(false);
    toast({ title: "🎉 Hoàn thành!", description: "Tất cả content đã được tạo và lưu vào database" });
  };

  const totalDbItems = dbContent?.length ?? 0;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal">Quản lý Admin</h1>
            <p className="text-soft-brown mt-1">
              Tạo nội dung AI & quản lý tài liệu chiến lược
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
              <Eye className="w-4 h-4 mr-1.5" /> Xem Landing Page
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-8 h-11">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Content AI
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Tài Liệu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {/* Progress overview */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {sections.map((config) => {
                const count = getDbCount(config.section);
                const total = config.images.length + config.textKeys.length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={config.section} className="border border-border rounded-lg p-3 bg-cream/20 text-center">
                    <div className="text-xs font-medium text-charcoal mb-1">{config.label.replace(" Section", "")}</div>
                    <div className="text-2xl font-display font-bold text-terracotta">{pct}%</div>
                    <div className="text-[10px] text-soft-brown">{count}/{total}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mb-6">
              <Button
                onClick={generateAllSections}
                disabled={generatingAll}
                className="bg-terracotta hover:bg-terracotta/90 text-cream"
              >
                {generatingAll ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                {generatingAll ? "Đang generate tất cả..." : "Generate Toàn Bộ"}
              </Button>
            </div>
            <div className="space-y-6">
              {sections.map((config) => {
                const dbImages = getDbImages(config.section);
                const dbTexts = getDbTexts(config.section);
                const showEx = showExisting[config.section];

                return (
                  <div key={config.section} className="border border-border rounded-lg p-6 bg-cream/30">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-display font-semibold text-charcoal">{config.label}</h2>
                      <div className="flex gap-2">
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => setShowExisting((p) => ({ ...p, [config.section]: !showEx }))}
                          className="text-xs text-soft-brown"
                        >
                          {showEx ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                          DB ({getDbCount(config.section)})
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          onClick={() => { generateText(config); generateAllImages(config); }}
                          disabled={generatingAll || config.images.some((img) => generating[`img:${config.section}:${img.key}`]) || generating[`text:${config.section}`]}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Generate Section
                        </Button>
                      </div>
                    </div>

                    {/* Image Grid */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-soft-brown flex items-center gap-2">
                          <Image className="w-4 h-4" /> Hình ảnh ({config.images.length})
                        </h3>
                        <Button
                          size="sm" variant="outline"
                          onClick={() => generateAllImages(config)}
                          disabled={generatingAll || config.images.some((img) => generating[`img:${config.section}:${img.key}`])}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Tạo tất cả ảnh
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {config.images.map((img) => {
                          const id = `img:${config.section}:${img.key}`;
                          const isGen = generating[id];
                          const result = results[id] || dbImages.find((d) => d.key === img.key)?.value;
                          return (
                            <div key={img.key} className="relative">
                              <div className="aspect-video bg-muted rounded overflow-hidden flex items-center justify-center relative">
                                {result ? (
                                  <>
                                    <img src={result} alt={img.key} className="w-full h-full object-cover" />
                                    {isGen && (
                                      <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-cream" />
                                      </div>
                                    )}
                                  </>
                                ) : isGen ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                                    <span className="text-[10px] text-soft-brown">Đang tạo...</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">{img.key}</span>
                                )}
                              </div>
                              <Button
                                size="sm" variant="ghost"
                                className="mt-1 w-full text-xs"
                                onClick={() => generateImage(config.section, img.key, img.prompt)}
                                disabled={isGen}
                              >
                                {result && !isGen ? <Check className="w-3 h-3 mr-1 text-terracotta" /> : null}
                                {isGen ? "Đang tạo..." : result ? "Tạo lại" : "Tạo ảnh"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Text — inline editable */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-soft-brown flex items-center gap-2">
                          <Type className="w-4 h-4" /> Nội dung text ({config.textKeys.length} keys)
                          {dbTexts.length > 0 && (
                            <span className="text-[10px] text-terracotta/70 font-normal">· click để chỉnh sửa</span>
                          )}
                        </h3>
                        <Button
                          size="sm"
                          onClick={() => generateText(config)}
                          disabled={generatingAll || generating[`text:${config.section}`]}
                        >
                          {generating[`text:${config.section}`] ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : null}
                          {generating[`text:${config.section}`] ? "Đang tạo..." : "Tạo text"}
                        </Button>
                      </div>

                      {dbTexts.length > 0 ? (
                        <div className="border border-border/60 rounded-lg overflow-hidden divide-y divide-border/40">
                          {dbTexts.map((t) => (
                            <EditableTextRow
                              key={t.id}
                              item={{ id: t.id, key: t.key, value: t.value, section: t.section }}
                              onSaved={refreshAll}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic px-2">Chưa có text — nhấn "Tạo text" để generate bằng AI</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent;

