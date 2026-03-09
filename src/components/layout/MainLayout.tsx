import { Sidebar } from "./Sidebar";
import { ChatWidget } from "../chat/ChatWidget";
import { Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-bg-dark text-white font-sans selection:bg-accent selection:text-primary">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden relative">
        <Outlet />
        <ChatWidget />
      </main>
    </div>
  );
}
