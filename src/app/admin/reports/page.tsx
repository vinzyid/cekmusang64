import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { status: statusFilter } = await searchParams;
  
  // Verify admin access
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect('/auth/login');
  }

  // Fetch reports based on filter if any
  let query = supabase
    .from('reports')
    .select('id, reported_name, reporter_name, category, created_at, status')
    .order('created_at', { ascending: false });

  if (statusFilter && ['pending', 'approved', 'rejected', 'revision'].includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }

  const { data: reports, error } = await query;

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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold mb-1">Kelola Laporan</h1>
          <p className="text-sm text-muted-foreground">Review, setujui, atau tolak laporan pengguna.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Terlapor</TableHead>
              <TableHead>Pelapor</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!reports || reports.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada laporan ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reported_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{report.reporter_name}</TableCell>
                  <TableCell className="capitalize">{report.category?.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(report.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/reports/${report.id}`} className={buttonVariants({ variant: 'outline', size: 'sm', className: "h-8 px-2" })}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
