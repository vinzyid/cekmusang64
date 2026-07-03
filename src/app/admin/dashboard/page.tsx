import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck, ClipboardCheck, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Reports', value: '1,248', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Pending Reviews', value: '42', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Approved Reports', value: '856', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Total Users', value: '15.4k', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Budi S. submitted a new report against "Toko Maju"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
              Review Pending Reports (42)
            </button>
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
              Manage Categories
            </button>
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
              Add New Admin User
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
