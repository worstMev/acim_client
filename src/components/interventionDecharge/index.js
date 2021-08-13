import './index.css';
import React,{useState } from 'react';
import FoldableDiv from './../foldableDiv';
import MultiMaterielSelector from './../multiMaterielSelector';

/*
 * props :
 * -num_intervention : to create the decharge on db
 * -socket to query data on materielsSelector
 * -downloadDecharge : method to download
 */
export default function InterventionDecharge(props){
    //materiels are num_materiels
    let tomorrowDate = new Date(new Date().setDate(new Date().getDate()+1)); 
    let [ materiels , setMateriels ] = useState([{ num:'nd' , type: 'nd'}]);
    let [ dateDebut , setDateDebut ] = useState(new Date());
    let [ dateFin , setDateFin ] = useState(tomorrowDate);
    let {
        num_decharge
    } = props;
    let style ;
    let control ;
    let disabled ;

    let title = 'Effectuer un decharge';
    if(num_decharge){
        title = `ID decharge : ${num_decharge}` ;
        style = {
            ...style,
            background : '#53d35342',
        };
        control = (
            <button onClick={()=>props.downloadDecharge(num_decharge)}> Telecharger </button>
        );
        disabled = true;
    }else{
        control = (
            <button onClick={createDecharge}> Creer </button>
        );
    }
    
    function updateDateDebut(e) {
        console.log('updateDateDebut', e.target.value);
        setDateDebut(new Date(e.target.value));
    }

    function createDecharge() {
        let materielsValide = materiels.filter( item => (item.num !== 'nd' && item.type !== 'nd'))
        console.log('materielsValide', materielsValide);
        if( materielsValide.length  
            && dateDebut.getTime() <= dateFin.getTime()){
            console.log('createDecharge' , dateDebut , dateFin , materielsValide );
            let date = {
                debut : dateDebut,
                fin : dateFin,
            };
            props.socket.emit('create decharge', date , materielsValide);
        }else{
            console.log('pas de materiels valide OU date invalide, InterventionDecharge');
        }
    }

    console.log('render InterventionDecharge');
    return(
        <div className ="interventionDecharge" style={style}>
            <FoldableDiv title={title} folded={true}>
                <div className="decharge-form">
                    <label> Debut : 
                    <input 
                        type='date' 
                        value ={formatDate(dateDebut)} 
                        onChange={updateDateDebut} 
                        disabled={disabled}
                        />
                    </label>
                    <label> Fin : 
                    <input 
                        type='date' 
                        value={formatDate(dateFin)} 
                        onChange={(e)=> setDateFin(new Date(e.target.value))}
                        disabled={disabled}
                        />
                    </label>
                    <MultiMaterielSelector 
                        socket = {props.socket}
                        listMateriel = {materiels}
                        setListMateriel = {setMateriels}
                        />
                    {control}
                </div>
            </FoldableDiv>
        </div>
    );
}

function formatDate (date) {
    let day = `${date.getDate()}`;
    let month = `${date.getMonth() +1}`;
    let year = date.getFullYear();
    month = (month.length < 2) ? '0'+month : month;
    day = (day.length < 2) ? '0'+day : day;
    return `${year}-${month}-${day}`;
}

//function downloadDecharge(num_decharge){
//    //open route /decharge/num_decharge/ in a new tab
//    //alert('downloadDecharge', num_decharge);
//    const URL = '/acim/decharge';
//    window.open(URL ,  '_blank');
//}
