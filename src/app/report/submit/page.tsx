'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, UploadCloud, CheckCircle2, X, FileImage, AlertCircle } from 'lucide-react';
import { submitAnonymousReport } from '@/app/actions/report';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reportSchema = z.object({
  reporterName: z.string().min(2, 'Nama pelapor wajib diisi'),
  reporterEmail: z.string().email('Email tidak valid'),
  reportedName: z.string().min(2, 'Nama terlapor wajib diisi'),
  facebookUrl: z.string().url('Format harus berupa link/URL Facebook yang valid').optional().or(z.literal('')),
  whatsappNumber: z.string().min(10, 'Nomor WA minimal 10 digit').optional().or(z.literal('')),
  bankAccount: z.string().min(5, 'Nomor rekening wajib diisi').optional().or(z.literal('')),
  marketplace: z.string().min(2, 'Pilih marketplace'),
  transactionValue: z.string().min(1, 'Nilai transaksi wajib diisi'),
  categoryId: z.string().min(1, 'Pilih kategori masalah'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  confirmTruth: z.boolean().refine((val) => val === true, {
    message: 'Anda harus mengkonfirmasi kebenaran laporan ini',
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function SubmitReportPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setEvidenceFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setEvidenceFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      marketplace: '',
      categoryId: '',
      confirmTruth: false,
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['reporterName', 'reporterEmail'];
    if (step === 2) fieldsToValidate = ['reportedName', 'facebookUrl', 'whatsappNumber', 'bankAccount'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === 'boolean' ? String(value) : value as string);
      });

      evidenceFiles.forEach((file, index) => {
        formData.append(`evidence_${index}`, file);
      });

      const result = await submitAnonymousReport(formData);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || 'Gagal mengirim laporan');
      }
    } catch (error) {
      setSubmitError('Terjadi kesalahan yang tidak terduga');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">Laporan Berhasil Dikirim</h1>
        <p className="text-muted-foreground mb-8">
          Terima kasih atas laporan Anda. Laporan ini sedang berstatus <strong>Pending Review</strong>.
          Admin kami akan segera memeriksa bukti yang Anda lampirkan sebelum dipublikasikan.
        </p>
        <Button onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Kirim Laporan Transaksi</h1>
        <p className="text-muted-foreground">Bantu komunitas dengan melaporkan transaksi yang bermasalah.</p>
      </div>

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-secondary -translate-y-1/2 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`h-10 w-10 rounded-full flex items-center justify-center relative z-10 font-bold border-4 ${
              step >= i ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-muted-foreground border-secondary'
            }`}
          >
            {i}
          </div>
        ))}
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">Informasi Pelapor</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Pelapor <span className="text-destructive">*</span></label>
                  <Input {...register('reporterName')} placeholder="Nama lengkap Anda" />
                  {errors.reporterName && <p className="text-sm text-destructive">{errors.reporterName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Pelapor <span className="text-destructive">*</span></label>
                  <Input {...register('reporterEmail')} type="email" placeholder="email@contoh.com" />
                  {errors.reporterEmail && <p className="text-sm text-destructive">{errors.reporterEmail.message}</p>}
                </div>
                
                <Button type="button" onClick={nextStep} className="w-full mt-6">Lanjut</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">Informasi Terlapor</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Terlapor <span className="text-destructive">*</span></label>
                  <Input {...register('reportedName')} placeholder="Nama pelaku/toko" />
                  {errors.reportedName && <p className="text-sm text-destructive">{errors.reportedName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor WhatsApp (Opsional)</label>
                    <Input {...register('whatsappNumber')} placeholder="0812xxxxxx" />
                    {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">No Rekening / E-Wallet (Opsional)</label>
                    <Input {...register('bankAccount')} placeholder="BCA / ShopeePay / Dana dll" />
                    {errors.bankAccount && <p className="text-sm text-destructive">{errors.bankAccount.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link Profil Facebook (Opsional)</label>
                  <Input {...register('facebookUrl')} placeholder="https://facebook.com/..." />
                  {errors.facebookUrl && <p className="text-sm text-destructive">{errors.facebookUrl.message}</p>}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Kembali</Button>
                  <Button type="button" onClick={nextStep} className="flex-1">Lanjut</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">Detail Transaksi</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Marketplace/Platform <span className="text-destructive">*</span></label>
                    <Select onValueChange={(val: string | null) => val && setValue('marketplace', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="tokopedia">Tokopedia</SelectItem>
                        <SelectItem value="shopee">Shopee</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Direct</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.marketplace && <p className="text-sm text-destructive">{errors.marketplace.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori Masalah <span className="text-destructive">*</span></label>
                    <Select onValueChange={(val: string | null) => val && setValue('categoryId', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Barang Tidak Dikirim</SelectItem>
                        <SelectItem value="2">Barang Tidak Sesuai</SelectItem>
                        <SelectItem value="3">Penipuan Transfer</SelectItem>
                        <SelectItem value="4">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nilai Kerugian (Rp) <span className="text-destructive">*</span></label>
                  <Input type="number" {...register('transactionValue')} placeholder="Misal: 500000" />
                  {errors.transactionValue && <p className="text-sm text-destructive">{errors.transactionValue.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi Kejadian <span className="text-destructive">*</span></label>
                  <Textarea 
                    {...register('description')} 
                    placeholder="Ceritakan kronologi kejadian secara detail..." 
                    className="h-32 resize-none"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">Kembali</Button>
                  <Button type="button" onClick={nextStep} className="flex-1">Lanjut</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-xl font-heading font-semibold border-b pb-2 mb-4">Upload Bukti & Konfirmasi</h2>
                
                {submitError && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm mb-4">
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}
                
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-1">Upload Bukti Transaksi</h3>
                  <p className="text-xs text-muted-foreground mb-4">Screenshot chat, bukti transfer, foto postingan, atau screenshot profil pelaku (Max 5MB)</p>
                  <Button variant="secondary" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>Pilih File</Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                />

                {evidenceFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">File Terpilih ({evidenceFiles.length}):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {evidenceFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg text-sm border border-border">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3">
                  <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-orange-900">
                    <p className="font-semibold mb-1">Penting!</p>
                    <p>Laporan palsu atau fitnah dapat berakibat pemblokiran akun Anda secara permanen dari platform ini.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="confirmTruth" className="h-4 w-4 rounded border-gray-300" {...register('confirmTruth')} />
                  <label htmlFor="confirmTruth" className="text-sm font-medium cursor-pointer">
                    Saya menyatakan bahwa laporan ini adalah benar dan dapat dipertanggungjawabkan.
                  </label>
                </div>
                {errors.confirmTruth && <p className="text-sm text-destructive">{errors.confirmTruth.message}</p>}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1" disabled={isSubmitting}>Kembali</Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                  </Button>
                </div>
              </div>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
