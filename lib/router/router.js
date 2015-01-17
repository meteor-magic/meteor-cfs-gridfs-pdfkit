Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase',
});

Router.route('/', {
  name: 'home',
  template: 'Home',
  waitOn: function() {
    return [Meteor.subscribe('docs'), Meteor.subscribe('images')];
  },
  fastRender: true
});

Router.route('/getPDF', function() {
  var doc = new PDFDocument({size: 'A4', margin: 50});
  doc.fontSize(12);
  doc.text('PDFKit is simple', 10, 30, {align: 'center', width: 200});
  this.response.writeHead(200, {
    'Content-type': 'application/pdf',
    'Content-Disposition': "attachment; filename=test.pdf"
  });
  this.response.end( doc.outputSync() );
}, {where: 'server'});