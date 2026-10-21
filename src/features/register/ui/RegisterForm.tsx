import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { register } from '../../../entities/user/api/authApi'
import { validateEmail, validateRequired } from '../../../shared/lib/validation'

interface RegisterFormProps {
  onSuccess: () => void
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validatePassword() {
    if (password === '') {
      return 'Введите пароль'
    }
    if (password.length < 6) {
      return 'Минимум 6 символов'
    }
    return ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newNameError = validateRequired(name, 'Введите имя')
    const newEmailError = validateEmail(email)
    const newPasswordError = validatePassword()
    setNameError(newNameError)
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)

    if (newNameError !== '' || newEmailError !== '' || newPasswordError !== '') {
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await register(name, email, password)
      onSuccess()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось зарегистрироваться')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {formError !== '' && <Alert color="red">{formError}</Alert>}
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
        <Button type="submit" fullWidth mt="sm" loading={submitting}>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  )
}

export default RegisterForm
