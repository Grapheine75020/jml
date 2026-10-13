'use client'

import { Bug } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useLang } from '@/lib/i18n/LangContext'
import { asset } from '@/lib/asset'

export default function AboutContent() {
  const { t } = useLang()

  const steps = [
    t('about.step1'),
    t('about.step2'),
    t('about.step3'),
    t('about.step4'),
    t('about.step5'),
  ]

  const specs: [string, string][] = [
    [t('about.spec.fontLabel'), t('about.spec.fontValue')],
    [t('about.spec.canvasLabel'), t('about.spec.canvasValue')],
    [t('about.spec.directionsLabel'), t('about.spec.directionsValue')],
    [t('about.spec.slicesLabel'), t('about.spec.slicesValue')],
    [t('about.spec.svgLabel'), t('about.spec.svgValue')],
    [t('about.spec.pngLabel'), t('about.spec.pngValue')],
    [t('about.spec.browsersLabel'), t('about.spec.browsersValue')],
  ]

  return (
    <main className="min-h-svh pt-24 pb-16 px-8 flex justify-center">
      <div className="w-full max-w-xl space-y-10">

        {/* Titre */}
        <div className="space-y-2">
          <h1 className="text-xl font-medium tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        <Separator />

        {/* Fonctionnement */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t('about.howItWorks')}
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
              {t('about.specs')}
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <dl className="space-y-2 text-sm pt-4">
                {specs.map(([label, value], i) => (
                  <div key={i} className="flex gap-4">
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
            {t('about.credits')}
          </h2>

          {/* Grapheine — concept */}
          <a
            href="https://grapheine.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <Avatar size="lg" className="rounded-lg bg-black">
              <AvatarImage src={asset('/logo-grapheine.ico')} alt="Grapheine" className="object-contain rounded-lg p-1" />
              <AvatarFallback className="rounded-lg">G</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {t('about.credit.grapheine.role')}
              </span>
              <span className="text-sm font-medium group-hover:underline underline-offset-2">
                Grapheine
              </span>
              <span className="text-xs text-muted-foreground">
                {t('about.credit.grapheine.type')}
              </span>
            </div>
          </a>

          {/* JML — client */}
          <a
            href="https://www.jml-elements.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <Avatar size="lg">
              {/* Logo noir (light) */}
              <AvatarImage
                src={asset('/logo-jml/PNG/Logo_JMLlogo-noir.png')}
                alt="JML Water Feature Design"
                className="dark:hidden"
              />
              {/* Logo blanc (dark) */}
              <Image
                src={asset('/logo-jml/PNG/Logo_JMLlogo-blanc.png')}
                alt="JML Water Feature Design"
                width={40}
                height={40}
                className="hidden dark:block aspect-square size-full rounded-full object-cover"
                unoptimized
              />
              <AvatarFallback>JML</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t('about.credit.jml.role')}</span>
              <span className="text-sm font-medium group-hover:underline underline-offset-2">
                {t('about.credit.jml.name')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('about.credit.jml.type')}
              </span>
            </div>
          </a>
        </div>

        <Separator />

        {/* Retour */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link href="/">{t('about.back')}</Link>
          </Button>
          <a
            href="mailto:alessandro@grapheine.com"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <Bug size={13} />
            {t('about.reportBug')}
          </a>
        </div>

      </div>
    </main>
  )
}
