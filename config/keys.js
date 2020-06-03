require("dotenv").config();

//this file will contain the key for mongoDB atlas
module.exports = {
  MongoURI: process.env.MONGO_KEY,
  // google: {
  //   clientID: process.env.GOOGLE_CLIENT_KEY,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // },
  google: {
    clientID:
      "187838931884-pmkooo3t4tvm82sl41ji7553d9dd5s8d.apps.googleusercontent.com",
    clientSecret: "ECxqW7Fsxxfehj7J63FksUcz",
  },
  MongoURI:
    "mongodb+srv://admin:Abc123@cluster0-dbcm5.mongodb.net/test?retryWrites=true&w=majority",
};
