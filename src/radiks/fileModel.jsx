import {Model} from 'radiks';


export class FileModal extends Model {
  constructor() {
    FileModal.className = 'FileModal';
    FileModal.schema = {
      fileData: String,
      fileName: String,
    };
    super();
  }

}

