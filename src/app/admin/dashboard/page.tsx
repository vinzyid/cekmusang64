import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck, ClipboardCheck, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts
  const { count: totalReports } = await supabase.from('reports').select('*', { count: 'exact', head: true });
  const { count: pendingReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: approvedReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'approved');

  // Fetch recent activity
  const { data: recentActivity } = await supabase
    .from('reports')
    .select('id, reported_name, reporter_name, created_at, status')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { title: 'Total Laporan', value: totalReports || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Perlu Direview', value: pendingReports || 0, icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Laporan Disetujui', value: approvedReports || 0, icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'Baru saja';
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Ringkasan Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <h3 className="text-2xl font-heading font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Laporan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!recentActivity || recentActivity.length === 0) ? (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
              ) : (
                recentActivity.map((report) => (
                  <div key={report.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        <span className="font-semibold">{report.reporter_name}</span> mengirim laporan baru tentang "{report.reported_name}"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{getTimeAgo(report.created_at)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          report.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          report.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              href="/admin/reports?status=pending"
              className="block w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
            >
              Review Laporan Pending ({pendingReports || 0})
            </Link>
            <Link 
              href="/admin/reports"
              className="block w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
            >
              Lihat Semua Laporan
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
