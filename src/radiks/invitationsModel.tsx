import { Model } from 'radiks';


export class InvitationScheme extends Model {
  public static className = 'Invitation';
  public static schema = {
    userGroupId: {
      type: String,
      decrypted: true,
    },
    invitationId: {
      type: String,
      decrypted: true,
    },
    isPending: {
      type: Boolean,
      decrypted: true,
    },
    to: {
      type: String,
      decrypted: true
    }
  };
  public static defaults = {
    isPending: true
  }
}
