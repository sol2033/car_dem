import type {
  Assessment,
  Car,
  DamageLocation,
  DamageSeverity,
  DamageType,
  User,
} from '../types'

export const damageTypes: DamageType[] = ['Скол', 'Вмятина', 'Царапина', 'Трещина']

export const damageLocations: DamageLocation[] = [
  'Бампер',
  'Дверь',
  'Капот',
  'Крыло',
  'Крыша',
  'Багажник',
]

export const damageSeverities: DamageSeverity[] = ['Лёгкая', 'Средняя', 'Сильная']

export const currentUserId = 1

export const users: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Смирнова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Кузнецов', email: 'alexey@example.com' },
]

export const assessments: Assessment[] = [
  {
    id: 1,
    car: { brand: 'Toyota', model: 'Camry', year: 2015 },
    createdAt: '2025-08-14T10:20:00',
    userId: 1,
    photos: ['/cars/car1.jpg', '/cars/car2.jpg'],
    damages: [
      {
        id: 1,
        type: 'Вмятина',
        location: 'Дверь',
        severity: 'Средняя',
        comment: 'Вмятина на передней левой двери, краска не повреждена',
      },
      {
        id: 2,
        type: 'Царапина',
        location: 'Бампер',
        severity: 'Лёгкая',
        comment: 'Несколько царапин на заднем бампере',
      },
      {
        id: 3,
        type: 'Скол',
        location: 'Капот',
        severity: 'Лёгкая',
        comment: 'Мелкие сколы от камней',
      },
    ],
  },
  {
    id: 2,
    car: { brand: 'Volkswagen', model: 'Polo', year: 2019 },
    createdAt: '2025-08-28T16:05:00',
    userId: 1,
    photos: ['/cars/car3.jpg'],
    damages: [
      {
        id: 4,
        type: 'Трещина',
        location: 'Бампер',
        severity: 'Сильная',
        comment: 'Трещина через весь передний бампер после удара',
      },
      {
        id: 5,
        type: 'Вмятина',
        location: 'Крыло',
        severity: 'Средняя',
        comment: 'Переднее правое крыло деформировано',
      },
    ],
  },
  {
    id: 3,
    car: { brand: 'Kia', model: 'Rio', year: 2018 },
    createdAt: '2025-09-02T09:40:00',
    userId: 1,
    photos: ['/cars/car4.jpg', '/cars/car5.jpg'],
    damages: [
      {
        id: 6,
        type: 'Царапина',
        location: 'Дверь',
        severity: 'Лёгкая',
        comment: 'Царапина до грунта на задней правой двери',
      },
    ],
  },
  {
    id: 4,
    car: { brand: 'Lada', model: 'Vesta', year: 2021 },
    createdAt: '2025-09-09T12:15:00',
    userId: 1,
    photos: ['/cars/car6.jpg'],
    damages: [],
  },
  {
    id: 5,
    car: { brand: 'Hyundai', model: 'Solaris', year: 2017 },
    createdAt: '2025-07-19T14:30:00',
    userId: 2,
    photos: ['/cars/car2.jpg', '/cars/car6.jpg'],
    damages: [
      {
        id: 7,
        type: 'Вмятина',
        location: 'Багажник',
        severity: 'Сильная',
        comment: 'Крышка багажника сильно замята, не закрывается',
      },
      {
        id: 8,
        type: 'Скол',
        location: 'Крыша',
        severity: 'Лёгкая',
        comment: 'Скол краски на крыше',
      },
    ],
  },
  {
    id: 6,
    car: { brand: 'Skoda', model: 'Octavia', year: 2016 },
    createdAt: '2025-08-05T11:00:00',
    userId: 2,
    photos: ['/cars/car5.jpg'],
    damages: [
      {
        id: 9,
        type: 'Царапина',
        location: 'Крыло',
        severity: 'Средняя',
        comment: 'Длинная царапина вдоль заднего крыла',
      },
    ],
  },
  {
    id: 7,
    car: { brand: 'Renault', model: 'Duster', year: 2014 },
    createdAt: '2025-09-01T18:45:00',
    userId: 3,
    photos: ['/cars/car3.jpg', '/cars/car1.jpg'],
    damages: [
      {
        id: 10,
        type: 'Трещина',
        location: 'Капот',
        severity: 'Средняя',
        comment: 'Трещина на лакокрасочном покрытии капота',
      },
      {
        id: 11,
        type: 'Вмятина',
        location: 'Дверь',
        severity: 'Лёгкая',
        comment: 'Небольшая вмятина от парковки',
      },
      {
        id: 12,
        type: 'Скол',
        location: 'Бампер',
        severity: 'Средняя',
        comment: 'Сколы на углу переднего бампера',
      },
    ],
  },
  {
    id: 8,
    car: { brand: 'Mazda', model: 'CX-5', year: 2020 },
    createdAt: '2025-09-11T08:25:00',
    userId: 3,
    photos: ['/cars/car4.jpg'],
    damages: [
      {
        id: 13,
        type: 'Царапина',
        location: 'Крыша',
        severity: 'Лёгкая',
        comment: 'Потёртости на рейлингах и крыше',
      },
    ],
  },
]

let nextAssessmentId = 9

export function getUserAssessments(userId: number): Assessment[] {
  return assessments.filter((assessment) => assessment.userId === userId)
}

export function getAssessmentById(id: number): Assessment | undefined {
  return assessments.find((assessment) => assessment.id === id)
}

export function getUserName(userId: number): string {
  const user = users.find((user) => user.id === userId)
  return user ? user.name : 'Неизвестный пользователь'
}

export function addAssessment(car: Car, photos: string[]): Assessment {
  const newAssessment: Assessment = {
    id: nextAssessmentId,
    car,
    createdAt: new Date().toISOString(),
    userId: currentUserId,
    photos,
    damages: [],
  }
  nextAssessmentId = nextAssessmentId + 1
  assessments.push(newAssessment)
  return newAssessment
}
