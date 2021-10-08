import './index.css';
import React , { Component } from 'react';
import green_dot from './../../res/icon/green_dot.png';
import red_dot from './../../res/icon/red_dot.png';
import yellow_dot from './../../res/icon/yellow_dot.png';

/*
 * props:
 * - intervention from view_intervention_full : date_programme , libelle_intervention_type , libelle_lieu , tech_main_username , done , probleme_resolu
 *   -showSub : to shoe intervention
 */
export default class InterventionSimple extends Component {
    constructor(props){
        super(props);
        this.state={
            showMenu : false,
        }
    }
    toggleShowMenu = () => {
        let newShowMenu = !this.state.showMenu;
        this.setState({
            showMenu : newShowMenu,
        });
    }
    render () {
        let {
            date_programme,
            libelle_intervention_type,
            libelle_lieu,
            tech_main_username,
            num_intervention,
            probleme_resolu,
            done,
        } = this.props.intervention;
        let {
            showMenu,
        } = this.state;
        let heure_programme = new Date(date_programme).toLocaleTimeString('fr-FR');
        let menuStyle ;
        let greenDotElement = (<img src={green_dot} />);
        let redDotElement = (<img src={red_dot} />);
        let yellowDotElement = (<img src={yellow_dot} />);
        let doneElement  = redDotElement;
        let pbElement  = redDotElement;

        let doneStyle = {
            //background : 'red',
            width : '20px',
            minWidth : '20px',
            maxWitdh : '20px',
            height : 'auto',
        };
        let okStyle = {
            //background : 'red',
            width : '20px',
            minWidth : '20px',
            maxWitdh : '20px',
            height : 'auto',
        };
        if(done) {
            doneElement = yellowDotElement;
            if(probleme_resolu) doneElement = greenDotElement;
        }
        if( showMenu ){
            menuStyle = {
                display: 'flex',
            };
        }else{
            menuStyle = {
                display : 'none',
            };
        }
        return (
            <div className = "interventionSimple">
                <div className="main" onClick={this.toggleShowMenu}>
                    <div className="done" style={doneStyle}>
                        {doneElement}
                    </div>
                    <div className="text">
                    <p> { heure_programme }  >{ libelle_intervention_type } - { libelle_lieu } par { tech_main_username } </p>
                    </div>
                </div>
                <div className="menu" style={menuStyle}>
                    <button onClick={()=>this.props.showSub(num_intervention)}>Ouvrir</button>
                </div>
            </div>
        );
    }
}
