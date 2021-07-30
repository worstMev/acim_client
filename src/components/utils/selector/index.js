import React from 'react';
import './selector.css';

//expect buttonText for the text on the button  , labelCheckbox for the label next to the checkbox , labelHiddenText for the label that is hidden with the hidden input , hidden input is the children , onClickButton for handling click on the button
class Selector extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showHiddenSelector : false,
        }

        this.toggleHiddenSelector = this.toggleHiddenSelector.bind(this);
    }

    handleOnClickButton = () => {
        console.log('click on button '+this.props.buttonText);
        this.props.onClickButton();
    }

    toggleHiddenSelector(e){
        console.log('showHiddenSelector '+ e.target.checked); 
        this.setState({
            showHiddenSelector : e.target.checked
        });
    }

    render(){
        return(
            <div className="selector">
                <input type="button" value={this.props.buttonText} className="my-button" onClick = {this.handleOnClickButton}/>
                <div>
                    <label>
                        <input type="checkbox" value={this.state.showHiddenSelector} onChange={ this.toggleHiddenSelector} />{this.props.labelCheckbox}
                    </label>
                {
                    this.state.showHiddenSelector &&
                    <div className="hidden">
                        <label> {this.props.labelHiddenText} 
                                {this.props.children}
                        </label>
                    </div>
                }
                </div>
            </div>
        );
    }
}

export default Selector;
