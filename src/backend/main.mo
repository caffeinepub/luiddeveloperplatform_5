import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type BlobMetadata = {
    id : Text;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  var nextId = 0;
};
