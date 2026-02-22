

# Nang Cap Chatbot Thanh Tro Ly Kinh Doanh FLYFIT

## Hien Trang
Chatbot hien tai chi la popup nho goc phai, khong luu lich su hoi thoai, khong co giao dien quan ly. Tat tab la mat het.

## Muc Tieu
1. Luu tru hoi thoai vao database (nhieu cuoc hoi thoai, moi cuoc co nhieu tin nhan)
2. Trang rieng `/ai-assistant` de xem, quan ly, tiep tuc hoi thoai cu
3. Giao dien truc quan de lap ke hoach kinh doanh tu ket qua chat

## Kien Truc Moi

```text
+---------------------------+
|   Trang /ai-assistant     |
|                           |
|  [Sidebar]    [Chat Area] |
|  - Hoi thoai 1  | Tin nhan|
|  - Hoi thoai 2  | ...     |
|  - Hoi thoai 3  | Input   |
|  + Tao moi      |         |
+---------------------------+
        |
        v
  [Database: chat_conversations + chat_messages]
        |
        v
  [Edge Function: project-chat (giu nguyen)]
```

## Chi Tiet Thuc Hien

### Buoc 1: Tao 2 bang database moi

**Bang `chat_conversations`:**
- id, user_id, title, created_at, updated_at
- RLS: chi user so huu moi doc/sua/xoa

**Bang `chat_messages`:**
- id, conversation_id (FK), role (user/assistant), content, created_at
- RLS: chi user so huu conversation moi doc/them

### Buoc 2: Tao trang `/ai-assistant`

Trang day du voi layout 2 cot:
- **Cot trai (sidebar)**: Danh sach hoi thoai, nut tao moi, nut xoa, hien thi tieu de + thoi gian
- **Cot phai (chat area)**: Hien thi tin nhan cua hoi thoai dang chon, input gui tin nhan moi, streaming AI response
- Tu dong dat tieu de hoi thoai = cau hoi dau tien (cat ngan)
- Responsive: tren mobile sidebar an/hien bang nut toggle

### Buoc 3: Cap nhat ProjectChatbot popup

- Giu popup chatbot hien tai nhung them nut "Mo trang day du" dan den `/ai-assistant`
- Popup van hoat dong doc lap (khong luu DB) de trai nghiem nhanh
- Trang `/ai-assistant` moi luu toan bo vao DB

### Buoc 4: Cap nhat App.tsx

- Them route `/ai-assistant` (protected - can dang nhap)

### Buoc 5: Cap nhat system prompt

- Bo sung huong dan AI ve vai tro tro ly kinh doanh: giup lap ke hoach, phan tich SWOT, to chuc y tuong, tao action items
- AI se tu dong format cau tra loi voi heading, bullet points, bang de de truc quan hoa

## Cac File Can Tao/Sua

| File | Hanh dong |
|---|---|
| Database migration | Tao 2 bang `chat_conversations` + `chat_messages` voi RLS |
| `src/pages/AIAssistant.tsx` | Trang moi: layout 2 cot, sidebar + chat area |
| `src/components/ui/ProjectChatbot.tsx` | Them nut "Mo trang day du" |
| `src/App.tsx` | Them route `/ai-assistant` (protected) |
| `supabase/functions/project-chat/index.ts` | Cap nhat system prompt them vai tro tro ly kinh doanh |

## Chi Tiet Ky Thuat

### Database Schema

```text
chat_conversations
  - id: uuid (PK)
  - user_id: uuid (FK auth.users, NOT NULL)
  - title: text (NOT NULL, default '')
  - created_at: timestamptz
  - updated_at: timestamptz

chat_messages
  - id: uuid (PK)
  - conversation_id: uuid (FK chat_conversations.id, ON DELETE CASCADE)
  - role: text (NOT NULL) -- 'user' | 'assistant'
  - content: text (NOT NULL)
  - created_at: timestamptz
```

### RLS Policies
- `chat_conversations`: SELECT/INSERT/UPDATE/DELETE chi khi `auth.uid() = user_id`
- `chat_messages`: SELECT/INSERT chi khi user so huu conversation (subquery check user_id)

### Giao Dien Trang AI Assistant
- Sidebar: min-w-[280px], scroll danh sach hoi thoai, nhom theo ngay (Hom nay / Hom qua / Truoc do)
- Chat area: flex-1, scroll messages, input fixed o duoi
- Header: tieu de hoi thoai + nut xoa
- Empty state: goi y cau hoi mau (VD: "Phan tich SWOT cho FLYFIT", "Lap ke hoach marketing Q2", "Tinh toan break-even")
- Style: dong bo voi brand FLYFIT (charcoal, terracotta, cream)

