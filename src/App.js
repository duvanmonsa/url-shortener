import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Input, Button } from 'antd';

import './App.css';


const { TextArea } = Input;

const getUrls = (text) => {
  const expression = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/ig;
  const regex = new RegExp(expression);
  return text.match(regex);
}

const App = (props) => {
  const [response, setResponse] = useState();
  const [copySuccess, setCopySuccess] = useState(false);
  const refResult = useRef(null);

  const handleSubmit = e => {
    setCopySuccess(false)
    e.preventDefault();
    props.form.validateFields(async (err, { text }) => {
      if (!err) {
        let result = text;
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}`, { urls: getUrls(text) });
        data.forEach(urlData => {
          result = result.replace(urlData.original_url, `<a href="${urlData.short_url}">${urlData.short_url}</a>`)
        })
        setResponse(result);
      }
    });
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
    setCopySuccess(true)
  };

  const validateUrls = (rule, value, callback) => {
    if (value && getUrls(value) === null) {
      callback('At least one url must be inside the text')
    }
    callback();
  }

  const { getFieldDecorator } = props.form;

  return (
    <Row type="flex" justify="center" className="App">
      <Col span={24}>
        <h1>Shor urls for any text</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('text', {
              rules: [
                { required: true, message: 'Please input the text!' },
                {
                  validator: validateUrls
                }
              ],
            })(
              <TextArea rows={5} />,
            )}
          </Form.Item>
          <Form.Item >
            <Button type="primary" size="large" htmlType="submit">
              Short Links
          </Button>
          </Form.Item>
        </Form>
        {response && (
          <div className="response">
            <div ref={refResult} dangerouslySetInnerHTML={{ __html: response }} />
            {/* <TextArea ref={refResult} rows={5} value={response} /> */}
            <Button type={copySuccess ? "dashed" : "primary"} size="primary" onClick={copyToClipboard} className={copySuccess && 'copied'}>
              {copySuccess ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default Form.create({ name: 'shortUrl' })(App);
