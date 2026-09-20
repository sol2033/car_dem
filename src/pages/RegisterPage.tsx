import { useState } from 'react'
import { Anchor, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let hasError = false

    if (name.trim() === '') {
      setNameError('Введите имя')
      hasError = true
    } else {
      setNameError('')
    }

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
    } else if (password.length < 6) {
      setPasswordError('Минимум 6 символов')
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
        Регистрация
      </Title>

      <Paper p="xl" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Имя"
              placeholder="Иван Петров"
              value={name}
              error={nameError}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <TextInput
              label="Email"
              placeholder="ivan@example.com"
              value={email}
              error={emailError}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <PasswordInput
              label="Пароль"
              placeholder="Не менее 6 символов"
              value={password}
              error={passwordError}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Button type="submit" fullWidth mt="sm">
              Зарегистрироваться
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="md">
          Уже есть аккаунт? <Anchor onClick={() => navigate('/login')}>Войти</Anchor>
        </Text>
      </Paper>
    </Container>
  )
}

export default RegisterPage
