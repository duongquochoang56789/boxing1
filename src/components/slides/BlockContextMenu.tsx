import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ArrowDown, CopyPlus, Trash2, Plus } from "lucide-react";

interface BlockContextMenuProps {
  position: { x: number; y: number };
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddBelow: () => void;
  onClose: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BlockContextMenu: React.FC<BlockContextMenuProps> = ({
  position,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAddBelow,
  onClose,
  canMoveUp,
  canMoveDown,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
      document.addEventListener("keydown", keyHandler);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [onClose]);

  // Clamp so menu stays visible
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.min(position.y, window.innerHeight - 220),
    left: Math.min(position.x, window.innerWidth - 200),
    zIndex: 100000,
  };

  const items = [
    { icon: <ArrowUp className="w-3.5 h-3.5" />, label: "Di chuyển lên", action: onMoveUp, disabled: !canMoveUp },
    { icon: <ArrowDown className="w-3.5 h-3.5" />, label: "Di chuyển xuống", action: onMoveDown, disabled: !canMoveDown },
    { type: "separator" as const },
    { icon: <CopyPlus className="w-3.5 h-3.5" />, label: "Nhân đôi block", action: onDuplicate },
    { icon: <Plus className="w-3.5 h-3.5" />, label: "Thêm block mới", action: onAddBelow },
    { type: "separator" as const },
    { icon: <Trash2 className="w-3.5 h-3.5" />, label: "Xoá block", action: onDelete, danger: true },
  ];

  return createPortal(
    <div
      ref={ref}
      style={style}
      className="bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl py-1.5 min-w-[180px] select-none animate-in fade-in zoom-in-95 duration-150"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => {
        if ("type" in item && item.type === "separator") {
          return <div key={i} className="h-px bg-white/10 my-1 mx-2" />;
        }
        const { icon, label, action, disabled, danger } = item as any;
        return (
          <button
            key={i}
            onClick={() => { action?.(); onClose(); }}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2 text-[12px] transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
              danger
                ? "text-red-400/80 hover:bg-red-400/10 hover:text-red-400"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        );
      })}
    </div>,
    document.body
  );
};

export default BlockContextMenu;
