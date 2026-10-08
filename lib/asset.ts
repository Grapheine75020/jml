/**
 * Préfixe un chemin de `public/` avec le basePath de l'app.
 * Next.js n'ajoute pas le basePath aux `src` d'images ni aux fetch() écrits à la main.
 * Vide par défaut (Vercel, dev) ; `/jml` quand l'app est servie sous picodesign.fr/jml.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  return `${BASE_PATH}${path}`
}
