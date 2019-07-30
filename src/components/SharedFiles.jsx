import React, {Component} from 'react';
import {FileModal} from '../radiks/fileModel.tsx';
import {notify} from "react-notify-toast";
import {ClipLoader} from "react-spinners";
import {UserGroup} from "radiks";

export default class SharedFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            loading: false,
            loaded: false,
            failed: false,
        };

    }


    render() {
        const {loaded, failed, files} = this.state;
        return (
            <div className="my-files">
                {
                    loaded ? files.map(file => <a key={file.id} href={file.fileData}
                                                  download={file.fileName}>{file.fileName}</a>)
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
            const groups = await UserGroup.myGroups();
            const processFiles = () =>
                Promise.all(
                    groups.map(group => {
                        return new Promise(async resolve => {
                            const filesRes = await FileModal.fetchList({
                                userGroupId: group._id,
                            });
                            const mappedFiles = filesRes.map(cr => (
                                Object.assign({}, cr.attrs, {
                                    id: cr._id
                                })));
                            resolve(mappedFiles);
                        });
                    })
                );
            const certs = await processFiles();
            this.setState({
                files: certs.flat(1),
                loading: false,
                loaded: true,
                failed: false,
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
