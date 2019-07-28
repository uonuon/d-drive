import React, {Component} from 'react';
import {
    Person,
} from 'blockstack';
import DragDropFile from "./dragDropFile.jsx";
import {FileModal} from '../radiks/fileModel.tsx';
import MyFiles from "./MyFiles.jsx";
import {ClipLoader} from "react-spinners";
import {notify} from "react-notify-toast";

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
            failed: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
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

    render() {
        const {handleSignOut, userSession} = this.props;
        const {person, currentTab, uploading} = this.state;
        return (
            !userSession.isSignInPending() ?
                <div className="panel-welcome" id="section-2">
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
                        </div>
                        {currentTab === '0' ?
                            <div className='upload-part'>
                                <DragDropFile className='dragDrop' handleFile={this.handleDrop}/>
                                {uploading ? <div>
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={20}
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
                            </div> : <MyFiles/>}
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
        this.setState({
            person: new Person(userSession.loadUserData().profile),
        });
    }
}
