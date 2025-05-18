import { CreateToteInput } from './create-tote.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateToteInput extends PartialType(CreateToteInput) {
  @Field(() => Int)
  id: string;
}
