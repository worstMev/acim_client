import './index.css';
import React , { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import MaterielReparationItem from './../materielReparationItem';

/*
 * props : 
 * - decharge : { num_decharge ,date_debut , date_fin , num_intervention , tech_main_username, materiel [] , is_all_working , renews }
 * - socket : for materielReparationItem, and changing state : is_archived
 * - session 
 */

export default class ReparationLocale extends Component {

    constructor(props){
        super(props);
        this.state = {
            showRenouvellement : false,
            newDateFin : '',
        };
    }

    toggleShowRenouvellement = () => {
        let showRenew = ! this.state.showRenouvellement;
        this.setState({
            showRenouvellement : showRenew,
        });
    }


    toggleIsArchived = (num_decharge) => {
        let new_is_archived = !this.props.decharge.is_archived;
        console.log('switch is_archived for %s to %s', num_decharge ,new_is_archived);
        this.props.socket.emit('update decharge', ['is_archived'] , [new_is_archived] , num_decharge);
    }

    extendDecharge = (num_decharge,newDate) => {
        let {
            date_fin,
        } = this.props.decharge;
        if(newDate){
            newDate = newDate.toISOString();
            if( new Date(formatDate(date_fin)) < new Date(newDate) ) {
                console.log('extend decharge %s pour %s' , newDate, num_decharge);
                this.props.socket.emit('update decharge', ['date_fin_decharge'] , [newDate] , num_decharge);
            }
        }
    };


    getDechargeDoc = (num_decharge) => {
        //get the server url , 
        const s_URL = new URL(document.location.href);
        //may not need to change port
        const m_path = `/docx/acim/decharge/${num_decharge}`
        s_URL.port = 3500;
        s_URL.pathname = m_path;
        console.log('s_URL',s_URL);
        window.open(s_URL, '_blank');
    }

    setNewDateFin = (new_date) => {
        console.log('new date fin :', new_date);
        //let newDate = new Date(new_date);
        this.setState({
            newDateFin : new_date,
        });
    }
    
    render(){

        let {
            newDateFin,
            showRenouvellement,
        } = this.state;

        let {
            num_decharge,
            is_all_working,
            is_all_in_place,
            is_archived,
            date_debut,
            date_fin,
            num_intervention,
            tech_main_username,
            num_tech_main,
            materiels,
            renews,
        } = this.props.decharge;
        let dateFinIsoFormat = date_fin.split('/').reverse().join('-');
        let is_perime  = new Date(dateFinIsoFormat) < new Date();
        let statutText = 'nd';
        let style = {};
        let isMyResponsability = (num_tech_main === this.props.session.num_user);
        if(is_archived){
            statutText = 'Archivé';
            style = {
                background : 'lightgrey',
            };

        }else{
            if( is_all_working ) {
                if( is_all_in_place ){
                    statutText = 'Réglé , à archiver';
                    style = {
                        background : '#a9c8f7',
                    };

                }else{
                    statutText = 'à retourner';
                    style = {
                        background : 'rgba(44, 155, 133, 0.38)',
                    };
                }
            }else{
                statutText = 'à réparer';
                style = {
                    background : '#f3b84457',
                };
                if( is_perime ){
                    //perime and NOT all_is_working
                    statutText = 'à renouveller';
                    style = {
                        background : '#ff000069',
                    }
                }
            }
        }
        
        const displayDateRenouvellement = (newDateFin) ? formatDate(newDateFin.toLocaleDateString()) : formatDate(date_fin);
        
        const displayRenews = renews.map( renew =>{
                let { 
                    date_creation_renouvellement , 
                    ancienne_date,
                    new_date,
                    username,
                } = renew;
                const date_renew = new Date(date_creation_renouvellement).toLocaleString();
                const old = new Date(ancienne_date).toLocaleDateString();
                const newd = new Date(new_date).toLocaleDateString();
                return(<p key={renew.num_renouvellement} > Renouvellée le {date_renew} du {old} au {newd} par {username}. </p>);
            }
        );

        const matos = materiels.map( mat => <MaterielReparationItem key = {mat.num_materiel}  materiel = {mat} socket={this.props.socket} is_archived= {is_archived}/> ); 
        return(
            <div className="reparationLocale" style={style}>
                <div className="reparationLocale-Info">
                    <div>
                        <p> Fin prévue : {date_fin} </p>
                        <p> Validité de la décharge : {date_debut} - {date_fin} </p>
                        <p> Décharge id : {num_decharge} <button onClick={()=>this.getDechargeDoc(num_decharge)}> Télécharger </button> </p>
                        <p> Responsable : {tech_main_username} </p>
                        {displayRenews}
                    </div>
                    <div className="status">
                        <p> Statut : <b>{ statutText }</b> </p>
                    </div>
                    { is_perime && !is_archived && isMyResponsability &&
                        <button onClick = {() => this.toggleShowRenouvellement() }> Renouveller </button>
                    }
                    { !is_archived && isMyResponsability &&
                        <button onClick = {() => this.toggleIsArchived(num_decharge)}> Archiver </button>
                    }
                </div>
                { isMyResponsability && is_perime && showRenouvellement &&
                <div>
                    <label> Renouveller jusqu'au : 
                    <input 
                        type='date' 
                        value={displayDateRenouvellement} 
                        onChange={(e)=> this.setNewDateFin(new Date(e.target.value))}
                        />
                    </label>
                    <button onClick = {()=> this.extendDecharge(num_decharge,this.state.newDateFin)}> Valider </button>
                </div>
                }
                <FoldableDiv title={`Matériel${ (materiels.length > 1) ? 's' : ''}`} folded={true}>
                    {matos}
                </FoldableDiv>
            </div>
        );
    }
}

function formatDate (date) {
    // dd/mm/yyyy to yyyy-mm-dd
    let [ day , month, year ] = date.split('/');
    return `${year}-${month}-${day}`;
}
