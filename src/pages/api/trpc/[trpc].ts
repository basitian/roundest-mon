import * as trpcNext from '@trpc/server/adapters/next';
import { AppRouter, appRouter } from '@/server/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: () => ({}),
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
