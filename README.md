# Graphic Tool JML

Outil de composition typographique directionnelle basé sur la charte graphique JML, développé pour permettre aux équipes Grapheine et JML Water Feature Design de créer facilement des compositions dans l'identité visuelle JML.

## Fonctionnement

1. Saisir un texte libre dans le canvas.
2. Cliquer sur une lettre pour la sélectionner.
3. Choisir une direction d'extension — haut, bas, gauche, droite.
4. Ajuster le nombre de tranches (1 à 3) et l'espacement (0 à 100 px).
5. Exporter en SVG vectoriel ou PNG 300 dpi fond transparent.

## Spécifications techniques

| Paramètre | Valeur |
|---|---|
| Police | Libre Franklin Medium 500 |
| Canvas | 1200 × 800 px |
| Export SVG | Paths vectoriels natifs — compatible Adobe Illustrator |
| Export PNG | 300 dpi, fond transparent |
| Navigateurs | Chrome, Safari, Edge — desktop ≥ 1280 px |

## Stack

- **Framework** : Next.js 15 (App Router) — React 19 — TypeScript
- **Rendu** : HTML5 Canvas 2D / OpenType.js
- **État** : Zustand
- **UI** : Tailwind CSS v4 / Radix UI / shadcn/ui
- **Thème** : next-themes (light / dark)

## Installation

```bash
npm install
npm run dev
```

## Crédits

- **Conception de l'identité visuelle JML** — [Grapheine](https://grapheine.com), agence de design graphique
- **Développement de l'outil** — Alessandro Capiluppi / [PicoDesign](https://picodesign.fr)
- **Client** — [JML Water Feature Design](https://jmlwaterfeaturedesign.com/fr)

## Licence

Voir [LICENSE](./LICENSE).
