// mega.js - MEGA uploader (fixed errors, same style)
const mega = require("megajs");

const auth = {
  email: process.env.MEGA_EMAIL || process.env.email || 'techobed4@gmail.com',
  password: process.env.MEGA_PASSWORD || process.env.password || 'Trippleo1802obed',
  userAgent:
    process.env.MEGA_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
  return new Promise((resolve, reject) => {
    try {
      if (!auth.email || !auth.password) {
        console.error("⚠️ Missing MEGA_EMAIL or MEGA_PASSWORD, using fallback.");
        return resolve(`fallback-session-${Date.now()}.json`);
      }

      const storage = new mega.Storage({
        email: auth.email,
        password: auth.password,
        userAgent: auth.userAgent
      });

      storage.on("ready", () => {
        try {
          const file = storage.root.upload({
            name: name || `file-${Date.now()}`,
            size: Buffer.isBuffer(data) ? data.length : (data?.length || 0)
          });

          file.on("uploadEnd", function () {
            file.link((err, url) => {
              storage.close();
              if (err || !url) {
                console.error("⚠️ MEGA link error:", err?.message);
                return resolve(`fallback-session-${Date.now()}.json`);
              }
              resolve(url);
            });
          });

          file.on("error", (err) => {
            console.error("⚠️ MEGA upload error:", err.message);
            storage.close();
            resolve(`fallback-session-${Date.now()}.json`);
          });

          if (Buffer.isBuffer(data)) {
            file.end(data);
          } else if (typeof data === "string") {
            file.end(Buffer.from(data));
          } else {
            file.end("");
          }
        } catch (err) {
          console.error("⚠️ Upload exception:", err.message);
          resolve(`fallback-session-${Date.now()}.json`);
        }
      });

      storage.on("error", (err) => {
        console.error("⚠️ MEGA storage error:", err.message);
        resolve(`fallback-session-${Date.now()}.json`);
      });
    } catch (err) {
      console.error("⚠️ Unexpected MEGA error:", err.message);
      resolve(`fallback-session-${Date.now()}.json`);
    }
  });
};

module.exports = { upload };
