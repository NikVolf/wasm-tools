import React from "react";
import PropTypes from "prop-types";
import styles from "./Explorer.css";
import { Icon, Header, Divider, Button, List } from "semantic-ui-react";

import Dropzone from "react-dropzone";

export default class Explorer extends React.Component {
  static propTypes = {
    onLoadWasmFiles: PropTypes.func,
    onSelect: PropTypes.func,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.instanceOf(ArrayBuffer)
      })
    ),
    selected: PropTypes.string
  };

  renderFiles() {
    const { files, onSelect, selected } = this.props;
    const list = files.map(file =>
      <List.Item
        active={selected === file.name}
        onClick={() => onSelect(file.name)}
        key={file.name}
      >
        <List.Content>
          <List.Header>
            {file.name}
          </List.Header>
          <List.Description>
            {file.data.byteLength} bytes
          </List.Description>
        </List.Content>
      </List.Item>
    );
    return (
      <List celled selection verticalAlign="middle">
        {list}
      </List>
    );
  }

  render() {
    const { onLoadWasmFiles } = this.props;

    return (
      <div>
        <Dropzone
          onDrop={accepted => onLoadWasmFiles(accepted)}
          ref={dropzoneRef => (this.dropzoneRef = dropzoneRef)}
          style={{}}
          disableClick={true}
          disablePreview
        >
          <Header as="h3">Uploaded contracts</Header>
          <Divider />
          <Button onClick={() => this.dropzoneRef.open()} fluid color="gray">
            <Icon name="plus" /> Upload WASM files
          </Button>

          {this.renderFiles()}
        </Dropzone>
      </div>
    );
  }
}
