import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TotesService } from './totes.service';
import { CreateToteInput } from './dto/create-tote.input';
import { UpdateToteInput } from './dto/update-tote.input';
import { Tote } from './tote.model';
import { ParseIntPipe } from '@nestjs/common';
import { GetTotesInput } from './dto/get-totes.input';

@Resolver(() => Tote)
export class TotesResolver {
  constructor(private readonly totesService: TotesService) {}

  @Mutation(() => ID)
  createTote(@Args('createToteInput') createToteInput: CreateToteInput) {
    return this.totesService.create(createToteInput);
  }

  @Query(() => [Tote], { name: 'totes' })
  findAll(@Args('getTotesInput') getTotesInput: GetTotesInput) {
    return this.totesService.findAll(getTotesInput);
  }

  @Query(() => Tote, { name: 'tote' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.totesService.findOne(id);
  }

  @Mutation(() => Tote)
  updateTote(@Args('updateToteInput') updateToteInput: UpdateToteInput) {
    return this.totesService.update(updateToteInput.id, updateToteInput);
  }

  @Mutation(() => Tote)
  removeTote(@Args('id', { type: () => Int }) id: number) {
    return this.totesService.remove(id);
  }
}
