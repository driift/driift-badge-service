var NodeTwitter =  Npm.require("node-twitter")

Tweet = {

  uploadClient: null,

  init: function (credentials) {
    if (!credentials) throw new Error('Pass twitter credentials to DriiftTwitter.init')

    // FYI: Twit / github.com/ttezel/twit has better rate limit handling,
    // while node-twitter is generally cleaner and has upload support

    Tweet.uploadClient = new NodeTwitter.RestClient(
      credentials.consumer_key, credentials.consumer_secret,
      credentials.access_token, credentials.access_token_secret
    )
  },

  tweetWithMedia: function (status, path, cb) {
    if (Meteor.settings.twitter.silent) {  // TODO: pull out
      console.log('tweetWithMedia not sent due to `settings.twitter.silent`', status, path)
      Meteor.setTimeout(cb, 100)
    } else {
      console.log('tweetWithMedia', status, path, Twitter)
      Tweet.uploadClient.statusesUpdateWithMedia(
        {
          'status': status,
          'media[]': path
        },
        Meteor.bindEnvironment(cb)
      )
    }
  }
}

