import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import {UserGroup, GroupInvitation, User} from "radiks";
import {FileModal} from '../radiks/fileModel.tsx';
import {InvitationScheme} from "../radiks/invitationsModel.tsx";
import {notify} from "react-notify-toast";
import {ClipLoader} from "react-spinners";

class ShareForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            loading: false,
            loaded: false,
            failed: false,
        };
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleValueChange(e) {
        this.setState({value: e.target.value});
    }

    async handleSubmit(e) {
        this.setState({
            loading: true,
            loaded: false,
            failed: false,
        });
        e.preventDefault();
        const group = new UserGroup();
        await group.create();
        const username = this.state.value;
        console.log(username,group)
        const userInvitation = await this.makeInvitation(username, group);
        const userInvitationObj = {
            userGroupId: userInvitation.attrs.userGroupId,
            invitationId: userInvitation._id,
            isPending: true,
            to: username
        };
        const userInvited = new InvitationScheme();
        await userInvited.update(userInvitationObj);
        await userInvited.save();
        const file = await FileModal.findById(this.props.selectedFileID);
        file.update({userGroupId: group._id});
        await file.save();
        this.setState({
            loading: false,
            loaded: true,
            failed: false,
        });
        notify.show('Invitation send successfully!','success');
    };

    async makeInvitation(invUsername, userGroup) {
        const user = new User({_id: invUsername});
        await user.fetch({decrypt: false});
        const {publicKey} = user.attrs;
        const invitation = new GroupInvitation({
            userGroupId: userGroup._id,
            signingKeyPrivateKey: userGroup.privateKey,
            signingKeyId: userGroup.attrs.signingKeyId
        });
        invitation.userPublicKey = publicKey;
        await invitation.save();
        return invitation;
    };

    render() {
        const {isOpen, toggle, selectedFileID} = this.props;
        console.log(selectedFileID);
        return (
            <Modal centered show={isOpen}
                   onHide={toggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Share</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='inputWrapper'>
                        <label className='inputLabel'>
                            Blockstack ID
                        </label>
                        <input
                            className='inputText'
                            value={this.state.value}
                            onChange={this.handleValueChange}
                            placeholder='Blockstack ID'
                            type='text
                               '/>
                    </div>
                    <button disabled={this.state.loading} style={{margin: '20px 0'}} className="btn btn-primary btn-lg"
                            onClick={this.handleSubmit}>
                        {this.state.loading ? <ClipLoader
                            sizeUnit={"px"}
                            size={20}
                            color={'white'}
                            loading={true}
                        /> : 'Share'}
                    </button>
                </Modal.Body>
            </Modal>
        );
    };
}

export default ShareForm;
