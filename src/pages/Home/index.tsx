import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/withdraw">Withdraw</Link>
            <Link to="/sell">Sell</Link>
        </div>
    )
}
