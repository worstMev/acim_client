import './index.css';
import React, {Component} from 'react';
import InterventionHistoryControl from './../interventionHistoryControl';
import InterventionHistoryAffichage from './../interventionHistoryAffichage';



export default class InterventionHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
            tech_main : { num: 'nd' , username : 'nd'},
            date_debut :new Date(new Date().setFullYear(2020,0,1)) ,
            date_fin : new Date(new Date().setHours(23,59,59)),
            statut :{ done : 'nd' , probleme_resolu : 'nd'},
            interventionList : [],
        };
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
        if(debut.getTime() > this.state.date_fin.getTime()) debut = this.state.date_fin;
        
        this.setState({
            date_debut : debut,
        });
    }
    setDateFin = (fin) => {
        console.log('setDateFin', fin);
        if(fin.getTime() < this.state.date_debut.getTime()) fin = this.state.date_debut;
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
    componentDidUpdate (prevProps,prevState) {
        //console.log('prevState', prevState);
        if(prevState.date_debut.getTime() !== this.state.date_debut.getTime()
            || prevState.date_fin.getTime() !== this.state.date_fin.getTime()
            || prevState.tech_main.num !== this.state.tech_main.num
            || prevState.statut.done !== this.state.statut.done
            || prevState.statut.probleme_resolu !== this.state.statut.probleme_resolu
        ){
            console.log('emit again');
            this.props.socket.emit('get intervention history', this.state.tech_main.num,this.state.date_debut , this.state.date_fin , this.state.statut );
        }
    };
    componentDidMount(){
       console.log('intervention History Mounted');
       let {
           tech_main,
           date_fin,
           statut,
       } = this.state;
       this.props.socket.emit('get intervention history', tech_main.num ,null , date_fin , statut);
       this.props.socket.emit('get oldest intervention date');
        this.props.socket.on('oldest intervention date', (minDate) => {
            this.setState({
                date_debut : new Date(minDate),
            });
        });
        this.props.socket.on('intervention history', (interventions ) => {
            console.log('intervention history', interventions );
            let newInterventionList = interventions.map( (item, index)=> ({
                num_intervention : item.num_intervention,
                date_programme : item.date_programme,
                lieu_libelle : item.libelle_lieu,
                intervention_type : item.libelle_intervention_type,
                tech_main_username : item.tech_main_username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
            }));

            this.setState({
                interventionList : newInterventionList,
            });
        });

    }
    componentWillUnmount(){
        this.props.socket.off('intervention history');
        this.props.socket.off('oldest intervention date');
    }

    render(){
        let {
            tech_main,
            statut,
            date_debut,
            date_fin,
            interventionList,
        } = this.state;
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
                        />
                        
                </div>
                <InterventionHistoryAffichage 
                    tech_main_username = {tech_main.username}
                    date_debut = {date_debut.toLocaleDateString()}
                    date_fin = {date_fin.toLocaleDateString()}
                    interventions = {interventionList}
                    statut={statut}
                    showSub={this.props.showSub}
                    />
            </div>
        );
    }
}
