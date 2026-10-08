import { Center, Loader, Stack, Text } from '@mantine/core'

function LoadingState() {
  return (
    <Center py={60}>
      <Stack align="center" gap="xs">
        <Loader />
        <Text c="dimmed" size="sm">
          Загрузка...
        </Text>
      </Stack>
    </Center>
  )
}

export default LoadingState
