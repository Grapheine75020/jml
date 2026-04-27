# JML - Typography Canvas Editor

JML est une application avancée de manipulation et de visualisation typographique basée sur Next.js. Elle permet d'éditer et de transformer des glyphes en temps réel via un moteur de rendu haute performance.

## Fonctionnalités clés

- **Slice Engine Custom** : Moteur de rendu spécialisé pour la manipulation géométrique des glyphes.
- **Éditeur Canvas Interactif** : Interface de dessin et d'édition pour visualiser les transformations typographiques.
- **Gestion de Polices Dynamique** : Chargement et analyse de fichiers de polices via OpenType.js.
- **Système de Cache de Glyphes** : Optimisation des performances grâce à une mise en cache intelligente des métriques et des tracés.
- **Interface Modulaire** : Panneaux de contrôle précis pour ajuster les directions, les espacements et les paramètres de rendu.
- **Architecture Robuste** : Utilisation de Zustand pour la gestion d'état et d'une bibliothèque de composants UI optimisée.

## Stack Technique

- **Framework** : Next.js (App Router)
- **Langage** : TypeScript
- **Rendu** : HTML5 Canvas / OpenType.js
- **État** : Zustand
- **UI** : Tailwind CSS / Radix UI / shadcn/ui
- **Tests** : Vitest

## Installation

```bash
npm install
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

## Tests

Pour exécuter la suite de tests unitaires :

```bash
npm test
```
