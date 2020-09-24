import React from 'react';
import { NavLink } from 'react-router-dom';
import Authorization from './Authorization';

const HeaderAndNavigation = () => {
    return (
        <div>
            <header>
                Computer Science Book Review Application
                </header>
            <nav>
                <div className="navbar">
                    <NavLink to="/Home" activeClassName="link-active">Home</NavLink>
                    <NavLink activeClassName="link-active" to="/BookSearch"> Book Search </NavLink>
                    <NavLink activeClassName="link-active" to="/Reviews"> Reviews </NavLink>
                    <Authorization />
                </div>
            </nav>
        </div>
    );
}


export default HeaderAndNavigation;