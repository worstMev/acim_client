import './index.css';
import React from 'react';
import FoldableDiv from './../foldableDiv';
import ProblemeTechConstate from './../problemeTechConstate';
import InterventionLog from './../interventionLog';
import InterventionDecharge from './../interventionDecharge';
import MultiMaterielSelector from './../multiMaterielSelector';

export default class InterventionPage extends React.Component  {
    constructor(props){
        super(props);
        this.state ={
            techMainIsAuth : false,
            num_intervention : this.props.num_intervention,
            intervention : {},
            pwd : '',
            selectedNumProblemeTechType: 'nd',
            selectedNumLieu : 'nd',
            remarque : '',
            log : 'etape1 ; etape2; etape3;',
            num_decharge : '',
            materiels : [{num:'nd' , type:'nd'}],//only one but to adapt to multiMaterielSelector way of things we use an array
        }
    }
    updateMateriel = (newMateriels) => {
        this.setState({
            materiels : newMateriels,
        });

    };
    updateProblemeTechType = (e) => {
        let newNumProblemeTechType = e.target.value;
        this.setState({
            selectedNumProblemeTechType : newNumProblemeTechType,
        });
    }
    updateLieu = (e) => {
        let newNumLieu = e.target.value;
        this.setState({
            selectedNumLieu : newNumLieu,
        });
    }
    updateRemarque = (e) => {
        let newRemarque = e.target.value;
        this.setState({
            remarque : newRemarque,
        });
    }
    updateLog = (newLog) => {
        this.setState({
            log : newLog,
        });
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
    updateIntervention = () => {
        let {
            num_intervention,
        } = this.state.intervention;
        let {
            log,
            selectedNumProblemeTechType,
            selectedNumLieu,
            remarque,
            num_decharge,
            materiels,
        } = this.state;
        console.log('updateIntervention', num_intervention , log , selectedNumProblemeTechType ,selectedNumLieu);
        let isInput = log ||(selectedNumProblemeTechType !== 'nd' && selectedNumLieu !== 'nd') ; 
        if( num_intervention ){
            if( log ) {
                console.log('emit udpdate intervention info log');
                this.props.socket.emit('update intervention info log' , num_intervention ,log);
            }
            if( selectedNumProblemeTechType !== 'nd' && selectedNumLieu !== 'nd'){
                console.log('emit update intervention info probleme_tech');
                let probleme_constate = {
                    num_probleme_tech_type : selectedNumProblemeTechType,
                    num_lieu : selectedNumLieu,
                    remarque ,
                }
                this.props.socket.emit('update intervention info probleme_tech' , num_intervention , probleme_constate);
            }
            if(num_decharge){
                console.log('emit update decharge intervention');
                this.props.socket.emit('update decharge intervention' , num_decharge , num_intervention);
            }
            if(materiels){
                console.log('emit update intervention info num_materiel');
                this.props.socket.emit('update intervention info num_materiel', num_intervention , materiels[0].num);
            }
        } 
    }
    componentDidMount () {
        console.log('intervention page mounted');
        console.log(this.props.socket);
        this.props.socket.emit('get intervention data' , this.props.num_intervention);
        this.props.socket.on('intervention data',(intervention) => {
            console.log('intervention data', intervention);

            this.setState({
                intervention : intervention ,
                log : intervention.log,
                num_decharge : intervention.num_decharge,
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
        
        this.props.socket.on('ended intervention interventionPage', (intervention) => {
            console.log('intervention ended ' , intervention.num_intervention , intervention.date_debut);
            if ( this.state.num_intervention === intervention.num_intervention ){
                this.setState({
                    intervention : intervention,
                });
            }

        });

        this.props.socket.on('new decharge' , (newDecharge) => {
            let {
                num_decharge
            } = newDecharge;
            this.setState({
                num_decharge : num_decharge,
            });
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
                num_decharge : '',
                
            });
        }
        
    }
    componentWillUnmount(){
        this.props.socket.off('intervention data');
        this.props.socket.off('tech_main is authenticated');
        this.props.socket.off('started intervention');
        this.props.socket.off('probleme_tech_type list');
        this.props.socket.off('lieu list');
        this.props.socket.off('new decharge');
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
            libelle_probleme_tech_type,//if there is
            log : log_info,//if there is
            lieu_probleme_tech,
            num_decharge : num_decharge_info,
            num_materiel,
            libelle_materiel ,
            libelle_materiel_type ,
        }   = this.state.intervention;
        let log_info_tab , log_info_elements;
        if( log_info ) {
            log_info_tab = log_info.split(';');
            log_info_elements = log_info_tab.map( (etape,index) => 
                <li key = {index}>{etape}</li>
            );
        }
        
        let {
            selectedNumProblemeTechType,
            selectedNumLieu,
            remarque,
            log,
            num_decharge,
            materiels,
        }   = this.state;
        
        let {
            style,
            closeSub,
        }   = this.props;
        if (date_debut) date_debut = new Date(date_debut).toLocaleString('fr-FR');
        if (date_programme) date_programme = new Date(date_programme).toLocaleString('fr-FR');
        if( date_fin ) date_fin = new Date(date_fin).toLocaleString('fr-FR');
        let { num_intervention } = this.props;
        let display ;
        let control = (
            <>
                { !date_debut &&
                    <button onClick={this.startIntervention}> Commencer </button>
                }
                {  !done &&
                        <button onClick={() => this.endIntervention()}> Terminer </button>
                }
                {  !probleme_resolu &&
                        <button onClick={() => this.endIntervention(true)}> OK </button>
                }
            </>
        );
        if( this.state.techMainIsAuth ) {
            let info;
            info = (
                <>
                    <p> Type : {libelle_intervention_type} </p> 
                    <p> Motif : {motif} </p>
                    <p> Lieu : {libelle_lieu} </p>
                    <p> Faite par : {tech_main_username} </p>
                    <p> Programme le : {date_programme} </p>
                    <p> Debutee le : {date_debut} </p>
                    <p> Terminee le : {date_fin} </p>
                    { libelle_probleme_tech_type &&
                        <p> Probleme constaté : { libelle_probleme_tech_type } -- {lieu_probleme_tech} </p>
                    }
                    { log_info && 
                        <p>
                             {`${(log_info_tab.length > 1)? 'Etapes suivies' : 'Etape suivie'}`} : 
                             {log_info_elements} 
                        </p>
                    }
                    { num_decharge_info &&
                        <p>
                            ID decharge : <button> {num_decharge_info} </button>
                        </p>
                    }
                    { num_materiel &&
                            <p>
                            Intervention sur : {libelle_materiel_type} -- {libelle_materiel}
                            </p>
                    }
                    <p> Probleme resolue : { (probleme_resolu) ? 'OUI' : 'NON' } </p>
                </>
            );
            display = (
                <>
                    <div className="intervention-form">
                        <FoldableDiv title="INFO">
                            {info}
                        </FoldableDiv>
                        <div className="intervention-modifier">
                            <FoldableDiv title="Modifier" folded={true}>
                                <ProblemeTechConstate 
                                    numProblemeTechType = {selectedNumProblemeTechType}
                                    numLieu = {selectedNumLieu}
                                    remarque = {remarque}
                                    onChangeProblemeTechType = {this.updateProblemeTechType}
                                    onChangeLieu = {this.updateLieu}
                                    onChangeRemarque = {this.updateRemarque}
                                    socket = {this.props.socket} 
                                    />
                                <InterventionLog 
                                    log = {log}
                                    updateLog = {this.updateLog}
                                    />
                                    <MultiMaterielSelector
                                        socket = {this.props.socket}
                                        listMateriel = {materiels}
                                        setListMateriel = {this.updateMateriel}
                                        maxListMaterielLength = {1}
                                        title="Objet de l'intervention"
                                        folded={true}
                                        />
                                <InterventionDecharge
                                    socket = {this.props.socket}
                                    num_intervention = {num_intervention}
                                    num_decharge = {num_decharge}
                                    />
                                <button onClick={this.updateIntervention}> Sauvergarder </button>
                            </FoldableDiv>
                        </div>
                    </div>
                    <div className="intervention-control">
                        {control}
                    </div>
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
            <div className="interventionPage" style={style}>
                <div className="interventionPage-title">
                    <button onClick={closeSub}> {'x'} </button>
                    <p> Intervention </p>
                </div>
                <p> ID intervention  : {num_intervention} </p>
                <div className="intervention-display">
                    {display}
                </div>
            </div>
        );
    }
}
