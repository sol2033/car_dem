import { useState } from 'react'
import { Button, Collapse, Group, Paper, Select, Stack, Textarea, Title, Alert } from '@mantine/core'
import { damageSeverities, damageTypes } from '../../../entities/damage/model/constants'
import type { DamageInput } from '../../../entities/damage/api/damageApi'
import type { Damage, DamageSeverity, DamageType } from '../../../entities/damage/model/types'

interface AddDamageFormProps {
  onAdd: (damage: DamageInput) => Promise<void>
  damage?: Damage
  onCancel?: () => void
}

function AddDamageForm({ onAdd, damage, onCancel }: AddDamageFormProps) {
  const [type, setType] = useState<DamageType>(damage?.type ?? 'Скол')
  const [severity, setSeverity] = useState<DamageSeverity>(damage?.severity ?? 'Лёгкая')
  const [comment, setComment] = useState(damage?.comment ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(Boolean(damage))
  const [commentError, setCommentError] = useState('')

  async function handleAdd() {
    if (comment.length > 300) {
      setCommentError('Комментарий не длиннее 300 символов')
      return
    }

    setCommentError('')
    setSaving(true)
    setError('')
    try {
      await onAdd({ type, severity, comment: comment.trim() })
      setComment('')
      setOpened(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить повреждение')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper p="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Title order={5}>{damage ? 'Изменить повреждение' : 'Добавить повреждение'}</Title>
        <Button variant="light" disabled={saving} onClick={() => onCancel ? onCancel() : setOpened(!opened)}>
          {onCancel ? 'Отмена' : opened ? 'Скрыть форму' : 'Открыть форму'}
        </Button>
      </Group>
      <Collapse expanded={opened}>
        <Stack mt="md">
          {error && <Alert color="red">{error}</Alert>}
          <Group grow align="flex-start">
            <Select
              label="Тип"
              data={damageTypes}
              value={type}
              allowDeselect={false}
              onChange={(value) => setType(value as DamageType)}
            />
            <Select
              label="Степень тяжести"
              data={damageSeverities}
              value={severity}
              allowDeselect={false}
              onChange={(value) => setSeverity(value as DamageSeverity)}
            />
          </Group>
          <Textarea
            maxLength={300}
            label="Комментарий"
            placeholder="Например: вмятина на задней левой двери"
            value={comment}
            error={commentError}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
          <Button loading={saving} onClick={handleAdd} style={{ alignSelf: 'flex-start' }}>
            {damage ? 'Сохранить' : 'Добавить'}
          </Button>
        </Stack>
      </Collapse>
    </Paper>
  )
}

export default AddDamageForm
