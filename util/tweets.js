const isRetweet = tweet => !!tweet.retweeted_status;

const getTweetText = tweet =>
  tweet.extended_tweet
    ? tweet.extended_tweet.full_text || tweet.full_text || tweet.text
    : tweet.full_text || tweet.text;

module.exports = {
  isRetweet,
  getTweetText
};
