import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateNotificationObjectDTO } from './create-notification-object.dto';

@InputType()
export class CreateNotificationDTO extends PartialType(
  CreateNotificationObjectDTO,
) {
  @Field({ nullable: true })
  notificationObjectId?: string;

  @Field(() => [String])
  receiverId: string[];
}
