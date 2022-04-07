import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { throwError } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

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
