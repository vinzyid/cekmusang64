import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShieldCheck, 
  Image as ImageIcon, 
  Users, 
  Upload, 
  ClipboardCheck, 
  BadgeCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: latestReports } = await supabase
    .from('reports')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3);

  const reports = latestReports || [];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Cek Riwayat Laporan Transaksi <span className="text-primary">Sebelum Deal</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Cari berdasarkan nama, nomor WhatsApp, nomor rekening, atau link Facebook untuk mengetahui apakah terdapat laporan transaksi yang telah diverifikasi admin.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border flex flex-col sm:flex-row gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Cari nama, nomor WA, rekening, atau link Facebook..." 
                className="pl-12 border-0 shadow-none focus-visible:ring-0 text-base h-14"
              />
            </div>
            <Button size="lg" className="h-14 px-8 text-base rounded-xl w-full sm:w-auto">
              Cek Sekarang
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground max-w-2xl mx-auto bg-orange-50 text-orange-800 p-4 rounded-lg border border-orange-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-orange-500" />
            <p className="text-left">
              Data yang ditampilkan merupakan laporan yang telah melalui proses review admin. Tidak ditemukannya laporan bukan berarti akun tersebut dijamin aman. Tetap lakukan transaksi dengan hati-hati.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { label: 'Total Reports', value: '1,248', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Verified Reports', value: '856', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Pending Reviews', value: '42', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-heading font-bold text-foreground">{stat.value}</h3>
                    <p className="text-muted-foreground font-medium mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Fitur Platform</h2>
            <p className="text-muted-foreground">Platform ini dirancang khusus untuk memberikan keamanan dan kenyamanan bagi komunitas diecast Indonesia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: 'Verified Reports', desc: 'Setiap laporan diverifikasi secara manual oleh admin sebelum dipublikasikan.', icon: ShieldCheck },
              { title: 'Evidence Upload', desc: 'Dukung laporan Anda dengan bukti transfer, screenshot chat, dan lainnya.', icon: ImageIcon },
              { title: 'Fast Search', desc: 'Pencarian instan dan akurat berdasarkan berbagai parameter data.', icon: Search },
              { title: 'Community Protection', desc: 'Melindungi sesama kolektor dari transaksi yang merugikan.', icon: Users },
            ].map((feature, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6 md:p-8">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Bagaimana Cara Kerjanya?</h2>
            <p className="text-muted-foreground">Proses transparan untuk memastikan kualitas dan keakuratan setiap laporan yang masuk.</p>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 'Step 1', title: 'Submit Report', icon: Upload },
                { step: 'Step 2', title: 'Admin Reviews', icon: ClipboardCheck },
                { step: 'Step 3', title: 'Approved', icon: BadgeCheck },
                { step: 'Step 4', title: 'Available for Search', icon: Search },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-white p-4">
                  <div className="h-16 w-16 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="mb-3">{item.step}</Badge>
                  <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reports Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Laporan Terbaru</h2>
              <p className="text-muted-foreground">Laporan transaksi bermasalah yang baru saja diverifikasi oleh admin.</p>
            </div>
            <Link href="/search" className={buttonVariants({ variant: 'outline' })}>
              Lihat Semua Laporan
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Belum ada laporan terbaru saat ini.</p>
              </div>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-xl mb-1 truncate">{report.reported_name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 truncate text-capitalize">Kategori: {report.category?.replace(/_/g, ' ')}</p>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{report.marketplace}</span>
                        {report.transaction_amount && (
                          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                            Rp {report.transaction_amount.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      <Link href={`/report/${report.id}`} className={buttonVariants({ variant: 'secondary', className: "w-full" })}>
                        View Detail
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Abstract background shapes could go here */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Bantu Komunitas Tetap Aman</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Punya pengalaman buruk dengan seller atau buyer? Laporkan sekarang agar kolektor lain tidak menjadi korban selanjutnya.
          </p>
          <Link href="/report/submit" className={buttonVariants({ variant: 'secondary', size: 'lg', className: "h-14 px-8 text-base rounded-xl" })}>
            Kirim Laporan
          </Link>
        </div>
      </section>
    </div>
  );
}
