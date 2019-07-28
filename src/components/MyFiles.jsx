import React, {Component} from 'react';
import {FileModal} from '../radiks/fileModel.tsx';

export default class MyFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };
    }

    render() {
        return (
            <div className="my-files">
                {
                    this.state.files.map(file => <a key={file.id} href={file.fileData} download={file.fileName}>{file.fileName}</a>)
                }
            </div>
        );
    }

    async componentWillMount() {
        const files = await FileModal.fetchList();
        const mappedFiles = files.map(f => {
            return Object.assign({}, f.attrs, {id: f._id})
        });
        console.log(mappedFiles);
        this.setState({
            files: mappedFiles
        });
    }
}
