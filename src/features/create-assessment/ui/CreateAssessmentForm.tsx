import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button, Group, Image, SimpleGrid, Stack, Text, TextInput } from '@mantine/core'
import type { Car } from '../../../entities/assessment/model/types'
import { validateRequired } from '../../../shared/lib/validation'

interface CreateAssessmentFormProps {
  onSubmit: (car: Car, photos: string[]) => void
  onCancel: () => void
}

function CreateAssessmentForm({ onSubmit, onCancel }: CreateAssessmentFormProps) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const [brandError, setBrandError] = useState('')
  const [modelError, setModelError] = useState('')
  const [yearError, setYearError] = useState('')

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files) {
      return
    }

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
    if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > 2026) {
      return 'Год должен быть от 1950 до 2026'
    }
    return ''
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newBrandError = validateRequired(brand, 'Укажите марку')
    const newModelError = validateRequired(model, 'Укажите модель')
    const newYearError = validateYear()
    setBrandError(newBrandError)
    setModelError(newModelError)
    setYearError(newYearError)

    if (newBrandError === '' && newModelError === '' && newYearError === '') {
      onSubmit({ brand: brand.trim(), model: model.trim(), year: Number(year) }, photos)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Марка"
          placeholder="Toyota"
          value={brand}
          error={brandError}
          onChange={(event) => setBrand(event.currentTarget.value)}
        />
        <TextInput
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
          <Button type="submit">Создать оценку</Button>
          <Button variant="default" onClick={onCancel}>
            Отмена
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default CreateAssessmentForm
