import './index.css';
import React , { Component, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AnnonceList from './../annonceList';

/*
 * props:
 * - socket
 * - session
 */

export default function AnnoncePage(props){
    let [ contenu , setContenu ] = useState('');
    let{
        session,
    } = props;
    function createAnnonce(e){
        e.preventDefault();
        console.log('create annonce' ,session.username, contenu)
        if( contenu ){
            //send the annonce
            let annonce_id = uuidv4();
            setContenu('');
            props.socket.emit('create annonce' ,annonce_id, session.num_user , contenu);
        }
    }
    let today_7 = new Date(new Date().getTime() - 7*24*60*60*1000).toLocaleDateString('fr-FR');
    let today = new Date().toLocaleDateString('fr-FR');
    return(
        <div className="annoncePage">
            <div className="header">
                <p> Annonce </p>
            </div>
            <div className="display">
                <AnnonceList
                    session = {props.session}
                    socket = {props.socket}/>
            </div>
            <div className="input">
                <form onSubmit={createAnnonce}>
                    <textarea placeholder="Annonce ..." 
                        value={contenu} 
                        onChange={(e)=>setContenu(e.target.value) }>
                    </textarea>
                    <button> Publier </button>
                </form>
            </div>
        </div>
    );
}
