import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendshipRepository } from 'src/shared/database/repositories/friendships.repositories';
import { CreateFriendshipDTO } from './dto/create-friendship.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { NotificationsService } from '../notifications/services/notifications.service';
import {
  BASE_USER_SELECTOR,
  NotificationsIds,
  PAGE_SIZE,
} from 'src/common/constants';
import { Friendship as PrismaFriendship, Prisma } from '@prisma/client';
import { RedisService } from 'src/shared/redis/redis.service';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';
import { RedisPubSubService } from 'src/shared/redis/pubSub/pubSub.service';
import { BaseUser } from '../users/entities/baseUser.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendshipStatusEnum } from './entities/friendship-status.entity';

const includedItems = {
  user: {
    select: BASE_USER_SELECTOR,
  },
  friend: {
    select: BASE_USER_SELECTOR,
  },
};

type FriendshipInclude = Prisma.FriendshipGetPayload<{
  include: typeof includedItems;
}>;

const MOCK_USERS = [
  {
    id: '1',
    name: 'Alice',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 10,
    username: 'alice01',
    friendship: null,
  },
  {
    id: '2',
    name: 'Andrew',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 5,
    username: 'andrew92',
    friendship: null,
  },
  {
    id: '3',
    name: 'Bob',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 15,
    username: 'bobby',
    friendship: null,
  },
  {
    id: '4',
    name: 'Bella',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 8,
    username: 'bella7',
    friendship: null,
  },
  {
    id: '5',
    name: 'Charlie',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 12,
    username: 'charlie91',
    friendship: null,
  },
  {
    id: '6',
    name: 'Clara',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 6,
    username: 'clara2000',
    friendship: null,
  },
  {
    id: '7',
    name: 'David',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 9,
    username: 'dave99',
    friendship: null,
  },
  {
    id: '8',
    name: 'Diana',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 4,
    username: 'diana22',
    friendship: null,
  },
  {
    id: '9',
    name: 'Eve',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 11,
    username: 'eve88',
    friendship: null,
  },
  {
    id: '10',
    name: 'Edward',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'edward01',
    friendship: null,
  },
  {
    id: '11',
    name: 'Fiona',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 3,
    username: 'fiona93',
    friendship: null,
  },
  {
    id: '12',
    name: 'Fred',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 5,
    username: 'fred27',
    friendship: null,
  },
  {
    id: '13',
    name: 'George',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 14,
    username: 'george83',
    friendship: null,
  },
  {
    id: '14',
    name: 'Grace',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 6,
    username: 'grace72',
    friendship: null,
  },
  {
    id: '15',
    name: 'Hannah',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 8,
    username: 'hannah11',
    friendship: null,
  },
  {
    id: '16',
    name: 'Henry',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 10,
    username: 'henry94',
    friendship: null,
  },
  {
    id: '17',
    name: 'Isabel',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'isabel77',
    friendship: null,
  },
  {
    id: '18',
    name: 'Ian',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 3,
    username: 'ian56',
    friendship: null,
  },
  {
    id: '19',
    name: 'Jack',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 12,
    username: 'jack23',
    friendship: null,
  },
  {
    id: '20',
    name: 'Jill',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 4,
    username: 'jill82',
    friendship: null,
  },
  {
    id: '21',
    name: 'Karen',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 9,
    username: 'karen10',
    friendship: null,
  },
  {
    id: '22',
    name: 'Kyle',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 5,
    username: 'kyle78',
    friendship: null,
  },
  {
    id: '23',
    name: 'Laura',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 6,
    username: 'laura32',
    friendship: null,
  },
  {
    id: '24',
    name: 'Leon',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 11,
    username: 'leon87',
    friendship: null,
  },
  {
    id: '25',
    name: 'Mona',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 2,
    username: 'mona50',
    friendship: null,
  },
  {
    id: '26',
    name: 'Mike',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 10,
    username: 'mike71',
    friendship: null,
  },
  {
    id: '27',
    name: 'Nina',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 8,
    username: 'nina41',
    friendship: null,
  },
  {
    id: '28',
    name: 'Nick',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 6,
    username: 'nick99',
    friendship: null,
  },
  {
    id: '29',
    name: 'Olivia',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'olivia33',
    friendship: null,
  },
  {
    id: '30',
    name: 'Oscar',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 9,
    username: 'oscar65',
    friendship: null,
  },
  {
    id: '31',
    name: 'Paula',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 4,
    username: 'paula22',
    friendship: null,
  },
  {
    id: '32',
    name: 'Paul',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 8,
    username: 'paul93',
    friendship: null,
  },
  {
    id: '33',
    name: 'Quincy',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 3,
    username: 'quincy42',
    friendship: null,
  },
  {
    id: '34',
    name: 'Rachel',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 10,
    username: 'rachel54',
    friendship: null,
  },
  {
    id: '35',
    name: 'Robert',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 12,
    username: 'robert88',
    friendship: null,
  },
  {
    id: '36',
    name: 'Sarah',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'sarah25',
    friendship: null,
  },
  {
    id: '37',
    name: 'Steven',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 14,
    username: 'steven77',
    friendship: null,
  },
  {
    id: '38',
    name: 'Tina',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 4,
    username: 'tina12',
    friendship: null,
  },
  {
    id: '39',
    name: 'Tom',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 5,
    username: 'tom97',
    friendship: null,
  },
  {
    id: '40',
    name: 'Uma',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 6,
    username: 'uma81',
    friendship: null,
  },
  {
    id: '41',
    name: 'Victor',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'victor44',
    friendship: null,
  },
  {
    id: '42',
    name: 'Violet',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 5,
    username: 'violet32',
    friendship: null,
  },
  {
    id: '43',
    name: 'William',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 13,
    username: 'william66',
    friendship: null,
  },
  {
    id: '44',
    name: 'Wanda',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 9,
    username: 'wanda15',
    friendship: null,
  },
  {
    id: '45',
    name: 'Xander',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 10,
    username: 'xander98',
    friendship: null,
  },
  {
    id: '46',
    name: 'Yasmin',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 8,
    username: 'yasmin90',
    friendship: null,
  },
  {
    id: '47',
    name: 'Zara',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 7,
    username: 'zara63',
    friendship: null,
  },
  {
    id: '48',
    name: 'Zack',
    avatar: null,
    bio: null,
    banner: null,
    course: null,
    friendsCount: 11,
    username: 'zack50',
    friendship: null,
  },
];
@Injectable()
export class FriendshipsService {
  constructor(
    private readonly friendRepo: FriendshipRepository,
    private readonly usersRepo: UsersRepository,
    private readonly notService: NotificationsService,
    private readonly redisService: RedisService,
    private readonly pubSub: RedisPubSubService,
  ) {}

