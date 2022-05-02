import './index.css';
import React , { Component } from 'react';
import AppUser from './../appUser';

/*
 * props :
 *  socket : to get the data
 *  match : from route
 */

export default class ListAppUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            listAppUser : [],
            dataLoaded : false,
        }
    }
    componentDidMount(){
        this.props.socket.emit('get list app_user');

        this.props.socket.on('list app_user', (listAppUser) => {
            console.log('list app_user ', listAppUser);
            this.setState({
                listAppUser : listAppUser,
                dataLoaded : true,
            });
        });

    }
    
    componentWillUnmount(){
        this.props.socket.off('list app_user');
    }
    render () {
        let { 
            dataLoaded ,
            listAppUser ,
        } = this.state;
        let display= <p> Loading ... </p> ;
        if(dataLoaded) {
            display = listAppUser.map(user => <AppUser key={user.num_user} user={user} openEditor={this.props.openEditor}/>);
        }
        return(
            <div className="listAppUser">
                <p> List des utilisateurs </p>
                <div className="scroll_list">
                {display}
                </div>
            </div>
        );
    }
}
