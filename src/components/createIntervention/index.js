import './index.css';
import React , {Component , createRef} from 'react';
import FoldableDiv from './../foldableDiv';
import Dropdown from './../../utils/dropDown';
import InterventionDecharge from './../interventionDecharge';
import Agenda from './../agenda';
import MaterielSelector from './../materielSelector';
import InterventionTypeCreator from './../interventionTypeCreator';
import ProblemeTechTypeCreator from './../problemeTechTypeCreator';

/*
 * props:
 * - socket
 * - session
 * - routeProps
 */

export default class CreateIntervention extends Component {
    constructor(props){
        super(props);

        let supposedFreeHours = new Date().getHours() + 1;
        this.state = {
            interventionTypeList : [],
            selectedNumInterventionType : '',
            dateProgramme : new Date( new Date().setHours(supposedFreeHours,0,0)).toISOString(),//localTime
            dateProgrammeDisplay : new Date(new Date().setHours((supposedFreeHours+3),0,0,0)).toISOString().replace('Z',''),//UTC : localTime - 3 , display consider its input to be localtime and tries to change it to UTC 
            lieuList : [],
            selectedNumLieu : '',
            materielList : [],
            selectedNumMateriel : '',
            materielTypes : [],
            selectedMaterielType : '',
            motif : 'ND',
            problemeList : [] ,
            selectedNumProblemeTechType : '',
            message : '',
            num_intervention_pere : '',//initialized by route here
            commentaire : '',
        }
        this.materiels = null;
        this.lieus = null;
        this.problemeTechTypes= null ;
        this.agendaPop = createRef();
        this.intervTypeCreator = createRef();
        this.problemeTechTypeCreator = createRef();
    }
    updateTypeIntervention = (e) => {
        console.log('update type intervention', e.target.value);
        let newNumInterventionType = e.target.value;
        this.setState({
            selectedNumInterventionType : newNumInterventionType,
        });
    }
    updateDateProgramme = (e) =>{
        console.log('updateDateProgramme ' ,new Date(e.target.value));
        let newDateProgramme = new Date(e.target.value);
        this.setState({
            dateProgramme : newDateProgramme,
            dateProgrammeDisplay : e.target.value,
        });
    }
    updateLieu = (e, motif) => {
        console.log('update lieu', e.target.value);
        console.log(motif);
        let newNumLieu = e.target.value;
        this.setState({
            selectedNumLieu : newNumLieu,
        });
    }
    updateMaterielType = (e) => {
        console.log('updateMaterielType', e.target.value);
        console.log('this.materiel' , this.materiels);
        this.setState({
            selectedMaterielType : e.target.value,
            materielList : this.materiels[e.target.value],
        });
    }
    updateMateriel = (e) => {
        console.log('updateMateriel' , e.target.value);
        this.setState({
            selectedNumMateriel : e.target.value,
        });
    }

    updateMotif = (e) => {
        console.log('update motif', e.target.value);
        this.setState({
            motif : e.target.value,
        });
    }

    //also used in update of Lieu because we need to update the motif at the same time
    //but update lieu is still there in case we want to revert
    updateProbleme = (e, numLieu) => {
        console.log('update probleme', e.target.value);
        console.log(this.problemeTechTypes);
        //change motif to 'resoudre probleme : type -- lieu '
        let type = this.problemeTechTypes[e.target.value];
        let lieu;
        let newMotif;
        let newNumLieu = (numLieu) ? numLieu : this.state.selectedNumLieu ;
        lieu = this.lieus[newNumLieu];
        if(type){
            newMotif = `Resoudre probleme : ${type} -- ${lieu}`;
        }else{
            newMotif = this.state.motif;
        }
        
        console.log('motif', newMotif);
        this.setState({
            motif : newMotif, 
            selectedNumProblemeTechType : e.target.value || '',
            selectedNumLieu : newNumLieu,
        });
    }

    updateCommentaire = (e) => {
        console.log('updateCommentaire' , e.target.value);
        this.setState({
            commentaire : e.target.value,
        });
    }



    createIntervention = () => {
        let {
            selectedNumInterventionType ,
            dateProgramme,
            selectedNumLieu,
            selectedNumProblemeTechType,
            selectedNumMateriel,
            motif,
            num_intervention_pere,
            commentaire,
        } = this.state;
        let code_intervention_type = '';//we use numInterventionType
        if (selectedNumMateriel === 'nd') selectedNumMateriel = '';
        //must be there : numInterventionType , numLieu , date_programme , 
        if( selectedNumInterventionType && selectedNumLieu && dateProgramme ) {
            //send the 'create intervention'
            console.log( 'create intervention : ' , selectedNumInterventionType ,code_intervention_type,  selectedNumLieu,  dateProgramme,motif, selectedNumMateriel,selectedNumProblemeTechType,num_intervention_pere);
            this.props.socket.emit('create intervention', selectedNumInterventionType , code_intervention_type , selectedNumLieu , dateProgramme , motif , selectedNumMateriel,selectedNumProblemeTechType,num_intervention_pere, commentaire);
            this.setState({
                message : 'intervention Creer lance',
            });
        }else{
            this.setState({
                message : 'selectionner un type d\'intervention, un lieu et une date programmée',
            });
        }
        
    }


