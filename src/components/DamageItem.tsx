import { Badge, Button, Group, Paper, Text } from '@mantine/core'
import type { Damage, DamageSeverity } from '../types'

interface DamageItemProps {
  damage: Damage
  onDelete: (id: number) => void
}

function getSeverityColor(severity: DamageSeverity) {
  if (severity === 'Лёгкая') {
    return 'green'
  }
  if (severity === 'Средняя') {
    return 'yellow'
  }
  return 'red'
}

function DamageItem({ damage, onDelete }: DamageItemProps) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="xs" mb="xs">
            <Badge color="blue">{damage.type}</Badge>
            <Badge color={getSeverityColor(damage.severity)} variant="light">
              {damage.severity}
            </Badge>
          </Group>
          <Text size="sm" c={damage.comment ? undefined : 'dimmed'}>
            {damage.comment ? damage.comment : 'Без комментария'}
          </Text>
        </div>
        <Button variant="subtle" color="red" onClick={() => onDelete(damage.id)}>
          Удалить
        </Button>
      </Group>
    </Paper>
  )
}

export default DamageItem
