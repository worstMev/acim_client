import './ask.css';
import React from 'react';
import Dropdown from './../../utils/dropDown';


export default class Ask extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            problem : '',
        }
    }
    updateProblem = (e) => {
       this.setState({
           problem : e.target.value,
       });
    }
    render () {
        return (
            <div className="ask">
                <p>{ `Demande d'assistance`}</p>
                <div className="dropdown-zone">
                    <p> Probleme  : </p>
                    <Dropdown defaultValue= 'xxxx' value={this.state.problem} onChange={this.updateProblem} array={['111','222']}/>
                </div>
                <div className="dropdown-zone">
                    <p> precision : </p>
                    <Dropdown defaultValue= 'xxxx' value={this.state.problem} onChange={this.updateProblem} array={['111x','222x']}/>
                </div>
                <div className="remarque-problem">
                    <p> remarque : </p>
                    <textarea placeholder="remarque ici"/>
                </div>
                <div className="double-dropdown">
                    <div className="dropdown-zone">
                        <p> Urgence : </p>
                        <Dropdown defaultValue="xx" value="tres" array={['tres','peu','pas']} onChange={this.updateProblem}/>
                    </div>
                    <div className="dropdown-zone">
                        <p> Lieu : </p>
                        <Dropdown defaultValue="xx" value="salle xxx" array={['salle y','salle x','salle z']} onChange={this.updateProblem} />
                    </div>
                </div>
                <button className="my-button"> Envoyer </button>
            </div>
        );
    }
}


