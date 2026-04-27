import MobileWarning from '@/components/MobileWarning'
import FontLoader from '@/components/FontLoader'
import CanvasEditor from '@/components/CanvasEditor'
import DirectionPicker from '@/components/DirectionPicker'

export default function Page() {
  return (
    <MobileWarning>
      <FontLoader>
        <main className="flex min-h-svh flex-col gap-6 p-8">
          <CanvasEditor />
        </main>
        <DirectionPicker />
      </FontLoader>
    </MobileWarning>
  )
}
