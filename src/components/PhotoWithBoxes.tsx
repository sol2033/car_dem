import { Image } from '@mantine/core'
import { damageColors } from '../data/mockData'
import type { Damage } from '../types'

interface PhotoWithBoxesProps {
  photo: string
  damages: Damage[]
}

function PhotoWithBoxes({ photo, damages }: PhotoWithBoxesProps) {
  return (
    <div style={{ position: 'relative' }}>
      <Image src={photo} radius="md" alt="Фото автомобиля" />
      {damages.map((damage) => {
        if (damage.photo !== photo || !damage.box) {
          return null
        }
        return (
          <div
            key={damage.id}
            style={{
              position: 'absolute',
              left: damage.box.x * 100 + '%',
              top: damage.box.y * 100 + '%',
              width: damage.box.width * 100 + '%',
              height: damage.box.height * 100 + '%',
              border: '3px solid var(--mantine-color-' + damageColors[damage.type] + '-6)',
            }}
          />
        )
      })}
    </div>
  )
}

export default PhotoWithBoxes
