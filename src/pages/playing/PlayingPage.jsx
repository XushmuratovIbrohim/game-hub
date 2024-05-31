import { useParams } from "react-router-dom"
import { useStore } from "react-redux"

export default function PlayingPage() {
    const { id } = useParams()
    const game = useStore().getState().find(game => game.id === id)
    return (
        <div>
            <h1>{game.name} O&#39;yini</h1>
            <div>{game.component}</div>
        </div>
    )
}