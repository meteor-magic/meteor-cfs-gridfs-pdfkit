var getBase64Data = function(doc, callback) {
    var buffer = new Buffer(0);
    // callback has the form function (err, res) {}
    var readStream = doc.createReadStream();
    readStream.on('data', function() {
        buffer = Buffer.concat([buffer, readStream.read()]);
    });
    readStream.on('error', function(err) {
        callback(err, null);
    });
    readStream.on('end', function() {
        // done
        callback(null, buffer.toString('base64'));
    });
};
var getBase64DataSync = Meteor.wrapAsync(getBase64Data);

Meteor.methods({
  toBase64: function(url) {
    return getBase64DataSync(Images.findOne());
  },

  generatePdf: function(docId) {
    var imageDoc = Images.findOne({_id: docId}),
        imageBase64 = getBase64DataSync(imageDoc);
        console.log("imageBase64", imageBase64);
    var imageBuffer2 = new Buffer(imageBase64.base64.replace('data:'+ imageDoc.type() +';base64,','') || '', 'base64'),
        doc = new PDFDocument({size: 'A4', margin: 50});
    console.log("imageBuffer2", imageBuffer2);
    //console.log("DOCDOCDOCDOCDOC", doc);
    console.log('After future');    
    doc.image(imageBuffer2, 10, 10, {height: 250});
    doc.fontSize(12);
    doc.text('Michael Rokosh | JSSolutions', 10, 150, {align: 'center', width: 200});
    //Buffer to GridJS:
    var file = new FS.File();
    file.attachData(doc.outputSync(), {type: 'application/pdf'}, function(error){
      if(error) throw error;
      file.name('PDFKitExample.pdf');
      Docs.insert(file);
    });
    //doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');
    //console.log("End of method", Docs.findOne({_id: file._id}));
    return file._id;
  }
});


/*var requestImage = function(url, callback) {
  var request = Meteor.npmRequire('request').defaults({ encoding: null });
  request(url, callback)
};

var toBase64 = function(url) {
  var requestImageWrapper = Meteor.wrapAsync(requestImage);
  var requestedImage = requestImageWrapper(url);
  var type = requestedImage.headers["content-type"],
      prefix = "data:" + type + ";base64,",
      base64 = new Buffer(requestedImage.body).toString('base64'),
      data = prefix + base64;
  console.log("Hello from toBase64()!", requestedImage);
  return { type: type, base64: data };
};
*/
//process.env.PWD


var toBase64 = function(fileObj, collection) {
  var request = Meteor.npmRequire('request').defaults({ encoding: null }),  
      Future = Meteor.npmRequire('fibers/future'),
      fut = new Future(),
      fileDoc = collection.findOne({'_id': fileObj._id});
  request(Meteor.absoluteUrl(fileDoc.url()), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var type = response.headers["content-type"],
          prefix = "data:" + type + ";base64,",
          base64 = new Buffer(body).toString('base64'),
          data = prefix + base64;
      //console.log(data);
      fut['return']({type: type, base64: data});
      console.log('Return from future');
    } else {
      console.log(error);
      fut['return'](error);
    }
  });
  return fut.wait();
};
/*var requestImage = function(url, callback) {
  var request = Meteor.npmRequire('request').defaults({ encoding: null });
  request(url, callback)
};

var toBase64 = function(url) {
  var requestImageWrapper = Meteor.wrapAsync(requestImage);
  var requestedImage = requestImageWrapper(url);
  var type = requestedImage.headers["content-type"],
      prefix = "data:" + type + ";base64,",
      base64 = new Buffer(requestedImage.body).toString('base64'),
      data = prefix + base64;
  console.log("Hello from toBase64()!", requestedImage);
  return { type: type, base64: data };
};
*/

Meteor.methods({
  toBase64: function(image) {
    return toBase64(image, Images).base64;
  },

  generatePdf: function(url) {
    var url = Meteor.absoluteUrl(url),
        imageBase64 = toBase64(url);
    console.log("Hello from generatePdf()!");
    console.log("imageBase64.type", imageBase64.type);
    var imageBuffer2 = new Buffer(imageBase64.base64.replace('data:'+ imageBase64.type +';base64,','') || '', 'base64'),
        doc = new PDFDocument({size: 'A4', margin: 50});
    console.log("imageBuffer2", imageBuffer2);
    doc.image(imageBuffer2, 10, 10, {height: 250});
    doc.fontSize(12);
    doc.text('Michael Rokosh | JSSolutions', 10, 150, {align: 'center', width: 200});
    doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');
    //Buffer to GridJS:
    var file = new FS.File();

    var newFileAsync = function(buffer, callback) {
      console.log("Hello from newFileAsync()");
      file.attachData(buffer, {type: 'application/pdf'}, callback);  
    };

    var newFileSync = Meteor.wrapAsync(newFileAsync);
    newFileSync(doc.outputSync());
    console.log("Hello after attaching data to the file");
    file.name('PDFKitExample.pdf');
    console.log("File to write",file);
    Docs.insert(file);
    //doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');
    //console.log("End of method", Docs.findOne({_id: file._id}));
    console.log("Hello from the end of generatePdf()");
    return file._id;
  }
});

//process.env.PWD