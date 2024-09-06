import './Layout.css';


const Layout  = ({header, mobileNav, children}) => {
    return (
        <>
            <header className="main-header">{header}</header>
            {mobileNav}
            <main className="content">{children}</main>
        </>
    )
}


export default Layout;