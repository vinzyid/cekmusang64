'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAdmin } from '@/app/actions/auth';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const result = await loginAdmin(null, formData);
      if (result?.error) {
        setErrorMsg(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan yang tidak terduga.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-heading font-bold">Admin CekMusang64</CardTitle>
          <CardDescription>
            Khusus pengurus. Masukkan kredensial Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm mb-4">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                {...register('email')} 
                placeholder="admin@cekmusang64.id" 
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                {...register('password')} 
                placeholder="••••••••" 
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk Dashboard'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
             <Link href="/" className="hover:text-primary transition-colors">Kembali ke Beranda</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
