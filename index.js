const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();

/**
 *
 * @param {string} baseDomain - https://www.aljazeera.net
 * @param {string} subdirectory - /news
 * @returns {Array of Objects} - have the final result
 */
const getList = async (baseDomain, subdirectory) => {
  try {
    const links = [];
    const articles = [];
    const { data } = await axios(baseDomain + subdirectory);
    const $ = cheerio.load(data);
    $("#news-feed-container", data).each(function () {
      $(this)
        .find("article")
        .each(function () {
          const link = $(this).find("a").attr("href");
          links.push(link);
        });
    });

    await Promise.all(
      links.map(async (x) => {
        const test = await getContent(`${baseDomain}${x}`, baseDomain);
        articles.push(test);
      })
    );
    return articles;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {String} fetchLink - singe article URL
 * @param {String} imgDomain - the domain used for imgs
 * @returns {Object} - single article data {title, imgURL, date, body}
 */
const getContent = async (fetchLink, imgDomain) => {
  try {
    const { data } = await axios(fetchLink);
    const $ = cheerio.load(data);
    const title = $("#main-content-area h1").text();
    const figure = $("#main-content-area figure", data);
    const image = figure.find("img").attr("src").split("?")[0];
    const imgURL = imgDomain + image;
    const date = $("#main-content-area .article-b-l").text().split("-")[0];
    const body = $(".wysiwyg--all-content")
      .text()
      .replace(/(\r\n|\n|\r|\t)/gm, "");
    return { title, imgURL, date, body };
  } catch (error) {
    console.log(error);
  }
};

app.get("/", async (req, res) => {
  const baseDomain = req.query.bd;
  const subdirectory = req.query.sd;
  const data = await getList(baseDomain, subdirectory);
  res.json(data);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
