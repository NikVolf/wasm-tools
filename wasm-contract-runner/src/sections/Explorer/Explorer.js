import React from 'react';
import styles from './Explorer.css';
import { Icon, Header, Divider, Segment, Button, List } from 'semantic-ui-react';

import Dropzone from 'react-dropzone';

export default class Explorer extends React.Component {

  uploadWasm(file) {
    console.log(file);
  }

  render() {
    return <div>
      <Header as="h3">Uploaded contracts</Header>
      <Divider />
      <Button onClick={ () => this.dropzoneRef.open() } fluid color="green">
        <Icon name="plus" /> Upload WASM files</Button>
      <Dropzone style={{}} disableClick={ true } disablePreview ref={ (dropzoneRef) => this.dropzoneRef = dropzoneRef }
                onDrop={ (accepted) => this.uploadWasm(accepted) }>
        <List selection verticalAlign='middle'>
          <List.Item>
              <List.Content>
                <List.Header>test.wasm</List.Header>
              </List.Content>
          </List.Item>
          <List.Item>
              <List.Content>
                <List.Header>identity.wasm</List.Header>
              </List.Content>
          </List.Item>
          <List.Item>
              <List.Content>
                <List.Header>new.wasm</List.Header>
              </List.Content>
          </List.Item>
        </List>
      </Dropzone>
      </div>
  }
}