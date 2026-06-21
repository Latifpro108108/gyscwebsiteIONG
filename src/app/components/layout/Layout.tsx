import { Outlet } from "react-router";
import { ScrollToHash } from "@/app/components/ScrollToHash";
import { Footer } from "@/app/components/layout/Footer";
import { NavBar } from "@/app/components/layout/NavBar";
import { T } from "@/app/lib/theme";

export function Layout() {
  return (
    <div className="site-shell" style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: T.navy }}>
      <ScrollToHash />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
