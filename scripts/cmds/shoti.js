const axios = require("axios");
const request = require('request');
const fs = require("fs");

module.exports = {
    config: {
        name: "shoti",
        aliases: ["shoti"],
        author: "Marjhxn",
        version: "1.0.0",
        role: 0,
        shortDescription: "Send a Shoti video",
        longDescription: "Send a random shoti video on command",
        category: "fun",
        guide: "{pn} shoti",
    },
    onStart: async function ({ api, event }) {
        try {
            let response = await axios.post(
                "https://your-shoti-api.vercel.app/api/v1/get",
                {
                    apikey: "$shoti-1hg4gifgnlfdmeslom8",
                }
            );

            const data = response.data.data;

            const username = data.user.username;
            const nickname = data.user.nickname;
            const duration = data.duration;

            var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
            var rqs = request(encodeURI(data.url));
            rqs.pipe(file);

            file.on('finish', () => {
                api.sendMessage(
                    {
                        body: `𝗛𝗘𝗥𝗘'𝗦 𝗬𝗢𝗨𝗥 𝗦𝗛𝗢𝗧𝗜 𝗩𝗜𝗗𝗘𝗢!\n\n𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${username}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${nickname}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}`,
                        attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
                    },
                    event.threadID,
                    (error, info) => {
                        if (!error) {
                            fs.unlinkSync(__dirname + '/cache/shoti.mp4');
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage('Error fetching TikTok video.', event.threadID);
        }
    }
};
