import './index.css';
import React, { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import Paginer from './../paginer';
import ReparationLocale from './../reparationLocale';

/*
 * props :
 * - socket
 * - session
 */

export default class MaterielReparation extends Component{
    constructor(props){
        super(props);
        this.itemPerPage = 5;
        this.state = {
            currentPage : 1,
            maxPage : 77,
            decharges : [],
        };
    }
    setPage = (newPage) => {
        console.log('change page to ', newPage);
        let { 
            maxPage, 
            currentPage 
        } = this.state;
        if( newPage > 0 && newPage <= maxPage ){
            this.setState({
                currentPage : newPage,
            });
            this.props.socket.emit('get all decharge',this.itemPerPage,newPage);
        }
    }
    componentDidMount = () => {
        console.log('MaterielReparation mounted');
        let { 
            currentPage,
        } = this.state;
        //get all decharge data
        this.props.socket.emit('get all decharge',this.itemPerPage,currentPage);

        this.props.socket.on('all decharge', (decharges,number) => {
            console.log('all decharge', decharges);
            // [{ num_decharge , date_debut , date_fin , num_intervention , tech_main_username , materiels[] }]
            // materiels >> { num_materiel , libelle_materiel , libelle_materiel_type , config_origine , lieu}
            if(decharges.length){
                this.setState({
                    decharges : decharges,
                    maxPage : Math.ceil( number / this.itemPerPage),
                });
            }
        });

        this.props.socket.on('updated materiel', (updatedMatos) => {
            //when a materiel is updated , re-get all data
            //
            console.log('updated materiel currentPage ', this.state.currentPage);
            //currentState is called at the beginning , then is always 1
            this.props.socket.emit('get all decharge',this.itemPerPage,this.state.currentPage);
        });

        this.props.socket.on('updated decharge', (updatedDecharge) => {
            //when a decharge is updated get all data
            this.props.socket.emit('get all decharge',this.itemPerPage,this.state.currentPage);
        });
    }

    componentWillUnmount = () => {
        console.log('materielReparation unmount');
        this.props.socket.off('all decharge');
        this.props.socket.off('updated materiel');
    }

    render(){
        let {
            decharges,
            currentPage,
            maxPage,
        } = this.state;
        const dechargesDisplay = decharges.map(dech => {
            return (
                <ReparationLocale key={ dech.num_decharge} decharge={dech} session={this.props.session} socket={this.props.socket} />
            );
        });
        return(
            <div className="materielReparation">
                <p> Materiel(s) en réparation </p>
                <div className="scroll_list">
                    {dechargesDisplay}
                </div>
                <Paginer currentPage={currentPage} maxPage={maxPage} setPage={this.setPage} />
            </div>
        );
    }
}

