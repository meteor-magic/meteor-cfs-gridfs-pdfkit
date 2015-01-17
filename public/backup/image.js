/*****************************************************************************/
/* Image: Event Handlers and Helpers */
/*****************************************************************************/
Template.Image.events({
  'click .base64-btn': function(event, template) {
    event.preventDefault();
    Meteor.call('toBase64', this.url(), function(err, res) {
      console.log(err||res);
      $(template.firstNode).append('<textarea class="form-control">' + res + '</textarea>');
    });
    $(event.currentTarget).prop('disabled', true);
  },
  'click .pdf-btn': function(event, template) {
    event.preventDefault();
    var self = this;
    Meteor.call('generatePdf', this.url(), function(err, res) {
      console.log('This will fucking fuck my server daAAAwn');
      Session.set("pdfId" + self._id, res);
      /*
      var pdf = Docs.findOne({_id: res});
      var pdfUrl = pdf.url();
      if (pdf.uploadProgress() === 100) {
        window.location = pdf.url();
      }
      */
      /*
      console.log("pdf.url", pdf.url);
      console.log("pdf.url()", pdf.url());
      console.log("pdf.uploadProgress()1", pdf.uploadProgress());
      console.log("pdf.uploadProgress()2", pdf.uploadProgress());
      console.log("pdf.uploadProgress()3", pdf.uploadProgress());
      console.log("pdf.uploadProgress()4", pdf.uploadProgress());
      console.log("pdf.uploadProgress()5", pdf.uploadProgress());
      */
      /*
      setTimeout(function() {
        //window.location = pdf.url();
        console.log("inside 50settimeout:", pdf.url());
        console.log("pdf.uploadProgress()6", pdf.uploadProgress());
      }, 50);
      setTimeout(function() {
        //window.location = pdf.url();
        console.log("inside 200settimeout:", pdf.url());
        console.log("pdf.uploadProgress()7", pdf.uploadProgress());
      }, 200);
      //$(template.firstNode).append('<a id="pdfLink" href="'+ pdfUrl +'" target="_blank"></a>');
      */
    });
    //$(event.currentTarget).prop('disabled', true);
  },
});

Template.Image.helpers({
  pdfUrl: function() {
    if (Session.get("pdfId" + this._id)) {
      return Docs.findOne({_id: Session.get("pdfId" + this._id)}).url();
    }
  }
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* Image: Lifecycle Hooks */
/*****************************************************************************/
Template.Image.created = function () {
};

Template.Image.rendered = function () {
};

Template.Image.destroyed = function () {
};
