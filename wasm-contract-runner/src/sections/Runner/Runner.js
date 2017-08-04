import React from 'react';
import styles from './Runner.css';

import { Header, Form, Button, Divider, Input } from 'semantic-ui-react';

export default class Runner extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            address: "",
            sender: "",
            origin: "",
            value: "",
            data: "",
        }
    }

    handleChange = ({ target }) => {
        const { name, value } = target;
        this.setState({[name]: value});
    }

    render() {
        const { selectedFile, onSubmit } = this.props;
        return <div className="Runner" >
            <Form>
                <Form.Input name="address" label="Address" onChange={ this.handleChange } />
                <Form.Input name="sender" label="Sender" onChange={ this.handleChange } />
                <Form.Input name="origin" label="Origin" onChange={ this.handleChange } />
                <Form.Button color="orange" fluid onClick={ () => onSubmit(this.state) }>Run</Form.Button>
            </Form>
        </div>
    }
}