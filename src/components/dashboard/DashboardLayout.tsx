import type { ReactNode } from "react";
import DashboardAutoRefresh from "./DashboardAutoRefresh";
import Sidebar, { type SidebarMenuItem } from "./Sidebar";
import Topbar from "./Topbar";

type DashboardLayoutProps = {
  children: ReactNode;
  menuItems: SidebarMenuItem[];
  userName: string;
  userRole: string;
  userAvatar: string;
  activeItem: string;
  dateLabel: string;
  panelTitle?: string;
  topbarActionLabel?: string;
};

export default function DashboardLayout({
  children,
  menuItems,
  userName,
  userRole,
  userAvatar,
  activeItem,
  panelTitle,
  topbarActionLabel,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-shell">
      <DashboardAutoRefresh />
      <Sidebar
        activeItem={activeItem}
        menuItems={menuItems}
      />
      <main className="dashboard-main">
        <Topbar
          actionLabel={topbarActionLabel}
          panelTitle={panelTitle}
          userAvatar={userAvatar}
          userName={userName}
          userRole={userRole}
        />
        {children}
      </main>
      <footer className="dashboard-footer">
        <span>Fortuna Vita Admin</span>
        <span>Dados atualizados automaticamente</span>
        <span>v1.0</span>
      </footer>
    </div>
  );
}
