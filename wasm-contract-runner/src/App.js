import React from 'react';
import styles from './App.css';
import { Header } from 'semantic-ui-react';
import Explorer from './sections/Explorer/Explorer';
import Runner from './sections/Runner';
import Output from './sections/Output';

class App extends React.Component {
  render() {

console.log(Explorer);
    return (
        <div>
          <div className="AppHeader">
            <Header as="h1">
              WASM Contract Runner
            </Header>
          </div>
          <div className="AppBody">
            <div className="AppExplorer">
              <Explorer />
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
