import './index.css';
import React , {Component} from 'react';
import { formatDate } from './../../functions';
import DropDown from './../utils/dropDown';

/*
 * props: - setTechMain 
 * - setDebut
 * - setFin
 * - setStatut
 * - setnumIntervention
 * - setInterventionType
 * - socket : for initialization
 * - tech_main,
 * - date_debut,
 * - date_fin,
 * - statut,
 * - num_intervention
 * _ numInterventionType
 */

export default class InterventionHistoryControl extends Component{
    constructor(props){
        super(props);
        this.state = {
            tech_mainList : [],
            statutList : [
                {key : 0,
                value : 0,
                libelle : 'nd'},
                { key : 1,
                value : 1,
                libelle : 'non-effectuée', },
                { key : 2,
                  value : 2,
                  libelle : 'effectuée-résolue'},
                { key : 3,
                  value : 3,
                  libelle : 'effectuée-non-résolue'},
            ],
            interventionTypes : [],
        };
        this.techMains = {};
        //this.intervType = {}; //correspondance num_intervention et libelle
        this.statuts = {
            0 : {
                done : 'nd',
                probleme_resolu : 'nd',
            },
            1 : {
                done : false,
                probleme_resolu : false,
            },
            2 : {
                done : true,
                probleme_resolu : true,
            },
            3 : {
                done : true,
                probleme_resolu : false,
            },
        };
    }
    updateTechMain = (e) => {
        console.log('updateTechMain', e.target.value);
        console.log(this.techMains[e.target.value]);
        let username = this.techMains[e.target.value];
        this.props.setTechMain({ num : e.target.value , username : username });
    }
    updateDateDebut = (e) => {
        console.log('updateDateDebut',new Date(e.target.value));
        let newDebut = new Date(new Date(e.target.value).setHours(0,0,0));
        this.props.setDateDebut(newDebut);
    }

    updateDateFin = (e) => {
        console.log('updateDateFin',new Date(e.target.value));
        let newFin = new Date(new Date(e.target.value).setHours(23,59,59));
        this.props.setDateFin(newFin);
    }

    updateStatut = (e) => {
        console.log('updateStatut' , e.target.value);
        let newStatut = this.statuts[e.target.value];
        this.props.setStatut(newStatut);

    }

    updateNumIntervention = (e) => {
        console.log('updateNumIntervention' , e.target.value);
        this.props.setNumIntervention(e.target.value);
    }

    updateNumInterventionType = (e) => {
        console.log('updateNumInterventionType',e.target.value);
        this.props.setNumInterventionType(e.target.value);
    }

    componentDidMount(){
        this.props.socket.emit('get tech_mains list');
        this.props.socket.on('tech_mains list' , (tech_mainList)=>{
            console.log('tech_mains list');
            let newTech_mainList = tech_mainList.map( tech => ({
                key : tech.num_user,
                libelle : tech.username,
                value : tech.num_user,
            }));
            for(const tech of newTech_mainList){
                this.techMains = {
                    ...this.techMains,
                    [tech.key] : tech.libelle,
                }
            }
            this.techMains = {
                ...this.techMains,
                nd : 'nd',
            }
            newTech_mainList.unshift({key: 'nd' , libelle : 'nd' , value : 'nd'});
            console.log('newTech_mainList' , newTech_mainList);
            this.setState({
                tech_mainList : newTech_mainList,
            });

        });
        this.props.socket.emit('get intervention type');
        this.props.socket.on('intervention_type list -interventionHistoryControl',(interventionTypes)=>{
            let newInterventionTypes = interventionTypes.map( item => ({
                key : item.num_intervention_type,
                libelle : item.libelle_intervention_type,
                value : item.num_intervention_type,
            }));
            newInterventionTypes.unshift({key: 'nd' , libelle : 'nd' , value : 'nd'});
            this.setState({
                interventionTypes : newInterventionTypes,
            });

        });
    }

    componentWillUnmount(){
        console.log('interventionHistoryControl unmount');
        this.props.socket.off('tech_mains list');
        this.props.socket.off('intervention_type list -interventionHistoryControl');
    }

    render(){
        let {
            tech_main,
            date_debut,
            date_fin,
            statut,
            num_intervention,
            num_intervention_type,
        } = this.props;
        let {
            tech_mainList,
            statutList,
            interventionTypes,
        } = this.state;
        let statutValue  = 1;
        if(statut.done){
            if(statut.done === 'nd'){
                statutValue = 0;
            }else{
                if(statut.probleme_resolu){
                    statutValue = 2;
                }else{
                    statutValue = 3;
                }
            }
        }
        return(
            <div className="interventionHistoryControl">
                <div className="sub-control">
                    <p> Technicien : </p>
                    <DropDown 
                        value = {tech_main.num}
                        onChange = {this.updateTechMain}
                        objArray = {tech_mainList}
                        />
                </div>
                <div className="sub-control">
                    <p> Programmé du: </p>
                    <input type="date" 
                        value = {formatDate(date_debut)} 
                        onChange = {this.updateDateDebut}/>
                </div>
                <div className="sub-control">
                    <p> au: </p>
                    <input type="date"
                            value = {formatDate(date_fin)}
                            onChange = {this.updateDateFin}/>
                </div>
                <div className="sub-control">
                    <p> status : </p>
                    <DropDown 
                        value = {statutValue}
                        onChange = {this.updateStatut}
                        objArray = {statutList}
                        />
                </div>
                <div className="sub-control">
                    <p> {`Type d'intervention :`} </p>
                    <DropDown 
                        value = {num_intervention_type}
                        onChange = {this.updateNumInterventionType}
                        objArray = {interventionTypes}
                        />
                </div>
                <div className="sub-control">
                    <p> ID : </p>
                    <input
                        placeholder = "Recherche par ID"
                        value = {num_intervention}
                        onChange = {this.updateNumIntervention}
                        />
                </div>
            </div>
        );
    }
}
