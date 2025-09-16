// mega.js - hardened MEGA uploader with fallback
const mega = require("megajs");
const fs = require("fs");

const auth = {
  email: process.env.MEGA_EMAIL || 'techobed4@gmail.com',
  password: process.env.MEGA_PASSWORD || 'Trippleo1802obed',
  userAgent:
    process.env.MEGA_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
  return new Promise((resolve) => {
    try {
      if (!auth.email || !auth.password) {
        console.error("⚠️ Missing MEGA credentials, falling back to local file.");
        fs.writeFileSync(name, data);
        return resolve(`/sessions/${name}`);
      }

      const storage = new mega.Storage({
        email: auth.email,
        password: auth.password,
        userAgent: auth.userAgent
      });

      storage.on("ready", () => {
        try {
          const file = storage.root.upload({ name });
          file.on("uploadEnd", () => {
            file.link((err, url) => {
              storage.close();
              if (err || !url) {
                console.error("⚠️ MEGA link error:", err?.message);
                fs.writeFileSync(name, data);
                return resolve(`/sessions/${name}`);
              }
              resolve(url);
            });
          });

          file.on("error", (err) => {
            console.error("⚠️ MEGA upload error:", err.message);
            storage.close();
            fs.writeFileSync(name, data);
            resolve(`/sessions/${name}`);
          });

          file.end(data);
        } catch (err) {
          console.error("⚠️ Upload exception:", err.message);
          fs.writeFileSync(name, data);
          resolve(`/sessions/${name}`);
        }
      });

      storage.on("error", (err) => {
        console.error("⚠️ MEGA storage error:", err.message);
        fs.writeFileSync(name, data);
        resolve(`/sessions/${name}`);
      });
    } catch (err) {
      console.error("⚠️ Unexpected MEGA error:", err.message);
      fs.writeFileSync(name, data);
      resolve(`/sessions/${name}`);
    }
  });
};

module.exports = { upload };
