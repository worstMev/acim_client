import './index.css';
import React , { useState } from 'react';
import FoldableDiv from './../foldableDiv';
import MaterielSelector from './../materielSelector';
/*
 * props:
 * - listMateriel : array;
 * - setListMateriel to change listMateriel
 * - socket 
 * - maxListMaterielLength
 * - title 
 * - folded
 */
export default function MultiMaterielSelector (props){
    let listMateriel = props.listMateriel;
     let maxLength = (props.maxListMaterielLength) ? props.maxListMaterielLength : 77;
    let title = (props.title) ? props.title : "Selectionner le(s) materiel(s)";
    let folded = (props.folded) ? props.folded : false;

    //let [ length , setLength ] = useState(listMateriel.length);

    function changeListMateriel( objValue , index){
        console.log('changeListMateriel');
        let newList = listMateriel.slice();
        newList[index] = objValue;
        props.setListMateriel(newList);
    }

    function changeListMaterielLength (newLength){
        console.log('changeListMaterielLength', newLength);
        newLength = (newLength < 0) ? 0 : newLength;
        newLength = (newLength > maxLength) ? maxLength : newLength;
        
        let newList = listMateriel.slice();
        if( newLength > newList.length ){
            let dLength = newLength - newList.length;
            console.log('dLength', dLength);
            for(let i = 0 ; i < dLength ; i ++ ){
                newList.push({ num: 'nd' , type :'nd'});
            }
        }else if( newLength < newList.length ){
            newList.length = newLength;
        }
            props.setListMateriel(newList);
        //setLength(newLength);
    }

    console.log('listMateriel before render', listMateriel);
    let materielElements = listMateriel.map( (materiel,index) => 
        <MaterielSelector 
            key = {index}
            title = {`Materiel #${index+1}`}
            socket = {props.socket}
            changeList = {(obj)=> changeListMateriel(obj,index)}
            selectedNumMateriel = {materiel.num}
            selectedMaterielType = {materiel.type}
            />
    );

    return(
        <div className="multiMaterielSelector">
            <FoldableDiv title={title} folded={folded}>
                <p> Nombres : {listMateriel.length}</p>
                <div className="scroll_list">
                    {materielElements}
                </div>
            { (maxLength > 1) &&
                <>
                    <button onClick={()=>changeListMaterielLength(listMateriel.length + 1)}> + </button>
                    <button onClick={()=>changeListMaterielLength(listMateriel.length - 1)}> - </button>
                </>
            }
                
            </FoldableDiv>
        </div>

    );
}
