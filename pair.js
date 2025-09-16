const { exec } = require("child_process");
const { upload } = require("./mega.js");
const express = require("express");
let router = express.Router();
const pino = require("pino");
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");

const MESSAGE =
  process.env.MESSAGE ||
  `
*🎉 SESSION GENERATED SUCCESSFULLY! ✅*

*💪 Empowering Your Experience with CRYPTIX MD Bot*

*🌟 Show your support by giving our repo a star! 🌟*
🔗 https://github.com/itsguruh/CRYPTIX-PAIR

*💭 Need help? Join our support groups:*
📢 💬
https://whatsapp.com/channel/0029VakUEfb4o7qVdkwPk83E

*🥀 Powered by CRYPTIX MD Bot 🥀*
`;

// clear auth dir if exists
if (fs.existsSync("./auth_info_baileys")) {
  fs.emptyDirSync(__dirname + "/auth_info_baileys");
}

router.get("/", async (req, res) => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    DisconnectReason,
    makeInMemoryStore,
  } = require("@whiskeysockets/baileys");

  const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });

  async function PAIRING() {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/auth_info_baileys"
    );

    try {
      let sock = makeWASocket({
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        auth: state,
      });

      sock.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;

        if (connection === "open") {
          await delay(3000);
          let user = sock.user.id;

          // random session ID
          function randomMegaId(length = 6, numberLength = 4) {
            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            for (let i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * characters.length)
              );
            }
            const number = Math.floor(Math.random() * Math.pow(10, numberLength));
            return `${result}${number}`;
          }

          const auth_path = "./auth_info_baileys/";
          const mega_url = await upload(
            fs.createReadStream(auth_path + "creds.json"),
            `${randomMegaId()}.json`
          );

          const string_session = mega_url.replace("https://mega.nz/file/", "");
          const Scan_Id = string_session;

          console.log(`
====================  SESSION ID  ==========================                   
SESSION-ID ==> ${Scan_Id}
------------------------------------------------------------
`);

          try {
            let msgsss = await sock.sendMessage(user, { text: Scan_Id });
            await sock.sendMessage(user, { text: MESSAGE }, { quoted: msgsss });
          } catch (err) {
            console.error("Error sending messages:", err);
          }

          await delay(1000);
          try {
            fs.emptyDirSync(__dirname + "/auth_info_baileys");
          } catch (e) {}
        }

        sock.ev.on("creds.update", saveCreds);

        if (connection === "close") {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

          if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed!");
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server!");
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            PAIRING().catch((err) => console.log(err));
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut!");
          } else {
            console.log("Connection closed with bot. Please run again.");
            console.log(reason);
            await delay(5000);
            exec("pm2 restart gifted");
            process.exit(0);
          }
        }
      });
    } catch (err) {
      console.log(err);
      exec("pm2 restart gifted");
      fs.emptyDirSync(__dirname + "/auth_info_baileys");
    }
  }

  PAIRING().catch(async (err) => {
    console.log(err);
    fs.emptyDirSync(__dirname + "/auth_info_baileys");
    exec("pm2 restart gifted");
  });

  return await PAIRING();
});

module.exports = router;
