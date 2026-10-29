import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button, Group, Image, SimpleGrid, Stack, Text, TextInput, Alert } from '@mantine/core'
import type { Car } from '../../../entities/assessment/model/types'
import { validateRequired } from '../../../shared/lib/validation'

interface CreateAssessmentFormProps {
  onSubmit: (car: Car, photos: File[]) => Promise<void>
  onCancel: () => void
}

function CreateAssessmentForm({ onSubmit, onCancel }: CreateAssessmentFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const [brandError, setBrandError] = useState('')
  const [modelError, setModelError] = useState('')
  const [yearError, setYearError] = useState('')

  useEffect(() => () => photos.forEach(URL.revokeObjectURL), [photos])

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files) {
      return
    }

    setFiles(Array.from(files))
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      urls.push(URL.createObjectURL(files[i]))
    }
    setPhotos(urls)
  }

  function validateYear() {
    if (year.trim() === '') {
      return 'Укажите год выпуска'
    }
    const yearNumber = Number(year)
    if (!Number.isInteger(yearNumber) || yearNumber < 1950 || yearNumber > 2026) {
      return 'Год должен быть от 1950 до 2026'
    }
    return ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newBrandError = validateRequired(brand, 'Укажите марку')
    const newModelError = validateRequired(model, 'Укажите модель')
    const newYearError = validateYear()
    setBrandError(newBrandError)
    setModelError(newModelError)
    setYearError(newYearError)

    if (newBrandError === '' && newModelError === '' && newYearError === '') {
      setSaving(true)
      setError('')
      try {
        await onSubmit({ brand: brand.trim(), model: model.trim(), year: Number(year) }, files)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось создать оценку')
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}
        <TextInput
          maxLength={50}
          label="Марка"
          placeholder="Toyota"
          value={brand}
          error={brandError}
          onChange={(event) => setBrand(event.currentTarget.value)}
        />
        <TextInput
          maxLength={50}
          label="Модель"
          placeholder="Camry"
          value={model}
          error={modelError}
          onChange={(event) => setModel(event.currentTarget.value)}
        />
        <TextInput
          label="Год выпуска"
          placeholder="2015"
          value={year}
          error={yearError}
          onChange={(event) => setYear(event.currentTarget.value)}
        />

        <div>
          <Text size="sm" fw={500} mb={4}>
            Фотографии автомобиля
          </Text>
          <input type="file" accept="image/*" multiple onChange={handlePhotosChange} />
        </div>

        {photos.length > 0 ? (
          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
            {photos.map((photo) => (
              <Image key={photo} src={photo} height={130} radius="sm" alt="Превью" />
            ))}
          </SimpleGrid>
        ) : (
          <Text size="sm" c="dimmed">
            Фотографии не выбраны
          </Text>
        )}

        <Group mt="sm">
          <Button type="submit" loading={saving}>Создать оценку</Button>
          <Button variant="default" disabled={saving} onClick={onCancel}>
            Отмена
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default CreateAssessmentForm
