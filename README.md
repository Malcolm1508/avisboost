# AvisBoost — carte NFC + réponses IA (multi-clients)

Un seul outil pour TOUS tes clients. Chaque commerçant a sa propre page grâce à son
identifiant dans l'URL. Ajouter un client = 20 secondes dans /admin, sans toucher au code.

## Ce que ça fait
- **/t/<id>** : l'adresse que tu programmes dans la carte NFC. Compte le tap, puis redirige vers la fiche Google du client.
- **/<id>** : le tableau de bord du commerçant (nb de scans + petit graphique + assistant IA pour répondre aux avis).
- **/admin** : ton espace privé pour créer un client (nom + lien Google) et récupérer ses 2 liens.

## Comment ça marche (le multi-client)
Il n'y a qu'UNE application. Le client est identifié par l'`id` dans l'URL
(`salon-marie`, `garage-dupont`…). Toutes ses données sont rangées dans la base
sous cet id. Donc : 1 client = 1 fiche en base. Pas de duplication de code.

---

## Installation (débutant, ~20 min)

### 1. Lancer en local
```bash
npm install
cp .env.example .env.local   # puis remplis les valeurs
npm run dev                  # ouvre http://localhost:3000
```

### 2. La base de données (gratuite)
Il faut un petit Redis pour stocker les clients + compter les taps.
- Le plus simple : sur Vercel, onglet **Storage → créer une base Upstash (KV/Redis)**.
- Copie les 2 valeurs fournies dans `.env.local` :
  - `REDIS_URL`   = l'URL "REST" de la base
  - `REDIS_TOKEN` = le token "REST" de la base

### 3. La clé IA
- Va sur console.anthropic.com, crée une clé, mets-la dans `ANTHROPIC_API_KEY`.

### 4. Choisis ton mot de passe admin
- `ADMIN_PASSWORD` = ce que tu veux (c'est ce qui protège /admin).

### 5. Mettre en ligne (Vercel, gratuit)
1. Pousse ce dossier sur un dépôt GitHub.
2. Sur vercel.com : **New Project → importe le dépôt**.
3. Dans **Settings → Environment Variables**, recopie les mêmes variables que ton `.env.local`
   (mets `PUBLIC_BASE_URL` = l'adresse finale, ex. `https://avisboost.vercel.app`).
4. Deploy. C'est en ligne.

---

## Utilisation quotidienne
1. Nouveau client signé → tu vas sur `/admin`, tu mets son nom + son lien Google.
2. Tu récupères les 2 liens affichés :
   - le **lien carte** → tu le programmes dans sa carte NFC (appli NFC Tools).
   - le **lien dashboard** → tu le donnes au commerçant (avec son PIN si tu en as mis un).
3. Fini. Le client suit ses scans et répond à ses avis tout seul.

## Bon à savoir
- Le modèle IA utilisé est `claude-haiku-4-5-20251001` (rapide et peu cher). Modifiable dans `app/api/respond/route.js`.
- Ne mets JAMAIS ta clé API ailleurs que dans les variables d'environnement.
- Rappel : on facilite les avis pour TOUS les clients, on ne filtre pas les mauvais (interdit par Google).
