import type { ReactNode } from 'react'
import { Badge, Group, Paper, Text } from '@mantine/core'
import type { Damage, DamageSeverity } from '../model/types'

interface DamageItemProps {
  damage: Damage
  action?: ReactNode
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

function DamageItem({ damage, action }: DamageItemProps) {
  return (
    <Paper className="appear" p="md" radius="md" withBorder>
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
        {action}
      </Group>
    </Paper>
  )
}

export default DamageItem
