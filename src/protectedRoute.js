/*protected route component
 * path : the path
 * takes conditionIn : a function that determines wether the condition to access the route is verified
 * render : the render function of the route component 
 * redirectRender : the redirect in case the conditionIn is false
 *
 */
import React from 'react';
import { Route } from 'react-router-dom';

export default class ProtectedRoute extends React.Component {

    determineRender = () => {
        if(this.props.conditionIn()) return this.props.render;
        else return this.props.redirectRender;
    }
    
    render() {
        return (
            <Route  path={this.props.path}
                    render={this.determineRender()}
            />
        );
    }
}

