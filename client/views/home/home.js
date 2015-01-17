/*****************************************************************************/
/* Home: Event Handlers and Helpers */
/*****************************************************************************/
Template.Home.events({
  'change #fileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      console.log(file);
      Images.insert(file, function(err, fileObj) {
        console.log(err || fileObj);
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    });
    $("form#imageUploader")[0].reset();
  },
});

Template.Home.helpers({
  images: function() {
    console.log("helper", this.url);
    return Images.find();
  }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {
};

Template.Home.rendered = function () {
};

Template.Home.destroyed = function () {
};
