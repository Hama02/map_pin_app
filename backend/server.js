const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinRouter = require("./routes/pin");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDb Connected!!"))
  .catch((err) => console.log(err));

app.use("/api/pins", pinRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
