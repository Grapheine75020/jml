import MobileWarning from '@/components/MobileWarning'
import FontLoader from '@/components/FontLoader'
import CanvasEditor from '@/components/CanvasEditor'
import DirectionPicker from '@/components/DirectionPicker'
import FloatingNav from '@/components/FloatingNav'

export default function Page() {
  return (
    <MobileWarning>
      <FontLoader>
        <FloatingNav />

        {/* Main */}
        <main className="min-h-svh flex items-center justify-center pt-24 pb-8">
          <CanvasEditor />
        </main>

        <DirectionPicker />
      </FontLoader>
    </MobileWarning>
  )
}
