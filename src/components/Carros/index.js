import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import { 
    Table, 
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';

class FormCarro extends Component {

    state = { 
        model: { 
            id: 0, 
            marca: '',
            modelo: '' 
        } 
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model });
    }

    create = () => {
        this.setState({ model: { id: 0,  marca: '', modelo: '' } })
        this.props.carroCreate(this.state.model);
    }

    componentDidMount() {
        PubSub.subscribe('edit-carro', (topic, carro) => {
            this.setState({ model: carro });
        });
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="marca">Marca:</Label>
                    <Input id="marca" type="text" value={this.state.model.marca} placeholder="Marca do carro"
                    onChange={e => this.setValues(e, 'marca') } />
                </FormGroup>
                <FormGroup>
                    <div className="form-row">
                            <Label for="modelo">Modelo:</Label>
                            <Input id="modelo" type="text"  value={this.state.model.modelo} placeholder="Modelo do carro" 
                            onChange={e => this.setValues(e, 'modelo') } />
                    </div>
                </FormGroup>
                <Button id="save" color="primary" block onClick={this.create}> Gravar </Button>
            </Form>
        );
    }
}

class ListCarro extends Component {

    delete = (id) => {
        this.props.deleteCarro(id);
    }

    onEdit = (carro) => {
        PubSub.publish('edit-carro', carro);
    }

    render() {
        const { carros } = this.props;
        return (
            <Table className="table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        carros.map(carro => (
                            <tr key={carro.id}>
                                <td>{carro.marca}</td>
                                <td>{carro.modelo}</td>
                                <td>
                                    <Button color="info" id="edit" size="sm" onClick={e => this.onEdit(carro)}>Editar</Button>
                                    <Button color="danger" id="delete" size="sm" onClick={e => this.delete(carro.id)}>Deletar</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }   
}

export default class CarroBox extends Component {

    Url = 'http://localhost:8089/api/v1/carros';

    state = {
        carros: [],
        message: {
            text: '',
            alert: ''
        }
    }

    componentDidMount() {
        fetch(this.Url)
            .then(response => response.json())
            .then(carros => this.setState({ carros }))
            .catch(e => console.log(e));
    }

    save = (carro) => {
        let data = {
            id: parseInt(carro.id),
            marca: carro.marca,
            modelo: carro.modelo
        };
        console.log(data);

        const requestInfo = {
            method: data.id !== 0? 'PUT': 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        if(data.id === 0) {
            // CREATE NEW CARRO
            if(carro.marca === ''){
                this.setState({ carro, message: { text: 'Marca não informada!', alert: 'danger' } });
                return;
             }
             if(carro.modelo === ''){
                this.setState({ carro, message: { text: 'Modelo não informado!', alert: 'danger' } });
                return;
             }
            fetch(this.Url, requestInfo)
            .then(response => response.json())
            .then(newCarro => {
                let { carros } = this.state;
                carros.push(newCarro);
                this.setState({ carros, message: { text: 'Novo carro adicionado com sucesso!', alert: 'success' } });
                this.timerMessage(3000);
            })
            .catch(e => console.log(e)); 
        } else {
            // EDIT CARRO
            fetch(`${this.Url}/${data.id}`, requestInfo)
            .then(response => response.json())
            .then(updatedCarro => {
                let { carros } = this.state;
                let position = carros.findIndex(carro => carro.id === data.id);
                carros[position] = updatedCarro;
                this.setState({ carros, message: { text: 'Carro atualizado com sucesso!', alert: 'info' } });
                this.timerMessage(3000);
            })
            .catch(e => console.log(e)); 
        }
    }

    delete = (id) => {
        console.log(`${this.Url}/${id}`);
        fetch(`${this.Url}/${id}`, {method: 'DELETE'})
            .then(rows => {
                const carros = this.state.carros.filter(carro => carro.id !== id);
                this.setState({ carros,  message: { text: 'Carro deletado com sucesso.', alert: 'danger' } });
                this.timerMessage(3000);
            })
            .catch(e => console.log(e));
    }

    timerMessage = (duration) => {
        setTimeout(() => {
            this.setState({ message: { text: '', alert: ''} });
        }, duration);
    }

    render() {
        return (
            <div>
                {
                    this.state.message.text !== ''? (
                        <Alert color={this.state.message.alert} className="text-center"> {this.state.message.text} </Alert>
                    ) : ''
                }

                <div className="row">
    
                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Cadastro de Carros </h2>
                        <FormCarro carroCreate={this.save} />
                    </div>
                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center"> Lista de Carros </h2>
                        <ListCarro carros={this.state.carros}  deleteCarro={this.delete} />
                    </div>
                </div>
            </div>
        );
    }
}