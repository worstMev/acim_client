import './index.css';
import React , { Component } from 'react';

/*
 * props:
 * - socket
 * - close
 */

export default class InterventionTypeCreator extends Component {
    constructor(props){
        super(props);
        this.state = {
            showIndic : false,
            indication : '',
            libelle : '',
            code : '',
        }
        this.component = 'interventionTypeCreator';
    }

    close = () => {
        this.setState({
            showIndic : false,
            indication : '',
            libelle : '',
            code : '',
        });
        this.props.close();
    }

    updateLibelle = (e) => {
        console.log('updateLibelle ' , e.target.value); 
        this.setState({
            libelle : e.target.value,
        });
    }

    updateCode = (e) => {
        console.log('updateCode ' , e.target.value); 
        this.setState({
            code : e.target.value,
        });
    }
    
    componentDidMount () {
        console.log('interventionTypeCreator mounted');
        this.props.socket.on('new intervention_type -'+this.component, (newIntervType) => {
            console.log('new intervention_type');
            this.setState({
                indication : `Type intervention : ${newIntervType.libelle_intervention_type} créé.`,
                libelle : '',
                code : '',
            });
        });
    }

    create = () => {
        console.log('create intervention type');
        let { libelle , code } = this.state;
        if(this.state.libelle && this.state.code ){
            this.props.socket.emit('create intervention_type', libelle, code , this.component);
            this.setState({
                indication : `...`,
                showIndic : true,
            });
        }else{
            this.setState({
                indication : `Veuillez remplir tout les champs`,
                showIndic : true,
            });

        }
    }

    componentWillUnmount(){
        console.log('interventionTypeCreator unmount');
        this.props.socket.off('new intervention_type -'+this.component);
    }
    

    render(){
        let { 
            showIndic,
            libelle,
            code,
            indication,
        } = this.state;
        let indicStyle;
        if(showIndic) {
            indicStyle = {
                display : 'flex',
            }
        }
        return(
            <div className="interventionTypeCreator">
                <div className="top">
                    <p> {`Créer un type d'intervention`} </p>
                    <button onClick={this.close}> x </button>
                </div>
                <div className="main">
                    <input type="text" required={true} placeholder="libelle" value={libelle} onChange={this.updateLibelle}/>
                    <input type="text" required={true} placeholder="code" value={code} onChange={this.updateCode}/>
                    <button className="myButton" onClick = {this.create} > Creer </button>
                    <div className="indic" style={indicStyle}>
                        <p> {indication} </p>
                    </div>

                </div>
            </div>
        );
    }
}
