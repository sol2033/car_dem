import { Anchor, Container, Paper, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../../features/register/ui/RegisterForm'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <Container size={420} py={80}>
      <Title order={2} ta="center" mb="lg">
        Регистрация
      </Title>

      <Paper className="appear" p="xl" radius="md" withBorder>
        <RegisterForm onSuccess={() => navigate('/dashboard')} />

        <Text size="sm" ta="center" mt="md">
          Уже есть аккаунт? <Anchor onClick={() => navigate('/login')}>Войти</Anchor>
        </Text>
      </Paper>
    </Container>
  )
}

export default RegisterPage
