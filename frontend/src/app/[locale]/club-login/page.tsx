'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2, LogIn, UserPlus, Lock, Mail, User, MapPin, Phone, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ClubLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'fr';
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    dojoName: '',
    city: '',
    address: '',
    email: '',
    phone: '',
    description: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/club/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Erreur de connexion');
      }
      
      // Store token and redirect
      localStorage.setItem('club_token', data.token);
      localStorage.setItem('club_dojo', JSON.stringify(data.dojo));
      toast.success('Connexion réussie !');
      router.push(`/${locale}/club-dashboard`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.adminPassword !== registerData.adminPasswordConfirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (registerData.adminPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/club/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dojo: {
            name: registerData.dojoName,
            city: registerData.city,
            address: registerData.address,
            email: registerData.email,
            phone: registerData.phone,
            description: registerData.description
          },
          admin: {
            firstName: registerData.adminFirstName,
            lastName: registerData.adminLastName,
            email: registerData.adminEmail,
            password: registerData.adminPassword
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Erreur lors de l\'inscription');
      }
      
      toast.success('Club créé avec succès ! Vous pouvez maintenant vous connecter.');
      setActiveTab('login');
      setLoginData({ email: registerData.adminEmail, password: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-10 h-10 text-amber-500" />
              <h1 className="text-3xl font-bold text-white">Espace Club</h1>
            </div>
          </Link>
          <p className="text-slate-400">Gérez votre club d'Aïkido</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscription
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <CardDescription className="text-slate-400 mb-6">
                  Connectez-vous à votre espace club
                </CardDescription>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-300">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email administrateur
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@votredojo.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Mot de passe
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <CardDescription className="text-slate-400 mb-6">
                  Inscrivez votre club d'Aïkido
                </CardDescription>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Dojo Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-500 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Informations du Club
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dojo-name" className="text-slate-300">Nom du Dojo *</Label>
                        <Input
                          id="dojo-name"
                          placeholder="Aïkido Lyon Centre"
                          value={registerData.dojoName}
                          onChange={(e) => setRegisterData({ ...registerData, dojoName: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-300">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Ville *
                        </Label>
                        <Input
                          id="city"
                          placeholder="Lyon"
                          value={registerData.city}
                          onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-slate-300">Adresse</Label>
                      <Input
                        id="address"
                        placeholder="123 rue de la Paix"
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dojo-email" className="text-slate-300">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email du club
                        </Label>
                        <Input
                          id="dojo-email"
                          type="email"
                          placeholder="contact@dojo.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-300">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Description
                      </Label>
                      <textarea
                        id="description"
                        placeholder="Présentez votre club..."
                        value={registerData.description}
                        onChange={(e) => setRegisterData({ ...registerData, description: e.target.value })}
                        className="w-full h-20 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  
                  {/* Admin Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-500 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Compte Administrateur
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-firstname" className="text-slate-300">Prénom *</Label>
                        <Input
                          id="admin-firstname"
                          placeholder="Jean"
                          value={registerData.adminFirstName}
                          onChange={(e) => setRegisterData({ ...registerData, adminFirstName: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-lastname" className="text-slate-300">Nom *</Label>
                        <Input
                          id="admin-lastname"
                          placeholder="Dupont"
                          value={registerData.adminLastName}
                          onChange={(e) => setRegisterData({ ...registerData, adminLastName: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-slate-300">Email administrateur *</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@votredojo.com"
                        value={registerData.adminEmail}
                        onChange={(e) => setRegisterData({ ...registerData, adminEmail: e.target.value })}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="text-slate-300">Mot de passe *</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.adminPassword}
                          onChange={(e) => setRegisterData({ ...registerData, adminPassword: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-password-confirm" className="text-slate-300">Confirmer *</Label>
                        <Input
                          id="admin-password-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.adminPasswordConfirm}
                          onChange={(e) => setRegisterData({ ...registerData, adminPasswordConfirm: e.target.value })}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Création en cours...' : 'Créer mon club'}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
