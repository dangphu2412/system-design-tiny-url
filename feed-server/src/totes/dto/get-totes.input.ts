import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetTotesInput {
  @Field(() => Int)
  page: number;
  @Field(() => Int)
  size: number;
  @Field(() => [String], {
    nullable: true,
  })
  colors?: string[];
  @Field(() => Int, {
    nullable: true,
  })
  minPrice?: number;
  @Field(() => Int, {
    nullable: true,
  })
  maxPrice?: number;
  @Field(() => [String], {
    nullable: true,
  })
  materials?: string[];
  @Field(() => [String], {
    nullable: true,
  })
  sizes?: string[];
  @Field(() => [String], {
    nullable: true,
  })
  tags?: string[];
  @Field({
    nullable: true,
  })
  availability?: string;
  @Field({
    nullable: true,
  })
  minRating?: number;
  @Field(() => [String], {
    nullable: true,
  })
  styles?: string[];
  @Field({
    nullable: true,
  })
  searchQuery?: string;
}
