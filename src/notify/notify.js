import './notify.css';
import React from 'react';
import {  Switch , Route , Redirect, NavLink , useRouteMatch  } from 'react-router-dom'; 
import { io } from 'socket.io-client';
import Ask from './ask/ask';

export default class Notify extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            socket : null ,
        }

    }
    logOut = () => {
        this.props.logOut();
    }

    componentDidMount() {
        //initializa a client socket io
        const newSocket = io('http://localhost:3500');
        console.log('notify mounted');
        this.setState({
            socket : newSocket,
        });
    }

    componentWillUnmount () {
       //disconnect the socket 
       this.state.socket.disconnect();

    }

    render () {
        let { path, url } = this.props.match;
        return (
            <div className="notify_layout">
                <div className="notify_header header">
                    <h1>mptdn_acim</h1>
                    <p> {this.props.session.username} </p>
                    <button onClick={this.logOut}> se deconnecter </button>
                </div>
                <div className="notify_display">
                    <nav className="notify_nav">
                        <NavLink activeClassName="active_navLink_notify" to={`${url}/ask`}>{ `Demande d'assistance`}</NavLink>
                        <NavLink activeClassName="active_navLink_notify" to={`${url}/history`}>Historiques des demandes</NavLink>
                    </nav>
                    <div className="display">
                        <Switch>
                            <Route path={`${path}/ask`} component={Ask} />
                            <Route path={`${path}/history`}>
                                <h2> { `Historique des Demandes d'assistance`} </h2>
                            </Route>
                            <Redirect exact from={path} to={`${path}/ask`} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}
