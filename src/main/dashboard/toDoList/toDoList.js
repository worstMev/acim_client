import './toDoList.css';
import React from 'react';
import ToDo from './toDo/toDo';

const toDoObjectList = [
    {title : '1' , ETA : '00:00'},
    {title : '2' , ETA : '00:00'},
    {title : '3' , ETA : '00:00'},
    {title : '4' , ETA : '00:00'},
    {title : '5' , ETA : '00:00'},
    {title : '6' , ETA : '00:00'},
    {title : '7' , ETA : '00:00'},
    {title : '8' , ETA : '00:00'},
    {title : '9' , ETA : '00:00'},
    {title : '10' , ETA : '00:00'},
    {title : '11' , ETA : '00:00'},
    {title : '12' , ETA : '00:00'},
];
export default class ToDoList extends React.Component {
    displayToDo  = (list) => {
        return list.map( todo => <ToDo toDo={todo} key={todo.title}/> );
    }
    render(){
        return (
            <div id="toDoList">
                <p> Liste des taches a faire: </p>
                <div id="scroll_list">
                    {this.displayToDo(toDoObjectList)}
                </div>
            </div>
        );
    }
}
