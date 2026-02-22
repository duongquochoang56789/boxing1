

# Chatbot AI Tro Ly Du An FLYFIT

## Kiem Tra Branding

Branding FLYFIT da hien thi dung:
- Logo "FLYFIT" (FLY mau charcoal + FIT mau terracotta) o Header va Footer
- Khong con "EliteFit" trong CMS database
- Noi dung hero: "Kien Tao Phien Ban / Uu Viet Cua Chinh Ban"
- Favicon SVG moi da duoc cap nhat

## Chatbot AI - Tro Ly Du An FLYFIT

### Muc tieu
Tao chatbot AI hieu toan bo du an FLYFIT - ca ky thuat lan kinh doanh - de ban co the hoi dap nhanh ve bat ky khia canh nao.

### Kien truc

```text
[Nut chat tren UI] --> [Chat Dialog] --> [Edge Function: project-chat]
                                              |
                                     [Lovable AI Gateway]
                                     (google/gemini-3-flash-preview)
                                              |
                                     [System Prompt chua toan bo
                                      kien thuc du an FLYFIT]
```

### System Prompt se bao gom

1. **Thuong hieu**: FLYFIT, slogan, tam nhin, su menh
2. **San pham**: FLY Class, FLY Zen, FLY Burn, FLY Fuel - chi tiet tung dich vu
3. **Mo hinh kinh doanh**: Hybrid 80% Online + 20% Offline, Small Group Virtual Training 5-7 nguoi
4. **Thi truong**: Quy mo, doi thu, loi the canh tranh, doi tuong muc tieu
5. **Tai chinh**: Bang gia 3 goi, Unit Economics, du bao doanh thu, cau truc chi phi
6. **Lo trinh**: Roadmap 2025-2028, doi ngu, ke hoach marketing
7. **Ky thuat**: React + Tailwind + Framer Motion, Lovable Cloud (database, auth, storage, edge functions), CMS dong tu bang site_content, 30 slide thuyet trinh tu bang project_slides, AI integration (Gemini) de tu dong tao noi dung va hinh anh

### Cac file can tao/sua

| File | Muc dich |
|---|---|
| `supabase/functions/project-chat/index.ts` | Edge function xu ly chat, goi Lovable AI Gateway voi system prompt day du |
| `src/components/ui/ProjectChatbot.tsx` | Component chatbot: nut mo, dialog chat, streaming tin nhan, ho tro markdown |
| `src/pages/Index.tsx` | Them component chatbot vao trang chu |
| `src/App.tsx` | Them chatbot vao layout chinh (hien thi tren moi trang) |
| `supabase/config.toml` | Them config cho edge function moi |

### Chi tiet ky thuat

**Edge Function `project-chat`:**
- Su dung Lovable AI Gateway (google/gemini-3-flash-preview)
- Streaming SSE de hien thi token-by-token
- System prompt ~2000 tu chua toan bo kien thuc du an (tu 30 slide + thong tin ky thuat)
- Xu ly loi 429/402

**Component Chatbot:**
- Nut tron goc duoi phai (thay the hoac dat ben canh nut Zalo hien tai)
- Dialog mo len voi giao dien chat
- Render markdown cho cau tra loi AI (su dung react-markdown - can cai dat)
- Luu lich su hoi thoai trong session (state React, khong can luu database)
- Animation mo/dong bang Framer Motion
- Responsive cho mobile

**Giao dien chatbot:**
- Header: "FLYFIT AI Assistant" voi logo
- Khung chat voi scroll
- Input + nut gui
- Hien thi streaming text khi AI dang tra loi
- Nut dong/thu nho

### Dependency moi
- `react-markdown` - de render markdown trong cau tra loi AI

