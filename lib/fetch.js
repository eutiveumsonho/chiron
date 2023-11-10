import { headers } from "next/headers";

export async function f(input, init = {}) {
  const url = process.env.NEXTAUTH_URL + input;

  return fetch(url, {
    ...init,
    cache: "no-cache", // 'force-cache' is the default in Next.js 🤦‍
    // Headers cannot be modified, error on deployment, working locally
    // https://nextjs-forum.com/post/1160308077753544805
    // https://github.com/nextauthjs/next-auth/issues/7423
    headers: headers(),
  });
}
