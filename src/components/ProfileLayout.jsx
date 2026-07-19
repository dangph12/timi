import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { User, Package, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/shadcn";

const sidebarLinks = [
  { to: "/ho-so", label: "Thông tin cá nhân", icon: User },
  { to: "/don-hang", label: "Đơn hàng của tôi", icon: Package },
];

export default function ProfileLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarContent = (
    <>
      <nav className="flex flex-col gap-1">
        {sidebarLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/ho-so"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-full">
      <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/30 p-4">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer — slides from left */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background shadow-xl flex flex-col p-4 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold">Tài khoản</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="lg:hidden border-b">
          <div className="px-4 py-2">
            <button
              onClick={() => setOpen(true)}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
