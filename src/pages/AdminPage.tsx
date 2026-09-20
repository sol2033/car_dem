import { Badge, Button, Paper, Table, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { assessments, getUserName } from '../data/mockData'

function AdminPage() {
  const navigate = useNavigate()

  return (
    <div>
      <Title order={2} mb="xs">
        Все оценки
      </Title>
      <Text c="dimmed" size="sm" mb="lg">
        Раздел администратора: оценки всех пользователей
      </Text>

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
            {assessments.map((assessment) => (
              <Table.Tr key={assessment.id}>
                <Table.Td>{assessment.id}</Table.Td>
                <Table.Td>{getUserName(assessment.userId)}</Table.Td>
                <Table.Td>
                  {assessment.car.brand} {assessment.car.model}, {assessment.car.year}
                </Table.Td>
                <Table.Td>
                  {new Date(assessment.createdAt).toLocaleDateString('ru-RU')}
                </Table.Td>
                <Table.Td>
                  <Badge color={assessment.damages.length > 0 ? 'orange' : 'green'}>
                    {assessment.damages.length}
                  </Badge>
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
    </div>
  )
}

export default AdminPage
