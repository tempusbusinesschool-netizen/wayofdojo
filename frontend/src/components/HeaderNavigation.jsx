import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, LogIn, Building2, GraduationCap, Settings, 
  ChevronDown, User, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeaderNavigation = ({ 
  isAuthenticated,
  user,
  onLogout,
  onRegisterUser,
  onRegisterDojo,
  onLoginUser,
  onLoginEnseignant,
  onLoginParent,
  onAdminAccess,
  isAdmin,
  isAdminMode
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (isAuthenticated) {
    return null; // Géré ailleurs quand connecté
  }

  return (
    <div ref={menuRef} className="flex items-center gap-2">
      {/* Créer un compte */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleMenu('register')}
          className="border-amber-600 text-amber-400 hover:bg-amber-900/30 h-8 px-3 text-sm"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Créer un compte</span>
          <span className="sm:hidden">Inscription</span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${openMenu === 'register' ? 'rotate-180' : ''}`} />
        </Button>
        
        {openMenu === 'register' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => { onRegisterUser(); setOpenMenu(null); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-amber-900/30 transition-colors"
            >
              <User className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-medium">Inscription Adhérent</div>
                <div className="text-xs text-slate-400">Compte personnel</div>
              </div>
            </button>
            <button
              onClick={() => { onRegisterDojo(); setOpenMenu(null); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-cyan-900/30 transition-colors border-t border-slate-700"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-medium">Inscription Club</div>
                <div className="text-xs text-slate-400">Espace de gestion club</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Se connecter */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleMenu('login')}
          className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/30 h-8 px-3 text-sm"
        >
          <LogIn className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Se connecter</span>
          <span className="sm:hidden">Connexion</span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${openMenu === 'login' ? 'rotate-180' : ''}`} />
        </Button>
        
        {openMenu === 'login' && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => { onLoginUser(); setOpenMenu(null); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-emerald-900/30 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-medium">Connexion Adhérent</div>
                <div className="text-xs text-slate-400">Accès espace personnel</div>
              </div>
            </button>
            <button
              onClick={() => { onLoginEnseignant(); setOpenMenu(null); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-amber-900/30 transition-colors border-t border-slate-700"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-medium">Connexion Enseignant</div>
                <div className="text-xs text-slate-400">Espace professeur</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Administration */}
      {!isAdmin && !isAdminMode && (
        <div className="relative hidden md:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu('admin')}
            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 px-3 text-sm"
          >
            <Settings className="w-4 h-4 mr-1" />
            <span>Administration</span>
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${openMenu === 'admin' ? 'rotate-180' : ''}`} />
          </Button>
          
          {openMenu === 'admin' && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => { onAdminAccess(); setOpenMenu(null); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-200 hover:bg-red-900/30 transition-colors"
              >
                <Lock className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-medium">Espace de gestion</div>
                  <div className="text-xs text-slate-400">Super Admin</div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderNavigation;
