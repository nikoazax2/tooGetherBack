import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Chat } from '../chats/entities/chat.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Chat) private chats: Repository<Chat>,
        @InjectRepository(Activity) private activities: Repository<Activity>,
        @InjectRepository(User) private users: Repository<User>,
    ) { }

    async create(createActivityDto: CreateActivityDto) {
        return await this.activities.save(createActivityDto);
    }

    async findAll() {
        const activities = await this.activities
            .createQueryBuilder('activity')
            .orderBy('activity.date', 'ASC')
            .execute();

        return activities;
    }

    async findMap(coords: string) {
        coords = JSON.parse(coords)
        const entityManager = getManager();
        let lieux = null
        if (coords != null) {
            lieux = await entityManager.query(`SELECT
            activity.uuid as 'id', 
            activity.lat as 'lat',
            activity.lng as 'lng',
            activity.uuid as 'uuid',
            activity.name as 'name',
            activity.description as 'description',
            activity.date as 'date',
            activity.lieux as 'lieux',
            activity.creatorId as 'creatorId',
            activity.coordlieux as 'coordlieux',
            activity.emoji as 'emoji',
            activity.nbMax as 'nbMax',
            (
                SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'uuid', user.uuid,
                            'email', user.email,
                            'avatar', user.avatar,
                            'profileImage', user.profileImage,
                            'username', user.surname
                        )
                    )
                FROM activity_users_user
                LEFT JOIN user ON activity_users_user.userUuid = user.uuid
                WHERE activity_users_user.activityUuid = activity.uuid
                ) as users
              FROM activity 
              WHERE ST_Contains(ST_GeomFromText('POLYGON((${coords["no"]["lng"]} ${coords["no"]["lat"]}, ${coords["ne"]["lng"]} ${coords["ne"]["lat"]}, ${coords["se"]["lng"]} ${coords["se"]["lat"]}, ${coords["so"]["lng"]} ${coords["so"]["lat"]}, ${coords["no"]["lng"]} ${coords["no"]["lat"]}))'),  ST_GeomFromText(CONCAT("POINT(", activity.lng, " ", activity.lat,")")))
              ORDER BY activity.date DESC
              LIMIT 50;`)
        } else {
            lieux = await entityManager.query(
                `SELECT
                activity.uuid as 'uuid', 
                activity.lat as 'lat',
                activity.lng as 'lng',
                activity.uuid as 'uuid',
                activity.name as 'name',
                activity.description as 'description',
                activity.date as 'date',
                activity.lieux as 'lieux',
                activity.creatorId as 'creatorId',
                activity.coordlieux as 'coordlieux',
                activity.emoji as 'emoji',
                activity.nbMax as 'nbMax',
                  (
                     SELECT
                         JSON_ARRAYAGG(
                             JSON_OBJECT(
                                'uuid', user.uuid,
                                'email', user.email,
                                'avatar', user.avatar,
                                'profileImage', user.profileImage,
                                'username', user.surname
                             )
                         )
                     FROM activity_users_user
                     LEFT JOIN user ON activity_users_user.userUuid = user.uuid
                     WHERE activity_users_user.activityUuid = activity.uuid
                     ) as users
                    FROM activity 
                    ORDER BY activity.date DESC
                    LIMIT 50`,
            )
        }

        return lieux;
    }

    async findOne(id: string) {
        return await this.activities.findOne({
            select: [
                'uuid',
                'name',
                'lieux',
                'date',
                'description',
                'coordlieux',
                'creatorId',
                'emoji',
            ],
            relations: ['users'],
            where: { uuid: id },
        });
    }

    async getAllWParams(name: string, lieux: string, date: string) {
        const entityManager = getManager();
        name == 'null' ? (name = null) : '';
        lieux == 'null' ? (lieux = null) : '';
        date == 'null' ? (date = null) : '';

        let nameSQL = name ? `activity.name like '%${name}%'` : '';
        let lieuxSQL = lieux ? `activity.lieux like '%${lieux}%'` : '';
        let dateSQL = date ? `activity.date like '%${date}%'` : '';

        let where = '';
        if (name && lieux && date) {
            where = `where ${nameSQL} and ${lieuxSQL} and ${dateSQL}  and activity.date > NOW()`;
        } else if (name && lieux) {
            where = `where ${lieuxSQL} and ${nameSQL}  and activity.date > NOW()`;
        } else if (name && date) {
            where = `where ${dateSQL} and ${nameSQL}  and activity.date > NOW()`;
        } else if (date && lieux) {
            where = `where ${lieuxSQL} and ${dateSQL}  and activity.date > NOW()`;
        } else if (nameSQL || lieuxSQL || dateSQL) {
            where = `where ${nameSQL} ${lieuxSQL} ${dateSQL} and activity.date > NOW()`;
        } else {
            where = 'WHERE activity.date > NOW()'
        }

        const activitys = await entityManager.query(
            `SELECT
      activity.uuid as 'uuid',
      activity.name as 'name',
      activity.description as 'description',
      activity.date as 'date',
      activity.lieux as 'lieux',
      activity.creatorId as 'creatorId',
      activity.coordlieux as 'coordlieux',
      activity.emoji as 'emoji',
      activity.nbMax as 'nbMax',
      (
         SELECT
             JSON_ARRAYAGG(
                 JSON_OBJECT(
                        'usr_id', user.uuid,
                     'email', user.email,
                     'avatar', user.avatar,
                     'profileImage', user.profileImage,
                     'username', user.surname
                 )
             )
         FROM activity_users_user
         LEFT JOIN user ON activity_users_user.userUuid = user.uuid
         WHERE activity_users_user.activityUuid = activity.uuid
         ) as users
        FROM activity
        ${where}
        ORDER BY activity.date DESC
        LIMIT 10`,
        );
        return activitys;
    }

    async findFromCreator(userUuid: string) {
        return await this.activities.find({
            relations: ['users'],
            where: { creatorId: userUuid },
        });
    }

    async findFromPaticipant(userUuidPaticipant: string) {
        const entityManager = getManager();

        const activitys = await entityManager.query(
            `SELECT act.uuid,act.name,act.description,act.date,act.lieux,act.creatorId,act.coordlieux,act.emoji,act.nbMax,usr.uuid as usr_id,usr.email,usr.surname,usr.avatar,usr.profileImage from activity act 
      JOIN activity_users_user act_usr on act.uuid = act_usr.activityUuid
      JOIN user usr on usr.uuid = act_usr.userUuid
      where usr.uuid = '${userUuidPaticipant}'
      ORDER by act.date desc`,
        );
        for (let index = 0; index < activitys.length; index++) {
            let users = await entityManager.query(
                `select usr.uuid,usr.avatar,usr.profileImage,usr.surname from user usr
        JOIN activity_users_user act_usr on usr.uuid = act_usr.userUuid
        JOIN activity act on act.uuid = act_usr.activityUuid
        where act.uuid='${activitys[index].act_id}'`,
            );
            activitys[index].users = users;
            if (index == activitys.length - 1) {
                return activitys;
            }
        }
    }

    async findFromUser(userUuid: string) {
        const entityManager = getManager();
        const activity = await entityManager.query(
            `SELECT activity.uuid,activity.uuid,activity.name,activity.date,activity.description,activity.lieux,activity.creatorId,activity.coordlieux,activity.emoji,activity.nbMax 
      FROM activity join activity_users_user on activityUuid = activity.uuid 
      join user on userUuid = user.uuid 
      where userUuid='${userUuid}' 
      order by activity.date`,
        );
        return activity;
    }

    async addUser(uuid: string, userUuid: string) {
        console.log(uuid);

        let activity = await this.activities.findOne({
            relations: ['users'],
            where: { uuid: uuid },
        });
        if (!activity) {
            throw new NotFoundException('Activity not found');
        }
        let user = await this.users.findOne({
            where: { uuid: userUuid }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        activity.users.push(user);
        activity.save();
        return true;
    }

    async removeUser(uuid: string, userUuid: string) {
        let activity = await this.activities.findOne({
            relations: ['users'],
            where: { uuid: uuid },
        });
        if (!activity) {
            throw new NotFoundException('Activity not found');
        }
        let user = await this.users.findOne(userUuid);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        activity.users.splice(activity.users.indexOf(user), 1);
        activity.save();
        return true;
    }

    async update(uuid: string, updateActivitytDto: UpdateActivityDto) {
        await this.activities.update(uuid, updateActivitytDto);
    }

    async remove(uuid: string) {
        await this.activities.delete(uuid);
    }
}
