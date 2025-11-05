import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import bodyParser = require("body-parser");

dotenv.config();
const app = express();

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/auth", authRoutes);

export default app;

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
