declare module "express-session" {
  interface SessionData {
    user: { username: string };
  }
}
