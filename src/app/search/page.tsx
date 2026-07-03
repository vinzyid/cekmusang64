'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Search, ShieldCheck, FileQuestion, Filter } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]); // To be wired with Supabase

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    // Dummy logic for now
    if (searchQuery.toLowerCase().includes('ahmad')) {
      setResults([{ id: 1, name: 'Ahmad S.', category: 'Barang Tidak Dikirim', verified: true, date: '12 Okt 2023' }]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Cari Database Laporan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cari berdasarkan nama terlapor, nomor WhatsApp, nomor rekening, atau link profil Facebook.
        </p>
      </div>

      <Card className="mb-10 shadow-sm border-border">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan kata kunci pencarian..."
                className="pl-12 h-14 text-base bg-secondary/50 border-secondary focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 shrink-0">
              Cari Laporan
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold">
              Hasil Pencarian: <span className="text-primary">"{searchQuery}"</span>
            </h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-1">{result.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Kategori: {result.category}</p>
                    
                    <Link href={`/report/${result.id}`} className={buttonVariants({ variant: 'secondary', className: "w-full" })}>
                      Lihat Detail Laporan
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-2">Tidak ditemukan laporan</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Kami tidak menemukan laporan yang cocok dengan kata kunci tersebut.
              </p>
              <div className="bg-orange-50 text-orange-800 px-6 py-4 rounded-lg text-sm max-w-md mx-auto border border-orange-200">
                <p className="font-semibold mb-1">Peringatan:</p>
                Tidak ditemukannya laporan bukan berarti akun tersebut dijamin aman. Tetap lakukan transaksi dengan hati-hati.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
