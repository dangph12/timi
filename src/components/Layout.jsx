import { Outlet, useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";

export default function Layout() {
  const { pathname } = useLocation();
  const isDesignPage = pathname.startsWith("/thiet-ke");

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className={`flex-1 min-h-0${!isDesignPage ? ' overflow-y-auto' : ''}`}>
        <Outlet />
        {!isDesignPage && <Footer />}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
