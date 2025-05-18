import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';
//
// {
//   id: string
//   name: string
//   price: number
//   rating: number
//   image: string
//   color: string
//   material: string
//   size: string
//   isNewArrival: boolean
//   isBestSeller: boolean
//   inStock: boolean
//   style: string[]
// }
@ObjectType()
export class Tote {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price?: number;

  @Field()
  bannerURL: string;

  @Field()
  color: string;

  @Field()
  material: string;

  @Field()
  size: string;

  @Field()
  rating: number;

  @Field(() => Boolean)
  isNewArrival: boolean;

  @Field(() => Boolean)
  isBestSeller: boolean;

  @Field()
  inStock: boolean;

  @Field(() => [String])
  style: string[];

  @Field(() => GraphQLDateTime)
  createdAt: Date;

  @Field(() => GraphQLDateTime)
  updatedAt: Date;
}
