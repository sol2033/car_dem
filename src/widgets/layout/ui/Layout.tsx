import { Button, Container, Group, Text } from '@mantine/core'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../features/auth/model/AuthContext'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div>
      <div style={{ borderBottom: '1px solid #dee2e6', background: '#fff' }}>
        <Container size="lg" py="sm">
          <Group justify="space-between">
            <Text fw={700} size="lg">
              Оценка повреждений авто
            </Text>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                {user?.name}
              </Text>
              <Button
                variant={location.pathname === '/dashboard' ? 'light' : 'subtle'}
                onClick={() => navigate('/dashboard')}
              >
                Мои оценки
              </Button>
              <Button
                variant={location.pathname === '/assessments/new' ? 'light' : 'subtle'}
                onClick={() => navigate('/assessments/new')}
              >
                Новая оценка
              </Button>
              {user?.is_admin && (
                <Button
                  variant={location.pathname === '/admin' ? 'light' : 'subtle'}
                  onClick={() => navigate('/admin')}
                >
                  Админ
                </Button>
              )}
              <Button variant="outline" color="gray" onClick={handleLogout}>
                Выйти
              </Button>
            </Group>
          </Group>
        </Container>
      </div>

      <Container size="lg" py="xl">
        <div key={location.pathname} className="appear">
          <Outlet />
        </div>
      </Container>
    </div>
  )
}

export default Layout