  async create(
    userId: string,
    data: CreateFriendshipDTO,
  ): Promise<ResponseEntity> {
    const { friendId } = data;
    const isAlreadyFriend = await this.friendRepo.findFirst({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });

    if (isAlreadyFriend) {
      return {
        message: 'Você já é amigo dessa pessoa.',
        success: false,
      };
    }

    const createdFriendship = await this.friendRepo.create({
      data: {
        userId,
        friendId,
        accepted: false,
      },
    });

    await this.notService.create({
      receiverId: [friendId],
      emitterId: userId,
      typeId: NotificationsIds.FRIENDSHIP,
      entity: {
        type: 'FRIENDSHIP',
        friendshipId: createdFriendship.id,
      },
    });

    return {
      message: 'Solicitação de amizade enviada com sucesso.',
      success: true,
      compl_data: createdFriendship.id,
    };
  }

  async accept(friendshipId: string, userId: string): Promise<ResponseEntity> {
    const includedFriendship = {
      notificationObject: {
        include: {
          notification: {
            select: {
              id: true,
            },
          },
        },
      },
    };

    type FriendshipInclude = Prisma.FriendshipGetPayload<{
      include: typeof includedFriendship;
    }>;

    const friendshipExists = (await this.friendRepo.findFirst({
      where: {
        id: friendshipId,
      },
      include: includedFriendship,
    })) as FriendshipInclude;

    if (!friendshipExists) {
      throw new NotFoundException('Amizade não encontrada.');
    }

    const updatedUser = await this.friendRepo.update({
      where: { id: friendshipId },
      data: { accepted: true },
    });

    const [userIdInCache, friendIdInCache] = await Promise.all([
      this.redisService.exists(`friends:${updatedUser.userId}`),
      this.redisService.exists(`friends:${updatedUser.friendId}`),
    ]);

    await Promise.all([
      userIdInCache &&
        this.redisService.sadd(`friends:${updatedUser.userId}`, [
          updatedUser.friendId,
        ]),
      friendIdInCache &&
        this.redisService.sadd(`friends:${updatedUser.friendId}`, [
          updatedUser.userId,
        ]),
    ]);

    await this.notService.delete(
      friendshipExists.notificationObject.notification[0].id,
      true,
    );

    return {
      message: 'Amizade aceita com sucesso.',
      success: true,
      compl_data: updatedUser.id,
    };
  }

