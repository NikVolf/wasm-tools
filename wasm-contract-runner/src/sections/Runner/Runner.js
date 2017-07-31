import React from 'react';
import styles from './Runner.css';

import { Header, Form, Button, Divider } from 'semantic-ui-react';

export default class Runner extends React.Component {
  render() {
    return <div className="Runner">
        <Header as="h3">Run with params</Header>
        <Divider />
        <Form>
            <Form.Input label="From:" placeholder="0x00000000000000000000..."/>
            <Form.Input label="To:" placeholder="0x00000000000000000000..."/>
            <Form.Input label="Value:"/>
            <Form.Input label="Gas Limit:"/>
            <Form.Input label="Data:"/>
        </Form>
    </div>
  }
}