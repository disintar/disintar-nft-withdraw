
import './styles.scss'

const Layout = ({children}) => {
    return (
        <div className="layout-wrapper">
            {children}
        </div>
    )
}

export {Layout}