import axios from 'axios';

const api_carros = axios.create({
    baseURL: 'http://localhost:8089/api/v1/carros'
})

export default api_carros;