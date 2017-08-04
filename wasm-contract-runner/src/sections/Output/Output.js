import React from "react";
import styles from "./Output.css";
// import {  } from 'react-dropzone';

export default class Output extends React.Component {
  render() {
    return <div className="Output">{ JSON.stringify(this.props.result) }</div>;
  }
}
