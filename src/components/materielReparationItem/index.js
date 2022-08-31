import './index.css';
import React , { Component } from 'react';

/*
 * props : 
 * - materiel : num_materiel , libelle_materiel , libelle_materiel_type , config_origine
 * - socket : 
 */

export default function MaterielReparationItem (props) {
    let { materiel  , is_archived} = props;
    
    let{ 
        num_materiel,
        libelle_materiel,
        libelle_materiel_type,
        config_origine,
        is_working,
        is_in_place,
        lieu,
    } = materiel;
    let statut_text ;
    let repareButtonText = (is_working) ? 'annuler reparation' : 'Réparé';
    let retourneButtonText = (is_in_place) ? 'annuler remise en place' : 'Retourné';

    if(!config_origine) config_origine = 'nd';
    if( is_working && is_in_place ) statut_text = 'OK';
    else if ( is_working ) statut_text = 'A retourner';
    else statut_text = 'A réparer';

    const toggleIsWorking = (num_materiel) => {
        console.log('change is working for num_materiel', num_materiel);
        let new_isWorking = !is_working;
        //send socket.emit
        props.socket.emit('update materiel', ['is_working'] , [new_isWorking] , num_materiel);

    }
    
    const toggleIsInPlace = (num_materiel) => {
        console.log('change is in place for num_materiel', num_materiel);
        let new_isInPlace = !is_in_place;
        //send socket.emit
        props.socket.emit('update materiel', ['is_in_place'] , [new_isInPlace] , num_materiel);

    }
    return (
        <div className="materielReparationItem">
            <div className="materielReparationItem-info">
                <p> Id: {num_materiel} </p>
                <p> Type: {libelle_materiel_type} </p>
                <p> Libelle: {libelle_materiel} </p>
                <p> Provenance : {lieu} </p>
                <p> Etat d'origine : {config_origine} </p>
                <p> Statut :  <b>{statut_text}</b></p>
            </div>
         { !is_archived &&
            <div className="control">
                <button onClick={ ()=> toggleIsWorking(num_materiel) }> { repareButtonText } </button>
                <button onClick={ ()=> toggleIsInPlace(num_materiel) }> { retourneButtonText } </button>
            </div>
         }
        </div>
    );

}
