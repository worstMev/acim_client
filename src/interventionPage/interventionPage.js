import './interventionPage.css';
import React from 'react';

export default class InterventionPage extends React.Component  {
    constructor(props){
        super(props);
        this.state ={
            techMainIsAuth : false,
            num_intervention : this.props.num_intervention,
            intervention : {},
            pwd : '',
        }
    }
    updatePwd = (e) => {
        let newPwd = e.target.value;
        this.setState({
            pwd : newPwd,
        })
    }
    authenticate = (e) => {
        e.preventDefault();
        let pwd = this.state.pwd;
        //alert( 'is password for tech_main_creator of num_intervention'+ this.props.num_intervention+' this '+pwd); 
        if (pwd) {
            this.props.socket.emit('authenticate intervention tech_main' , this.state.num_intervention , pwd);
        }
    }
    startIntervention = () => {
       let {    num_intervention} = this.state.intervention;
        console.log('start intervention');
        if( this.state.techMainIsAuth ) {
            this.props.socket.emit('start intervention' , num_intervention );
        }
    }
    endIntervention = (resolu = false) => {
       let {    num_intervention,
                date_debut } = this.state.intervention;
        if (!date_debut) {
            console.log('pas de date de debut mais problem OK');
        }
        console.log('resolu' , resolu);
        console.log('end intervention');
        if( this.state.techMainIsAuth ) {
            this.props.socket.emit('end intervention' , num_intervention  , resolu , date_debut);
        }
    }
    componentDidMount () {
        console.log('intervention page mounted');
        this.props.socket.emit('get intervention data' , this.props.num_intervention);
        this.props.socket.on('intervention data',(intervention) => {
            console.log('intervention data', intervention);

            this.setState({
                intervention : intervention ,
            });
        });

        this.props.socket.on('tech_main is authenticated', (num_intervention) => {
            if( num_intervention === this.state.num_intervention ){
                console.log('tech is auth to true');
                this.setState({
                    techMainIsAuth : true,
                    pwd : '',
                });
            }
        });

        this.props.socket.on('started intervention', (intervention) => {
            console.log('intervention started ' , intervention.num_intervention , intervention.date_debut);
            if ( this.state.num_intervention === intervention.num_intervention ){
                this.setState({
                    intervention : intervention,
                });
            }

        });
        
        this.props.socket.on('ended intervention', (intervention) => {
            console.log('intervention ended ' , intervention.num_intervention , intervention.date_debut);
            if ( this.state.num_intervention === intervention.num_intervention ){
                this.setState({
                    intervention : intervention,
                });
            }

        });
    }
    
    componentDidUpdate(){
        console.log('intervention page updated' , this.props.num_intervention);
        if( this.props.num_intervention !== this.state.num_intervention ) {
            this.props.socket.emit('get intervention data' , this.props.num_intervention);
            let newIntervention ;
            if( !this.props.num_intervention ) newIntervention = {};
            else newIntervention = this.state.intervention ;
            this.setState({
                num_intervention : this.props.num_intervention,
                techMainIsAuth : false,
                intervention : newIntervention,
                
            });
        }
        
    }
    componentWillUnmount(){
        this.props.socket.off('intervention data');
        this.props.socket.off('tech_main is authenticated');
        this.props.socket.off('started intervention');
        this.props.socket.off('ended intervention');
    }
    render () {
        
        let {
            tech_main_username,
            libelle_intervention_type,
            motif,
            libelle_lieu,
            date_programme,
            date_debut,
            date_fin,
            done,
            probleme_resolu,
        }= this.state.intervention;
        if (date_debut) date_debut = new Date(date_debut).toLocaleString('fr-FR');
        if (date_programme) date_programme = new Date(date_programme).toLocaleString('fr-FR');
        if( date_fin ) date_fin = new Date(date_fin).toLocaleString('fr-FR');
        let { num_intervention } = this.props;
        let display ;
        if( this.state.techMainIsAuth ) {
            display = (
                <>
                    <p> Type : {libelle_intervention_type} </p> 
                    <p> Motif : {motif} </p>
                    <p> Lieu : {libelle_lieu} </p>
                    <p> Faite par : {tech_main_username} </p>
                    <p> Programme le : {date_programme} </p>
                    <p> Debutee le : {date_debut} </p>
                    <p> Terminee le : {date_fin} </p>
                    <p> Probleme resolue : { (probleme_resolu) ? 'OUI' : 'NON' } </p>
                    { !date_debut &&
                        <button onClick={this.startIntervention}> Commencer </button>
                    }
                    {  !done &&
                            <button onClick={() => this.endIntervention()}> Terminer </button>
                    }
                    { !done && !probleme_resolu &&
                            <button onClick={() => this.endIntervention(true)}> OK </button>
                    }
                </>
            );
        }else{
            display = (
                <form onSubmit={this.authenticate}>
                    <input type="password" placeholder={`mot de passe de ${tech_main_username}`}  value={this.state.pwd} onChange={this.updatePwd}/>
                    <button onClick={this.authenticate}> Valider </button>
                </form>
            );
        }
        return(
            <div className="interventionPage">
                <p> ID intervention  : {num_intervention} </p>
                <div className="intervention-display">
                    {display}
                </div>
            </div>
        );
    }
}
