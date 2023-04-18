import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersAlreadyExistsError } from './errors/users-already-exists'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const register = new RegisterUseCase(usersRepository)

    const { user } = await register.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const register = new RegisterUseCase(usersRepository)

    const email = 'johndoe@example.com'

    await register.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      register.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UsersAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const register = new RegisterUseCase(usersRepository)

    const { user } = await register.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
