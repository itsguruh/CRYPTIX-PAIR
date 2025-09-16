const { exec } = require("child_process");
const { upload } = require("./mega.js");
const express = require("express");
let router = express.Router();
const pino = require("pino");
let { toBuffer } = require("qrcode");
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
  try {
    fs.emptyDirSync(__dirname + "/auth_info_baileys");
  } catch (e) {}
}

router.get("/", async (req, res) => {
  const {
    default: SuhailWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    DisconnectReason,
    makeInMemoryStore,
  } = require("@whiskeysockets/baileys");

  const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });

  async function SUHAIL() {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/auth_info_baileys"
    );

    try {
      let Smd = SuhailWASocket({
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        auth: state,
      });

      Smd.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect, qr } = s;

        if (qr && !res.headersSent) {
          try {
            const qrBuffer = await toBuffer(qr);
            res.setHeader("Content-Type", "image/png");
            res.end(qrBuffer);
            return;
          } catch (error) {
            console.error("Error generating QR Code buffer:", error);
            return;
          }
        }

        if (connection === "open") {
          await delay(3000);
          let user = Smd.user.id;

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
            let msgsss = await Smd.sendMessage(user, { text: Scan_Id });
            await Smd.sendMessage(user, { text: MESSAGE }, { quoted: msgsss });
          } catch (err) {
            console.error("Error sending messages:", err);
          }

          await delay(1000);
          try {
            fs.emptyDirSync(__dirname + "/auth_info_baileys");
          } catch (e) {}
        }

        Smd.ev.on("creds.update", saveCreds);

        if (connection === "close") {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

          if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed!");
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server!");
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            SUHAIL().catch((err) => console.log(err));
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut!");
          } else {
            console.log("Connection closed with bot. Please run again.");
            console.log(reason);
            await delay(5000);
            exec("pm2 restart gifted"); // <-- check your pm2 name here
            process.exit(0);
          }
        }
      });
    } catch (err) {
      console.log(err);
      exec("pm2 restart gifted");
      try {
        fs.emptyDirSync(__dirname + "/auth_info_baileys");
      } catch (e) {}
    }
  }

  try {
    await SUHAIL();
  } catch (err) {
    console.log(err);
    try {
      fs.emptyDirSync(__dirname + "/auth_info_baileys");
    } catch (e) {}
    exec("pm2 restart gifted");
  }
});

module.exports = router;
