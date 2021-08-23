import './index.css';
import React from 'react';
//import ToDo from './../toDo';
import Intervention from './../intervention';
import FoldableDiv from './../foldableDiv';

/*
 * prop : num_tech_main to define by who the intervetions have been created if none then all intervention are shown
 *         - showSub to show the display for intervention
 *         - setNbInterventionUndone
 * */

export default class ToDoList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            interventionListUndone : [],
            interventionListUndoneLate : [],
            interventionListUndoneToday : [],
            interventionListUndoneFuture : [],
        }
    }
    componentDidMount = () => {
        console.log('ToDoList did mount');
        this.props.socket.emit('get undone intervention' , this.props.num_tech_main);
        this.props.socket.on('list undone intervention' , (listUndoneIntervention) => {
            console.log('list undone intervention' , listUndoneIntervention);
            let newList = listUndoneIntervention.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
            }));
            for( const interv of newList ){
                interv.children = newList.filter( item => item.num_intervention_pere === interv.num_intervention);
            }
            console.log('new list intervention undone' , newList);
            if(this.props.setNbInterventionUndone){
                this.props.setNbInterventionUndone(newList.length);
            }
            let endOfDay = new Date(new Date().setHours(23,59,59)).getTime();
            let newListLate = newList.filter( item => new Date(item.date_programme).getTime() <= new Date().getTime() ); 
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
            this.setState({
                interventionListUndone : newList,
                interventionListUndoneLate : newListLate,
                interventionListUndoneToday : newListToday,
                interventionListUndoneFuture : newListFuture,
            });
        });
        this.props.socket.on('new intervention' , ()=> {
            console.log('new intervention todolist');
            this.props.socket.emit('get undone intervention');
        });

        this.props.socket.on('ended intervention' , () => {
            console.log('ended intervention todolist');
            this.props.socket.emit('get undone intervention');
        });
    }
    
    componentDidUpdate () {
        console.log('update toDoList');
    }

    clickOnToDoList = () => {
    }

    componentWillUnmount = () => {
        console.log('ToDoList will unmount');
        this.props.socket.off('list undone intervention');
        
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
        } = this.state;
        let retardTitle = `En retard : ${interventionListUndoneLate.length}`;
        let todayTitle = `Aujourd'hui : ${interventionListUndoneToday.length}`;
        let futureTitle = `A venir : ${interventionListUndoneFuture.length}`;
        let allTitle = `Toutes : ${interventionListUndone.length}`;
        return (
            <div id="toDoList" onClick={this.clickOnToDoList}>
                <p> {this.props.topText || 'Liste des taches a faire :'} </p>
                    <div className="scroll_list">
                        <FoldableDiv title={retardTitle} titleStyle={{color : 'red'}} folded={true}>
                            <div className="scroll_list">
                                    {this.displayToDo(this.state.interventionListUndoneLate)}
                            </div>
                        </FoldableDiv>
                        <FoldableDiv title={todayTitle} >
                            <div className="scroll_list">
                                    {this.displayToDo(this.state.interventionListUndoneToday)}
                            </div>
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
