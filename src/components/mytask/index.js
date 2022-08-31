import './index.css';
import React , {Component} from 'react';
import FoldableDiv from './../foldableDiv';
import Intervention from './../intervention';
import InterventionTimeline from './../interventionTimeline';


export default class MyTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            interventionListUndone : [],
            interventionListUndoneLate : [],
            interventionListUndoneToday : [],
            interventionListUndoneFuture : [],
            listPendingIntervention : [],
        }
    }
    componentDidMount = () => {
        console.log('MyTask did mount');
        this.props.socket.emit('get undone intervention' , this.props.session.num_user);
        this.props.socket.emit('get pending intervention' , this.props.session.num_user);

        this.props.socket.on('list undone intervention -myTask' , (listUndoneIntervention) => {
            console.log('list undone intervention' , listUndoneIntervention);
            let newList = listUndoneIntervention.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                date_debut : item.date_debut,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                commentaire :item.commentaire,
            }));
            for( const interv of newList ){
                interv.children = newList.filter( item => item.num_intervention_pere === interv.num_intervention);
            }
            console.log('new list intervention undone' , newList);
            if(this.props.setNbInterventionUndone){
                this.props.setNbInterventionUndone(newList.length);
            }
            let endOfDay = new Date(new Date().setHours(23,59,59)).getTime();
            let newListLate = newList.filter( item => {
                if ( item.date_debut ) return false;
                return new Date(item.date_programme).getTime() <= new Date().getTime() ;
            }); 
            let newListToday = newList.filter( item => {
                let interventionDate = new Date(item.date_programme).getTime() ;
                let startOfDay  = new Date(new Date().setHours(0,0,0)).getTime();
               
                return ( interventionDate > startOfDay && interventionDate <= endOfDay );
            });
            let newListFuture = newList.filter( item => {
                let interventionDate = new Date(item.date_programme).getTime() ;
                return ( interventionDate > endOfDay );
            });
            console.log('newListToday' , newListToday);
            console.log('newListLate' , newListLate);
            this.setState({
                interventionListUndone : newList,
                interventionListUndoneLate : newListLate,
                interventionListUndoneToday : newListToday,
                interventionListUndoneFuture : newListFuture,
            });
        });
        this.props.socket.on('pending intervention -myTask', (pendingInterventions) => {
            console.log('pending intervention -myTask', pendingInterventions);
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
        //this.props.socket.on('new intervention' , ()=> {
        //    console.log('new intervention todolist');
        //    this.props.socket.emit('get undone intervention');
        //});

        //this.props.socket.on('ended intervention' , () => {
        //    console.log('ended intervention todolist');
        //    this.props.socket.emit('get undone intervention');
        //});

        //this.props.socket.on('intervention data -toDoList' , () => {
        //    console.log('intervention date -toDoList');
        //    this.props.socket.emit('get undone intervention');
        //});
        this.props.socket.on('new intervention -myTask', () => {
            this.props.socket.emit('get undone intervention' , this.props.session.num_user);
            this.props.socket.emit('get pending intervention' , this.props.session.num_user);
        });

        this.props.socket.on('started intervention -myTask', (intervention) => {
            console.log('started intervention -myTask');
            this.props.socket.emit('get undone intervention' , this.props.session.num_user);
            this.props.socket.emit('get pending intervention' , this.props.session.num_user);
        });
        
        
        this.props.socket.on('ended intervention -myTask', (intervention) => {
            console.log('ended intervention -myTask');
            this.props.socket.emit('get undone intervention' , this.props.session.num_user);
            this.props.socket.emit('get pending intervention' , this.props.session.num_user);
        });
    }
    
    componentDidUpdate () {
        console.log('update MyTask');
    }

    clickOnToDoList = () => {
    }

    componentWillUnmount = () => {
        console.log('ToDoList will unmount');
        this.props.socket.off('list undone intervention -myTask');
        this.props.socket.off('pending intervention -myTask');
    }
    displayToDo  = (list) => {
        //return list.map( intervention => <ToDo intervention={intervention} key={intervention.num_intervention}/> );
        return list.map( intervention => <Intervention showSub={this.props.showSub} intervention={intervention} key={intervention.num_intervention}/> );
    }

    render(){
        
        let{
            interventionListUndoneLate,
            interventionListUndoneToday,
            interventionListUndone,
            interventionListUndoneFuture,
            listPendingIntervention,
        } = this.state;
        let retardTitle = `En retard : ${interventionListUndoneLate.length}`;
        let pendingTitle = `En cours : ${listPendingIntervention.length}`;
        let todayTitle = `Aujourd'hui : ${interventionListUndoneToday.length}`;
        let futureTitle = `A venir : ${interventionListUndoneFuture.length}`;
        let allTitle = `Toutes : ${interventionListUndone.length}`;
        return (
            <div id="toDoList" onClick={this.clickOnToDoList}>
                <p> {this.props.topText || 'Liste des tâches a faire :'} </p>
                    <div className="scroll_list">
                        <FoldableDiv title={retardTitle} titleStyle={{color : 'red'}} folded={true}>
                            <div className="scroll_list">
                                    {this.displayToDo(interventionListUndoneLate)}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={pendingTitle} titleStyle={{color : 'red'}} folded={true}>
                            <div className="scroll_list">
                                    {this.displayToDo(listPendingIntervention)}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={todayTitle} >
                            <InterventionTimeline 
                                { ... this.props}
                                session = {this.props.session}
                                start={ new Date()}
                                end = { new Date()}
                                showSub = { this.props.showSub }
                                socket = {this.props.socket}/>
                        </FoldableDiv>
                        <FoldableDiv title={futureTitle} folded={true}>
                            <div className="scroll_list">
                                    {this.displayToDo(this.state.interventionListUndoneFuture)}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={allTitle} folded={true}>
                            <div className="scroll_list">
                                    {this.displayToDo(this.state.interventionListUndone)}
                            </div>
                        </FoldableDiv>
                    </div>
            </div>
        );
    }
}
