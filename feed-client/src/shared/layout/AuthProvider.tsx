// app/auth-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import {apolloClient} from "@/shared/graphql/apollo-client";
import { ApolloProvider } from "@apollo/client";

export function AuthProvider({ children }: { children: ReactNode }) {
    return <SessionProvider>
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    </SessionProvider>;
}
