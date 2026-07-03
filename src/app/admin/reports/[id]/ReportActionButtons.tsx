'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateReportStatus } from '@/app/actions/admin';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ReportActionButtons({ reportId, currentStatus }: { reportId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAction = (status: string) => {
    setErrorMsg('');
    startTransition(async () => {
      const result = await updateReportStatus(reportId, status);
      if (result.success) {
        router.refresh();
      } else {
        setErrorMsg(result.error || 'Terjadi kesalahan.');
      }
    });
  };

  if (currentStatus !== 'pending' && currentStatus !== 'revision') {
    return (
      <div className="p-4 bg-secondary/50 rounded-lg text-sm text-center text-muted-foreground">
        Laporan ini sudah diproses dan berstatus: <strong className="uppercase">{currentStatus}</strong>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="destructive" 
          className="flex-1" 
          onClick={() => handleAction('rejected')}
          disabled={isPending}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Tolak Laporan
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700" 
          onClick={() => handleAction('approved')}
          disabled={isPending}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Setujui Laporan
        </Button>
      </div>
    </div>
  );
}
