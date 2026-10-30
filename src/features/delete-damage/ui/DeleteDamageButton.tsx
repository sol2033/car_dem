import { useState } from 'react'
import { Alert, Button, Stack } from '@mantine/core'

interface DeleteDamageButtonProps {
  damageId: number
  onDelete: (id: number) => Promise<void>
}

function DeleteDamageButton({ damageId, onDelete }: DeleteDamageButtonProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setSaving(true)
    setError('')
    try {
      await onDelete(damageId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить повреждение')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack gap="xs">
      {error && <Alert color="red">{error}</Alert>}
    <Button variant="subtle" color="red" loading={saving} onClick={handleDelete}>
      Удалить
    </Button>
    </Stack>
  )
}

export default DeleteDamageButton
