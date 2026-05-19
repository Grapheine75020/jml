'use client'

import { useState } from 'react'
import { Download, Image as ImageIcon, FileCode } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useLang } from '@/lib/i18n/LangContext'

export default function ExportPanel() {
  const { t } = useLang()
  const store = useEngineStore()
  const characters = useEngineStore((s) => s.characters)
  const isReady = characters.length > 0
  const [whiteText, setWhiteText] = useState(false)

  const handleExportSVG = async () => {
    try {
      await exportToSVG(store, { whiteText })
      toast.success(t('export.success'))
    } catch (e) {
      console.error('SVG export failed:', e)
      toast.error(t('export.error'))
    }
  }

  const handleExportPNG = () => {
    try {
      exportToPNG(store, { whiteText })
      toast.success(t('export.success'))
    } catch (e) {
      console.error('PNG export failed:', e)
      toast.error(t('export.error'))
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
                {t('export.button')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuCheckboxItem
                checked={whiteText}
                onCheckedChange={setWhiteText}
              >
                {t('export.whiteText')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportSVG} className="gap-2">
                <FileCode size={16} />
                {t('export.svg')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPNG} className="gap-2">
                <ImageIcon size={16} />
                {t('export.png')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </TooltipTrigger>
      {!isReady && (
        <TooltipContent>{t('export.tooltip')}</TooltipContent>
      )}
    </Tooltip>
  )
}
