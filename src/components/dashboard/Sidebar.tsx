import type { ReactNode } from "react";

export type SidebarMenuItem = {
  label: string;
  icon: ReactNode;
  badge?: string;
  href?: string;
};

type SidebarProps = {
  menuItems: SidebarMenuItem[];
  activeItem: string;
};

export default function Sidebar({
  menuItems,
  activeItem,
}: SidebarProps) {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-menu" aria-label="Menu principal">
        {menuItems.map((item) => {
          const isActive = item.label === activeItem;

          return (
            <a
              className={`sidebar-menu-item${isActive ? " active" : ""}`}
              href={item.href ?? "#"}
              key={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-help">
          <div className="sidebar-help-brand" aria-label="SEO Partners" />
          <p>Suporte externo especializado</p>
          <a className="sidebar-help-button" href="mailto:suporte@seopartners.com.br">
            <i className="bi bi-headset" aria-hidden="true" />
            Acionar suporte
          </a>
        </div>
      </div>
    </aside>
  );
}
