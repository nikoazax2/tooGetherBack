import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRegisterPayload } from '../auth/payload/user-register.payload';
import { Role } from '../roles/role.entity';
import { RoleEnum } from '../roles/role.enum';
import { from, Observable } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private users: Repository<User>,
        @InjectRepository(Role)
        private roles: Repository<Role>,
    ) { }

    async getAll(email) {
        return await this.users.find({ where: { email }, relations: ['roles'] });
    }

    async getprofile(id) {
        const entityManager = getManager();
        const user = await entityManager.query(
            `SELECT * from user where user.uuid = "${id}"`
        )
        return user;
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return this.users.findOne({
            where: { email: email },
            relations: ['roles'],
        });
    }

    async testmail(email: string) {
        return await this.users.find({
            where: { email },
            relations: ['roles'],
        });
    }

    async getById(id: string): Promise<User | undefined> {
        return await this.users.findOne({
            where: { uuid: id },
            relations: ['roles'],
        });
    }
    async isFriend(id: string) {
        const entityManager = getManager();
        const friendsId = await entityManager.query(
            `SELECT userUuid_2 from user_friends_user where userUuid_1 = "${id}"`,
        );
        return friendsId;
    }

    async getFriends(uuid: string) {
        const entityManager = getManager();
        const friends = await entityManager.query(
            `select friend.uuid, friend.surname, friend.avatar, friend.profileImage from user demandeur left JOIN user_friends_user jointure on demandeur.uuid = jointure.userId_1 left join user friend on friend.uuid = jointure.userId_2 where demandeur.uuid = '${uuid}'`,
        );
        if (
            JSON.stringify(friends) ==
            '[{"uuid":null,"surname":null,"avatar":null,"profileImage":null}]'
        ) {
            return [];
        } else {
            return friends;
        }
    }

    async update(uuid: string, UpdateUserDto: UpdateUserDto) {
        await this.users.update(uuid, UpdateUserDto);
    }

    async addFriend(idUser: string, idFriend: string) {
        const entityManager = getManager();
        const rawData = await entityManager.query(
            `INSERT INTO user_friends_user VALUES ('${idUser}', '${idFriend}') `,
        );
        return true;
    }

    async checkMail(mail: string) {
        const entityManager = getManager();
        const rawData = await entityManager.query(
            `SELECT count(uuid) as count from user where email='${mail}'`,
        );
        return rawData[0].count == 0 ? true : false;
    }

    async suppFriend(idUser: string, idFriend: string) {
        const entityManager = getManager();
        const rawData = await entityManager.query(
            `DELETE FROM user_friends_user WHERE user_friends_user.userUuid_1 = ${idUser} AND user_friends_user.userUuid_2 = ${idFriend}`,
        );
        return true;
    }

    async register(payload: UserRegisterPayload) {
        payload.uuid = uuidv4().replace(/-/g, '');
        if (
            payload.email === '' ||
            payload.surname === '' ||
            payload.password === '' ||
            payload.avatar === ''
        ) {
            throw new BadRequestException('Missing information');
        }
        let user = await this.getByEmail(payload.email);
        if (user) {
            throw new ConflictException();
        }

        let { password, ...payloadWithoutPass } = payload;

        // Hash the password
        const salt = await bcrypt.genSalt();
        const passHash = await bcrypt.hash(password, salt);

        // Set default role
        let role: Role = await this.roles.findOne({
            name: RoleEnum.User,
        });

        // Get number of users
        if ((await this.users.find()).length === 0) {
            // Set admin
            role = await this.roles.findOne({
                name: RoleEnum.Admin,
            });
        }

        return await this.users.save({
            ...payloadWithoutPass,
            password: passHash,
            roles: [role],
        });
    }

    updateOne(uuid: number, user: User): Observable<any> {
        return from(this.users.update(uuid, user));
    }

    async addProfileImage(path: string, user: User) {
        /*  const entityManager = getManager();
        const rawData = await entityManager.query(
          `INSERT INTO user_friends_user VALUES (${path}, ${path}) `,
        ); */
        return true;
    }
}
