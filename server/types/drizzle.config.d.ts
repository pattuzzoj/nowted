export declare const db: import("drizzle-orm/neon-http").NeonHttpDatabase<Record<string, never>> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
};
export type DatabaseType = typeof db;
declare const _default: import("drizzle-kit").Config;
export default _default;
//# sourceMappingURL=drizzle.config.d.ts.map