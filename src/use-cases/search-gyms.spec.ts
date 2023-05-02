import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Academy',
      description: 'The best gym in the world',
      phone: null,
      latitude: -22.5357786,
      longitude: -44.7944833,
    })
    await gymsRepository.create({
      title: 'Typescript Academy',
      description: 'The best gym in the world',
      phone: null,
      latitude: -22.5357786,
      longitude: -44.7944833,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Academy' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Academy ${i}`,
        description: 'The best gym in the world',
        phone: null,
        latitude: -22.5357786,
        longitude: -44.7944833,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Academy 21' }),
      expect.objectContaining({ title: 'JavaScript Academy 22' }),
    ])
  })
})
