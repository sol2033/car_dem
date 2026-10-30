import { useState } from 'react'
import { Alert, Badge, Button, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { deleteAssessment, updateAssessment } from '../../entities/assessment/api/assessmentApi'
import { createDamage, deleteDamage, updateDamage } from '../../entities/damage/api/damageApi'
import type { DamageInput } from '../../entities/damage/api/damageApi'
import { useAuth } from '../../features/auth/model/AuthContext'
import EditAssessmentForm from '../../features/edit-assessment/ui/EditAssessmentForm'
import type { Assessment, Car } from '../../entities/assessment/model/types'
import { damageColors, damageTypes } from '../../entities/damage/model/constants'
import type { Damage } from '../../entities/damage/model/types'
import DamageCountBadge from '../../entities/damage/ui/DamageCountBadge'
import DamageItem from '../../entities/damage/ui/DamageItem'
import PhotoWithBoxes from '../../entities/damage/ui/PhotoWithBoxes'
import AddDamageForm from '../../features/add-damage/ui/AddDamageForm'
import DeleteDamageButton from '../../features/delete-damage/ui/DeleteDamageButton'
import { formatDate } from '../../shared/lib/formatDate'

interface AssessmentDetailsProps {
  assessment: Assessment
  onChange: () => void
}

function AssessmentDetails({ assessment, onChange }: AssessmentDetailsProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canEdit = user?.id === assessment.userId
  const damages = assessment.damages
  const [editing, setEditing] = useState(false)
  const [editingDamage, setEditingDamage] = useState<Damage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  async function handleAddDamage(damage: DamageInput) {
    await createDamage(assessment.id, damage)
    onChange()
  }

  async function handleDeleteDamage(id: number) {
    await deleteDamage(id)
    onChange()
  }

  async function handleSave(car: Car) {
    await updateAssessment(assessment.id, car)
    setEditing(false)
    onChange()
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      await deleteAssessment(assessment.id)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить оценку')
    } finally {
      setDeleting(false)
    }
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
            Владелец: {assessment.ownerName}
          </Text>
        </div>
        <Button variant="default" onClick={() => navigate('/dashboard')}>
          Назад
        </Button>
      </Group>

      {error && <Alert color="red" mb="md">{error}</Alert>}
      {canEdit && (
        <Group mb="lg">
          <Button variant="light" onClick={() => setEditing(!editing)}>Изменить оценку</Button>
          <Button color="red" variant="light" onClick={() => setConfirmDelete(true)}>Удалить оценку</Button>
        </Group>
      )}
      {canEdit && confirmDelete && (
        <Alert color="red" mb="lg" title="Удалить оценку вместе с фотографиями и повреждениями?">
          <Group mt="sm">
            <Button color="red" loading={deleting} onClick={handleDelete}>Да, удалить</Button>
            <Button variant="default" disabled={deleting} onClick={() => setConfirmDelete(false)}>Отмена</Button>
          </Group>
        </Alert>
      )}
      {canEdit && editing && <EditAssessmentForm car={assessment.car} onSave={handleSave} onCancel={() => setEditing(false)} />}

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
              action={canEdit && (
                <Group gap="xs">
                  <Button variant="subtle" onClick={() => setEditingDamage(damage)}>Изменить</Button>
                  <DeleteDamageButton damageId={damage.id} onDelete={handleDeleteDamage} />
                </Group>
              )}
            />
          ))}
        </Stack>
      )}

      {canEdit && (editingDamage ? (
        <AddDamageForm
          key={editingDamage.id}
          damage={editingDamage}
          onCancel={() => setEditingDamage(null)}
          onAdd={async (data) => {
            await updateDamage(editingDamage.id, data)
            setEditingDamage(null)
            onChange()
          }}
        />
      ) : <AddDamageForm onAdd={handleAddDamage} />)}
    </div>
  )
}

export default AssessmentDetails
