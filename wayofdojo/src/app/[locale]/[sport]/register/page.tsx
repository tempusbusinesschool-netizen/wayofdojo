'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Swords, Star, ChevronRight, ChevronLeft, Check, 
  User, Mail, Lock, ArrowRight, Sparkles
} from 'lucide-react';
import { aikidoConfig } from '@/config/sports/aikido.config';

type Step = 'profile' | 'info' | 'sport' | 'complete';

interface FormData {
  profile: 'jeune_ninja' | 'ninja_confirme' | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [step, setStep] = useState<Step>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    profile: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '6e_kyu',
  });

  const steps: Step[] = ['profile', 'info', 'sport', 'complete'];
  const currentStepIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profile: formData.profile,
          sport: sport,
          grade: formData.grade,
          locale: locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Store token
      localStorage.setItem('wayofdojo_token', data.token);
      localStorage.setItem('wayofdojo_user', JSON.stringify(data.user));

      // Go to complete step
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 'profile':
        return formData.profile !== null;
      case 'info':
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.email.includes('@') &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword
        );
      case 'sport':
        return formData.grade !== '';
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Swords className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WayofDojo</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-colors ${
                i <= currentStepIndex ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Profile Selection */}
          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('profiles.chooseProfile')}
                </h1>
                <p className="text-slate-400">{t('profiles.canChangeLater')}</p>
              </div>

              <div className="grid gap-4">
                {/* Jeune Ninja */}
                <Card
                  className={`cursor-pointer transition-all ${
                    formData.profile === 'jeune_ninja'
                      ? 'border-amber-500 ring-2 ring-amber-500/50'
                      : 'hover:border-amber-500/50'
                  }`}
                  onClick={() => setFormData({ ...formData, profile: 'jeune_ninja' })}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                      <Star className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-400">
                        {t('profiles.jeuneNinja')}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {t('profiles.jeuneNinjaDesc')}
                      </p>
                    </div>
                    {formData.profile === 'jeune_ninja' && (
                      <Check className="w-6 h-6 text-amber-500" />
                    )}
                  </CardContent>
                </Card>

                {/* Ninja Confirmé */}
                <Card
                  className={`cursor-pointer transition-all ${
                    formData.profile === 'ninja_confirme'
                      ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                      : 'hover:border-cyan-500/50'
                  }`}
                  onClick={() => setFormData({ ...formData, profile: 'ninja_confirme' })}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Swords className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cyan-400">
                        {t('profiles.ninjaConfirme')}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {t('profiles.ninjaConfirmeDesc')}
                      </p>
                    </div>
                    {formData.profile === 'ninja_confirme' && (
                      <Check className="w-6 h-6 text-cyan-500" />
                    )}
                  </CardContent>
                </Card>
              </div>

              <Button
                className="w-full mt-6"
                variant="gradient"
                size="lg"
                disabled={!isStepValid()}
                onClick={handleNext}
              >
                {t('common.next')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Personal Info */}
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('auth.registerTitle')}</CardTitle>
                  <CardDescription>Créez votre compte WayofDojo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('auth.firstName')}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder={t('auth.firstName')}
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('auth.lastName')}</label>
                      <Input
                        placeholder={t('auth.lastName')}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

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
                      />
                    </div>
                    {formData.password && formData.password.length < 6 && (
                      <p className="text-xs text-amber-400">Minimum 6 caractères</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">{t('auth.confirmPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" onClick={handleBack}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {t('common.back')}
                </Button>
                <Button
                  className="flex-1"
                  variant="gradient"
                  size="lg"
                  disabled={!isStepValid()}
                  onClick={handleNext}
                >
                  {t('common.next')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Sport & Grade */}
          {step === 'sport' && (
            <motion.div
              key="sport"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Votre niveau en {aikidoConfig.name}</CardTitle>
                  <CardDescription>Sélectionnez votre grade actuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {aikidoConfig.grades.kyu.map((grade) => (
                      <button
                        key={grade.id}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.grade === grade.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-700 hover:border-slate-500'
                        }`}
                        onClick={() => setFormData({ ...formData, grade: grade.id })}
                      >
                        <div
                          className="w-6 h-6 rounded-full mb-2"
                          style={{ backgroundColor: grade.color, border: grade.color === '#FFFFFF' ? '2px solid #334155' : 'none' }}
                        />
                        <p className="font-semibold text-white">{grade.displayName}</p>
                        <p className="text-xs text-slate-400">{grade.name}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">Grades Dan</p>
                    <div className="grid grid-cols-3 gap-2">
                      {aikidoConfig.grades.dan.slice(0, 3).map((grade) => (
                        <button
                          key={grade.id}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formData.grade === grade.id
                              ? 'border-amber-500 bg-amber-500/10'
                              : 'border-slate-700 hover:border-slate-500'
                          }`}
                          onClick={() => setFormData({ ...formData, grade: grade.id })}
                        >
                          <p className="font-semibold text-white text-sm">{grade.displayName}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" onClick={handleBack}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {t('common.back')}
                </Button>
                <Button
                  className="flex-1"
                  variant="gradient"
                  size="lg"
                  disabled={!isStepValid() || loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                {t('common.welcome')}, {formData.firstName} !
              </h1>
              <p className="text-slate-400 mb-8">
                Votre compte a été créé avec succès. Bienvenue sur WayofDojo !
              </p>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">Badge débloqué !</p>
                        <p className="text-sm text-slate-400">Premiers pas</p>
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold">+10 XP</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={() => router.push(`/${locale}/${sport}/dojo`)}
              >
                Accéder à mon Dojo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login link */}
        {step !== 'complete' && (
          <p className="text-center text-slate-400 mt-6">
            {t('auth.hasAccount')}{' '}
            <Link href={`/${locale}/${sport}/login`} className="text-amber-400 hover:underline">
              {t('common.login')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
