import './index.css';
import React , { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import Dropdown from './../utils/dropDown';

/*
 * props : -title for foldable title
 * - selectedNumMateriel pour syncro 
 * - selectedMaterielType pour syncro
 */

export default class MaterielSelector extends Component {
    constructor(props){
        super(props);
        this.state = {
            materielTypes : [],
            selectedMaterielType : this.props.selectedMaterielType || '',
            materielList : [],
            config : '',
        }
        this.materiels = null;
    }
    updateMaterielType = (e) => {
        console.log('updateMaterielType', e.target.value);
        console.log('this.materiel' , this.materiels);
        let objMateriel = {
            num :this.materiels[e.target.value][0].value,
            type : e.target.value,
            config : this.state.config,
        };
        this.props.changeList(objMateriel);
        this.setState({
            selectedMaterielType : e.target.value,
            materielList : this.materiels[e.target.value],
        });
    }
    updateMateriel = (e) => {
        console.log('updateMateriel' , e.target.value);
        let objMateriel = {
            num : e.target.value,
            type : this.state.selectedMaterielType,
            config : this.state.config,
        };
        this.props.changeList(objMateriel); 
        //this.setState({
            //selectedNumMateriel : e.target.value,
        //});
    }
    updateConfig = (e) => {
        let objMateriel = {
            num : this.props.selectedNumMateriel,
            type : this.state.selectedMaterielType,
            config : e.target.value,
        };
        this.props.changeList(objMateriel);
        this.setState({
            config : e.target.value,
        });
    }
    componentDidMount(){
        this.props.socket.emit('get materiel list');
        this.props.socket.on('materiel list' ,(materiels,materielTypes) => {
            console.log('materiels', materiels);
            let materielsList ;
            
            for( const type of materielTypes ){
                
                materielsList = {
                    ...materielsList,
                    [type.libelle_materiel_type] : materiels.filter( item => item.num_materiel_type === type.num_materiel_type).map( item => ({
                        key : item.num_materiel,
                        value : item.num_materiel,
                        libelle : item.libelle_materiel,
                    })),
                }
            }
            materielTypes = materielTypes.map( item => item.libelle_materiel_type);
            materielTypes.unshift('nd');
            console.log('materielsList' , materielsList , materielTypes);
            this.materiels = materielsList;
            
            let selectedMaterielType = this.state.selectedMaterielType;
            this.setState({
                materielTypes : materielTypes,
                materielList : materielsList[selectedMaterielType],
            });
            
        });
    }
    componentWillUnmount(){
       this.props.socket.off('materiel list'); 
    }
    render() {
        let {
            materielTypes,
            materielList,
            config,
        } = this.state;
        let {
            selectedNumMateriel,
            selectedMaterielType,
        } = this.props;
        let {
            title,
        } = this.props;
        return(
            <div className="materielSelector">
                <FoldableDiv title={title || 'Materiel'} >
                    <div className="sub-category-option">
                        <label> Type materiel: 
                        </label>
                        <Dropdown value={selectedMaterielType} array = {materielTypes} onChange={this.updateMaterielType}/>
                    </div>
                    <div className="sub-category-option">
                        <label> Materiel: 
                        </label>
                        <Dropdown value={selectedNumMateriel} objArray = {materielList} onChange={this.updateMateriel}/>
                    </div>
                    <div className="sub-category-option">
                        <label> Note: 
                            <textarea value={config} onChange={this.updateConfig}> </textarea>
                        </label>
                    </div>
                </FoldableDiv>
            </div>
        );
    }
}
