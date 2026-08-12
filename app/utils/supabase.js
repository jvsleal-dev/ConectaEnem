import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from 'h3'

export function createSupabaseServerClient(event) {
  const config = useRuntimeConfig(event)

  const initialCookies = parseCookies(event)

  const cookieStore = new Map(
    Object.entries(initialCookies)
  )

  return createServerClient(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return Array.from(cookieStore.entries()).map(
            ([name, value]) => ({
              name,
              value
            })
          )
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              cookieStore.set(name, value)

              setCookie(
                event,
                name,
                value,
                options
              )
            }
          )
        }
      }
    }
  )
}