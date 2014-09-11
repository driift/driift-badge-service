
Meteor.publish('badges', function(id) {
  return id ? Badges.find(id) : Badges.find()
})

Meteor.methods({

  'tweetBadge': function (badgeData, cardData) {
    check(badgeData, Match.ObjectIncluding({ name: String, event: Match.Optional(String) }))

    var fields = {name: badgeData.name}
    if (!badgeData.global && badgeData.event) fields.event = badgeData.event

    var badge = Badges.findOne(fields)
    if (!badge) throw new Meteor.Error(404, "No badge for " + badgeData.name)

    var status = Handlebars.templates['tweet-badge']({
      badge: badge,
      card: cardData
    })

    if (Meteor.settings.twitter && Meteor.settings.twitter.silent) {
      throw new Meteor.Error(420, "Badge service is silent")
    }

    Tweet.tweetWithMedia(status, pathFor(badge), function(err, data){
      if (err) return console.error(err)
      if (data) return console.log("badge tweet success", status, badge.name)
    })
  }
})

Meteor.startup(function () {

  // init Tweet
  if (Meteor.settings.twitter) {
    Tweet.init(Meteor.settings.twitter)
  } else {
    console.error('No twitter config. Please provide a --settings file')
  }

  // init badges
  Meteor.setTimeout(function (){
    if(Badges.find().count() > 0) return

    console.log('Initialising badges collection')

    var badges = [
      { name: 'Party Hard', description: 'Awarded for enthusiastic merrymaking of the highest order', global:true },
      { name: 'Sir Digby', description: 'A special award for secret reasons', global:true },
      { name: 'Super Connector', description: 'Awarded for pro-grade bipmanship', global:true},

      { name: 'After Party', description: 'Awarded for keeping the fun fire burning'},
      { name: 'Photo Booth', description: 'Awarded for getting snap happy' },
    ]

    badges
      .forEach(function (badge) {
        badge.puid = puidFor(badge)
        badge.url = urlFor(badge)

        console.log('%s badge at %s', badge.puid, badge.url)
        if (!Badges.findOne({puid: badge.puid})) Badges.insert(badge)
      })

  }, 2000)
})

function pathFor (badge) {
  var config =  Meteor.settings
  var badgePath = config.badges && config.badges.path
  if (!badgePath) return console.error('Please pass in a settings.json file')
  return process.cwd() + '/' + badgePath + '/' + fileNameFor(badge)
}

// { name: 'welcome', event: 'lxjs'} => 'welcome/lxjs'
function puidFor(badge) {
  var puid = snakeCase(badge.name)
  if (!badge.global && badge.event) puid = snakeCase(badge.event) + '/' + puid
  return puid
}

function urlFor (badge) {
  return Meteor.absoluteUrl('/' + fileNameFor(badge), {replaceLocalhost:true})
}

function fileNameFor (badge) {
  return badge.puid + '.png'
}

function snakeCase (string) {
  return string.toLowerCase().replace(/[^a-z0-9]/gi, "-")
}
