import { Button, Paper, Table, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { fetchAssessments } from '../../entities/assessment/model/assessments'
import DamageCountBadge from '../../entities/damage/ui/DamageCountBadge'
import { getUserName } from '../../entities/user/model/users'
import { formatDate } from '../../shared/lib/formatDate'
import { useAsyncData } from '../../shared/lib/useAsyncData'
import EmptyState from '../../shared/ui/EmptyState'
import ErrorState from '../../shared/ui/ErrorState'
import LoadingState from '../../shared/ui/LoadingState'

function AdminPage() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsyncData(fetchAssessments, null)

  return (
    <div>
      <Title order={2} mb="xs">
        Все оценки
      </Title>
      <Text c="dimmed" size="sm" mb="lg">
        Раздел администратора: оценки всех пользователей
      </Text>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState message="Оценок пока нет" />
      ) : (
        <Paper withBorder radius="md" p="md">
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Пользователь</Table.Th>
                <Table.Th>Автомобиль</Table.Th>
                <Table.Th>Дата</Table.Th>
                <Table.Th>Повреждений</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((assessment) => (
                <Table.Tr key={assessment.id}>
                  <Table.Td>{assessment.id}</Table.Td>
                  <Table.Td>{getUserName(assessment.userId)}</Table.Td>
                  <Table.Td>
                    {assessment.car.brand} {assessment.car.model}, {assessment.car.year}
                  </Table.Td>
                  <Table.Td>{formatDate(assessment.createdAt)}</Table.Td>
                  <Table.Td>
                    <DamageCountBadge count={assessment.damages.length} />
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => navigate('/assessments/' + assessment.id)}
                    >
                      Открыть
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </div>
  )
}

export default AdminPage
