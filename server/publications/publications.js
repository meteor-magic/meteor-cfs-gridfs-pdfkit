Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('docs', function() {
  return Docs.find();
});