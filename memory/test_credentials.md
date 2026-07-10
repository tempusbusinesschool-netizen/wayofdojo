# WayofDojo - Test Credentials

## Comptes de test (Preview Emergent)

### Mode Adulte - Admin
- **Email**: admin@wayofdojo.com
- **Password**: admin123
- **Profil**: samourai_confirme
- **Rôle**: super_admin

### Mode Adulte - Standard
- **Email**: adulte@wayofdojo.fr
- **Password**: 123456
- **Profil**: samourai_confirme
- **Grade**: 3e Kyu

### Mode Enfant - Gratuit
- **Email**: gratuit@wayofdojo.com
- **Password**: gratuit123
- **Profil**: jeune_samourai

### Mode Enfant - Standard
- **Email**: enfant@wayofdojo.fr
- **Password**: 123456
- **Profil**: jeune_samourai
- **Grade**: 6e Kyu

## Comptes Club (Espace Gestion)

### Club Admin Test
- **Email**: admin-test@aikido-lyon.fr
- **Password**: club123
- **Dojo**: Aikido Lyon Test
- **Ville**: Lyon

## URLs de Test

### Preview (Développement)
- **Base URL**: https://gamified-build-1.preview.emergentagent.com/fr
- Dashboard Adulte: /fr/aikido/dojo
- Dashboard Enfant: /fr/aikido/dojo (avec profil jeune_samourai)
- Techniques: /fr/aikido/techniques
- Ceintures: /fr/aikido/ceintures
- Dojo Virtuel: /fr/aikido/dojo-virtuel
- Login: /fr/aikido/login
- Register: /fr/aikido/register
- **Espace Gestion (Clubs)**: /fr/club-login

### Production (Vercel)
- **Base URL**: https://www.wayofdojo.fr/fr
- ⚠️ Note: La production nécessite une configuration MongoDB Atlas avec IP whitelist ouvert (0.0.0.0/0)

## Notes importantes
- Les comptes preview fonctionnent uniquement sur l'environnement Emergent
- Pour la production Vercel, il faut configurer une base MongoDB Atlas séparée avec les IPs autorisées
- L'Espace Gestion permet aux clubs d'Aïkido de s'inscrire et gérer leur club
