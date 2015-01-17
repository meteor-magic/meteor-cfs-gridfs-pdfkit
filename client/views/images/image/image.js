/*****************************************************************************/
/* Image: Event Handlers and Helpers */
/*****************************************************************************/

Template.Image.events({
  'click .base64-btn': function(event, template) {
    event.preventDefault();
    Meteor.call('toBase64', this._id, function(err, res) {
      if(!err) {
        $(template.firstNode).append('<textarea class="form-control">' + res + '</textarea>');
        //$(template.firstNode).find('textarea').select(); // can freeze your browser
        $(event.currentTarget).button('reset').prop('disabled', true);
      }
    });

  },

  'click .pdf-btn': function(event, template) {
    event.preventDefault();
    var self = this;
    Meteor.call('generatePdf', this._id, function(err, res) {
      Session.set("pdfId" + self._id, res);
    });
  },

  'click .remove-image': function() {
    Images.remove({_id: this._id});
  }
});

Template.Image.helpers({
  pdfUploadProgress: function() {
    if (Session.get("pdfId" + this._id)) {
      return Docs.findOne({_id: Session.get("pdfId" + this._id)}).uploadProgress() + '%';
    }
  },

  pdfUrl: function() {
    if (Session.get("pdfId" + this._id) && Docs.findOne({_id: Session.get("pdfId" + this._id)}).isUploaded()) {
      return Docs.findOne({_id: Session.get("pdfId" + this._id)}).url();
    }
  }
});

