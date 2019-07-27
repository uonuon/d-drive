import React, {Component} from 'react';



class DragDropFile extends Component {
  static suppress(evt) { evt.stopPropagation(); evt.preventDefault(); };
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  };
  onDrop(evt) { evt.stopPropagation(); evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) {
      this.props.handleFile(files[0]);
    }
  };
  render() { return (
    <div onDrop={this.onDrop} className={this.props.className} onDragEnter={DragDropFile.suppress} onDragOver={DragDropFile.suppress}>
      {this.props.children}
    </div>
  ); };
}

export default DragDropFile;
