import { useState } from 'react'
import { Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function handleSubmit(event: any) {
    event.preventDefault()

    let hasError = false

    if (email.trim() === '') {
      setEmailError('Введите email')
      hasError = true
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Неверный формат email')
      hasError = true
    } else {
      setEmailError('')
    }

    if (password === '') {
      setPasswordError('Введите пароль')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (!hasError) {
      navigate('/dashboard')
    }
  }

  return (
    <Container size={420} py={80}>
      <Title order={2} ta="center" mb="lg">
        Вход в систему
      </Title>

      <Paper p="xl" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="ivan@example.com"
              value={email}
              error={emailError}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <PasswordInput
              label="Пароль"
              placeholder="Ваш пароль"
              value={password}
              error={passwordError}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Button type="submit" fullWidth mt="sm">
              Войти
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="md">
          Нет аккаунта? <Anchor onClick={() => navigate('/register')}>Зарегистрироваться</Anchor>
        </Text>
      </Paper>
    </Container>
  )
}

export default LoginPage
