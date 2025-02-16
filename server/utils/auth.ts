import type { EventHandler, EventHandlerRequest, H3Event, EventHandlerResponse } from "h3"
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const defineAuthEventHandler = <T extends EventHandlerRequest, D>(
  handler: (event: H3Event<T>, session: Session | undefined) => EventHandlerResponse<D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      // do something before the route handler
      const session = await auth.api.getSession({
        headers: event.headers,
      })
      if (!session)
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
        })
      //
      const response = await handler(event, session)
      // do something after the route handler
      //
      return response
    } catch (err) {
      // Error handling
      return err
    }
  })

export const auth = betterAuth({
  //...rest of the options
  emailAndPassword: {
    enabled: true,
  },
  database: new Database("./sqlite.db"),
})

type Session = typeof auth.$Infer.Session
