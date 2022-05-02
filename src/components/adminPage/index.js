import './index.css';
import React , { Component } from 'react';
import { mySocket } from './../../socket_io/socket_io';
import {  Switch , Route , Redirect, NavLink   } from 'react-router-dom'; 
import AppHeader from './../appHeader';
import CrudUser from './../crudUser';

export default class AdminPage extends Component {
    constructor(props){
        super(props);
        this.socket = mySocket.socket;
    }

    componentDidMount() {
        //initialize a client socket io
        mySocket.connect( this.props.session.username , this.props.session.type_user , this.props.session.num_user );

        console.log('adminPage mounted , socket id ', mySocket.socket.id);//id doesn't show up

        this.socket.on('you have to disconnect', () => {
            this.props.logOut();
        });
    }

    logOut = () => {
        this.socket.emit('disconnect all');
        this.props.logOut();
    }

    render(){
        let { path , url } = this.props.match;
        return(
            <div className="adminPage">
                <AppHeader session={this.props.session} 
                                logOut={this.logOut}/>
                <div className= "display">
                    <div className = "nav" >
                        nav
                        <NavLink to={`${url}/user`}> Modifier les utilisateurs </NavLink>
                        <NavLink to={`${url}/lieu`}> Modifier les lieus </NavLink>
                    </div>
                    <div className = "main">
                        <Switch>
                            
                            <Route path={`${path}/user`} render= {
                                (routeProps) => < CrudUser  {... routeProps} socket={this.socket} />
                            }/>
                            <Route path={`${path}/lieu`} render= {
                                (routeProps) => <p>crud lieu </p>
                            }/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
         
    }
}
