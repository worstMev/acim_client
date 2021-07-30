import React from 'react';
import {Link} from 'react-router-dom';
import './index.css';

export default class Layout extends React.Component {
    render(){
      return (  
        <div id="layout">
            <main>
                {this.props.children}
            </main>
            <footer>
              <Link to="/">home</Link>
              <Link to="/info">info</Link>
              <Link to="/acim">acim</Link>
              <Link to="/notify">notify</Link>
            </footer>
        </div>
     );
    }
}
