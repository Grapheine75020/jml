'use client'

import { Download, Image as ImageIcon, FileCode } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEngineStore } from '@/lib/store'
import { exportToSVG } from '@/lib/svg-exporter'
import { exportToPNG } from '@/lib/png-exporter'

export default function ExportPanel() {
  const store = useEngineStore()
  const characters = useEngineStore((s) => s.characters)
  const isReady = characters.length > 0

  const handleExportSVG = async () => {
    await exportToSVG(store)
  }

  const handleExportPNG = () => {
    exportToPNG(store)
  }

  return (
    <div className="fixed top-8 right-8 z-30">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={!isReady} className="gap-2 shadow-sm">
            <Download size={18} weight="bold" />
            Exporter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleExportSVG} className="gap-2">
            <FileCode size={18} />
            Vectoriel (SVG)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPNG} className="gap-2">
            <ImageIcon size={18} />
            Image (PNG 300dpi)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
