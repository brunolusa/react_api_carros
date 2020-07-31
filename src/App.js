import React, { Component } from 'react';
import Header from './components/Header';
import CarroBox from './components/Carros';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Header title="Carros App" />
        <br />
        <CarroBox />
      </div>
    );
  }
}

export default App;