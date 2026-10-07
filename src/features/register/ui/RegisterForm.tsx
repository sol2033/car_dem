import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
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

  function validatePassword() {
    if (password === '') {
      return 'Введите пароль'
    }
    if (password.length < 6) {
      return 'Минимум 6 символов'
    }
    return ''
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newNameError = validateRequired(name, 'Введите имя')
    const newEmailError = validateEmail(email)
    const newPasswordError = validatePassword()
    setNameError(newNameError)
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)

    if (newNameError === '' && newEmailError === '' && newPasswordError === '') {
      onSuccess()
    }
  }

  return (
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
  )
}

export default RegisterForm
