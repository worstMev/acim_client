import './index.css';
import React , { Component } from 'react';

/*
 * props:
 * - socket
 * - close
 */

export default class ProblemeTechTypeCreator extends Component {
    constructor(props){
        super(props);
        this.state = {
            showIndic : false,
            indication : '',
            libelle : '',
        }
        this.component = 'problemeTechTypeCreator';
    }

    close = () => {
        this.setState({
            showIndic : false,
            indication : '',
            libelle : '',
        });
        this.props.close();
    }

    updateLibelle = (e) => {
        console.log('updateLibelle ' , e.target.value); 
        this.setState({
            libelle : e.target.value,
        });
    }

    
    componentDidMount () {
        console.log('problemeTechTypeCreator mounted');
        this.props.socket.on('new probleme_tech_type -'+this.component, (newProblemeTechType) => {
            console.log('new probleme_tech_type');
            this.setState({
                indication : `Type intervention : ${newProblemeTechType.libelle_probleme_tech_type} créé.`,
                libelle : '',
            });
        });
    }

    create = () => {
        console.log('create probleme_tech_type');
        let { libelle } = this.state;
        if(this.state.libelle ){
            this.props.socket.emit('create probleme_tech_type', libelle, this.component);
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
        console.log('problemeTechTypeCreator unmount');
        this.props.socket.off('new probleme_tech_type -'+this.component);
    }
    

    render(){
        let { 
            showIndic,
            libelle,
            indication,
        } = this.state;
        let indicStyle;
        if(showIndic) {
            indicStyle = {
                display : 'flex',
            }
        }
        return(
            <div className="problemeTechTypeCreator">
                <div className="top">
                    <p> {`Créer un type de probleme`} </p>
                    <button onClick={this.close}> x </button>
                </div>
                <div className="main">
                    <input type="text" required={true} placeholder="libelle" value={libelle} onChange={this.updateLibelle}/>
                    <button className="myButton" onClick = {this.create} > Creer </button>
                    <div className="indic" style={indicStyle}>
                        <p> {indication} </p>
                    </div>

                </div>
            </div>
        );
    }
}
