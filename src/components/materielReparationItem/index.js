import './index.css';
import React , { Component } from 'react';

/*
 * props : 
 * - materiel : num_materiel , libelle_materiel , libelle_materiel_type , config_origine
 */

export default function MaterielReparationItem (props) {
    let { materiel } = props;
    
    let{ 
        num_materiel,
        libelle_materiel,
        libelle_materiel_type,
        config_origine,
    } = materiel;
    
    return (
        <div className="materielReparationItem">
            <p> id: {num_materiel} </p>
            <p> type: {libelle_materiel_type} </p>
            <p> libelle: {libelle_materiel} </p>
            <p> configuration: {config_origine} </p>
        </div>
    );

}
