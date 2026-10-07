import { Anchor, Container, Paper, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../features/login/ui/LoginForm'

function LoginPage() {
  const navigate = useNavigate()

  return (
    <Container size={420} py={80}>
      <Title order={2} ta="center" mb="lg">
        Вход в систему
      </Title>

      <Paper p="xl" radius="md" withBorder>
        <LoginForm onSuccess={() => navigate('/dashboard')} />

        <Text size="sm" ta="center" mt="md">
          Нет аккаунта? <Anchor onClick={() => navigate('/register')}>Зарегистрироваться</Anchor>
        </Text>
      </Paper>
    </Container>
  )
}

export default LoginPage
