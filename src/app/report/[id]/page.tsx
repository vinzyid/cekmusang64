import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ShieldCheck, MessageCircle, Link as LinkIcon, Building, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  // Dummy data for presentation
  const report = {
    id: params.id,
    reportedName: 'Ahmad S.',
    status: 'approved',
    date: '12 Oktober 2023',
    marketplace: 'Tokopedia',
    transactionValue: 'Rp 1.500.000',
    category: 'Barang Tidak Dikirim',
    description: 'Saya membeli diecast Hot Wheels Super Treasure Hunt Datsun 510. Setelah transfer via BCA, seller tidak membalas chat dan keesokan harinya nomor saya diblokir.',
    facebookUrl: 'https://facebook.com/ahmads.diecast',
    whatsappNumber: '0812-XXXX-1234',
    bankAccount: 'BCA 123456789 A/N Ahmad',
    adminNotes: 'Bukti transfer valid. Seller tidak merespon saat dihubungi admin.',
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/search" className={buttonVariants({ variant: 'ghost', className: "mb-4" })}>
          ← Kembali ke Pencarian
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-heading font-bold">{report.reportedName}</h1>
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            Verified Report
          </Badge>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Dilaporkan pada {report.date}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Detail Kronologi</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kategori Masalah</p>
                  <p className="font-medium text-foreground">{report.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nilai Transaksi</p>
                  <p className="font-medium text-foreground">{report.transactionValue}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deskripsi Pelapor</p>
                <div className="bg-secondary/50 p-4 rounded-xl text-foreground text-sm leading-relaxed">
                  {report.description}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Bukti Lampiran</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((img) => (
                  <div key={img} className="aspect-square bg-secondary rounded-lg flex items-center justify-center border border-border cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-muted-foreground text-sm">Bukti {img}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {report.adminNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 text-blue-800">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold font-heading">Catatan Verifikasi Admin</h3>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">{report.adminNotes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Profile Info */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b bg-secondary/30">
              <CardTitle className="text-lg">Data Terlapor</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Building className="h-3.5 w-3.5" /> Rekening Bank
                </p>
                <p className="font-medium text-sm">{report.bankAccount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </p>
                <p className="font-medium text-sm">{report.whatsappNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <LinkIcon className="h-3.5 w-3.5" /> Link Facebook
                </p>
                <a href={report.facebookUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-primary hover:underline break-all">
                  {report.facebookUrl}
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Platform Transaksi
                </p>
                <p className="font-medium text-sm">{report.marketplace}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-sm bg-orange-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800 mb-1">Hati-hati Transaksi</h3>
              <p className="text-xs text-orange-700">Akun ini memiliki riwayat laporan terverifikasi. Sangat disarankan menggunakan Rekber.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
