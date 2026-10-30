import { Button } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAssessment } from '../../entities/assessment/api/assessmentApi'
import { useAsyncData } from '../../shared/lib/useAsyncData'
import ErrorState from '../../shared/ui/ErrorState'
import LoadingState from '../../shared/ui/LoadingState'
import AssessmentDetails from './AssessmentDetails'

function AssessmentDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { data, loading, error, reload } = useAsyncData(fetchAssessment, Number(params.id))

  if (loading) {
    return <LoadingState />
  }

  if (error || !data) {
    return (
      <div>
        <ErrorState message={error} onRetry={reload} />
        <Button mt="md" onClick={() => navigate('/dashboard')}>
          Вернуться к списку
        </Button>
      </div>
    )
  }

  return <AssessmentDetails key={data.id} assessment={data} onChange={reload} />
}

export default AssessmentDetailsPage
