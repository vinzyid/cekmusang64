import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Apa itu CekMusang64.id?',
      a: 'CekMusang64.id adalah platform berbasis komunitas tempat kolektor diecast di Indonesia dapat membagikan dan mencari rekam jejak transaksi yang bermasalah, guna mencegah terjadinya penipuan.'
    },
    {
      q: 'Apakah semua laporan yang masuk akan langsung dipublikasikan?',
      a: 'Tidak. Setiap laporan yang masuk akan melalui proses moderasi (Pending Review). Admin kami akan mengecek kelengkapan dan keabsahan bukti (screenshot chat, resi palsu, bukti transfer, dll) sebelum menampilkannya di database publik.'
    },
    {
      q: 'Apakah web ini melabeli seseorang sebagai "Penipu"?',
      a: 'Tidak. Sesuai kebijakan kami, kami tidak melabeli siapapun sebagai penipu. Kami hanya menampilkan fakta bahwa ada laporan masalah pengiriman barang atau transfer pada transaksi yang melibatkan pihak tersebut.'
    },
    {
      q: 'Bagaimana jika nama saya dilaporkan tapi itu adalah kesalahpahaman?',
      a: 'Anda dapat menggunakan fitur "Ajukan Banding" atau menghubungi admin kami melalui email contact@cekmusang64.id dengan melampirkan bukti bahwa masalah transaksi tersebut telah diselesaikan (misalnya: barang akhirnya dikirim, atau uang telah di-refund). Jika terbukti selesai, status laporan akan diubah atau diturunkan.'
    },
    {
      q: 'Bukti apa saja yang harus disiapkan sebelum melaporkan?',
      a: 'Anda wajib melampirkan minimal: (1) Screenshot percakapan lengkap yang menunjukkan indikasi masalah, (2) Bukti transfer bank/e-wallet, (3) Link profil pelaku jika ada. Semakin lengkap bukti Anda, semakin cepat laporan diverifikasi.'
    },
    {
      q: 'Apakah layanan ini berbayar?',
      a: 'Tidak, CekMusang64.id 100% gratis untuk seluruh komunitas diecast Indonesia.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Pertanyaan yang Sering Diajukan</h1>
        <p className="text-muted-foreground">
          Temukan jawaban untuk pertanyaan umum seputar platform CekMusang64.id
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-semibold mb-3 flex items-start gap-3">
                <span className="text-primary font-bold">Q:</span>
                {faq.q}
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-7">
                <span className="text-foreground font-medium hidden">A: </span>
                {faq.a}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center bg-secondary/50 p-8 rounded-2xl">
        <h3 className="text-xl font-heading font-bold mb-2">Masih punya pertanyaan?</h3>
        <p className="text-muted-foreground mb-6">Tim admin kami siap membantu Anda.</p>
        <a href="mailto:admin@cekmusang64.id" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
