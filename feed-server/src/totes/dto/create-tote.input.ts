import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateToteInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
