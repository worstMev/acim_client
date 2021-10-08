import './index.css';
import React , { Component } from 'react';
import ActiveUsers from './../activeUsers';
import TechActivityDisplay from './../techActivityDisplay';

/*
 * props : 
 * - socket 
 * - session : username , num_user
 * -showSub
 */

export default class TechActivity extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedUser: {},
        };
    }
    updateSelectedUser = (user) => {
        console.log('updateSelectedUser' , user);
        this.setState({
            selectedUser : user,
        });
    }
    render () {
        let {
            selectedUser,
        } = this.state;
        let indic ;
        if( selectedUser.num_user ){
            indic = `Activite de ${selectedUser.username}`;
        }else{
            indic = '...';
        }
        return (
            <div className="techActivity">
                <div className="side">
                    <ActiveUsers
                        socket = {this.props.socket}
                        session = {this.props.session}
                        selectedUser = {selectedUser}
                        setSelectedUser = {this.updateSelectedUser}
                        />
                </div>
                <div className="main">
                    <TechActivityDisplay
                        tech={selectedUser}
                        socket = { this.props.socket }
                        resetUser = { () => this.updateSelectedUser({}) }
                        showSub = {this.props.showSub}/>
                </div>
            </div>
        );
    }
}
