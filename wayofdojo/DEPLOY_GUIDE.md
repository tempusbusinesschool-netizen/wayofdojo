# 🚀 GUIDE DE DÉPLOIEMENT - WayofDojo sur Vercel

## Récapitulatif des étapes

```
1. MongoDB Atlas (5 min) → Base de données gratuite
2. GitHub (2 min) → Héberger le code  
3. Vercel (5 min) → Déploiement automatique
4. O2switch (2 min) → Configuration DNS (déjà fait ?)
5. Vercel Domains (1 min) → Lier le domaine
```

---

## 📦 ÉTAPE 1 : MongoDB Atlas (Base de données)

### 1.1 Créer un compte
- Aller sur https://mongodb.com/atlas
- "Try Free" → Créer un compte (Google ou email)

### 1.2 Créer un Cluster
- Choisir "M0 Sandbox" (GRATUIT)
- Région : Paris (EU-WEST-3) ou proche
- Nom : `wayofdojo-cluster`
- Cliquer "Create"

### 1.3 Créer un utilisateur base de données
- Menu gauche → "Database Access"
- "Add New Database User"
  - Username : `wayofdojo_admin`
  - Password : (générer un mot de passe sécurisé, le noter !)
  - Rôle : "Atlas Admin"
- "Add User"

### 1.4 Autoriser les connexions
- Menu gauche → "Network Access"
- "Add IP Address"
- "Allow Access from Anywhere" → `0.0.0.0/0`
- "Confirm"

### 1.5 Obtenir la chaîne de connexion
- Menu gauche → "Database" → "Connect"
- "Connect your application"
- Copier l'URI :
```
mongodb+srv://wayofdojo_admin:VOTRE_MOT_DE_PASSE@wayofdojo-cluster.xxxxx.mongodb.net/wayofdojo?retryWrites=true&w=majority
```
⚠️ Remplacer `<password>` par votre vrai mot de passe !

---

## 📁 ÉTAPE 2 : GitHub Repository

### 2.1 Créer un repo GitHub
- Aller sur https://github.com/new
- Nom : `wayofdojo`
- Privé ou Public (au choix)
- Créer

### 2.2 Pusher le code
```bash
cd /app/wayofdojo
git init
git add .
git commit -m "Initial commit - WayofDojo v1.0"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/wayofdojo.git
git push -u origin main
```

---

## 🔧 ÉTAPE 3 : Vercel

### 3.1 Se connecter à Vercel
- Aller sur https://vercel.com
- "Continue with GitHub"

### 3.2 Importer le projet
- "Add New..." → "Project"
- Sélectionner le repo `wayofdojo`
- "Import"

### 3.3 Configurer le projet
- Framework : Next.js (auto-détecté)
- Root Directory : `.` (laisser par défaut)

### 3.4 Variables d'environnement
Cliquer "Environment Variables" et ajouter :

| NAME | VALUE |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://wayofdojo_admin:xxxxx@cluster.mongodb.net/wayofdojo` |
| `NEXTAUTH_URL` | `https://wayofdojo.humanknowledge.fr` |
| `NEXTAUTH_SECRET` | `8f3k2j4h5g6h7j8k9l0m1n2b3v4c5x6z7` ← générer le vôtre |

Pour générer NEXTAUTH_SECRET :
```bash
openssl rand -base64 32
```

### 3.5 Déployer
- Cliquer "Deploy"
- Attendre ~2 minutes
- ✅ Déploiement réussi !

---

## 🌐 ÉTAPE 4 : O2switch - Configuration DNS

### 4.1 Accéder au cPanel
- https://votrecompte.o2switch.net:2083
- Identifiants O2switch

### 4.2 Zone Editor
- Section "Domaines" → "Zone Editor"
- Sélectionner `humanknowledge.fr`
- "+ Ajouter un enregistrement"

### 4.3 Créer l'enregistrement CNAME
```
Type   : CNAME
Nom    : wayofdojo
TTL    : 14400
Cible  : cname.vercel-dns.com
```

- "Ajouter un enregistrement"

---

## 🔗 ÉTAPE 5 : Lier le domaine sur Vercel

### 5.1 Ajouter le domaine
- Vercel → Votre projet → "Settings" → "Domains"
- Entrer : `wayofdojo.humanknowledge.fr`
- "Add"

### 5.2 Vérification
- Vercel vérifie automatiquement le DNS
- Status : "Valid Configuration" ✅
- SSL : Automatique (Let's Encrypt)

---

## ✅ VÉRIFICATION FINALE

Après 5-15 minutes de propagation DNS, tester :

| Page | URL |
|------|-----|
| Landing | https://wayofdojo.humanknowledge.fr |
| Inscription | https://wayofdojo.humanknowledge.fr/fr/aikido/register |
| Connexion | https://wayofdojo.humanknowledge.fr/fr/aikido/login |
| Dojo | https://wayofdojo.humanknowledge.fr/fr/aikido/dojo |
| Techniques | https://wayofdojo.humanknowledge.fr/fr/aikido/techniques |
| Stages | https://wayofdojo.humanknowledge.fr/fr/aikido/stages |

---

## 🔄 Mises à jour futures

Chaque `git push` sur la branche `main` déclenche automatiquement un nouveau déploiement sur Vercel.

```bash
git add .
git commit -m "Nouvelle fonctionnalité"
git push
# → Déploiement automatique !
```

---

## 🆘 Dépannage

### Le site ne s'affiche pas
- Vérifier la propagation DNS : https://dnschecker.org/#CNAME/wayofdojo.humanknowledge.fr
- Attendre jusqu'à 24h (rare, généralement 15 min)

### Erreur 500
- Vercel → Project → "Deployments" → Dernier déploiement → "View Logs"
- Vérifier les variables d'environnement

### Base de données non connectée
- Vérifier l'URI MongoDB (mot de passe correct ?)
- Vérifier "Network Access" sur Atlas (0.0.0.0/0)

---

**🎉 Félicitations ! WayofDojo est en ligne !**
