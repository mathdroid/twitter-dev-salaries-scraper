const fs = require("fs");

const statuses = require("./statuses2020-02-15T05:56:25.030Z.json"); // Change accordingly

const { getTweetText, isRetweet } = require("./util/tweets");

console.log(statuses.length);

const getEducation = tweetText =>
  tweetText
    .split("🏫")[1]
    .split("\n")[0]
    .replace(":", "")
    .trim();
const getExperience = tweetText =>
  tweetText
    .split("⏳")[1]
    .split("\n")[0]
    .replace(":", "")
    .trim();
const getLevel = tweetText => {
  try {
    return tweetText
      .split("🏷")[1]
      .split("\n")[0]
      .replace(":", "")
      .trim();
  } catch (err) {
    return "";
  }
};
const getLocation = tweetText =>
  tweetText
    .split("🌎")[1]
    .split("\n")[0]
    .replace(":", "")
    .trim();

const getSalary = tweetText =>
  tweetText
    .split("💸")[1]
    .split("\n")[0]
    .split("https://")[0]
    .replace(":", "")
    .trim();

const csvHeaders = `url,tweetId,screenName,name,followersCount,education,experience,level,location,salary`;
const csv = [csvHeaders];
for (const tweet of statuses.filter(t => !isRetweet(t))) {
  const tweetText = getTweetText(tweet);
  const line = [
    `https://twitter.com/${tweet.user.id_str}/status/${tweet.id_str}`,
    tweet.user.id_str,
    tweet.user.screen_name,
    tweet.user.name,
    tweet.user.followers_count,
    getEducation(tweetText),
    getExperience(tweetText),
    getLevel(tweetText),
    getLocation(tweetText),
    getSalary(tweetText)
  ]
    .map(str => `"${str}"`)
    .join(",");
  console.log(line);
  csv.push(line);
}

fs.writeFileSync(`${new Date().toISOString()}.csv`, csv.join("\n"));
