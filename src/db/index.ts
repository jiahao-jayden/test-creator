import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

if (typeof window !== "undefined") {
  throw new TypeError("Database connection should only be used on the server side")
}

let dbInstance: PostgresJsDatabase<typeof schema> | null = null

function createDatabaseConnection(): PostgresJsDatabase<typeof schema> {
  if (dbInstance) {
    return dbInstance
  }

  // Configure postgres client with better settings for consistency
  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    // Ensure proper transaction handling
    max: 20, // Maximum number of connections
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
    debug: process.env.NODE_ENV === "development", // Enable debug logging in development
  })

  dbInstance = drizzle(client, {
    schema,
    logger:
      process.env.NODE_ENV === "development"
        ? {
            logQuery: (query, params) => {
              // Filter out select queries
              if (query.toLowerCase().trim().startsWith("select")) {
                return
              }

              console.log("=".repeat(60))

              console.log("\n\x1b[33m[Drizzle]\x1b[0m\n")
              console.log(`Query: \n${query}\n`)

              if (params && params.length > 0) {
                console.log(`Params: \n${JSON.stringify(params, null, 2)}\n`)
              }

              console.log("=".repeat(60))
            },
          }
        : undefined,
  })

  return dbInstance
}

const db = createDatabaseConnection()

export default db
