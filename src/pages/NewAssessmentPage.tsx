import { useState } from 'react'
import { Button, Group, Image, Paper, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { addAssessment } from '../data/mockData'

function NewAssessmentPage() {
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  const [brandError, setBrandError] = useState('')
  const [modelError, setModelError] = useState('')
  const [yearError, setYearError] = useState('')

  function handlePhotosChange(event: any) {
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

  function handleSubmit(event: any) {
    event.preventDefault()

    let hasError = false

    if (brand.trim() === '') {
      setBrandError('Укажите марку')
      hasError = true
    } else {
      setBrandError('')
    }

    if (model.trim() === '') {
      setModelError('Укажите модель')
      hasError = true
    } else {
      setModelError('')
    }

    const yearNumber = Number(year)
    if (year.trim() === '') {
      setYearError('Укажите год выпуска')
      hasError = true
    } else if (isNaN(yearNumber) || yearNumber < 1950 || yearNumber > 2026) {
      setYearError('Год должен быть от 1950 до 2026')
      hasError = true
    } else {
      setYearError('')
    }

    if (!hasError) {
      const created = addAssessment(
        { brand: brand.trim(), model: model.trim(), year: yearNumber },
        photos,
      )
      navigate('/assessments/' + created.id)
    }
  }

  return (
    <div>
      <Title order={2} mb="lg">
        Новая оценка
      </Title>

      <Paper p="xl" radius="md" withBorder>
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
              <Button variant="default" onClick={() => navigate('/dashboard')}>
                Отмена
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  )
}

export default NewAssessmentPage
