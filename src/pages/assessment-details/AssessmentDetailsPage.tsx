import { useState } from 'react'
import { Badge, Button, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import { getAssessmentById } from '../../entities/assessment/model/assessments'
import { damageColors, damageTypes } from '../../entities/damage/model/constants'
import type { Damage } from '../../entities/damage/model/types'
import DamageCountBadge from '../../entities/damage/ui/DamageCountBadge'
import DamageItem from '../../entities/damage/ui/DamageItem'
import PhotoWithBoxes from '../../entities/damage/ui/PhotoWithBoxes'
import { getUserName } from '../../entities/user/model/users'
import AddDamageForm from '../../features/add-damage/ui/AddDamageForm'
import DeleteDamageButton from '../../features/delete-damage/ui/DeleteDamageButton'
import { formatDate } from '../../shared/lib/formatDate'

function AssessmentDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const assessment = getAssessmentById(Number(params.id))

  const [damages, setDamages] = useState<Damage[]>(assessment ? assessment.damages : [])

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

  function handleAddDamage(damage: Damage) {
    setDamages([...damages, damage])
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
            {assessment.car.year} год, оценка №{assessment.id} от {formatDate(assessment.createdAt)}
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
        <div>
          <Group gap="xs" mb="sm">
            <Text size="sm" c="dimmed">
              Цвет рамки на фото — тип повреждения:
            </Text>
            {damageTypes.map((damageType) => (
              <Badge key={damageType} color={damageColors[damageType]} variant="outline">
                {damageType}
              </Badge>
            ))}
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
            {assessment.photos.map((photo) => (
              <PhotoWithBoxes key={photo} photo={photo} damages={damages} />
            ))}
          </SimpleGrid>
        </div>
      ) : (
        <Text c="dimmed" mb="xl">
          Фотографии не загружены
        </Text>
      )}

      <Group mb="sm">
        <Title order={4}>Повреждения</Title>
        <DamageCountBadge count={damages.length} prefix="Всего:" />
      </Group>

      {damages.length === 0 ? (
        <Text c="dimmed" mb="xl">
          Повреждений не найдено
        </Text>
      ) : (
        <Stack mb="xl">
          {damages.map((damage) => (
            <DamageItem
              key={damage.id}
              damage={damage}
              action={<DeleteDamageButton damageId={damage.id} onDelete={handleDeleteDamage} />}
            />
          ))}
        </Stack>
      )}

      <AddDamageForm onAdd={handleAddDamage} />
    </div>
  )
}

export default AssessmentDetailsPage
