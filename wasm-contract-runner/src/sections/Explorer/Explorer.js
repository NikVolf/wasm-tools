import React from 'react';
import styles from './Explorer.css';
import { Icon, Header, Divider, Segment, Button, List } from 'semantic-ui-react';

import Dropzone from 'react-dropzone';

export default class Explorer extends React.Component {

  renderFiles() {
    const { files } = this.props;
    const list = files.map(file =>
        <List.Item key={file.name}>
          <List.Content>
            <List.Header>{ file.name }</List.Header>
          </List.Content>
        </List.Item>
    );
    return <List selection verticalAlign='middle'>{list}</List>
  }

  render() {
    const { 
      loadWasmFiles,
    } = this.props;

    return <div>
      <Header as="h3">Uploaded contracts</Header>
      <Divider />
      <Button onClick={ () => this.dropzoneRef.open() } fluid color="green">
        <Icon name="plus" /> Upload WASM files</Button>
      <Dropzone style={{}} disableClick={ true } disablePreview ref={ (dropzoneRef) => this.dropzoneRef = dropzoneRef }
                onDrop={ (accepted) => loadWasmFiles(accepted) }>
        { this.renderFiles() }
      </Dropzone>
      </div>
  }
}