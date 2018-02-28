import React, { Component } from 'react';
import { Spin, Card, Row, Col, Input } from 'antd';
import lunr from 'lunr';
import './App.css';

import executeFetch from './helpers';

const { Search } = Input;
let idx;

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
        items: data,
        fetching: false,
      },
      () => {
        const { items } = this.state;
        idx = lunr(function() {
          this.field('link_title');
          this.field('link_text');
          this.field('text');
          items.forEach(el => {
            this.add(el);
          });
        });
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
    const { search } = this.state;
    const blah = idx.search(search);
    // this.generateCards(blah.map(score => this.state.list[]))
  };

  generateCards = (items = this.state.items) =>
    items.map(o => <Card.Grid style={cardStyles}>{o.link_title}</Card.Grid>);

  render() {
    if (this.state.fetching) {
      return (
        <div>
          <Spin size="large" />
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
        {/* <Button type="primary">heyo</Button> */}
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
