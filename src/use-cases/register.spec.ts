import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should be able to register', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@mail.com',
            password: 'password'
        })

        expect(user.id).toEqual(expect.any(String))
    })
    it('should hash user password upon registration', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@mail.com',
            password: 'password'
        })

        const isPasswordCorrectluyHashed = await compare('password', user.password_hash)

        expect(isPasswordCorrectluyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = "john.doe@mail.com"

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: 'password'
        })

        await expect(registerUseCase.execute({
            name: 'John Doe',
            email,
            password: 'password'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
