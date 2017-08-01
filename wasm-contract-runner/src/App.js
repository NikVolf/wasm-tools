import React from 'react';
import Dexie from 'dexie';
import styles from './App.css';
import { Header } from 'semantic-ui-react';
import Explorer from './sections/Explorer/Explorer';
import Runner from './sections/Runner';
import Output from './sections/Output';

let db;

class App extends React.Component {

  constructor(props, state) {
    super(props, state);
    this.loadWasmFiles = this.loadWasmFiles.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
    this.state = {
      files: []
    };
  }

  componentWillMount() {
    db = new Dexie("wasmFilesStore");
    db.version(1).stores({ files: "name" });
    db.open().then(() => db.files.toArray()).then((files) => this.setState({ files }));
  }

  saveFiles() {

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
      console.log(files);
      this.setState({ files });
    });
  }

  saveWasmFiles(files) {
    files.forEach((f) => {

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
