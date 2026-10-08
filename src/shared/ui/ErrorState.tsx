import { Alert, Button } from '@mantine/core'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert color="red" title="Не удалось загрузить данные" radius="md">
      {message}
      <div>
        <Button mt="sm" size="xs" variant="light" color="red" onClick={onRetry}>
          Повторить
        </Button>
      </div>
    </Alert>
  )
}

export default ErrorState
