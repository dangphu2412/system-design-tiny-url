
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  ignoreNoDocuments: true,
  generates: {
    'src/shared/graphql/models.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        useTypeImports: true, // Important for import compatibility
        scalars: {
          DateTime: 'string', // 👈 Fixes the 'any' issue
        },
      },
    },
    'src/features/': {
      preset: 'near-operation-file',
      documents: "src/features/**/*.gql",
      presetConfig: {
        baseTypesPath: '../shared/graphql/models.ts', // relative to the .ts file location
        extension: '.graphql.ts',
        folder: '.', // put generated files alongside their .graphql
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        scalars: {
          DateTime: 'string',
        },
        useTypeImports: true,
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  }
};

export default config;
