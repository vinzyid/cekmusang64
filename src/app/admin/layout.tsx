import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, FileText, Users, Tag, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-lg text-primary">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-foreground font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <FileText size={18} />
            Reports
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Users size={18} />
            Users
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Tag size={18} />
            Categories
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-destructive hover:bg-red-50 font-medium transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 md:hidden">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-lg text-primary">Admin</span>
          </Link>
          <button className="text-muted-foreground">
            <LayoutDashboard size={24} />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
