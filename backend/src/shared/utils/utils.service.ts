import { Global, Injectable } from '@nestjs/common';
import { BaseUser } from 'src/modules/users/entities/baseUser.entity';

@Global()
@Injectable()
export class UtilsService {
  contentParser(content: string, users: BaseUser[]) {
    const mentions = content.match(
      /@[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g,
    );
    if (!mentions) return content;
    for (const mention of mentions) {
      for (const user of users) {
        if (!mention.includes('@' + user.id)) continue;
        content = content.replace(
          mention,
          `<mention id=${user.id} username=${user.username} name=${user.name} />`,
        );
      }
    }
    return content;
  }

  chatNameParser(
    name: string,
    users: { userId: string; name: string }[],
    selfId: string,
  ) {
    const [id1, id2] = name.split('<INTERNAL_SERVER_SPLITTER>');
    if (id1 === selfId) {
      return users.find((user) => user.userId === id2).name;
    } else {
      return users.find((user) => user.userId === id1).name;
    }
  }

  getDirectImage(users: { userId: string; avatar: string }[], selfId: string) {
    const [id1, id2] = users.map((user) => user.userId);
    if (id1 === selfId) {
      return users.find((user) => user.userId === id2).avatar;
    } else {
      return users.find((user) => user.userId === id1).avatar;
    }
  }
}
