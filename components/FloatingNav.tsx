import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FloatingNav() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {/* Logo + label — cliquable, retour à l'outil */}
      <Link
        href="/"
        className="h-12 px-3 rounded-4xl border border-border bg-background/80 backdrop-blur-md shadow-sm flex items-center gap-2 shrink-0"
      >
        {/* Logo noir (light) */}
        <Image
          src="/logo-jml/SVG/Logo_JMLlogo-noir.svg"
          alt="JML"
          width={32}
          height={32}
          priority
          unoptimized
          className="dark:hidden"
        />
        {/* Logo blanc (dark) */}
        <Image
          src="/logo-jml/SVG/Logo_JMLlogo-blanc.svg"
          alt="JML"
          width={32}
          height={32}
          priority
          unoptimized
          className="hidden dark:block"
        />
        <span className="text-sm text-muted-foreground font-medium select-none">
          Graphic Tool
        </span>
      </Link>

      {/* À propos pill */}
      <div className="flex items-center h-12 px-2 rounded-full border border-border bg-background/80 backdrop-blur-md shadow-sm">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">À propos</Link>
        </Button>
      </div>
    </nav>
  )
}
