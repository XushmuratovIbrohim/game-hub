import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.scss'
import { createStore } from 'redux';
import SnakeGame from './components/games/snake/Snake'
import { Provider } from 'react-redux'
import authServices from './services/authServices.js';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE':
            return { ...state, ...action.payload }
        default:
            return state
    }
}

function onWin (coins) {
    authServices.updateUser({ coins })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
}

const store = createStore(reducer, [
    { name: 'Iloncha', icon: '🐍', component: <SnakeGame onWin={onWin} />, id: '1' },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
)
