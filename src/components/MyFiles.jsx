import React, {Component} from 'react';
import {FileModal} from '../radiks/fileModel.tsx';
import {notify} from "react-notify-toast";
import {ClipLoader} from "react-spinners";
export default class MyFiles extends Component {
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
        const{loaded,failed,files} =this.state;
        return (
            <div className="my-files">
                {
                    loaded ? files.map(file => <a key={file.id} href={file.fileData} download={file.fileName}>{file.fileName}</a>)
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
        }
        catch(e){
            this.setState({
                loading: false,
                loaded: false,
                failed: true,
            });
            notify.show('Something went wrong!','error');
        }
        
    }
}
