export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-12">
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-medium tracking-tight">
          JML Graphic Haikus
        </h1>
        <p className="text-muted-foreground">
          Outil de typographie directionnelle. Sélectionnez une lettre,
          choisissez une direction, ajustez les tranches.
        </p>
        <p className="text-muted-foreground">
          Police : Libre Franklin Medium 500. Export SVG vectoriel &amp; PNG
          300dpi.
        </p>
        <a href="/" className="text-sm underline underline-offset-4">
          ← Retour à l&apos;outil
        </a>
      </div>
    </div>
  )
}
