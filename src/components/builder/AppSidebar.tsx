import { Presentation, Palette, PlusCircle, Home, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", url: "/slides", icon: Presentation },
  { title: "Brand Kit", url: "/brand", icon: Palette },
  { title: "Tạo mới", url: "/slides/new", icon: PlusCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-[#0a0a0a]">
      <SidebarContent className="bg-[#0a0a0a]">
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Presentation className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">
              Slide<span className="text-indigo-400">AI</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/30 text-xs uppercase tracking-wider px-4">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                        isActive(item.url)
                          ? "bg-indigo-500/15 text-indigo-400 font-medium"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                      activeClassName=""
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#0a0a0a] border-t border-white/10 p-3 space-y-1">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-sm transition-all w-full ${collapsed ? "justify-center" : ""}`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Trang chủ</span>}
        </button>

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs truncate">
                {user?.user_metadata?.full_name || user?.email || "User"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="text-white/30 hover:text-red-400 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
