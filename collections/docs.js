var docStore = new FS.Store.GridFS("docs", {
  chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
                        // Default: 2MB. Reasonable range: 512KB - 4MB
});

Docs = new FS.Collection("docs", {
  stores: [docStore]
});