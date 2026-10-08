import { Center, Text } from '@mantine/core'

interface EmptyStateProps {
  message: string
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <Center py={60}>
      <Text c="dimmed">{message}</Text>
    </Center>
  )
}

export default EmptyState
