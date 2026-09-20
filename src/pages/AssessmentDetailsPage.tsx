import { useState } from 'react'
import { Badge, Button, Group, Image, Paper, Select, SimpleGrid, Stack, Text, Textarea, Title } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import DamageItem from '../components/DamageItem'
import { damageLocations, damageSeverities, damageTypes, getAssessmentById, getUserName } from '../data/mockData'
import type { Damage, DamageLocation, DamageSeverity, DamageType } from '../types'

function AssessmentDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const assessment = getAssessmentById(Number(params.id))

  const [damages, setDamages] = useState<Damage[]>(assessment ? assessment.damages : [])
  const [type, setType] = useState<DamageType>('Скол')
  const [location, setLocation] = useState<DamageLocation>('Бампер')
  const [severity, setSeverity] = useState<DamageSeverity>('Лёгкая')
  const [comment, setComment] = useState('')

  if (!assessment) {
    return (
      <div>
        <Title order={2} mb="md">
          Оценка не найдена
        </Title>
        <Button onClick={() => navigate('/dashboard')}>Вернуться к списку</Button>
      </div>
    )
  }

  function handleAddDamage() {
    const newDamage: Damage = {
      id: Date.now(),
      type: type,
      location: location,
      severity: severity,
      comment: comment.trim(),
    }
    setDamages([...damages, newDamage])
    setComment('')
  }

  function handleDeleteDamage(id: number) {
    setDamages(damages.filter((damage) => damage.id !== id))
  }

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>
            {assessment.car.brand} {assessment.car.model}
          </Title>
          <Text c="dimmed" size="sm">
            {assessment.car.year} год, оценка №{assessment.id} от{' '}
            {new Date(assessment.createdAt).toLocaleDateString('ru-RU')}
          </Text>
          <Text c="dimmed" size="sm">
            Владелец: {getUserName(assessment.userId)}
          </Text>
        </div>
        <Button variant="default" onClick={() => navigate('/dashboard')}>
          Назад
        </Button>
      </Group>

      <Title order={4} mb="sm">
        Фотографии
      </Title>
      {assessment.photos.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
          {assessment.photos.map((photo) => (
            <Image key={photo} src={photo} height={200} radius="md" alt="Фото автомобиля" />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" mb="xl">
          Фотографии не загружены
        </Text>
      )}

      <Group mb="sm">
        <Title order={4}>Повреждения</Title>
        <Badge color={damages.length > 0 ? 'orange' : 'green'}>Всего: {damages.length}</Badge>
      </Group>

      {damages.length === 0 ? (
        <Text c="dimmed" mb="xl">
          Повреждений не найдено
        </Text>
      ) : (
        <Stack mb="xl">
          {damages.map((damage) => (
            <DamageItem key={damage.id} damage={damage} onDelete={handleDeleteDamage} />
          ))}
        </Stack>
      )}

      <Paper p="lg" radius="md" withBorder>
        <Title order={5} mb="md">
          Добавить повреждение
        </Title>
        <Stack>
          <Group grow align="flex-start">
            <Select
              label="Тип"
              data={damageTypes}
              value={type}
              allowDeselect={false}
              onChange={(value) => setType(value as DamageType)}
            />
            <Select
              label="Место на кузове"
              data={damageLocations}
              value={location}
              allowDeselect={false}
              onChange={(value) => setLocation(value as DamageLocation)}
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
            onChange={(event) => setComment(event.currentTarget.value)}
          />
          <Button onClick={handleAddDamage} style={{ alignSelf: 'flex-start' }}>
            Добавить
          </Button>
        </Stack>
      </Paper>
    </div>
  )
}

export default AssessmentDetailsPage
