'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Swords, Mail, Lock, ArrowRight } from 'lucide-react';
import apiService from '@/services/api.service';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiService.login(formData.email, formData.password) as {
        success: boolean;
        token: string;
        user: Record<string, unknown>;
        error?: string;
      };

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      // Store token
      localStorage.setItem('wayofdojo_token', data.token);
      localStorage.setItem('wayofdojo_user', JSON.stringify(data.user));

      // Redirect to dojo
      router.push(`/${locale}/${sport}/dojo`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Swords className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WayofDojo</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
            <CardDescription>Connectez-vous à votre espace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="#" className="text-sm text-amber-400 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Connexion...' : t('common.login')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 mt-6">
          {t('auth.noAccount')}{' '}
          <Link href={`/${locale}/${sport}/register`} className="text-amber-400 hover:underline">
            {t('common.register')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
