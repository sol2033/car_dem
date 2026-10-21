import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useAuth } from '../../auth/model/AuthContext'
import { validateEmail, validateRequired } from '../../../shared/lib/validation'

interface LoginFormProps {
  onSuccess: () => void
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newEmailError = validateEmail(email)
    const newPasswordError = validateRequired(password, 'Введите пароль')
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)

    if (newEmailError !== '' || newPasswordError !== '') {
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await login(email, password)
      onSuccess()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось войти')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {formError !== '' && <Alert color="red">{formError}</Alert>}
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
        <Button type="submit" fullWidth mt="sm" loading={submitting}>
          Войти
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
