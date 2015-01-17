var toBase64Async = function(doc, callback) {
  var buffer = new Buffer(0),
      readStream = doc.createReadStream();
  readStream.on('data', function(chunk) {
    buffer = Buffer.concat([buffer, chunk]);
  });
  readStream.on('error', function(err) {
    callback(err, null);
  });
  readStream.on('end', function() {
    // done
    callback(null, 'data:'+ doc.type() + ';base64,' + buffer.toString('base64'));
  });
};

var toBase64Sync = Meteor.wrapAsync(toBase64Async);

var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis vel lacus non tincidunt. Curabitur eu sollicitudin risus, vitae tristique turpis. Vestibulum consequat fringilla lectus eu gravida. Pellentesque convallis vestibulum egestas. Praesent aliquet elementum purus at maximus. Praesent diam elit, faucibus quis convallis eu, aliquam et justo. Curabitur pharetra metus ipsum, nec pretium tellus ultrices nec. Proin id aliquet ante. Aenean posuere velit non ex lacinia, ac sagittis eros maximus. Praesent lacus mauris, dapibus eu imperdiet convallis, dignissim at dolor. Vestibulum id nisl at ligula elementum tristique at sed ligula. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse feugiat lobortis nisi, ac iaculis diam imperdiet non. Aliquam velit metus, finibus non velit quis, elementum iaculis orci. Phasellus cursus tellus quis viverra tristique. Vivamus a placerat sapien, non dapibus mi. Donec aliquam nisi ac quam ornare feugiat. Nam varius justo a quam bibendum aliquam. In quam mauris, mattis at eros et, sagittis lacinia nulla. Suspendisse id bibendum odio. Nam efficitur elit sed lorem feugiat accumsan ac vitae orci. Ut eu lacus lobortis, aliquet dui at, vehicula lorem. Ut et consequat sapien. Integer nisl lacus, ultricies a purus vel, efficitur tempor neque. Nulla commodo aliquam lectus, at sagittis lorem suscipit eget. Nam egestas aliquet libero ac elementum. Morbi volutpat urna ut ligula dapibus scelerisque. Nulla in interdum est. Mauris at rutrum ipsum. Etiam lacus mi, pulvinar a sapien sit amet, semper finibus nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur eu nunc ut lectus semper mattis id eu risus. Quisque tempor fermentum porttitor. Suspendisse non felis non felis finibus ullamcorper. Phasellus aliquet placerat dui sed sollicitudin. Aliquam eget nunc et massa semper blandit eget non ligula. Cras euismod, velit vel condimentum consectetur, massa quam pellentesque nisi, sit amet venenatis nibh nulla vitae erat. Vestibulum ipsum tellus, pretium eu nisi eget, faucibus finibus turpis. Mauris ullamcorper, erat a sodales consectetur, turpis nulla commodo est, ut elementum odio elit ullamcorper urna. Nulla malesuada tempor sem, in sodales velit fermentum quis. Praesent rutrum nibh id semper venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed nec elit in velit sagittis egestas. Pellentesque dui dolor, sodales a odio nec, convallis dignissim felis. Donec feugiat, orci quis pulvinar imperdiet, sem eros viverra lectus, vel vestibulum mi leo vel neque. Vestibulum eu diam a dolor pretium cursus. Sed ultrices velit in risus ultricies fermentum. Aliquam quis dui dapibus, semper ligula vel, facilisis lorem. Praesent vel ante imperdiet, vehicula ante tempus, tincidunt ipsum. In luctus orci non felis scelerisque lacinia. Cras eget faucibus odio. Ut rhoncus, est quis scelerisque vestibulum, enim tellus auctor diam, at semper metus magna vel ipsum. Nulla dui neque, lacinia eget libero nec, blandit viverra urna. Nullam eu ipsum nec erat bibendum lobortis a sed orci. Ut tristique maximus finibus. Mauris pharetra placerat tincidunt. Vestibulum ut leo eu erat mattis lobortis. Mauris pretium faucibus hendrerit. Aenean vulputate accumsan rhoncus. Nulla vitae cursus est. In maximus, mauris sit amet volutpat interdum, risus est tincidunt lorem, a consequat metus diam at nisi. In sed facilisis erat Nam convallis rutrum lobortis. In vestibulum, sapien id pretium tempus, ligula risus facilisis orci, sed scelerisque erat nulla ut est. Sed sit amet nisl ante. Aenean sit amet urna cursus sem aliquet aliquam. Aliquam eget viverra nisi, vel iaculis nulla. Mauris maximus placerat mauris vel fringilla. Cras nisl tortor, faucibus vitae dignissim id, sollicitudin sed magna. Aliquam nunc est, rhoncus lacinia nibh euismod, imperdiet porttitor lacus. Fusce eleifend ante sed malesuada iaculis.";

Meteor.methods({
  toBase64: function(docId) {
    return toBase64Sync(Images.findOne({_id: docId}));
  },

  generatePdf: function(docId) {
    var docObj = Images.findOne({_id: docId}),
        imageBase64 = toBase64Sync(docObj),
        imageBuffer2 = new Buffer(imageBase64.split(",")[1], 'base64'),
        doc = new PDFDocument({size: 'A4', margin: 50}),
        file = new FS.File();

    doc.image(imageBuffer2, 100, 50, {height: 220});
    doc.fontSize(20);
    doc.text('Lorem Ipsum', 100, 300)
      .font('Times-Roman', 13)
      .moveDown()
      .text(lorem, {
        width: 412,
        align: 'justify',
        indent: 30,
        columns: 2,
        height: 300,
        ellipsis: true
      });
    doc.fontSize(20).fillColor('blue').text('Praxie', {
      link: 'https://github.com/Praxie',
      underline: true
    });

    // Buffer to GridJS: 
    file.attachData(doc.outputSync(), {type: 'application/pdf'}, function(error){
      if(error) throw error;
      file.name('doc.pdf');
      insertedDoc = Docs.insert(file);
    });

    // To write a file into the public/pdf directory
    //doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf'); 
    return file._id;
  }
});









//process.env.PWD