import React from 'react';
import Dexie from 'dexie';
import styles from './App.css';
import { Header } from 'semantic-ui-react';
import Explorer from './sections/Explorer/Explorer';
import Runner from './sections/Runner';
import Output from './sections/Output';

class App extends React.Component {

  constructor(props, state) {
    super(props, state);
    this.loadWasmFiles = this.loadWasmFiles.bind(this);
    this.db = null;
    this.state = {
      files: []
    };
  }

  componentWillMount() {
    this.db = new Dexie("wasmFilesStore");
    this.db.version(1).stores({ files: "name" });
    this.loadFiles();
  }

  loadFiles() {
    this.db.files.toArray().then((files) => this.setState({ files }))
  }

  loadWasmFiles(inputFiles) {
    const promises = inputFiles.map((file) =>
      new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          res({ name: file.name, data: e.target.result });
          return;
        };
        reader.onerror = (e) => {
          rej(e);
          return;
        }
        reader.onabort = (e) => {
          rej(e);
          return;
        }
        reader.readAsArrayBuffer(file);
      }))
    Promise.all(promises).then((files) => {
      this.db.files.bulkPut(files).then(() => this.loadFiles());
    });
  }

  render() {
    console.log(console.log(this.state.files));
    return (
        <div>
          <div className="AppHeader">
            <Header as="h1">
              WASM Contract Runner
            </Header>
          </div>
          <div className="AppBody">
            <div className="AppExplorer">
              <Explorer files={ this.state.files } loadWasmFiles={ this.loadWasmFiles } />
            </div>
            <div className="AppRunner">
              <Runner />
            </div>
            <div className="AppOutput">
              <Output />
            </div>
        </div>
      </div>
    );
  }
}

export default App;