    componentDidMount () {
        console.log('createIntervention did mount');
        //get the data : type_intervention
        this.props.socket.emit('get intervention definition');

        this.props.socket.on('intervention_type list -createIntervention' , (intervention_types) => {
            console.log(' intervention_types ' ,intervention_types);
            let newInterventionList = intervention_types.map( type => ({
                key : type.num_intervention_type,
                value : type.num_intervention_type,
                libelle : type.libelle_intervention_type,
            }));
            let newSelectedNumInterventionType = newInterventionList[0].key;
            if( this.props.location.state ){
                if ( this.props.location.state.num_intervention_type ){
                    newSelectedNumInterventionType = this.props.location.state.num_intervention_type;
                }
            }
            this.setState({
                interventionTypeList : newInterventionList,
                selectedNumInterventionType : newSelectedNumInterventionType,
            });
        });
        
        this.props.socket.on('lieu list -createIntervention' , (lieus) =>{
            console.log('lieus' , lieus );
            for( const lieu of lieus){
                this.lieus = {
                    ...this.lieus,
                    [lieu.num_lieu] : [lieu.libelle],
                }
            }
            let newLieuList = lieus.map( lieu => ({
                key : lieu.num_lieu,
                value : lieu.num_lieu,
                libelle : lieu.libelle,
            }));
            this.setState({
                lieuList : newLieuList,
                selectedNumLieu : newLieuList[0].value,
            });
        });

        this.props.socket.on('materiel list -createIntervention' ,(materiels,materielTypes, lieus) => {
            console.log('materiels', materiels);
            let materielsList ;
            
            for( const type of materielTypes ){
                
                materielsList = {
                    ...materielsList,
                    [type.libelle_materiel_type] : materiels.filter( item => item.num_materiel_type === type.num_materiel_type).map( item => ({
                        key : item.num_materiel,
                        value : item.num_materiel,
                        libelle : item.libelle_materiel,
                    })),
                }
            }
            materielsList ={
                ...materielsList,
                ['nd'] : [{
                    key : 'nd',
                    value : 'nd',
                    libelle : 'nd',
                }],
            }
            materielTypes = materielTypes.map( item => item.libelle_materiel_type);
            materielTypes.unshift('nd');
            console.log('materielsList' , materielsList , materielTypes);
            this.materiels = materielsList;
            this.setState({
                materielTypes : materielTypes,
                selectedMaterielType : materielTypes[0],
                materielList : materielsList[materielTypes[0]],
            });
            
        });

        this.props.socket.on('probleme_tech_type list -createIntervention', (probleme_tech_types) => {
            console.log('probleme_tech_types', probleme_tech_types);
            for(const probleme_tech_type of probleme_tech_types){
                this.problemeTechTypes = {
                    ...this.problemeTechTypes ,
                    [probleme_tech_type.num_probleme_tech_type] : probleme_tech_type.libelle_probleme_tech_type,
                }
            }
            let newProblemeList = probleme_tech_types.map( blem => ({
                key : blem.num_probleme_tech_type,
                value : blem.num_probleme_tech_type,
                libelle : blem.libelle_probleme_tech_type,
            }));
            this.setState({
                problemeList : newProblemeList,
            });
        });

        this.props.socket.on('new intervention -createIntervention', (intervention) => {
            let {
                num_intervention,
            } = intervention;
            console.log('new intervention createIntervention');
            this.setState({
                message : `Intervention ${num_intervention} créée.`
            });
        });

        this.props.socket.on('new intervention_type -createIntervention' ,() => {
            console.log('new intervention_type -createIntervention');
            this.props.socket.emit('get intervention definition');
        });

        this.props.socket.on('new probleme_tech_type -createIntervention' ,() => {
            console.log('new problem_tech_type -createIntervention');
            this.props.socket.emit('get intervention definition');
        });

        if(this.props.location.state){
            let {
                num_intervention_pere,
                num_intervention_type,
                dateFree,
            } = this.props.location.state;
            
            if(dateFree) this.updateDateProgramme(dateFree); 
            this.setState({
                num_intervention_pere : this.props.location.state.num_intervention_pere,
                selectedNumInterventionType : this.props.location.state.num_intervention_type,
            });
        }


    }

    componentWillUnmount () {
        this.props.socket.off('intervention_type list -createIntervention');
        this.props.socket.off('lieu list -createIntervention');
        this.props.socket.off('materiel list -createIntervention');
        this.props.socket.off('probleme_tech_type list -createIntervention');
        this.props.socket.off('new intervention_type -createIntervention');
        this.props.socket.off('new intervention -createIntervention');
    }
    closePopUp = (ref) => {
        ref.current.style.top = "-1000px";
    }

