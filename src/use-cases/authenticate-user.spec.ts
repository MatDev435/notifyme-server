import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { AuthenticateUserUseCase } from './authenticate-user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate', async () => {
    inMemoryUsersRepository.items.push({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual('user-01')
  })

  it('should not be able to authenticate an user with wrong email', async () => {
    inMemoryUsersRepository.items.push({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    inMemoryUsersRepository.items.push({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
