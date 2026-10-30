import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Group, Stack, TextInput } from '@mantine/core'
import type { Car } from '../../../entities/assessment/model/types'

interface EditAssessmentFormProps {
  car: Car
  onSave: (car: Car) => Promise<void>
  onCancel: () => void
}

function EditAssessmentForm({ car, onSave, onCancel }: EditAssessmentFormProps) {
  const [brand, setBrand] = useState(car.brand)
  const [model, setModel] = useState(car.model)
  const [year, setYear] = useState(String(car.year))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!brand.trim() || !model.trim() || !Number.isInteger(Number(year)) || Number(year) < 1950 || Number(year) > 2026) {
      setError('Укажите марку, модель и целый год от 1950 до 2026')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ brand: brand.trim(), model: model.trim(), year: Number(year) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить оценку')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack mb="lg">
        {error && <Alert color="red">{error}</Alert>}
        <TextInput label="Марка" required maxLength={50} value={brand} onChange={(event) => setBrand(event.currentTarget.value)} />
        <TextInput label="Модель" required maxLength={50} value={model} onChange={(event) => setModel(event.currentTarget.value)} />
        <TextInput label="Год выпуска" required value={year} onChange={(event) => setYear(event.currentTarget.value)} />
        <Group>
          <Button type="submit" loading={saving}>Сохранить</Button>
          <Button variant="default" disabled={saving} onClick={onCancel}>Отмена</Button>
        </Group>
      </Stack>
    </form>
  )
}

export default EditAssessmentForm
