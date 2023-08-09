import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class RoutesService {
    constructor() { }
    getHello(): string {
        return 'Welcome to the server!';
    }

    signIn(): string {
        return 'Sign in page';
    }

    signUp(): string {
        return 'Sign up page';
    }

    registration(): string {
        return 'Registration page';
    }

    getUsers() {
        return `all Users`;
    }

    getUserById(id: string): string {
        return `User with ID ${id}`;
    }

    updateUserById(id: string): string {
        return `User with ID ${id}`;
    }

    getProfile(): string {
        return 'User profile page';
    }

    createAdmin(): string {
        return 'Admin creation page';
    }

    verifyRules(): string {
        return 'Rules verification page';
    }

    changeAdmin(): string {
        return 'Admin management page';
    }

    manageChats(): string {
        return 'Admin chat management page';
    }

    privacyPolicy(): string {
        return 'Privacy policy page';
    }

    about(): string {
        return 'About us page';
    }

    manageTask(): string {
        return 'Manage task page';
    }

    getManageTask(): string {
        return ' Get manage task page';
    }

    getActiveTasks(): string {
        return 'Active tasks page';
    }

    getCompletedTasks(): string {
        return 'Completed tasks page';
    }
}