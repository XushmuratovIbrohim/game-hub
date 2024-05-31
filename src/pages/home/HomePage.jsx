import { Link } from 'react-router-dom'
import { useStore} from 'react-redux'

export default function HomePage() {
    const games = useStore().getState()
    return (
        <div className="container">
            {   
                games.map(({ name, icon, id }) => (
                    <Link to={`/game/${id}`} key={name} className="game">
                        <div className="game-icon">{icon}</div>
                        <div className="game-name">{name}</div>
                    </Link>
                ))
            }
        </div>
    )
}
