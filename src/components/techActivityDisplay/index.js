import './index.css';
import React , { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import Intervention from './../intervention';

/*
 * props :
 * - tech : num_user , username 
 * - socket :
 * - showSub : for intervention
 */
export default class TechActivityDisplay extends Component{
    constructor(props){
        super(props);
        this.state = {
            listUndoneIntervention : [],
            listPendingIntervention : [],
            listDoneTodayIntervention : [],
        };
    }
    componentDidMount() {
        console.log('TechActivityDisplay mounted');
        
        this.props.socket.emit('get undone intervention' , this.props.tech.num_user);
        this.props.socket.emit('get pending intervention' , this.props.tech.num_user);
        this.props.socket.emit('get done today intervention' , this.props.tech.num_user);

        this.props.socket.on('list undone intervention -techActivityDisplay' , (undoneInterventions) => {
            console.log('list undone intervnetion -techActivityDisplay' , undoneInterventions);
            let newList = undoneInterventions.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                children : item.children,
                commentaire : item.commentaire,
            }));
            this.setState({
                listUndoneIntervention : newList,
            });
        });

        this.props.socket.on('pending intervention -techActivityDisplay', (pendingInterventions) => {
            console.log('pending intervention -techActivityDisplay', pendingInterventions);
            let newList = pendingInterventions.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                children : item.children,
                commentaire : item.commentaire,
            }));
            this.setState({
                listPendingIntervention : newList,
            });
        });

        this.props.socket.on('done today intervention -techActivityDisplay' , (doneTodayInterventions) => {
            console.log('done today intervention -techActivityDisplay', doneTodayInterventions);
            let newList = doneTodayInterventions.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                children : item.children,
                commentaire : item.commentaire,
            }));
            this.setState({
                listDoneTodayIntervention : newList,
            });
        });

        this.props.socket.on('ended intervention -techActivity', () => {
            this.props.socket.emit('get undone intervention' , this.props.tech.num_user);
            this.props.socket.emit('get pending intervention' , this.props.tech.num_user);
            this.props.socket.emit('get done today intervention' , this.props.tech.num_user);
        });

        this.props.socket.on('started intervention -techActivity',()=>{
            this.props.socket.emit('get undone intervention' , this.props.tech.num_user);
            this.props.socket.emit('get pending intervention' , this.props.tech.num_user);
            this.props.socket.emit('get done today intervention' , this.props.tech.num_user);
        });
    }
    componentDidUpdate(prevProps, prevState){
        console.log('TechActivityDisplay update');
        if( prevProps.tech.num_user !== this.props.tech.num_user ){
            this.props.socket.emit('get undone intervention' , this.props.tech.num_user);
            this.props.socket.emit('get pending intervention' , this.props.tech.num_user);
            this.props.socket.emit('get done today intervention' , this.props.tech.num_user);
        }
    }
    componentWillUnmount(){
        console.log('TechActivityDisplay unmount');
        this.props.socket.off('list undone intervention -techActivityDisplay');
        this.props.socket.off('pending intervention -techActivityDisplay');
        this.props.socket.off('done today intervention -techActivityDisplay');
    }
    render(){
        let {
            listUndoneIntervention,
            listPendingIntervention,
            listDoneTodayIntervention,
        } = this.state;
        let{
            num_user,
            username,
        } = this.props.tech;
        let indic ;
        let undoneTitle  = `à faire : ${listUndoneIntervention.length}`;
        let pendingTitle = `En cours : ${listPendingIntervention.length}`;
        let doneTitle = `Terminée aujourd'hui : ${listDoneTodayIntervention.length}`;

        let undoneElements = listUndoneIntervention.map( interv =>
            <Intervention key = {interv.num_intervention} intervention = {interv} showSub={this.props.showSub}/>
        );
        let pendingElements = listPendingIntervention.map( interv => 
            <Intervention key = {interv.num_intervention} intervention = {interv} showSub={this.props.showSub}/>
        );
        let doneTodayElements = listDoneTodayIntervention.map( interv =>
            <Intervention key = {interv.num_intervention} intervention = {interv} showSub={this.props.showSub}/>
        );
        console.log('tech activite' , num_user);
        if( num_user ){
            indic = `Activités de ${username}`;
        }else{
            indic = 'Activités';
        }
        return (
            <div className="techActivityDisplay">
                <div className="indic">
                    <p>{indic}</p>
                    { num_user && username &&
                        <button onClick={()=> this.props.resetUser()}>X</button>
                    }
                </div>
                <div className="main">
                    <div className="scroll_list">
                        <FoldableDiv title={pendingTitle} >
                            <div className="scroll_list">
                                {pendingElements}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={undoneTitle} folded={true}>
                            <div className="scroll_list">
                                {undoneElements}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={doneTitle} folded={true} >
                            <div className="scroll_list">
                                {doneTodayElements}
                            </div>
                        </FoldableDiv>
                    </div>
                </div>
            </div>
        );
    }
}

