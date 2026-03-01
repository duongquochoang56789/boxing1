import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

const INDUSTRIES = [
  "Công nghệ", "Giáo dục", "Y tế & Sức khoẻ", "Thời trang", "F&B",
  "Bất động sản", "Tài chính", "Du lịch", "Thể thao & Fitness", "Sáng tạo & Nghệ thuật",
  "Thương mại điện tử", "Tư vấn", "Khác",
];

const STYLES = [
  "Tối giản (Minimalist)", "Sang trọng (Luxury)", "Hiện đại (Modern)",
  "Trẻ trung (Playful)", "Chuyên nghiệp (Corporate)", "Cổ điển (Classic)",
  "Táo bạo (Bold)", "Tự nhiên (Organic)",
];

interface BrandFormProps {
  onGenerate: (data: { name: string; industry: string; style: string; description: string }) => void;
  loading: boolean;
}

const BrandForm = ({ onGenerate, loading }: BrandFormProps) => {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onGenerate({ name: name.trim(), industry, style, description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-white/80 mb-1.5 block">Tên thương hiệu *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: FLYFIT, TechVN, GreenLeaf..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white/80 mb-1.5 block">Ngành nghề</label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Chọn ngành nghề..." />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-white/80 mb-1.5 block">Phong cách thiết kế</label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Chọn phong cách..." />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-white/80 mb-1.5 block">Mô tả thêm (tuỳ chọn)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả thêm về thương hiệu, đối tượng khách hàng, giá trị cốt lõi..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
        />
      </div>

      <Button type="submit" disabled={loading || !name.trim()} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? "Đang tạo Brand Kit..." : "Tạo Brand Kit bằng AI"}
      </Button>
    </form>
  );
};

export default BrandForm;
