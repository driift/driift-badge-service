/*
 <meta name="twitter:card" content="photo" />
 <meta name="twitter:site" content="@flickr" />
 <meta name="twitter:title" content="Mountain sunset" />
 <meta name="twitter:description" content="Explore Reza-Sina's photos on Flickr. Reza-Sina has uploaded 113 photos to Flickr." />
 <meta name="twitter:image" content="http://farm8.staticflickr.com/7334/11858349453_e3f18e5881_z.jpg" />
 <meta name="twitter:url" content="https://www.flickr.com/photos/reza-sina/11858349453/" />
 */

Router.map(function() {
  return this.route('card', {
    path: '/card/:badgeId',

    fastRender: true,

    waitOn: function() {
      console.log('waiting for', this.params.badgeId)
      return Meteor.subscribe('badges', this.params.badgeId)
    },

    data: function() {
      return {
        badge: Badges.findOne(this.params.badgeId)
      }
    },

    onAfterAction: function() {
      // The SEO object is only available on the client.
      // Return if you define your routes on the server, too.
      if (!Meteor.isClient) return

      var badge = Badges.findOne(this.params.badgeId)

      if(!badge) return // console.error('No badge found for %s', this.params.badgeId)

      SEO.set({
        title: badge.name,
        meta: {
          'description': badge.description
        },
        og: {
          'title': badge.name,
          'description': badge.description
        },
        twitter: {
          card: 'photo',
          site: '@driiftio',
          title: badge.name,
          description: badge.description,
          image: badge.url,
          url: 'http://driift.io'
        }
      })
    }
  })
})