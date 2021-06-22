import React from 'react';
import './dropDown.css';
//for a DropDown
//expect : defaultValue , value and onChange for controlling the component , array for the data in options
class DropDown extends React.Component {
    render(){
        let array = this.props.array || [] ;
//        console.log( typeof array);
//        console.log('DropDown '+array);
        let optionArray = array.map( item => 
            <option
                key= {item}
                value={item} >
            {item}
            </option>
        );
        return (
            <div className="dropDown">
                <select defaultValue= {this.props.selectedValue} value={this.props.value} onChange ={(e)=> this.props.onChange(e)} >
                    {optionArray}
                </select>
            </div>
        )
    }
}

export default DropDown;
