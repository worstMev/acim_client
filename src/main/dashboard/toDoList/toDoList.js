import './toDoList.css';
import React from 'react';
import ToDo from './toDo/toDo';

export default class ToDoList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            interventionListUndone : [],
        }
    }
    componentDidMount = () => {
        console.log('ToDoList did mount');
        this.props.socket.emit('get undone intervention');
        this.props.socket.on('list undone intervention' , (listUndoneIntervention) => {
            console.log('list undone intervention' , listUndoneIntervention);
            let newList = listUndoneIntervention.map( (item,index) => ({
                num_intervention : item.num_intervention,
                date_programme : item.date_programme,
                lieu_libelle : item.libelle,
                intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
            }));
            console.log('new list intervention undone' , newList);
            this.setState({
                interventionListUndone : newList,
            });
        });
        this.props.socket.on('new intervention' , ()=> {
            console.log('new intervention todolist');
            this.props.socket.emit('get undone intervention');
        });
    }

    clickOnToDoList = () => {
    }

    componentWillUnmount = () => {
        console.log('ToDoList will unmount');
        this.props.socket.off('list undone intervention');
        
    }
    displayToDo  = (list) => {
        return list.map( intervention => <ToDo intervention={intervention} key={intervention.num_intervention}/> );
    }
    render(){
        return (
            <div id="toDoList" onClick={this.clickOnToDoList}>
                <p> Liste des taches a faire: </p>
                <div className="scroll_list">
                    {this.displayToDo(this.state.interventionListUndone)}
                </div>
            </div>
        );
    }
}
