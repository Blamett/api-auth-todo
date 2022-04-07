import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToke';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    login(user: User): UserToken {
        
        const payload: UserPayload = {
            sub: user.id,
            username: user.username
        };

        const jwtToken  = this.jwtService.sign(payload)

        return{
            access_token: jwtToken
        }
    }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username);

        if(user){
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                return {
                    ...user,
                    password: undefined,
                }
            }
        }

        // nao encontrou user / password n corresponde
        throw new Error('Email address or password provided is incorrect')
    }
}
