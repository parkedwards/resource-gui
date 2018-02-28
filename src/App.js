import React, { Component } from 'react';
import { Spin, Card, Row, Col, Input } from 'antd';
import Sifter from 'sifter';

import './App.css';

import executeFetch from './helpers';

const { Search } = Input;
let sifter;

class App extends Component {
  state = {
    items: [],
    fetching: true,
    search: '',
    filtered: [],
  };

  componentWillMount = async () => {
    const data = await executeFetch();
    this.setState(
      {
        ...this.state,
        items: data,
        fetching: false,
      },
      () => {
        const { items } = this.state;
        sifter = new Sifter(items);
      },
    );
  };

  onFieldChange = e => {
    e.preventDefault();
    this.setState({
      ...this.state,
      search: e.target.value,
    });
  };

  onSearchSubmit = () => {
    console.log('inside of search submit');
    const { search } = this.state;
    // const blah = idx.search(search);
    const { items } = sifter.search(search, {
      fields: ['link_title', 'text'],
      conjunction: 'and',
      limit: 500,
    });

    // console.log(items.map(({ id }) => this.state.items[id]));
    this.generateCards(items.map(({ id }) => this.state.items[id]));
  };

  generateCards = (items = this.state.items) => {
    const result = items.map(o => (
      <Card.Grid style={cardStyles}>{o.link_title}</Card.Grid>
    ));
    return result;
  };

  render() {
    if (this.state.fetching) {
      return (
        <div className="spinner-wrap">
          <Spin size="large" id="main-spinner" />
        </div>
      );
    }

    return (
      <div className="App">
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          value={this.state.search}
          onChange={this.onFieldChange}
          onSearch={this.onSearchSubmit}
        />
        <Card>{this.generateCards()}</Card>
      </div>
    );
  }
}

export default App;

const cardStyles = {
  width: '22%',
  height: '250px',
  margin: '5px',
  wordWrap: 'break-word',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  cursor: 'pointer',
};
