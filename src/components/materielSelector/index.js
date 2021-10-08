import './index.css';
import React , { Component } from 'react';
import FoldableDiv from './../foldableDiv';
import Dropdown from './../utils/dropDown';

/*
 * props : -title for foldable title
 * - selectedNumMateriel pour syncro *
 * - selectedMaterielType pour syncro*
 * - selectedLieu *
 * - onChange  
 * - socket
 *   
 *   exposes an obj { num (num_materiel) , type (libelle_materiel_type)  , lieu (libelle_lieu)} in its onChange props
 */

export default class MaterielSelector extends Component {
    constructor(props){
        super(props);
        this.state = {
            materielTypes : [],
            lieus : [],
            selectedLieu : this.props.selectedLieu || 'nd',
            selectedMaterielType : this.props.selectedMaterielType || 'nd',
            materielList : [],
            config : '',
        }
        //Lieu >>> type >>> materiel
        this.materiels = null;
    }

    updateLieu = (e) => {
        console.log('updateLieu', e.target.value);
        console.log('this.materiel' , this.materiels);
        let firstType = Object.getOwnPropertyNames(this.materiels[e.target.value])[0];
        let materielsList = this.materiels[e.target.value][firstType];
        let objMateriel = {
            num : materielsList[0].value,
            type : firstType,
            lieu : e.target.value,
            config : this.state.config,
        }
        console.log('objMateriel', objMateriel);
        this.props.onChange(objMateriel);
        this.setState({
            selectedLieu : e.target.value,
            selectedMaterielType : firstType,
            materielTypes : Object.getOwnPropertyNames(this.materiels[e.target.value]),
            materielList : materielsList,
        });
    }
    
    updateMaterielType = (e) => {
        console.log('updateMaterielType', e.target.value);
        console.log('this.materiel' , this.materiels);
        let materielsList = this.materiels[this.state.selectedLieu][e.target.value];
        let objMateriel = {
            num :materielsList[0].value,
            type : e.target.value,
            lieu : this.state.selectedLieu,
            config : this.state.config,
        };
        this.props.onChange(objMateriel);
        this.setState({
            selectedMaterielType : e.target.value,
            materielList : materielsList,
        });
    }

    updateMateriel = (e) => {
        console.log('updateMateriel' , e.target.value);
        let objMateriel = {
            num : e.target.value,
            type : this.state.selectedMaterielType,
            lieu : this.state.selectedLieu,
            config : this.state.config,
        };
        this.props.onChange(objMateriel); 
        //this.setState({
            //selectedNumMateriel : e.target.value,
        //});
    }
    
    updateConfig = (e) => {
        let objMateriel = {
            num : this.props.selectedNumMateriel,
            type : this.state.selectedMaterielType,
            lieu : this.state.selectedLieu,
            config : e.target.value,
        };
        this.props.onChange(objMateriel);
        this.setState({
            config : e.target.value,
        });
    }
    sortMaterielsByType = (materiels,types) => {
        let sortedMateriels = {};
        sortedMateriels.nd = [{ key : 'nd' , libelle:'nd' , value : 'nd'  }];
        for( const type of types ){
            let matOfType = materiels.filter( item => item.num_materiel_type === type.num_materiel_type).map( item => ({
                key : item.num_materiel,
                value : item.num_materiel,
                libelle : item.libelle_materiel,
            }));
            if( matOfType.length ){
                sortedMateriels[type.libelle_materiel_type] = materiels.filter( item => item.num_materiel_type === type.num_materiel_type).map( item => ({
                    key : item.num_materiel,
                    value : item.num_materiel,
                    libelle : item.libelle_materiel,
                }));
            }
        }
        //console.log('sortedMateriels' , sortedMateriels);
        
        return sortedMateriels;

    }
    componentDidMount(){
        this.props.socket.emit('get materiel list');
        this.props.socket.on('materiel list -materielSelector' ,(materiels,materielTypes,lieus) => {
            console.log('materiels', materiels,materielTypes,lieus);
            let materielsListLieu = {};
            materielsListLieu.nd = {
                nd : [{ key : 'nd' , libelle:'nd' , value : 'nd'  }],
            };
            for ( const lieu of lieus ){
                materielsListLieu = {
                    ...materielsListLieu,
                    [lieu.libelle] : this.sortMaterielsByType(materiels.filter( item => item.num_lieu === lieu.num_lieu ),materielTypes),
                }
            }
            console.log('materielsListLieu', materielsListLieu);
            
            //let materielsList ;
            //for( const type of materielTypes ){
            //    
            //    materielsList = {
            //        ...materielsList,
            //        [type.libelle_materiel_type] : materiels.filter( item => item.num_materiel_type === type.num_materiel_type).map( item => ({
            //            key : item.num_materiel,
            //            value : item.num_materiel,
            //            libelle : item.libelle_materiel,
            //        })),
            //    }
            //}
            lieus = lieus.map( item => item.libelle);
            lieus.unshift('nd');

            this.materiels = materielsListLieu;
            let selectedMaterielType = this.state.selectedMaterielType;
            let selectedLieu = this.state.selectedLieu;
            materielTypes = Object.getOwnPropertyNames(this.materiels[selectedLieu]);
            console.log('materielTypes', materielTypes);
            console.log('materielsList' , materielsListLieu , materielTypes, lieus);
            let materielsList;
            if( this.materiels){
                
                console.log('selectedLieu :%c, materielsList : %c',selectedLieu,this.materiels[selectedLieu]);
                materielsList = (this.materiels) ? this.materiels[selectedLieu][selectedMaterielType] : [];
            }
            this.setState({
                lieus : lieus,
                materielTypes : materielTypes,
                materielList : materielsList,
            });
            
        });
    }

    componentWillUnmount(){
       console.log('materielSelector unmount');
       this.props.socket.off('materiel list -materielSelector'); 
    }
    render() {
        let {
            materielTypes,
            materielList,
            config,
            lieus,
            selectedLieu,
        } = this.state;
        let {
            selectedNumMateriel,
        } = this.props;
        let {
            title,
        } = this.props;
        let selectedMaterielType = this.props.selectedMaterielType || this.state.selectedMaterielType;

        return(
            <div className="materielSelector">
                <FoldableDiv title={title || 'Materiel'} >
                    <div className="sub-category-option">
                        <label> Lieu </label>
                        <Dropdown value={selectedLieu} array = {lieus} onChange={this.updateLieu}/>
                    </div>
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
