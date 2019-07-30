import React, {Component} from 'react';
import {FileModal} from '../radiks/fileModel.tsx';
import {notify} from "react-notify-toast";
import {ClipLoader} from "react-spinners";
import ShareForm from "./shareForm.jsx";

export default class MyFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            loading: false,
            loaded: false,
            failed: false,
            isOpen: false,
            selectedFileID: undefined,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle(selectedFileID) {
        this.setState(prevValue => ({isOpen: !prevValue.isOpen, selectedFileID}))
    };

    render() {
        const {loaded, failed, files, isOpen, selectedFileID} = this.state;
        return (
            <div className="my-files">
                {isOpen && <ShareForm toggle={this.toggle} selectedFileID={selectedFileID} isOpen={isOpen}/>}
                {
                    loaded ? files.map(file => {
                            return (
                                <div className={'myFile'} key={file.id}>
                                    <a href={file.fileData} download={file.fileName}>{file.fileName}</a>
                                    <button className="btn btn-primary btn-lg"
                                            onClick={this.toggle.bind(null, file.id)}>
                                        Share
                                    </button>
                                </div>
                            )
                        })
                        : failed ? <p>Failed to fetch files!</p> : <ClipLoader
                            sizeUnit={"px"}
                            size={20}
                            color={'white'}
                            loading={true}
                        />
                }
            </div>
        );
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            loaded: false,
            failed: false,
        });
        try {
            const files = await FileModal.fetchOwnList();
            console.log(files);
            this.setState({
                loading: false,
                loaded: true,
                failed: false,
            });
            const mappedFiles = files.map(f => {
                return Object.assign({}, f.attrs, {id: f._id})
            });
            console.log(mappedFiles);
            this.setState({
                files: mappedFiles
            });
        } catch (e) {
            this.setState({
                loading: false,
                loaded: false,
                failed: true,
            });
            notify.show('Something went wrong!', 'error');
        }

    }
}
