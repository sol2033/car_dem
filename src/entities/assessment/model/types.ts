import type { Damage } from '../../damage/model/types'

export interface Car {
  brand: string
  model: string
  year: number
}

export interface Assessment {
  id: number
  car: Car
  createdAt: string
  damages: Damage[]
  userId: number
  ownerName: string
  photos: string[]
}
