import './index.css';
import React, { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import Paginer from './../paginer';
import MaterielReparationItem from './../materielReparationItem';

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
            // materiel >> { num_materiel , libelle_materiel , libelle_materiel_type , config_origine }
            if(decharges.length){
                this.setState({
                    decharges : decharges,
                    maxPage : Math.ceil( number / this.itemPerPage),
                });
            }
        });
    }

    componentWillUnmount = () => {
        console.log('materielReparation unmount');
        this.props.socket.off('all decharge');
    }

    render(){
        let {
            decharges,
            currentPage,
            maxPage,
        } = this.state;
        const dechargesDisplay = decharges.map(dech => {
            const title = ` Décharge par ${dech.tech_main_username} du ${dech.date_debut} au ${dech.date_fin} venant de {lieu}`;
            const matos = dech.materiels.map( mat => <MaterielReparationItem key = {mat.num_materiel}  materiel = {mat} /> ); 
            return (
                <FoldableDiv title={title} folded={true} key = {dech.num_decharge} >
                    <p> id : {dech.num_decharge} </p>
                    {matos}
                </FoldableDiv>
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

