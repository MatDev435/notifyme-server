import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserUseCase } from './register-user-use-case'
import { compare } from 'bcryptjs'
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user).toEqual(inMemoryUsersRepository.items[0])
  })

  it('should hash users password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordValid = await compare('123456', user.passwordHash)

    expect(isPasswordValid).toEqual(true)
  })

  it('should not be able to register a user with same e-mail', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})
