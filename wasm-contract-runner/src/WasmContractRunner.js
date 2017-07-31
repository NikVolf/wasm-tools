import React from 'react';
import styles from './App.css';
import { Divider, Grid, Header, Message, Segment } from 'semantic-ui-react';
import Toolbar from './Components/Toolbar';

class WasmContractRunner extends React.Component {
  render() {
    return (
        <div>
          <div className="AppHeader">
            <h2>
              WASM Contract Runner
            </h2>
          </div>
          <div className="AppBody">
            <div className="AppToolbarContainer">
              <Toolbar/>
            </div>
            <div className="AppEditorContainer">

            </div>
          </div>
        </div>
    );
  }
}

export default App;
