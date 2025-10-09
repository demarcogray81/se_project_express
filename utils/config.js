const { NODE_ENV, JWT_SECRET } = process.env;

if (NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in production environment variables!");
}

module.exports = {
  JWT_SECRET: JWT_SECRET || "dev-secret-do-not-use-in-prod",
};
