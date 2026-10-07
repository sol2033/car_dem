import { Badge } from '@mantine/core'

interface DamageCountBadgeProps {
  count: number
  prefix?: string
}

function DamageCountBadge({ count, prefix }: DamageCountBadgeProps) {
  return (
    <Badge color={count > 0 ? 'orange' : 'green'}>
      {prefix} {count}
    </Badge>
  )
}

export default DamageCountBadge
