import { useState } from 'react'
import { Button, Collapse, Group, Paper, Select, Stack, Textarea, Title } from '@mantine/core'
import { damageSeverities, damageTypes } from '../../../entities/damage/model/constants'
import type { Damage, DamageSeverity, DamageType } from '../../../entities/damage/model/types'

interface AddDamageFormProps {
  onAdd: (damage: Damage) => void
}

function AddDamageForm({ onAdd }: AddDamageFormProps) {
  const [type, setType] = useState<DamageType>('Скол')
  const [severity, setSeverity] = useState<DamageSeverity>('Лёгкая')
  const [comment, setComment] = useState('')
  const [opened, setOpened] = useState(false)
  const [commentError, setCommentError] = useState('')

  function handleAdd() {
    if (comment.length > 200) {
      setCommentError('Комментарий не длиннее 200 символов')
      return
    }

    setCommentError('')
    onAdd({
      id: Date.now(),
      type: type,
      severity: severity,
      comment: comment.trim(),
    })
    setComment('')
    setOpened(false)
  }

  return (
    <Paper p="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Title order={5}>Добавить повреждение</Title>
        <Button variant="light" onClick={() => setOpened(!opened)}>
          {opened ? 'Скрыть форму' : 'Открыть форму'}
        </Button>
      </Group>
      <Collapse expanded={opened}>
        <Stack mt="md">
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
            label="Комментарий"
            placeholder="Например: вмятина на задней левой двери"
            value={comment}
            error={commentError}
            onChange={(event) => setComment(event.currentTarget.value)}
          />
          <Button onClick={handleAdd} style={{ alignSelf: 'flex-start' }}>
            Добавить
          </Button>
        </Stack>
      </Collapse>
    </Paper>
  )
}

export default AddDamageForm
