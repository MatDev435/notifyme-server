import { User, UserProps } from 'src/domain/entities/user'
import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  return User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}
