import './index.css';
import React , { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import DropDown from './../utils/dropDown';
/*
 * prop : 
 * - onChangeProblemeTechType : when we change the probleme tech type
 * - numProblemeTechType :
 * - onChangeLieu :
 * - numLieu
 * - onChangeRemarque :
 * - remarque
 * - socket
 * - problemeTechTypeArray
 * - LieuArray
 * 
 */

export default class ProblemeConstate extends Component {
    constructor(props){
        super(props);
        this.state = {
            problemeTechTypeArray : [],
            lieuArray : [],
        }
    }
    componentDidMount () {
        console.log('probleme constate mounted');
        this.props.socket.emit('get probleme_tech_type list');
        this.props.socket.emit('get lieu list');

        this.props.socket.on('probleme_tech_type list -problemeTechConstate' , (probleme_tech_types) => {

            console.log('probleme_tech_types list',probleme_tech_types);
            let newProblemeList = probleme_tech_types.map( blem => ({
                key : blem.num_probleme_tech_type,
                value : blem.num_probleme_tech_type,
                libelle : blem.libelle_probleme_tech_type,
            }));
            newProblemeList.unshift({
                key : 'nd',
                value :'nd',
                libelle : 'nd',
            });
            this.setState({
                problemeTechTypeArray : newProblemeList,
            });

        });

        this.props.socket.on('lieu list -problemeTechConstate' , (lieus) => {
            console.log('lieus' , lieus );
            let newLieuList = lieus.map( lieu => ({
                key : lieu.num_lieu,
                value : lieu.num_lieu,
                libelle : lieu.libelle,
            }));
            newLieuList.unshift({
                key : 'nd',
                value :'nd',
                libelle : 'nd',
            });
            this.setState({
                lieuArray : newLieuList,
            });
        });
    }

    componentWillUnmount () {
        console.log('ProblemeTechConstate unmount');
        this.props.socket.off('probleme_tech_type list -problemeTechConstate');
        this.props.socket.off('lieu list -problemeTechConstate');
    }
    
    render () {
        let {
            numProblemeTechType,
            numLieu,
            remarque,
            onChangeProblemeTechType,
            onChangeLieu,
            onChangeRemarque,
        } = this.props;
        let {
            problemeTechTypeArray,
            lieuArray,
        } = this.state;
        return (
            <div className="problemeTechConstate">
                <FoldableDiv title="Probleme constaté" folded={true}>
                    <DropDown objArray={problemeTechTypeArray} value={numProblemeTechType} onChange={onChangeProblemeTechType}/>
                    <DropDown objArray={lieuArray} value={numLieu} onChange={onChangeLieu}/>
                    <textarea placeholder="Remarque" value={remarque} onChange={onChangeRemarque}>
                    </textarea>
                    
                </FoldableDiv>
            </div>
        );
    }
}
