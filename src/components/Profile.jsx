import React, {Component} from 'react';
import {
    Person,
} from 'blockstack';
import DragDropFile from "./dragDropFile.jsx";
import {FileModal} from '../radiks/fileModel.tsx';
import MyFiles from "./MyFiles.jsx";
import {ClipLoader} from "react-spinners";
import {notify} from "react-notify-toast";
import {InvitationScheme} from "../radiks/invitationsModel.tsx";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {GroupInvitation} from "radiks";
import Notifications from "@material-ui/icons/Notifications";
import SharedFiles from "./SharedFiles.jsx";

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const getBase64FromFile = (file) => {
    return new Promise(res => {
        const reader = new FileReader();
        reader.onload = (data) => {
            res(data.target.result);
        };
        reader.readAsDataURL(file);
    })
};

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            person: {
                name() {
                    return 'Anonymous';
                },
                avatarUrl() {
                    return avatarFallbackImage;
                },
            },
            currentTab: '0',
            file: [],
            uploading: false,
            uploaded: false,
            failed: false,
            invitations: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.acceptInvitation = this.acceptInvitation.bind(this);
        this.acceptAllInvitation = this.acceptAllInvitation.bind(this);
    }

    onTabClicked(index) {
        this.setState({currentTab: index});
    };

    async uploadNewFile(file) {
        this.setState({
            uploading: true,
            uploaded: false,
            failed: false
        });
        const fileData = await getBase64FromFile(file);
        const newFile = new FileModal({
            fileData,
            fileName: file.name
        });
        newFile.save().then(() => {
            this.setState({
                uploading: false,
                uploaded: true,
                failed: false
            });
            notify.show('File has been uploaded successfully!', 'success');
        }).catch(() => {
            this.setState({
                uploading: false,
                uploaded: false,
                failed: true
            });
            notify.show('Something went wrong!', 'error');
        });
    }

    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) {
            this.setState({file: files[0]});
            this.uploadNewFile(files[0]);
        }
        e.target.value = '';
    };

    handleDrop(file) {
        this.setState({file});
        this.uploadNewFile(file);
    };

    async acceptInvitation(id, invitationSchemeId) {
        const invitation = await GroupInvitation.findById(id);
        await invitation.activate();
        const invitationScheme = await InvitationScheme.findById(invitationSchemeId);
        invitationScheme.update({
            isPending: false
        });
        await invitationScheme.save();
        const updatedInvitations = this.state.invitations.filter(i => i._id !== invitationSchemeId);
        this.setState({invitations: updatedInvitations});
        notify.show('Invitation has been accepted successfully!','success');
    };

    async acceptAllInvitation() {
        const processAllInvitations = () =>
            Promise.all(
                this.state.invitations.map(inv => {
                    return new Promise(async resolve => {
                        resolve(this.acceptInvitation(inv.id, inv._id));
                    });
                })
            );
        await processAllInvitations();
        this.setState({invitations: []});
        notify.show('Invitations have been accepted successfully!','success');
    };

    render() {
        const {handleSignOut, userSession} = this.props;
        const {person, currentTab, uploading, invitations} = this.state;
        return (
            !userSession.isSignInPending() ?
                <div className="panel-welcome" id="section-2">
                    <UncontrolledDropdown direction={'down'}>
                        <DropdownToggle disabled={invitations.length === 0} className='notifyWrapper'>
                            <Notifications
                                className={`notifications ${invitations.length > 0 && 'pulseBtn'}`}/>
                        </DropdownToggle>
                        <DropdownMenu className='notifyDD'>
                            <DropdownItem className='notifyItem'>
                                <button onClick={this.acceptAllInvitation} className='accept'>Accept all</button>
                            </DropdownItem>
                            {invitations.map(inv => {
                                return (
                                    <DropdownItem key={inv.id} className='notifyItem'>
                                        You have got a new invitation <button
                                        onClick={this.acceptInvitation.bind(null, inv.id, inv._id)}
                                        className='accept'>Accept</button>
                                    </DropdownItem>);
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="avatar-section">
                        <img src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                             className="img-rounded avatar" id="avatar-image"/>
                    </div>
                    <h1>Hello, <span id="heading-name">{person.name() ? person.name() : 'Nameless Person'}</span>!</h1>
                    <div className='tab-wrapper'>
                        <div>
                            <button
                                className={`$btn btn-primary ${currentTab === '0' ? 'btn-tab' : ''}`}
                                onClick={this.onTabClicked.bind(this, '0')}
                            >
                                Upload files
                            </button>
                            <button
                                className={`$btn btn-primary ${currentTab === '1' ? 'btn-tab' : ''}`}
                                onClick={this.onTabClicked.bind(this, '1')}
                            >
                                My files
                            </button>
                            <button
                                className={`$btn btn-primary ${currentTab === '2' ? 'btn-tab' : ''}`}
                                onClick={this.onTabClicked.bind(this, '2')}
                            >
                                Shared with me
                            </button>
                        </div>
                        {currentTab === '0' ?
                            <div className='upload-part'>
                                <DragDropFile className='dragDrop' handleFile={this.handleDrop}/>
                                {uploading ? <div>
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={40}
                                        color={'white'}
                                        loading={true}
                                    />
                                    <p>Uploading</p>
                                </div> : <span>Drag and Drop or <span>Browse</span> to upload</span>}
                                <input
                                    disabled={uploading}
                                    type="file"
                                    className='upload-btn'
                                    onChange={this.handleChange}
                                />
                            </div> : currentTab === '1' ? <MyFiles/> : <SharedFiles/>}
                    </div>
                    <p className="lead">
                        <button
                            className="btn btn-primary btn-lg"
                            id="signout-button"
                            onClick={handleSignOut.bind(this)}
                        >
                            Logout
                        </button>
                    </p>
                </div> : null
        );
    }

    componentWillMount() {
        const {userSession} = this.props;
        InvitationScheme.fetchList({
            to: userSession.loadUserData().username,
            isPending: true,
        }).then(invitationsRes => {
            const mappedInvitations = invitationsRes.map(cr => (
                Object.assign({}, cr.attrs, {
                    id: cr.attrs.invitationId,
                    schemeId: cr._id,
                })
            ));
            this.setState({invitations: mappedInvitations});
        });
        this.setState({
            person: new Person(userSession.loadUserData().profile),
        });
    }
}
