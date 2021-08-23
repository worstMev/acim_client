import './index.css';
import React , {useState} from 'react';
import ActiveUsers from './../activeUsers';
import MessageRoom from './../messageRoom';
/*
 * props :
 * - socket : for getting data
 * - session: to identify self
 * - setNbNewMessageToZero :
 */

export default function MessagePage(props) {
    let selectedUserFromState;
    if( props.location.state && props.location.state.num_user && props.location.state.username ){
        //setSelected_app_user_recepteur(props.match.location
        //setSelected_app_user_recepteur({ ... props.location.state , active : true });
        selectedUserFromState = { ... props.location.state , active : true};
    }else{
        selectedUserFromState = {};
    }
    let [selected_app_user_recepteur, setSelected_app_user_recepteur] = useState(selectedUserFromState);

    return(
        <div className="messagePage">
            <div className ="side-messagePage">
                <ActiveUsers 
                    socket = {props.socket} 
                    session = {props.session}
                    setSelectedUser = {setSelected_app_user_recepteur}
                    selectedUser = {selected_app_user_recepteur}/>
            </div>
            <div className="main-messagePage">
                <MessageRoom 
                    socket={props.socket}
                    selectedUser = {selected_app_user_recepteur}
                    session={props.session}
                    setNbNewMessageToZero={props.setNbNewMessageToZero}/>
            </div>
        </div>
    );
}
