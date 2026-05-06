# Graphic Tool JML

Outil de composition typographique directionnelle basé sur la charte graphique JML.  
Développé pour les équipes Grapheine et JML Water Feature Design.

![](.github/screenshot.png)

---

## Fonctionnement

**1. Saisir un texte** dans le canvas — police Libre Franklin 200 px, rendu vectoriel natif.

**2. Sélectionner une lettre** en cliquant dessus.

**3. Activer une ou plusieurs directions** — ↑ ↓ ← →  
Chaque bouton est un toggle indépendant. Plusieurs directions peuvent être actives simultanément sur la même lettre.

**4. Régler les slices**  
Ajuster le nombre de slices avec le slider (1 → 6). Espacement fixe à 10 px.

**5. Exporter** en SVG vectoriel (Illustrator-ready) ou PNG 300 dpi fond transparent.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 — App Router — React 19 |
| Langage | TypeScript |
| Rendu | HTML5 Canvas 2D + OpenType.js |
| État | Zustand |
| UI | shadcn/ui — Tailwind CSS v4 — Radix UI |
| Thème | next-themes (light / dark) |
| Déploiement | Statique — Vercel / intégration site existant |

---

## Démarrage

```bash
npm install
npm run dev
```

---

## Spécifications

| Paramètre | Valeur |
|-----------|--------|
| Police | Libre Franklin Medium 500 |
| Canvas | 1200 × 800 px |
| Directions | Jusqu'à 4 simultanées par lettre |
| Slices | Slider 1 → 6, espacement fixe 10 px |
| Export SVG | Paths vectoriels natifs |
| Export PNG | 300 dpi, fond transparent |
| Navigateurs | Chrome, Safari, Edge — desktop ≥ 1280 px |

---

## Déploiement

> **Application statique** — aucune dépendance serveur, aucune base de données. Tout le rendu s'effectue côté navigateur. L'outil peut être hébergé sur n'importe quel serveur web ou intégré directement dans un site existant.

### Vercel (solution actuelle)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/picodesign/jml)

Déploiement automatique à chaque push sur `main`. Gratuit (forfait Hobby). HTTPS inclus.

> **Limite Hobby** : ne supporte pas les repos d'une organisation GitHub — le repo doit être sur un compte personnel.

### Intégration dans un site existant

```bash
npm run build
# génère les fichiers dans .next/
```

Les fichiers produits peuvent être déposés sur n'importe quel hébergement web existant (Apache, Nginx, hébergement mutualisé…) et servis sous un sous-chemin au choix — ex. `jmlwaterfeaturedesign.com/outil`.

### Local

```bash
npm install && npm run build && npm run start
```

Accessible uniquement depuis le réseau local.

---

## Crédits

| Rôle | Intervenant |
|------|-------------|
| Conception identité visuelle JML | [Grapheine](https://grapheine.com) |
| Développement | Alessandro Capiluppi / [PicoDesign](https://picodesign.fr) |
| Client | [JML Water Feature Design](https://jmlwaterfeaturedesign.com/fr) |

---

## Licence

Usage interne — voir [LICENSE](./LICENSE).
