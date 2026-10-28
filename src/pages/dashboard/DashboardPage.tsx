import { Button, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { fetchAssessments } from '../../entities/assessment/api/assessmentApi'
import AssessmentCard from '../../entities/assessment/ui/AssessmentCard'
import { useAuth } from '../../features/auth/model/AuthContext'
import { useAsyncData } from '../../shared/lib/useAsyncData'
import EmptyState from '../../shared/ui/EmptyState'
import ErrorState from '../../shared/ui/ErrorState'
import LoadingState from '../../shared/ui/LoadingState'

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsyncData(fetchAssessments, false)

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Мои оценки</Title>
          <Text c="dimmed" size="sm">
            Пользователь: {user?.name}
          </Text>
        </div>
        <Button onClick={() => navigate('/assessments/new')}>Создать оценку</Button>
      </Group>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState message="У вас пока нет оценок" />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {data.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </SimpleGrid>
      )}
    </div>
  )
}

export default DashboardPage
