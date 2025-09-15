// mega.js - MEGA upload helper (reads credentials from env vars)
const mega = require("megajs");

const auth = {
  email: process.env.MEGA_EMAIL || process.env.email || '',
  password: process.env.MEGA_PASSWORD || process.env.password || '',
  userAgent:
    process.env.MEGA_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
  return new Promise((resolve, reject) => {
    try {
      if (!auth.email || !auth.password) {
        return reject(new Error("Missing MEGA_EMAIL or MEGA_PASSWORD environment variable"));
      }

      const storage = new mega.Storage({
        email: auth.email,
        password: auth.password,
        userAgent: auth.userAgent
      });

      storage.on("ready", () => {
        const file = storage.root.upload({
          name: name || `file-${Date.now()}`,
          size: Buffer.isBuffer(data) ? data.length : (data.length || 0)
        });

        file.on("uploadEnd", function () {
          file.link((err, url) => {
            storage.close();
            if (err) return reject(err);
            resolve(url);
          });
        });

        file.on("error", (err) => {
          storage.close();
          reject(err);
        });

        file.write(data);
        file.complete();
      });

      storage.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { upload };