'use client'

import { Download, Image as ImageIcon, FileCode } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEngineStore } from '@/lib/store'
import { exportToSVG } from '@/lib/svg-exporter'
import { exportToPNG } from '@/lib/png-exporter'

export default function ExportPanel() {
  const store = useEngineStore()
  const characters = useEngineStore((s) => s.characters)
  const isReady = characters.length > 0

  const handleExportSVG = async () => {
    try {
      await exportToSVG(store)
      toast.success('Export réussi')
    } catch (e) {
      console.error('SVG export failed:', e)
      toast.error('Export impossible — réessayer')
    }
  }

  const handleExportPNG = () => {
    try {
      exportToPNG(store)
      toast.success('Export réussi')
    } catch (e) {
      console.error('PNG export failed:', e)
      toast.error('Export impossible — réessayer')
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!isReady} className="gap-2">
                <Download size={15} weight="bold" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem onClick={handleExportSVG} className="gap-2">
                <FileCode size={16} />
                Vectoriel (SVG)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPNG} className="gap-2">
                <ImageIcon size={16} />
                Image (PNG 300dpi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </TooltipTrigger>
      {!isReady && (
        <TooltipContent>Saisissez un texte pour exporter</TooltipContent>
      )}
    </Tooltip>
  )
}
