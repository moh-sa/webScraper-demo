const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

const URL =
  "https://www.aljazeera.net/news/2022/12/26/%D8%B9%D8%A7%D8%AC%D9%84-%D8%AA%D8%A7%D8%B3-%D8%B9%D9%86-%D8%A7%D9%84%D8%AF%D9%81%D8%A7%D8%B9-%D8%A7%D9%84%D8%B1%D9%88%D8%B3%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D8%AC%D9%87%D9%8A%D8%B2%D8%A7%D8%AA";

axios(URL)
  .then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    console.log($("#main-content-area").html());
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
