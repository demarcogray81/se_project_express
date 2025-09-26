const { JWT_SECRET = "your-secret-key-goes-here" } = process.env; // Replace this with a .env variable later

module.exports = {
  JWT_SECRET,
};
