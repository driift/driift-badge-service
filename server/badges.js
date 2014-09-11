
Meteor.publish('badges', function(id) {
  return id ? Badges.find(id) : Badges.find()
})



// init badges
Meteor.startup(function () {
  Meteor.setTimeout(function (){
    if(Badges.find().count() > 0) return

    console.log('Initialising badges collection')

    var badges = [
      { name: 'Party Hard', description: 'Awarded for enthusiastic merrymaking of the highest order'},
      { name: 'Super Connector', description: 'Awarded for pro-grade bipmanship'},
      { name: 'Sir Digby', description: 'A special award for secret reasons' },
      { name: 'After Party', description: 'Awarded for keeping the fun fire burning'},
      { name: 'Photo Booth', description: 'Awarded for getting snap happy' },
    ]

    badges
      .forEach(function (b) {
        addBadgeMetadata(b)
        console.log('Inserting %s %s', b._id, b.url)
        Badges.insert(b)
      })

  }, 2000)
})


function addBadgeMetadata (b) {
  b._id = b.name.toLowerCase().replace(/[^a-z0-9]/gi, "-")
  b.url = Meteor.absoluteUrl(b._id + '.png', {replaceLocalhost:true})
  return b
}