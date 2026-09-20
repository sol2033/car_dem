import { Button, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import AssessmentCard from '../components/AssessmentCard'
import { currentUserId, getUserAssessments, getUserName } from '../data/mockData'

function DashboardPage() {
  const navigate = useNavigate()
  const myAssessments = getUserAssessments(currentUserId)

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Мои оценки</Title>
          <Text c="dimmed" size="sm">
            Пользователь: {getUserName(currentUserId)}
          </Text>
        </div>
        <Button onClick={() => navigate('/assessments/new')}>Создать оценку</Button>
      </Group>

      {myAssessments.length === 0 ? (
        <Text c="dimmed">У вас пока нет оценок</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {myAssessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </SimpleGrid>
      )}
    </div>
  )
}

export default DashboardPage
