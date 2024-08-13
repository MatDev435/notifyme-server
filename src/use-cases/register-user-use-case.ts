import { User } from '@prisma/client'
import { UsersRepository } from '../repositories/users-repository'
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error'
import { hash } from 'bcryptjs'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }

    const passwordHash = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return { user }
  }
}
