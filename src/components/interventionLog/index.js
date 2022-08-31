import './index.css';
import React, {useState} from 'react';
import FoldableDiv from './../foldableDiv';

/*
 * props :
 * - log : <string>; 
 * - updateLog 
 */
export default function InterventionLog (props) {
    let etapes =(props.log) ? props.log.split(';') : [''];
    //change size of etapes depending nbEtapes and etapes

    function changeEtapesLength (e,newLength) {
        e.preventDefault();
        if ( newLength > etapes.length ){
            for( let i = 0 , dE = newLength - etapes.length ; i < dE ; i ++) {
                etapes.push('');
            }
        }else if ( newLength < etapes.length ) {
            etapes.length = newLength;
        }
        props.updateLog( etapes.join(';'));
    }
    

    function changeEtape (newEtape,index){
        console.log('change Etapes', index);
        let newEtapes = etapes.slice();
        newEtapes[index] = newEtape;
        props.updateLog( newEtapes.join(';'));
    };
    console.log('etapes before render' , etapes);
    let logElements = etapes.map( (etape,index) => 
        <input value={etape} placeholder={`etape #${index+1}`} key={index} onChange={(e)=>changeEtape(e.target.value,index)}/>
    );
    
    return (
        <div className="interventionLog">
            <FoldableDiv title="Étape(s)" folded={true}>
                <form onSubmit={ (e)=>changeEtapesLength(e,etapes.length + 1) } >
                    {logElements}
                    <button onClick={(e)=>changeEtapesLength(e,etapes.length + 1)}> + </button>
                    <button onClick={(e)=>changeEtapesLength(e,etapes.length - 1)}> - </button>
                </form>
            </FoldableDiv>
        </div>
    );
}


