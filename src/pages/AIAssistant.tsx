import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bot, Plus, Trash2, Send, Menu, X, ArrowLeft, Sparkles, Moon, Sun, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import Logo from "@/components/ui/Logo";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type FontSize = "sm" | "base" | "lg";

const FONT_SIZE_MAP: Record<FontSize, { label: string; prose: string; input: string }> = {
  sm: { label: "Nhỏ", prose: "prose-sm", input: "text-xs" },
  base: { label: "Vừa", prose: "prose-base", input: "text-sm" },
  lg: { label: "Lớn", prose: "prose-lg", input: "text-base" },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-chat`;

const SUGGESTIONS = [
  "Phân tích SWOT cho FLYFIT",
  "Lập kế hoạch marketing Q2",
  "Tính toán break-even point",
  "Chiến lược giữ chân khách hàng",
];

function groupConversations(conversations: Conversation[]) {
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const older: Conversation[] = [];

  conversations.forEach((c) => {
    const d = new Date(c.updated_at);
    if (isToday(d)) today.push(c);
    else if (isYesterday(d)) yesterday.push(c);
    else older.push(c);
  });

  return { today, yesterday, older };
}

export default function AIAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dark mode state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("flyfit-ai-dark");
    return saved ? saved === "true" : false;
  });

  // Font size state
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem("flyfit-ai-fontsize");
    return (saved as FontSize) || "base";
  });

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("flyfit-ai-dark", String(isDark));
    return () => { document.documentElement.classList.remove("dark"); };
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("flyfit-ai-fontsize", fontSize);
  }, [fontSize]);

  const cycleFontSize = () => {
    const order: FontSize[] = ["sm", "base", "lg"];
    const idx = order.indexOf(fontSize);
    setFontSize(order[(idx + 1) % order.length]);
  };

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, [user]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Load messages when activeId changes
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, created_at: m.created_at })));
    })();
  }, [activeId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const createConversation = async (firstMessage: string) => {
    if (!user) return null;
    const title = firstMessage.slice(0, 60) + (firstMessage.length > 60 ? "..." : "");
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: user.id, title })
      .select()
      .single();
    if (error || !data) return null;
    setConversations((prev) => [data, ...prev]);
    setActiveId(data.id);
    return data.id;
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("chat_conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) { setActiveId(null); setMessages([]); }
  };

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);

    let convId = activeId;
    if (!convId) {
      convId = await createConversation(msg);
      if (!convId) { setLoading(false); return; }
    }

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    await supabase.from("chat_messages").insert({ conversation_id: convId, role: "user", content: msg });

    let soFar = "";
    const allMsgs = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMsgs.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok || !resp.body) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Lỗi kết nối AI. Vui lòng thử lại." }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              soFar += c;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && !last.id) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: soFar } : m));
                }
                return [...prev, { role: "assistant", content: soFar }];
              });
            }
          } catch {}
        }
      }

      if (soFar) {
        await supabase.from("chat_messages").insert({ conversation_id: convId, role: "assistant", content: soFar });
        await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Không thể kết nối AI. Vui lòng thử lại." }]);
    }

    setLoading(false);
  };

  const groups = groupConversations(conversations);
  const fs = FONT_SIZE_MAP[fontSize];

  const renderGroup = (label: string, items: Conversation[]) =>
    items.length > 0 && (
      <div key={label} className="mb-4">
        <p className="text-xs font-medium text-muted-foreground px-3 mb-1 uppercase tracking-wider">{label}</p>
        {items.map((c) => (
          <div
            key={c.id}
            onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
              activeId === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`}
          >
            <span className="flex-1 truncate">{c.title || "Hội thoại mới"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );

  return (
    <div className="h-screen flex bg-background transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col transition-transform lg:relative lg:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs font-medium text-muted-foreground">Trợ lý KD</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <Button
            onClick={() => { setActiveId(null); setMessages([]); setSidebarOpen(false); }}
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" /> Hội thoại mới
          </Button>
        </div>

        {/* Conversation list */}
        <ScrollArea className="flex-1 px-1">
          {renderGroup("Hôm nay", groups.today)}
          {renderGroup("Hôm qua", groups.yesterday)}
          {renderGroup("Trước đó", groups.older)}
          {conversations.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-8">Chưa có hội thoại nào</p>
          )}
        </ScrollArea>

        {/* Back */}
        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" /> Về Dashboard
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 rounded-md hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <Bot className="w-5 h-5 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate font-body">
              {activeId ? conversations.find((c) => c.id === activeId)?.title || "Hội thoại" : "FLYFIT Trợ Lý Kinh Doanh"}
            </h1>
            <p className="text-[10px] text-muted-foreground">Hỗ trợ lập kế hoạch, phân tích, chiến lược</p>
          </div>

          {/* Controls: font size + dark mode */}
          <div className="flex items-center gap-1">
            <button
              onClick={cycleFontSize}
              className="p-2 rounded-lg hover:bg-muted transition-colors group relative"
              title={`Cỡ chữ: ${fs.label}`}
            >
              <Type className="w-4 h-4" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {fontSize === "sm" ? "S" : fontSize === "base" ? "M" : "L"}
              </span>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={isDark ? "Chế độ sáng" : "Chế độ tối"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && !activeId && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="heading-subsection mb-2">Trợ Lý Kinh Doanh</h2>
              <p className={`${fs.input} text-muted-foreground mb-6`}>
                Tôi có thể giúp bạn phân tích SWOT, lập kế hoạch marketing, tính toán tài chính, và nhiều hơn nữa.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className={`text-left ${fs.input} px-4 py-3 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-colors`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${fs.input} ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className={`prose ${fs.prose} dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className={`bg-muted rounded-2xl px-4 py-3 ${fs.input} text-muted-foreground`}>Đang suy nghĩ...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 md:p-4 bg-background">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về chiến lược kinh doanh, marketing, tài chính..."
              className={`flex-1 bg-muted rounded-xl px-4 py-3 ${fs.input} outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground transition-colors`}
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} size="icon" className="rounded-xl h-11 w-11">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
