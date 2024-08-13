import { User } from '@prisma/client'
import { UsersRepository } from '../repositories/users-repository'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUserUseCaseResponse {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
