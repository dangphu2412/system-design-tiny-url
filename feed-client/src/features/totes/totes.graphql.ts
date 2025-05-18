import type * as Types from '../../shared/graphql/models';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SearchTotesDashboardQueryVariables = Types.Exact<{
  getTotesInput: Types.GetTotesInput;
}>;

export type SearchTotesDashboardQuery = {
  __typename?: 'Query';
  totes: Array<{
    __typename?: 'Tote';
    id: string;
    name: string;
    color: string;
    description?: string | null;
    bannerURL: string;
    price: number;
    rating: number;
    size: string;
    style: Array<string>;
    inStock: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    material: string;
  }>;
};

export type GetQuickViewToteQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type GetQuickViewToteQuery = {
  __typename?: 'Query';
  tote: {
    __typename?: 'Tote';
    id: string;
    name: string;
    color: string;
    description?: string | null;
    bannerURL: string;
    price: number;
    rating: number;
    size: string;
    style: Array<string>;
    inStock: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    material: string;
  };
};

export const SearchTotesDashboardDocument = gql`
  query SearchTotesDashboard($getTotesInput: GetTotesInput!) {
    totes(getTotesInput: $getTotesInput) {
      id
      name
      color
      description
      bannerURL
      price
      rating
      size
      style
      inStock
      isBestSeller
      isNewArrival
      material
    }
  }
`;

/**
 * __useSearchTotesDashboardQuery__
 *
 * To run a query within a React component, call `useSearchTotesDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTotesDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTotesDashboardQuery({
 *   variables: {
 *      getTotesInput: // value for 'getTotesInput'
 *   },
 * });
 */
export function useSearchTotesDashboardQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchTotesDashboardQuery,
    SearchTotesDashboardQueryVariables
  > &
    (
      | { variables: SearchTotesDashboardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchTotesDashboardQuery,
    SearchTotesDashboardQueryVariables
  >(SearchTotesDashboardDocument, options);
}
export function useSearchTotesDashboardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchTotesDashboardQuery,
    SearchTotesDashboardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchTotesDashboardQuery,
    SearchTotesDashboardQueryVariables
  >(SearchTotesDashboardDocument, options);
}
export function useSearchTotesDashboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SearchTotesDashboardQuery,
        SearchTotesDashboardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchTotesDashboardQuery,
    SearchTotesDashboardQueryVariables
  >(SearchTotesDashboardDocument, options);
}
export type SearchTotesDashboardQueryHookResult = ReturnType<
  typeof useSearchTotesDashboardQuery
>;
export type SearchTotesDashboardLazyQueryHookResult = ReturnType<
  typeof useSearchTotesDashboardLazyQuery
>;
export type SearchTotesDashboardSuspenseQueryHookResult = ReturnType<
  typeof useSearchTotesDashboardSuspenseQuery
>;
export type SearchTotesDashboardQueryResult = Apollo.QueryResult<
  SearchTotesDashboardQuery,
  SearchTotesDashboardQueryVariables
>;
export const GetQuickViewToteDocument = gql`
  query GetQuickViewTote($id: String!) {
    tote(id: $id) {
      id
      name
      color
      description
      bannerURL
      price
      rating
      size
      style
      inStock
      isBestSeller
      isNewArrival
      material
    }
  }
`;

/**
 * __useGetQuickViewToteQuery__
 *
 * To run a query within a React component, call `useGetQuickViewToteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuickViewToteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuickViewToteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQuickViewToteQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetQuickViewToteQuery,
    GetQuickViewToteQueryVariables
  > &
    (
      | { variables: GetQuickViewToteQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetQuickViewToteQuery, GetQuickViewToteQueryVariables>(
    GetQuickViewToteDocument,
    options,
  );
}
export function useGetQuickViewToteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetQuickViewToteQuery,
    GetQuickViewToteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetQuickViewToteQuery,
    GetQuickViewToteQueryVariables
  >(GetQuickViewToteDocument, options);
}
export function useGetQuickViewToteSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetQuickViewToteQuery,
        GetQuickViewToteQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetQuickViewToteQuery,
    GetQuickViewToteQueryVariables
  >(GetQuickViewToteDocument, options);
}
export type GetQuickViewToteQueryHookResult = ReturnType<
  typeof useGetQuickViewToteQuery
>;
export type GetQuickViewToteLazyQueryHookResult = ReturnType<
  typeof useGetQuickViewToteLazyQuery
>;
export type GetQuickViewToteSuspenseQueryHookResult = ReturnType<
  typeof useGetQuickViewToteSuspenseQuery
>;
export type GetQuickViewToteQueryResult = Apollo.QueryResult<
  GetQuickViewToteQuery,
  GetQuickViewToteQueryVariables
>;
