if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables!");
}

const { JWT_SECRET } = process.env;

module.exports = { JWT_SECRET };
