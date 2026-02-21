import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SlideViewer } from "@/components/slides/SlideViewer";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectPresentation = () => {
  const { data: slides, isLoading, error } = useQuery({
    queryKey: ["project-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_slides")
        .select("*")
        .order("slide_order");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        <p className="text-white/50">Đang tải slide thuyết trình...</p>
      </div>
    );
  }

  if (error || !slides?.length) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-lg">
          {error ? "Lỗi tải dữ liệu" : "Chưa có slide nào. Vui lòng tạo slides từ trang quản trị."}
        </p>
        <Link to="/" className="text-orange-400 hover:text-orange-300 underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  return <SlideViewer slides={slides} />;
};

export default ProjectPresentation;
