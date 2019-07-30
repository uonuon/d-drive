import {Model} from 'radiks';


export class FileModal extends Model {
    static className = 'FileModal';
    static schema = {
        fileData: String,
        fileName: String,
        userGroupId: {
            type: String,
            decrypted: true
        },
    };
}

