'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for presentation
  const reports = [
    { id: '1', reported: 'Ahmad S.', reporter: 'Budi (budi@gmail.com)', date: '12 Okt 2023', category: 'Barang Tidak Dikirim', status: 'pending' },
    { id: '2', reported: 'Toko Maju', reporter: 'Citra (citra@gmail.com)', date: '11 Okt 2023', category: 'Barang Tidak Sesuai', status: 'approved' },
    { id: '3', reported: '0812345678', reporter: 'Dedi (dedi@gmail.com)', date: '10 Okt 2023', category: 'Penipuan Transfer', status: 'rejected' },
  ];

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
          <h1 className="text-2xl font-heading font-bold mb-1">Manage Reports</h1>
          <p className="text-sm text-muted-foreground">Review, approve, or reject user reports.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Reported Entity</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.reported}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{report.reporter}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{report.date}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
