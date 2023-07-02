const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to mongoDb successfully");
  })
  .catch(() => {
    console.log(`Failed to connect with mongoDb. Error: ${err}`);
  });
