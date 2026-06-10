/**
 * Cookies Service
 * A service to manage cookies in both server and client side inside Next.js.
 *
 */

type Expires = Date | number | string | null | undefined;
type HttpOnly = boolean | undefined;
type SameSite = "strict" | "lax" | "one" | undefined;

interface CookieOptions {
    expires?: Expires;
    httpOnly?: HttpOnly;
    sameSite?: SameSite;
    path?: string;
    domain?: string;
    secure?: boolean;
}

const runtime = typeof window === "undefined" ? "server" : "client";

const getCookies = async () => {
    if (runtime === "server") {
        const { cookies } = await import("next/headers");
        return cookies();
    }

    if (runtime === "client") {
        const Cookies = await import("js-cookie");
        return Cookies.default;
    }
};

const initializeCookies = async () => {
    const cookies = await getCookies();

    const get = async (key: string) => {
        // @ts-expect-error: runtime-dependent return type (ReadonlyRequestCookies | CookiesStatic)
        const cookie = cookies.get(key);

        if (runtime === "server") {
            if (cookie && typeof cookie === "object" && "value" in cookie) {
                return cookie.value ?? "az";
            }
            return "az";
        }

        if (runtime === "client") {
            return cookie ?? "az";
        }
    };

    const set = async (key: string, value: string, options?: CookieOptions) => {
        // @ts-expect-error: runtime-dependent return type (ReadonlyRequestCookies | CookiesStatic)
        return cookies.set(key, value, options);
    };

    const remove = async (key: string) => {
        if (runtime === "server") {
            // @ts-expect-error: runtime-dependent return type (ReadonlyRequestCookies | CookiesStatic)
            return cookies.delete(key);
        }
        // @ts-expect-error: runtime-dependent return type (ReadonlyRequestCookies | CookiesStatic)
        return cookies.remove(key);
    };

    const has = async (key: string) => {
        // @ts-expect-error: runtime-dependent return type (ReadonlyRequestCookies | CookiesStatic)
        return cookies.get(key) !== undefined;
    };


    return {
        get,
        set,
        remove,
        has,
    };
};

// Export the function that initializes and returns the cookies object
export default initializeCookies;