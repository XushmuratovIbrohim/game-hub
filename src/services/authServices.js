import axios from "axios";
axios.defaults.baseURL = process.env.API_URL;
class AuthServices {
    login = async (username, password) => {
        try {
            const response = await axios.post('/login', { username, password });
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };
    register = async (username, nickname, password) => {
        try {
            const response = await axios.post('/register', { username, nickname, password });
            console.log(response);
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
    logout = () => {
        localStorage.removeItem('token');
    }
    getUser = async () => {
        try {
            const response = await axios.get('/getMe', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                },
            });
            return response.data;
        } catch (e) {
            console.error(e);
        }
    }
    updateUser = async (data) => {
        try {
            const response = await axios.patch('/updateUser', data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (e) {
            console.error(e);
        }
    }
}

export default new AuthServices();