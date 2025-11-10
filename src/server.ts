import express from "express";
import dotenv from "dotenv";

const cors = require("cors");

import authRoutes from "./routes/authRoutes";
import bodyParser = require("body-parser");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "https://carbonblaze-frontend.vercel.app/", // Replace with your Next.js frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to send cookies or authentication headers
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the Carbonblaze API");
});

app.get("/signin", (req, res) => {
  res.send("Welcome to the Carbonblaze API");
});
// create application/json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
// create application/x-www-form-urlencoded parser

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
