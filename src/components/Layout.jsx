import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
