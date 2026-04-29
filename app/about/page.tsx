import Link from 'next/link'
import Image from 'next/image'
import FloatingNav from '@/components/FloatingNav'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata = {
  title: 'À propos — Graphic Tool JML',
}

const steps = [
  'Saisir un texte libre dans le canvas.',
  'Cliquer sur une lettre pour la sélectionner.',
  "Choisir une direction d'extension — haut, bas, gauche, droite.",
  "Ajuster le nombre de tranches (1 à 3) et l'espacement (0 à 100 px).",
  'Exporter en SVG vectoriel ou PNG 300 dpi fond transparent.',
]

const specs: [string, string][] = [
  ['Police', 'Libre Franklin Medium 500'],
  ['Canvas', '1200 × 800 px'],
  ['Export SVG', 'Paths vectoriels natifs - compatible Adobe Illustrator'],
  ['Export PNG', '300 dpi, fond transparent'],
  ['Navigateurs', 'Chrome, Safari, Edge - desktop ≥ 1280 px'],
]

export default function AboutPage() {
  return (
    <>
      <FloatingNav />

      <main className="min-h-svh pt-24 pb-16 px-8 flex justify-center">
        <div className="w-full max-w-xl space-y-10">

          {/* Titre */}
          <div className="space-y-2">
            <h1 className="text-xl font-medium tracking-tight">
              Graphic Tool JML
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Outil de composition typographique directionnelle basé sur la charte
              graphique JML. Développé pour un usage interne par les équipes
              Grapheine et JML Water Feature Design.
            </p>
          </div>

          <Separator />

          {/* Fonctionnement */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Fonctionnement
            </h2>
            <ol className="space-y-2 text-sm text-foreground">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="tabular-nums text-muted-foreground shrink-0 w-4">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          {/* Spécifications */}
          <Accordion type="single" collapsible className="border-none rounded-none">
            <AccordionItem value="specs" className="border-none data-[state=open]:bg-transparent">
              <AccordionTrigger className="p-0 text-sm font-medium uppercase tracking-widest text-muted-foreground hover:no-underline">
                Spécifications techniques
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <dl className="space-y-2 text-sm pt-4">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex gap-4">
                      <dt className="text-muted-foreground shrink-0 w-28">{label}</dt>
                      <dd className="text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Crédits */}
          <div className="space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Crédits
            </h2>

            {/* Grapheine — concept */}
            <a
              href="https://grapheine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <Avatar size="lg" className="rounded-lg bg-black">
                <AvatarImage src="/logo-grapheine.ico" alt="Grapheine" className="object-contain rounded-lg p-1" />
                <AvatarFallback className="rounded-lg">G</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Conception de l&apos;identité visuelle JML
                </span>
                <span className="text-sm font-medium group-hover:underline underline-offset-2">
                  Grapheine
                </span>
                <span className="text-xs text-muted-foreground">
                  Agence de design graphique
                </span>
              </div>
            </a>

            {/* Alessandro + PicoDesign — développement */}
            <div className="flex items-center gap-4">
              <AvatarGroup>
                <Avatar size="lg">
                  <AvatarImage
                    src="/photoppalessandro/pp-al.jpg"
                    alt="Alessandro Capiluppi"
                  />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="/logo-pico/pp.jpg" alt="PicoDesign" />
                  <AvatarFallback>PD</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Développement de l&apos;outil
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span>Alessandro Capiluppi</span>
                  <span className="text-muted-foreground">·</span>
                  <a
                    href="https://picodesign.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-2"
                  >
                    PicoDesign
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  Grapheine
                </span>
              </div>
            </div>

            {/* JML — client */}
            <a
              href="https://jmlwaterfeaturedesign.com/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <Avatar size="lg">
                {/* Logo noir (light) */}
                <AvatarImage
                  src="/logo-jml/PNG/Logo_JMLlogo-noir.png"
                  alt="JML Water Feature Design"
                  className="dark:hidden"
                />
                {/* Logo blanc (dark) */}
                <Image
                  src="/logo-jml/PNG/Logo_JMLlogo-blanc.png"
                  alt="JML Water Feature Design"
                  width={40}
                  height={40}
                  className="hidden dark:block aspect-square size-full rounded-full object-cover"
                  unoptimized
                />
                <AvatarFallback>JML</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Client</span>
                <span className="text-sm font-medium group-hover:underline underline-offset-2">
                  JML - Water Feature Design
                </span>
                <span className="text-xs text-muted-foreground">
                  Installations de jeux d&apos;eau
                </span>
              </div>
            </a>
          </div>

          <Separator />

          {/* Retour */}
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link href="/">← Retour à l&apos;outil</Link>
          </Button>

        </div>
      </main>
    </>
  )
}
