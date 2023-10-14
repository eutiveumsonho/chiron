export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api-management",
    "completions",
    "/api/api-keys",
    "/api/data/completions/approved",
    "/api/data/completions/pending",
    "/api/data/completions/rejected",
    "/api/data/completions/review",
  ],
};
