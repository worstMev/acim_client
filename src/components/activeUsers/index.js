import './index.css';
import React, {Component} from 'react';

/*
 * props:
 * - socket
 * - setSelectedUser
 * - selectedUser
 * - session
 */

export default class ActiveUsers extends Component {
    constructor(props){
        super(props);
        this.state = {
            connectedList : [],
            allUserList : [],
        };
    }

    updateSelectedNumUser = (user) => {
        console.log('updateSelectedNumUser' , user);
        this.props.setSelectedUser(user);
    }

    componentDidMount () {
        console.log('ActiveUsers mounted');
        this.props.socket.emit('get tech_mains list');
        this.props.socket.emit('get list tech_main connected');

        this.props.socket.on('tech_mains list -activeUsers',(tech_mains)=>{
            console.log('tech_mains list -activeUsers', tech_mains);
            // { num_user , username , num_type_user}
            tech_mains.sort((a,b) => {
                if ( a.num_user === this.props.session.num_user ) return -1;
                else return 1;
            });
            this.setState({
                allUserList : tech_mains,
            });
        });

        this.props.socket.on('tech_main connected list -activeUsers', (connected_tech_mains) => {
            console.log('tech_main connected list -activeUsers', connected_tech_mains);
            //connected_tech_mains [num_app_user]
            this.setState({
                connectedList : connected_tech_mains,
            });
            //update the active of the selectedUser
            let newSelectedUser = { ...this.props.selectedUser};
            newSelectedUser.active = connected_tech_mains.includes(this.props.selectedUser.num_user);
            this.updateSelectedNumUser(newSelectedUser);
        });

        this.props.socket.on('new message -activeUsers', (newMs) => {
            console.log('new message -activeUsers');
            this.props.socket.emit('get tech_mains list');
        });
    }

    componentWillUnmount () {
        console.log('ActiveUsers unmounted');
        this.props.socket.off('tech_mains list -activeUsers');
        this.props.socket.off('tech_main connected list -activeUsers');
    }


    render () {
        let {
            allUserList ,
            connectedList,
        } = this.state;
        let {
            session,
            selectedUser,
        } = this.props;
        let elements = allUserList.map( user =>{
            let active = connectedList.includes( user.num_user );
            let selected = ( user.num_user === selectedUser.num_user );
            user.active = active;
            console.log( user.username , active);
            return(
                <UserListItem  
                    isSelf = { session.num_user === user.num_user }
                    key={user.num_user} 
                    username={user.username} 
                    nbNewMessage = {user.nbNewMessage}
                    active={user.active}
                    selected = {selected}
                    onClick={()=> this.updateSelectedNumUser(user) }/>
            );
        });
        return (
            <div className="activeUsers">
                <div className = "scroll_list">
                    {elements}
                </div>
            </div>
        );
    }
}
                //<div className="header-activeUsers">
                //    <p> Moi : {session.username} </p>
                //</div>

function UserListItem (props) {
    let {
        username ,
        active ,
        selected ,
        isSelf,
        nbNewMessage,
    } = props;
    /*
     * props:
     * - username
     * - onClick
     * - active : if online or not
     * - selected :
     */
    let style;
    let pStyle;
    if(selected){
        style = {
            borderBottom : '1px solid red',
            background : 'white',
        };
    }else{
        style = {
        };
    }
    if(active){
        pStyle = {
            borderRight : '5px solid green',
        };
    }else{
        pStyle = {
            borderRight : '5px solid red',
        }
    }
    return(
        <div className="userListItem" style={style}>
            <p onClick={props.onClick} style={pStyle}> 
                {username} {(nbNewMessage > 0) ? `(${nbNewMessage})` : ''}
                {(isSelf) ? `(moi)`:'' } <span className="statut-userListItem">{(active) ? 'connecté' : 'non-connecté'}</span>
            </p>
        </div>
    );
}
