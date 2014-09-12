Badges = new Meteor.Collection('badges')

Badges.allow({
  insert:function (){ return true},
  update:function (){ return true}
})

