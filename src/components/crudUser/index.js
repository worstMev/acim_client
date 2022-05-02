import './index.css';
import React , { Component } from 'react';
import { Switch , Route }  from 'react-router-dom';
import ListAppUser from './../listAppUser';
import UserPage from './../userPage';

export default class CrudUser extends Component {
    openEditor = (num_user = null) => {
        console.log(this.props);
        let { path } = this.props.match;
        if(num_user) {
            console.log('num_user is not false');
            let state = {
                num_user,
            };
            this.props.history.push(`${path}/edit`,state);
        }
        else{
            this.props.history.push(`${path}/edit`);
        }
    }

    render(){
        let { path , url } = this.props.match;
        let listDisplay = (
            <>
                <div className="display">
                    <ListAppUser socket = {this.props.socket}  openEditor={this.openEditor}/>
                </div>
                <div className="control">
                    <button onClick = { () => this.openEditor() }> Creer un nouvel utilisateur </button>
                </div>
            </>
        );
        return (
            <div className="crudUser">
                <Switch>
                    <Route exact path={path} render = {
                        (routeProps) => <>{listDisplay}</>
                    }/>
                    <Route path={`${path}/edit`} render = {
                        (routeProps) => <UserPage {...routeProps} socket={this.props.socket}/>
                    }/>
                </Switch>
            </div>
        );
    }
}
