type SidebarTab = "dashboard" | "add-products" | "orders" | "products";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  return (
    <aside className="glass w-[280px] rounded-2xl p-4 h-fit sticky top-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-emerald-300">Authenticated</p>
      </div>
      <nav className="space-y-2">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "add-products", label: "Add Products" },
          { id: "orders", label: "Orders" },
          { id: "products", label: "Products" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id as SidebarTab)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              activeTab === item.id
                ? "bg-cyan-500 text-slate-950 font-semibold"
                : "border hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 w-full rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
      >
        Logout
      </button>
    </aside>
  );
}
