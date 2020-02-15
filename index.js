const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");

const Twit = require("twit");

const { getTweetText } = require("./util/tweets");

const client = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const searchTweets = async opts => {
  return new Promise((resolve, reject) => {
    client.get("search/tweets", opts, (err, data, response) => {
      if (err) {
        console.error({ err });
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getNextMaxId = searchMetadata =>
  searchMetadata.next_results
    ? searchMetadata.next_results.split("max_id=")[1].split("&")[0]
    : false;

const getSalaries = async (maxId = null, count = 1) => {
  const { statuses, search_metadata } = await searchTweets({
    q: "🏫 ⏳ 🌎 💸",
    count: 100,
    max_id: maxId,
    include_entities: true,
    tweet_mode: "extended"
  });
  //   console.log(statuses);
  const next = getNextMaxId(search_metadata);

  if (next) {
    console.log(next, count, statuses.length);
    return [...statuses, ...(await getSalaries(next, count + 1))];
  } else {
    console.log("result length", statuses.length);
    return statuses;
  }
};

async function main() {
  const statuses = (await getSalaries())
    .reverse()
    .slice(1)
    .map(tweet => ({
      ...tweet,
      scrapedAt: new Date().toISOString()
    }));

  fs.writeFileSync(
    `statuses${new Date().toISOString()}.json`,
    JSON.stringify(statuses, null, 2)
  );

  console.log(statuses.length);
}

main();