  async delete(friendshipId: string, userId: string): Promise<ResponseEntity> {
    const friendshipExists = await this.friendRepo.findFirst({
      where: {
        id: friendshipId,
        OR: [
          {
            userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });

    if (!friendshipExists) {
      throw new NotFoundException('Amizade não encontrada.');
    }

    await this.friendRepo.delete({
      where: {
        id: friendshipId,
      },
    });

    return {
      message: 'Amizade desfeita com sucesso.',
      success: true,
      compl_data: friendshipId,
    };
  }

  async getAllFriends(userId: string, page: number) {
    try {
      const friends = (await this.friendRepo.findMany({
        where: {
          OR: [
            {
              userId,
              accepted: true,
            },
            {
              friendId: userId,
              accepted: true,
            },
          ],
        },
        include: includedItems,
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as FriendshipInclude[];

      const friendsData = friends.map((friend) => {
        const userData = friend.userId === userId ? friend.friend : friend.user;
        return userData;
      });
      return friendsData;
    } catch (e) {
      console.log(e);
    }
  }

  async getFriendRequestStatus(userId: string, friendId: string) {
    const friendship = await this.friendRepo.findFirst({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });

    if (!friendship) {
      return FriendshipStatusEnum.NONE;
    }

    if (friendship.accepted) {
      return FriendshipStatusEnum.ACCEPTED;
    }

    if (userId == friendship.userId) {
      return FriendshipStatusEnum.SENT;
    }

    if (friendship.userId == friendId) {
      return FriendshipStatusEnum.RECEIVED;
    }

    return friendship;
  }

  async getAllFriendsAlphabetical(userId: string, page: number) {
    try {
      const friends = await this.getAllFriends(userId, page);
      const categorizedFriends = Object.entries(
        friends.reduce(
          (acc, friend) => {
            const initial = friend.name.charAt(0).toUpperCase();
            if (!acc[initial]) {
              acc[initial] = [];
            }
            acc[initial].push(friend);
            return acc;
          },
          {} as Record<string, BaseUser[]>,
        ),
      )
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([letter, friends]) => ({ letter, friends }));

      console.log(categorizedFriends);

      return {
        data: categorizedFriends,
        hasNextPage: friends.length >= PAGE_SIZE,
      };
    } catch (e) {
      console.log(e);
    }

    // const friends = MOCK_USERS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    // const categorizedFriends = Object.entries(
    //   friends.reduce(
    //     (acc, friend) => {
    //       const initial = friend.name.charAt(0).toUpperCase();
    //       if (!acc[initial]) {
    //         acc[initial] = [];
    //       }
    //       acc[initial].push(friend);
    //       return acc;
    //     },
    //     {} as Record<string, BaseUser[]>,
    //   ),
    // ).map(([letter, friends]) => ({ letter, friends }));

    // return {
    //   data: categorizedFriends,
    //   hasNextPage: friends.length >= PAGE_SIZE,
    // };
  }

  async searchFriendsAlphabetically(
    userId: string,
    page: number,
    value: string,
  ) {
    if (!value) {
      throw new BadRequestException('O valor de busca não pode ser vazio.');
    }

    const friends = (await this.friendRepo.findMany({
      where: {
        OR: [
          {
            userId,
            friend: {
              name: {
                contains: value,
                mode: 'insensitive',
              },
            },
            accepted: true,
          },
          {
            friendId: userId,
            user: {
              name: {
                contains: value,
                mode: 'insensitive',
              },
            },
            accepted: true,
          },
        ],
      },
      include: includedItems,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    })) as FriendshipInclude[];

    const categorizedFriends = Object.entries(
      friends.reduce(
        (acc, user) => {
          const friend = user.userId === userId ? user.friend : user.user; // Determina o amigo real
          const initial = friend.name.charAt(0).toUpperCase(); // Pega a primeira letra do nome e converte para maiúscula
          if (!acc[initial]) {
            acc[initial] = [];
          }
          acc[initial].push(friend);
          return acc;
        },
        {} as Record<string, BaseUser[]>,
      ),
    ).map(([letter, friends]) => ({ letter, friends })); // Converte o objeto para o formato desejado

    return {
      data: categorizedFriends,
      hasNextPage: friends.length >= PAGE_SIZE,
    };
  }

  async getOnlineFriends(userId: string) {
    const onlineFriends = await this.redisService.sinter(
      'users:online',
      `friends:${userId}`,
    );

    const populatedFriends = await this.usersRepo.findMany({
      where: {
        id: {
          in: onlineFriends,
        },
      },
      select: BASE_USER_SELECTOR,
    });

    return populatedFriends;
  }

  async getUsersFriends(
    userId: string,
    includeSelf = false,
    useCache = true,
  ): Promise<string[]> {
    if (useCache) {
      const cachedFriends = await this.redisService.smembers(
        `friends:${userId}`,
      );
      if (cachedFriends && cachedFriends.length > 0) {
        if (includeSelf) cachedFriends.push(userId);
        return cachedFriends;
      }
    }

    const friendsIds = await this.friendRepo.findMany({
      where: {
        OR: [
          {
            userId,
            accepted: true,
          },
          {
            friendId: userId,
            accepted: true,
          },
        ],
      },
    });

    const ids = [
      ...(includeSelf ? [userId] : []),
      ...friendsIds.map((friend) => {
        if (friend.userId === userId) {
          return friend.friendId;
        }
        return friend.userId;
      }),
    ];

    return ids;
  }

  async getFriendsByUsernames(
    username: string,
    userId: string,
    page: number,
  ): Promise<BaseUser[]> {
    try {
      const includedItems = {
        user: {
          select: {
            ...BASE_USER_SELECTOR,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        friend: {
          select: {
            ...BASE_USER_SELECTOR,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      };

      type FriendshipInclude = Prisma.FriendshipGetPayload<{
        include: typeof includedItems;
      }>;

      const friendships = (await this.friendRepo.findMany({
        where: {
          OR: [
            {
              userId: userId,
              friend: { username: { contains: username.toLocaleLowerCase() } },
            },
            {
              friendId: userId,
              user: { username: { contains: username.toLocaleLowerCase() } },
            },
          ],
        },
        include: includedItems,
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      })) as FriendshipInclude[];

      return friendships.map((friend) => {
        if (friend.friendId === userId) {
          return {
            ...friend.user,
            friendship: this.parseFriendshipStatus(friend, userId) || null,
          };
        }
        if (friend.userId === userId) {
          return {
            ...friend.friend,
            friendship: this.parseFriendshipStatus(friend, userId) || null,
          };
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  countFriends(userId: string) {
    return this.friendRepo.count({
      where: {
        OR: [
          {
            userId,
            accepted: true,
          },
          {
            friendId: userId,
            accepted: true,
          },
        ],
      },
    });
  }

  parseFriendshipStatus(
    friendship: PrismaFriendship,
    userId: string,
  ): Friendship {
    if (!friendship) return null;

    if (!friendship.accepted) {
      if (friendship.userId === userId) {
        return {
          ...friendship,
          status: FriendshipStatusEnum.SENT,
        };
      }
      if (friendship.friendId === userId) {
        return {
          ...friendship,
          status: FriendshipStatusEnum.RECEIVED,
        };
      }
      return {
        ...friendship,
        status: FriendshipStatusEnum.NONE, // fallback
      };
    }

    return {
      ...friendship,
      status: FriendshipStatusEnum.ACCEPTED,
    };
  }

  async friendshipStatus(userId: string, friendId: string) {
    const friendship = await this.friendRepo.findFirst({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });
    return this.parseFriendshipStatus(friendship, userId);
  }

  async getFriendsStatus(userId: string) {
    try {
      const friends = await this.redisService.smembers(`friends:${userId}`);
      const subKey = friends.map((friend) => `status:${friend}`);
      return this.pubSub.asyncIterator(subKey);
    } catch (e) {
      console.log(e);
    }
  }
}
