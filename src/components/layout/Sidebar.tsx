import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";

export function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: "首页", path: "/", icon: "home" },
    { name: "GIS 驾驶舱", path: "/gis", icon: "hub" },
    { name: "区块链溯源", path: "/traceability", icon: "link" },
    { name: "VR 博物馆", path: "/vr", icon: "view_in_ar" },
    { name: "产品详情", path: "/product/1", icon: "qr_code_2" },
  ];

  return (
    <aside className="w-20 lg:w-64 border-r border-primary/30 bg-bg-dark flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 justify-center lg:justify-start">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-accent shrink-0">
          <span className="material-symbols-outlined">eco</span>
        </div>
        <span className="text-xl font-bold text-white hidden lg:block tracking-tight">乡土印迹</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary text-accent shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className={clsx("material-symbols-outlined text-2xl", isActive ? "fill-1" : "")}>
                {item.icon}
              </span>
              <span className="font-medium hidden lg:block">{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-accent rounded-full hidden lg:block shadow-[0_0_8px_#FFB703]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium hidden lg:block">退出登录</span>
        </Link>
      </div>
    </aside>
  );
}
