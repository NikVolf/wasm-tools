import React from 'react';
import Dexie from 'dexie';
import styles from './App.css';
import { Header } from 'semantic-ui-react';
import Explorer from './sections/Explorer/Explorer';
import Runner from './sections/Runner';
import Output from './sections/Output';

import runWasm from './common/wasm/runWasm';
import Runtime from './common/wasm/Runtime';
import parseArgs from './common/parseArgs';


class App extends React.Component {

  constructor(props, state) {
    super(props, state);
    this.db = null;
    this.state = {
      files: [],
      selected: "",
      args: {},
      result: null,
    };
  }

  getSelectedFile = () => {
    return this.state.files.find(({ name }) => name === this.state.selected);
  }

  componentWillMount = () => {
    this.db = new Dexie("wasmFilesStore");
    this.db.version(1).stores({ files: "name" });
    this.loadFiles();
  }

  loadFiles = () => {
    this.db.files.toArray().then((files) => this.setState({ files }))
  }

  loadWasmFiles = (inputFiles) => {
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

  
  run = (args) => {
    const buffer = this.getSelectedFile().data;
    const runtime = new Runtime();
    runWasm(buffer, runtime).then((instance) => {
      const module = instance.module;
      const result = runtime.call(instance.instance, parseArgs(args));
      this.setState({ result });
      let str = runtime.storage.read('')
      console.log(runtime.storage.toArray())
    });
  }

  render() {
    const selectedFile = this.getSelectedFile();
    return (
        <div>
          <div className="AppHeader">
            <Header as="h1">
              WASM Contract Runner
            </Header>
          </div>
          <div className="AppBody">
            <div className="AppExplorer">
              <Explorer 
                files={ this.state.files }
                onSelect= { (selected) => this.setState({ selected })}
                selected= { this.state.selected }
                onLoadWasmFiles={ this.loadWasmFiles }
                 />
            </div>
            <div className="AppRunner">
              { selectedFile && <Runner selectedFile={ selectedFile } onSubmit={ (args) => this.run(args) } />}
            </div>
            <div className="AppOutput">
              <Output result={ this.state.result } />
            </div>
        </div>
      </div>
    );
  }
}

export default App;
