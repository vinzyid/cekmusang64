import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, Calendar, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ReportActionButtons } from './ReportActionButtons';

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify admin access
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect('/auth/login');
  }

  // Fetch report
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !report) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Laporan Tidak Ditemukan</h2>
        <Link href="/admin/reports" className="text-primary hover:underline">Kembali ke Daftar Laporan</Link>
      </div>
    );
  }

  // Fetch evidence
  const { data: evidence } = await supabase
    .from('evidence')
    .select('*')
    .eq('report_id', id);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/reports" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Laporan
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold mb-1">Detail Laporan</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> 
              Dilaporkan pada {new Date(report.created_at).toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            {getStatusBadge(report.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Informasi Terlapor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nama / Akun Terlapor</p>
                  <p className="font-semibold">{report.reported_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kategori Laporan</p>
                  <p className="font-semibold capitalize">{report.category?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Platform / Marketplace</p>
                  <p className="font-semibold">{report.marketplace || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Kerugian</p>
                  <p className="font-semibold text-destructive">
                    {report.transaction_amount ? `Rp ${report.transaction_amount.toLocaleString('id-ID')}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nomor WhatsApp</p>
                  <p className="font-semibold">{report.whatsapp_number || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                  <p className="font-semibold">{report.bank_account || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Link Profil Facebook</p>
                  {report.facebook_url ? (
                    <a href={report.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {report.facebook_url}
                    </a>
                  ) : (
                    <p className="font-semibold">-</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Kronologi Kejadian</p>
                <div className="bg-secondary/30 p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed border border-border">
                  {report.description}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
              <CardTitle className="text-lg">Bukti Lampiran</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(!evidence || evidence.length === 0) ? (
                <p className="text-muted-foreground text-sm text-center py-4">Tidak ada lampiran bukti yang diunggah.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {evidence.map((ev, idx) => (
                    <a key={idx} href={ev.file_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-lg border border-border">
                      {ev.file_type?.startsWith('image/') ? (
                        <div className="aspect-square relative w-full overflow-hidden bg-secondary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={ev.file_url} 
                            alt={`Bukti ${idx + 1}`} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square flex flex-col items-center justify-center bg-secondary">
                          <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground px-2 text-center break-all">{ev.file_url.split('/').pop()}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-black px-3 py-1 rounded text-xs font-medium transition-opacity">
                          Buka Penuh
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
              <CardTitle className="text-lg">Informasi Pelapor</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nama</p>
                <p className="font-semibold">{report.reporter_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold break-all">{report.reporter_email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm border-t-4 border-t-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tindakan Admin</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ReportActionButtons reportId={report.id} currentStatus={report.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
