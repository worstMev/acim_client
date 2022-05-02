import './index.css';
import React from 'react';


/*
 * show app_user element in listAppUser
 * props :  user : num_user,  username,  libelle ,
 * openEditor : function to open editor
 */


export default function AppUser (props) {
    let{
        username,
        num_user,
        libelle , //type_user_libelle
    } = props.user;

    function edit(num_user) {
        console.log('edit ', num_user);
        props.openEditor(num_user);
    }
    return(
        <div className="appUser">
            <p> {username} </p>
            <p> {libelle} </p>
            <button onClick={() => edit(num_user)}> Modifier </button>
        </div>
    );
}
