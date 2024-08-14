import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to authenticate', async () => {
    const newUser = makeUser(
      {
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      'user-01',
    )

    await inMemoryUsersRepository.items.push(newUser)

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual('user-01')
  })

  it('should not be able to authenticate an user with wrong email', async () => {
    const newUser = makeUser(
      {
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      'user-01',
    )

    await inMemoryUsersRepository.items.push(newUser)

    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    const newUser = makeUser(
      {
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      },
      'user-01',
    )

    await inMemoryUsersRepository.items.push(newUser)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