    showPopUp = (ref) => {
        ref.current.style.top = "10px";
        //setTimeout( () => {
        //    if (ref) ref.current.style.top = "-1000px";
        //}, 120000);

    }
    render(){
        let {
            interventionTypeList,
            selectedNumInterventionType,
            lieuList,
            selectedNumLieu,
            materielList ,
            selectedNumMateriel,
            materielTypes,
            selectedMaterielType,
            motif,
            selectedNumProblemeTechType,
            problemeList,
            message,
            num_intervention_pere,
            commentaire,
        } = this.state;
        //BUTTON AGENDA
        //<button onClick={()=> this.showPopUp(this.agendaPop)}> Agenda </button>
        //date agenda 
        //today and today + 7days
        let startAgenda = new Date().setHours(3,0,0); //0 UTC
        let endAgenda = startAgenda + 7*24*60*60*1000;
        return (
            <div className="createIntervention">
                <div className="notif_pop agenda-createIntervention" ref={this.agendaPop}>
                    <Agenda 
                        socket = {this.props.socket} 
                        date_debut = {new Date(startAgenda)}
                        date_fin = {new Date(endAgenda)}
                        session = {this.props.session}
                        showSub = {this.props.showSub}
                        showHeader = {true}
                        setSelectedDate = {this.updateDateProgramme} //value is in e.target.value
                        close = { () => this.closePopUp(this.agendaPop)}/>
                </div>
                <div className="notif_pop agenda-createIntervention" ref={this.intervTypeCreator}>
                    <InterventionTypeCreator 
                        socket = {this.props.socket}
                        close = { () => this.closePopUp(this.intervTypeCreator)}/>
                </div>
                <div className="notif_pop agenda-createIntervention" ref={this.problemeTechTypeCreator} >
                    <ProblemeTechTypeCreator 
                        socket = {this.props.socket}
                        close = { () => this.closePopUp(this.problemeTechTypeCreator)}/>
                </div>
                <p> Créer une intervention :</p>
                { num_intervention_pere &&
                    <p> Suite de l'intervention : {num_intervention_pere} </p> 
                }
                <div className="scroll-option">
                    <FoldableDiv title="Intervention" folded={false}>
                        <div className="sub-category-option">
                            <label> Type Intervention : 
                            </label>
                            <Dropdown value={selectedNumInterventionType} objArray = {interventionTypeList} onChange={this.updateTypeIntervention}/>
                            <button onClick={() => this.showPopUp(this.intervTypeCreator)}> Creer </button>
                        </div>
                        <div className="sub-category-option">
                            <label> Date programmée : 
                            </label>
                            <button onClick={()=> this.showPopUp(this.agendaPop)}> Agenda </button>
                            <input type="datetime-local" value={this.state.dateProgrammeDisplay} onChange={this.updateDateProgramme}/>
                        </div>
                        <div className="sub-category-option">
                            <label> Lieu : 
                            </label>
                            <Dropdown 
                                value={selectedNumLieu} 
                                objArray = {lieuList} 
                                onChange={
                                    (e)=> {
                                        this.updateProbleme({target:{value : selectedNumProblemeTechType}} , e.target.value);
                                    }
                                }
                            />
                        </div>
                        <div className="sub-category-option">
                            <label> Commentaire : 
                            </label>
                            <textarea value={commentaire} onChange={this.updateCommentaire}>
                            </textarea>
                        </div>
                    </FoldableDiv>
                    <FoldableDiv title="Objet de l'intervention" folded={true}>
                        <MaterielSelector
                            socket = {this.props.socket}
                            onChange = {(obj)=> this.updateMateriel({target: {value : obj.num}})}
                            selectedLieu = "nd"
                            selectedNumMateriel = {selectedNumMateriel}/>

                    </FoldableDiv>
                    <FoldableDiv title="Motif" folded={true}>
                        <div className="sub-category-option">
                            <label> Motif :
                            </label>
                            <textarea value={motif} onChange={this.updateMotif}></textarea>
                        </div>
                        <FoldableDiv title="Probleme" folded={true}>
                            <div className="sub-category-option">
                                <label> Type du probleme:
                                </label>
                                <Dropdown value={selectedNumProblemeTechType} objArray = {problemeList} onChange={this.updateProbleme}/>
                                <button onClick={()=>this.showPopUp(this.problemeTechTypeCreator)}> Créer </button>
                            </div>
                            <div className="sub-category-option">
                                <label> Lieu : 
                                </label>
                                <Dropdown value={selectedNumLieu} objArray = {lieuList} onChange={(e) => {  this.updateProbleme({target:{value: selectedNumProblemeTechType}},e.target.value); }}/>
                            </div>
                        </FoldableDiv>
                    </FoldableDiv>
                </div>
                <button onClick={this.createIntervention} > Planifier </button>
                <p> {message} </p>
            </div>
        );
    }
}

