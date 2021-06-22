import './main.css';
import React from 'react';
import {  Switch , Route , Redirect, NavLink , useRouteMatch  } from 'react-router-dom'; 
import Dashboard from './dashboard/dashboard';


export default class Main extends React.Component{
    logOut = () => {
        this.props.logOut();
    }
    render(){
        let { path, url } = this.props.match;
            return (
                <div className="main_layout">
                    <div className="header">
                        <h1>mptdn_acim</h1>
                        <p> {this.props.session.username} </p>
                        <button onClick={this.logOut}> se deconnecter </button>
                    </div>
                    <div className="main_display">
                        <nav className="side_nav">
                            <NavLink activeClassName="active_navLink"  to={`${url}/dashboard`}>tableau de bord</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/mytask`}>mes taches</NavLink>
                        </nav>
                        <div className="display">
                            <Switch>
                                <Route exact path={path}> 
                                    <Redirect to={`${path}/dashboard`}/>
                                </Route>
                                <Route path={`${path}/dashboard`} component={Dashboard}/>
                                <Route path={`${path}/mytask`}>
                                    <p> acim mytask </p>
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </div>
            );
    }
}
