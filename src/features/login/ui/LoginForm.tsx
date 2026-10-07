import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { validateEmail, validateRequired } from '../../../shared/lib/validation'

interface LoginFormProps {
  onSuccess: () => void
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newEmailError = validateEmail(email)
    const newPasswordError = validateRequired(password, 'Введите пароль')
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)

    if (newEmailError === '' && newPasswordError === '') {
      onSuccess()
    }
  }

  return (
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
  )
}

export default LoginForm
