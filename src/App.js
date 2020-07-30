import React, { Component } from 'react';
import api from './api';

class App extends Component{
  state= {
    carro: [],
  }

  async componentDidMount(){
    const response = await api.get('');
    this.setState({carro: response.data});
  }

  render(){

    const { carro } =this.state;

    return(
      <div>
        <h1>Lista de Carros</h1>
        {console.log(carro)}
        {carro.map(c => (
          <li key={c.id} >
            <h2>
              Marca:
              {c.marca}
              {c.modelo}
              {c.id}
            </h2>
          </li>
        ))}
      </div>
    );
  }

}

export default App;
