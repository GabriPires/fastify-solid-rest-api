import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'The best gym in the world',
      phone: null,
      latitude: -22.4913737,
      longitude: -44.6544769,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'The best gym in the world',
      phone: null,
      latitude: -22.5357786,
      longitude: -44.7944833,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.4913737,
      userLongitude: -44.6544769,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
