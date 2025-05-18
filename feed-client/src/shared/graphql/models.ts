export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
};

export type CreateToteInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type GetTotesInput = {
  availability?: InputMaybe<Scalars['String']['input']>;
  colors?: InputMaybe<Array<Scalars['String']['input']>>;
  materials?: InputMaybe<Array<Scalars['String']['input']>>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  minRating?: InputMaybe<Scalars['Float']['input']>;
  page: Scalars['Int']['input'];
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  size: Scalars['Int']['input'];
  sizes?: InputMaybe<Array<Scalars['String']['input']>>;
  styles?: InputMaybe<Array<Scalars['String']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTote: Scalars['ID']['output'];
  removeTote: Tote;
  updateTote: Tote;
};

export type MutationCreateToteArgs = {
  createToteInput: CreateToteInput;
};

export type MutationRemoveToteArgs = {
  id: Scalars['Int']['input'];
};

export type MutationUpdateToteArgs = {
  updateToteInput: UpdateToteInput;
};

export type Query = {
  __typename?: 'Query';
  tote: Tote;
  totes: Array<Tote>;
};

export type QueryToteArgs = {
  id: Scalars['String']['input'];
};

export type QueryTotesArgs = {
  getTotesInput: GetTotesInput;
};

export type Tote = {
  __typename?: 'Tote';
  bannerURL: Scalars['String']['output'];
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inStock: Scalars['Boolean']['output'];
  isBestSeller: Scalars['Boolean']['output'];
  isNewArrival: Scalars['Boolean']['output'];
  material: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  rating: Scalars['Float']['output'];
  size: Scalars['String']['output'];
  style: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateToteInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};
