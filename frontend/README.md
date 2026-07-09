# 🥋 WayofDojo - Plateforme de Gamification pour Arts Martiaux

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🚀 Déploiement sur Vercel

### Prérequis

1. **Compte Vercel** - [vercel.com](https://vercel.com)
2. **Compte MongoDB Atlas** - [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Nom de domaine** configuré (wayofdojo.humanknowledge.fr)

---

## 📦 Étape 1 : MongoDB Atlas (Base de données gratuite)

1. Créer un compte sur [MongoDB Atlas](https://mongodb.com/atlas)
2. Créer un **Cluster gratuit** (M0 Sandbox)
3. Dans "Database Access" → Créer un utilisateur
4. Dans "Network Access" → Ajouter `0.0.0.0/0` (permet l'accès depuis Vercel)
5. Cliquer sur "Connect" → "Connect your application"
6. Copier la chaîne de connexion :
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/wayofdojo
   ```

---

## 🔧 Étape 2 : Déployer sur Vercel

### Option A : Via GitHub (Recommandé)

1. Pusher le code sur GitHub
2. Sur Vercel → "New Project" → Importer depuis GitHub
3. Configurer les variables d'environnement (voir ci-dessous)
4. Déployer

### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd wayofdojo
vercel --prod
```

---

## 🔐 Étape 3 : Variables d'environnement (Vercel Dashboard)

Dans Vercel → Project → Settings → Environment Variables :

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/wayofdojo` |
| `NEXTAUTH_URL` | `https://wayofdojo.humanknowledge.fr` |
| `NEXTAUTH_SECRET` | `générer avec: openssl rand -base64 32` |

---

## 🌐 Étape 4 : Configurer le domaine

1. Vercel → Project → Settings → Domains
2. Ajouter : `wayofdojo.humanknowledge.fr`
3. Vercel affichera les instructions DNS

### Configuration DNS chez O2switch :

| Type | Nom | Valeur |
|------|-----|--------|
| CNAME | wayofdojo | cname.vercel-dns.com |

---

## ✅ Vérification

Après déploiement, tester :
- https://wayofdojo.humanknowledge.fr (Landing)
- https://wayofdojo.humanknowledge.fr/fr/aikido/register (Inscription)
- https://wayofdojo.humanknowledge.fr/fr/aikido/login (Connexion)

---

## 📁 Structure du projet

```
wayofdojo/
├── src/
│   ├── app/                 # Pages Next.js App Router
│   │   ├── [locale]/        # Routes internationalisées
│   │   └── api/             # API Routes
│   ├── components/          # Composants React
│   ├── config/sports/       # Configuration Aikido
│   ├── lib/                 # Utilitaires (DB, Auth)
│   ├── locales/             # Traductions FR/EN
│   └── types/               # Types TypeScript
├── public/                  # Assets statiques
├── vercel.json              # Config Vercel
└── package.json
```

---

## 🛠️ Développement local

```bash
# Installation
npm install

# Lancer en dev
npm run dev

# Build production
npm run build
```

---

**Fait avec ❤️ pour la communauté des arts martiaux**
