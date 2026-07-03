import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ShieldCheck, MessageCircle, Link as LinkIcon, Building, Calendar, AlertCircle, FileText, Phone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved') // Only show approved reports to public
    .single();

  if (error || !report) {
    notFound();
  }

  const { data: evidence } = await supabase
    .from('evidence')
    .select('*')
    .eq('report_id', id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/search" className={buttonVariants({ variant: 'ghost', className: "mb-4" })}>
          ← Kembali ke Pencarian
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-heading font-bold">{report.reported_name}</h1>
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            Verified Report
          </Badge>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Dilaporkan pada {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                  <p className="font-medium text-foreground capitalize">{report.category?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nilai Transaksi</p>
                  <p className="font-medium text-foreground">
                    {report.transaction_amount ? `Rp ${report.transaction_amount.toLocaleString('id-ID')}` : '-'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deskripsi Pelapor</p>
                <div className="bg-secondary/50 p-4 rounded-xl text-foreground text-sm leading-relaxed whitespace-pre-wrap">
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
              {(!evidence || evidence.length === 0) ? (
                <p className="text-muted-foreground text-sm py-4">Tidak ada lampiran bukti yang tersedia untuk publik.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {evidence.map((ev, idx) => (
                    <a key={idx} href={ev.file_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-lg border border-border aspect-square">
                      {ev.file_type?.startsWith('image/') ? (
                        <div className="w-full h-full bg-secondary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={ev.file_url} 
                            alt={`Bukti ${idx + 1}`} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-secondary">
                          <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground px-2 text-center break-all">{ev.file_url.split('/').pop()}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {report.admin_note && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 text-blue-800">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold font-heading">Catatan Verifikasi Admin</h3>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">{report.admin_note}</p>
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
                <p className="font-medium text-sm">{report.bank_account || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </p>
                <p className="font-medium text-sm">{report.whatsapp_number || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <LinkIcon className="h-3.5 w-3.5" /> Link Facebook
                </p>
                {report.facebook_url ? (
                  <a href={report.facebook_url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-primary hover:underline break-all">
                    {report.facebook_url}
                  </a>
                ) : (
                  <p className="font-medium text-sm">-</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Platform Transaksi
                </p>
                <p className="font-medium text-sm">{report.marketplace || '-'}</p>
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
          
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 text-center">
              <h3 className="font-semibold mb-2 text-sm">Merasa Laporan Ini Salah?</h3>
              <p className="text-xs text-muted-foreground mb-4">Jika Anda adalah pihak terlapor dan merasa laporan ini tidak benar, Anda bisa mengajukan banding.</p>
              <a 
                href={`https://wa.me/6281288882671?text=Halo%20Admin,%20saya%20ingin%20mengajukan%20banding%20terkait%20laporan%20dengan%20ID:%20${report.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={buttonVariants({ variant: 'outline', className: "w-full text-xs h-9 flex items-center justify-center gap-2" })}
              >
                <Phone className="h-3.5 w-3.5" />
                Ajukan Banding via WA
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
