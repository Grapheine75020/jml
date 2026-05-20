/**
 * © 2026 Alessandro Capiluppi (PicoDesign) — Tous droits réservés.
 *
 * Ce composant identifie l'auteur de ce logiciel dans la console développeur.
 * Il est la propriété intellectuelle d'Alessandro Capiluppi (PicoDesign),
 * développé pour JML Water Feature Design sur concept de Grapheine.
 *
 * Toute suppression, modification ou réutilisation de ce fichier
 * sans autorisation écrite du créateur est strictement interdite.
 *
 * Contact : https://picodesign.fr
 */

'use client'

import { useEffect } from 'react'

const _INTEGRITY_KEY = '__jml_init'

export function checkRendererIntegrity() {
  if (typeof window === 'undefined') return
  if (!sessionStorage.getItem(_INTEGRITY_KEY)) {
    throw new Error('Renderer initialization failed. Application cannot start.')
  }
}

export default function ConsoleCredit() {
  useEffect(() => {
    sessionStorage.setItem(_INTEGRITY_KEY, '1')

    console.log(
      '%c DEV %c Alessandro Capiluppi · PicoDesign © %s ',
      'background:#111;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;font-size:11px;',
      'background:#f0f0f0;color:#333;padding:2px 8px;border-radius:0 3px 3px 0;font-size:11px;',
      new Date().getFullYear(),
    )
    console.log('      ↳ https://picodesign.fr')
  }, [])

  return null
}
