import './index.css';
import React, {Component} from 'react';
import InterventionHistoryControl from './../interventionHistoryControl';
import InterventionHistoryAffichage from './../interventionHistoryAffichage';
import Paginer from './../paginer';



export default class InterventionHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
            itemPerPage : 10,
            currentPage : 1,
            maxItem : 0,//number max of intervention
            tech_main : { num: 'nd' , username : 'nd'},
            date_debut :new Date(new Date().setFullYear(2020,0,1)) ,
            date_fin : new Date(new Date().setHours(23,59,59)),
            statut :{ done : 'nd' , probleme_resolu : 'nd'},
            interventionList : [],
            num_intervention : '',//no nd cause we add % and then it is not nd
            num_intervention_type : 'nd',
        };
    }
    setCurrentPage = (newPage) => {
        console.log('set current page to '+ newPage);
        let {
            maxItem,
            itemPerPage,
        }= this.state;
        let maxPage = Math.ceil(maxItem / itemPerPage);
        if( newPage <= 0 || newPage > maxPage ) return;
        this.setState({
            currentPage : newPage,
        });
    }
    setTechMain = (tech) => {
        console.log('setTechMain', tech);
        
        this.setState({
            tech_main : tech,
        });
    }
    setDateDebut = (debut) => {
        //debut must be a new Date()
        console.log('setDateDebut', debut);
        if(debut.getTime() > this.state.date_fin.getTime()) debut = new Date(new Date(this.state.date_fin).setHours(0,0,0));
        
        this.setState({
            date_debut : debut,
        });
    }
    setDateFin = (fin) => {
        console.log('setDateFin', fin);
        if(fin.getTime() < this.state.date_debut.getTime()) fin = new Date(new Date(this.state.date_debut).setHours(23,59,59));
        this.setState({
            date_fin : fin,
        });
    }
    setStatut = (st) => {
        console.log('setStatut' , st);
        this.setState({
            statut : st,
        });
    }

    setNumIntervention = (num) => {
        this.setState({
            num_intervention : num,
        });
    }

    setNumInterventionType = (num) => {
        this.setState({
            num_intervention_type : num,
        });
    }
    componentDidUpdate (prevProps,prevState) {
        //console.log('prevState', prevState);
        if(prevState.date_debut.getTime() !== this.state.date_debut.getTime()
            || prevState.date_fin.getTime() !== this.state.date_fin.getTime()
            || prevState.tech_main.num !== this.state.tech_main.num
            || prevState.statut.done !== this.state.statut.done
            || prevState.statut.probleme_resolu !== this.state.statut.probleme_resolu
            || prevState.num_intervention !== this.state.num_intervention
            || prevState.num_intervention_type !== this.state.num_intervention_type
            || prevState.currentPage !== this.state.currentPage
        ){
            console.log('emit again');
            let num_intervention;
            if(this.state.num_interevnetion !== 'nd'){
                //add '%' for the LIKE comparisson
                num_intervention = `%${this.state.num_intervention}%`;
            }
            this.props.socket.emit('get intervention history', this.state.tech_main.num,this.state.date_debut , this.state.date_fin , this.state.statut , this.state.num_intervention_type ,num_intervention, this.state.currentPage , this.state.itemPerPage);
        }
    };
    componentDidMount(){
       console.log('intervention History Mounted');
       let {
           tech_main,
           date_fin,
           statut,
           currentPage,
           itemPerPage,
       } = this.state;
       this.props.socket.emit('get intervention history', tech_main.num ,null , date_fin , statut,null , null ,currentPage , itemPerPage );
        //num_intervention use LIKE %...%
       this.props.socket.emit('get oldest intervention date');
        this.props.socket.on('oldest intervention date', (minDate) => {
            this.setState({
                date_debut : new Date(minDate),
            });
        });
        this.props.socket.on('intervention history', (interventions, number ) => {
            console.log('intervention history', interventions,number );
            let newInterventionList = interventions.map( (item, index)=> ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle_lieu,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.tech_main_username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                children : item.children,
                commentaire : item.commentaire,
            }));
            console.log('newInterventionList' , newInterventionList);


            this.setState({
                interventionList : newInterventionList,
                maxItem : number,
            });
        });

    }
    componentWillUnmount(){
        this.props.socket.off('intervention history');
        this.props.socket.off('oldest intervention date');
    }

    render(){
        let {
            currentPage,
            maxItem,
            itemPerPage,
            tech_main,
            statut,
            date_debut,
            date_fin,
            interventionList,
            num_intervention,
            num_intervention_type,
        } = this.state;
        let maxPage = Math.ceil(maxItem/itemPerPage);
        return (
            <div className="interventionHistory">
                <div className="side-InterventionHistory">
                    <InterventionHistoryControl
                        socket={this.props.socket}
                        tech_main={tech_main}
                        setTechMain={this.setTechMain}
                        date_debut={date_debut}
                        date_fin={date_fin}
                        setDateDebut={this.setDateDebut}
                        setDateFin={this.setDateFin}
                        statut={statut}
                        setStatut={this.setStatut}
                        num_intervention = {this.state.num_intervention}
                        setNumIntervention = {this.setNumIntervention}
                        num_intervention_type = {num_intervention_type} 
                        setNumInterventionType = {this.setNumInterventionType}
                        />
                        
                </div>
                <div className="main-InterventionHistory">
                    <InterventionHistoryAffichage 
                        tech_main_username = {tech_main.username}
                        date_debut = {date_debut.toLocaleDateString()}
                        date_fin = {date_fin.toLocaleDateString()}
                        interventions = {interventionList}
                        maxItem = {maxItem}
                        statut={statut}
                        showSub={this.props.showSub}
                        />
                    <Paginer currentPage ={currentPage} maxPage={maxPage} setPage = { this.setCurrentPage } />
                </div>
            </div>
        );
    }
}
