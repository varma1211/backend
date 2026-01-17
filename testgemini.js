import dotenv from "dotenv";
dotenv.config();

import { askGemini } from "./utils/gemini.js";

(async () => {
  const res = await askGemini("Give me 3 Java interview questions");
  console.log(res);
})();
