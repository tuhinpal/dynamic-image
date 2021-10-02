module.exports = function () {
  if (process.env.VERCEL_ENV === "production") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return `http://localhost:3000`;
  }
};
