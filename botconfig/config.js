module.exports = {
  "token": process.env.TOKEN, //Discord Bot Token
  "MongoURL": "mongodb+srv://xd666:naveen123@cluster.gbcmjjt.mongodb.net/?retryWrites=true&w=majority", //if dbType = MONGO, this is required else skip
  "loadSlashsGlobal": true,
  "prefix": "!", //Bot Prefix
  "dirSetup": [{
    "Folder": "Info", "CmdName": "info",
    "CmdDescription": "Grant specific Information about something!"
  }]
}
