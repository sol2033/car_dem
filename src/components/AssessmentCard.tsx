import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import type { Assessment } from '../types'

interface AssessmentCardProps {
  assessment: Assessment
  ownerName?: string
}

function AssessmentCard({ assessment, ownerName }: AssessmentCardProps) {
  const navigate = useNavigate()

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section>
        {assessment.photos.length > 0 ? (
          <Image src={assessment.photos[0]} height={170} alt="Фото автомобиля" />
        ) : (
          <div
            style={{
              height: 170,
              background: '#f1f3f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text c="dimmed" size="sm">
              Фото не загружено
            </Text>
          </div>
        )}
      </Card.Section>

      <Text fw={600} mt="md">
        {assessment.car.brand} {assessment.car.model}
      </Text>
      <Text size="sm" c="dimmed">
        {assessment.car.year} год
      </Text>

      {ownerName ? (
        <Text size="sm" c="dimmed">
          Владелец: {ownerName}
        </Text>
      ) : null}

      <Group justify="space-between" mt="sm">
        <Text size="sm" c="dimmed">
          {new Date(assessment.createdAt).toLocaleDateString('ru-RU')}
        </Text>
        <Badge color={assessment.damages.length > 0 ? 'orange' : 'green'}>
          Повреждений: {assessment.damages.length}
        </Badge>
      </Group>

      <Button
        fullWidth
        mt="md"
        onClick={() => navigate('/assessments/' + assessment.id)}
      >
        Открыть
      </Button>
    </Card>
  )
}

export default AssessmentCard
