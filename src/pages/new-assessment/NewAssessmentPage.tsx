import { Paper, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { createAssessment } from '../../entities/assessment/api/assessmentApi'
import type { Car } from '../../entities/assessment/model/types'
import CreateAssessmentForm from '../../features/create-assessment/ui/CreateAssessmentForm'

function NewAssessmentPage() {
  const navigate = useNavigate()

  async function handleSubmit(car: Car, photos: File[]) {
    const created = await createAssessment(car, photos)
    navigate('/assessments/' + created.id)
  }

  return (
    <div>
      <Title order={2} mb="lg">
        Новая оценка
      </Title>

      <Paper p="xl" radius="md" withBorder>
        <CreateAssessmentForm onSubmit={handleSubmit} onCancel={() => navigate('/dashboard')} />
      </Paper>
    </div>
  )
}

export default NewAssessmentPage
