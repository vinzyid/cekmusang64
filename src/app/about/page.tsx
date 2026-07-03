import { ShieldCheck, Users, Search, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Tentang CekMusang64.id</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Membangun ekosistem transaksi diecast yang lebih aman, transparan, dan terpercaya untuk seluruh kolektor di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-heading font-bold mb-4">Misi Kami</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Hobi mengoleksi diecast seharusnya menyenangkan, namun sayangnya semakin banyak oknum yang memanfaatkan komunitas untuk melakukan penipuan. CekMusang64.id lahir dari kepedulian terhadap para kolektor yang sering menjadi korban transaksi fiktif.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Misi kami sederhana: menyediakan pusat data riwayat transaksi bermasalah yang diverifikasi, sehingga setiap kolektor bisa melakukan pengecekan (*background check*) sebelum mentransfer uang.
          </p>
        </div>
        <div className="bg-secondary/50 p-8 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border shadow-sm border-none bg-white">
              <CardContent className="p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold">100% Verified</p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm border-none bg-white">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold">Komunitas</p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm border-none bg-white">
              <CardContent className="p-6 text-center">
                <Search className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold">Database</p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm border-none bg-white">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-heading font-bold">Real-time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-heading font-bold mb-8 text-center">Bagaimana Kami Bekerja</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Terima Laporan</h3>
              <p className="text-sm text-muted-foreground">
                Kolektor yang menjadi korban penipuan mengirimkan laporan lengkap dengan bukti transfer dan chat.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Verifikasi Admin</h3>
              <p className="text-sm text-muted-foreground">
                Tim admin kami mengecek validitas bukti. Kami tidak melabeli siapa pun sebagai penipu, hanya menampilkan fakta laporan.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Publikasi</h3>
              <p className="text-sm text-muted-foreground">
                Laporan yang valid akan masuk ke database publik agar bisa dicari oleh kolektor lain sebelum mereka bertransaksi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center mb-8">
        <h3 className="text-xl font-heading font-bold text-orange-900 mb-2">Penting untuk Diketahui</h3>
        <p className="text-orange-800 max-w-2xl mx-auto">
          Platform ini bersifat informasi historis. Adanya nama seseorang di dalam database ini adalah murni berdasarkan laporan riwayat transaksi bermasalah yang kami terima, bukan putusan hukum. Kami menyarankan untuk selalu menggunakan **Rekening Bersama (Rekber)** atau marketplace untuk keamanan transaksi Anda.
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-heading font-bold text-primary mb-2">Dukung Pengembang</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Platform ini dikembangkan dan dikelola secara mandiri untuk membantu komunitas. Jika Anda merasa terbantu dengan adanya CekMusang64.id, Anda bisa memberikan dukungan (*support*) kepada developer agar platform ini dapat terus beroperasi dan berkembang.
        </p>
        <a 
          href="https://tako.id/vinzy.id" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Dukung via Tako.id
        </a>
      </div>
    </div>
  );
}
