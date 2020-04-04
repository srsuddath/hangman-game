import PropTypes from 'prop-types';
import React from 'react';
import './styles.css';

const Scaffold = (props) => {

  return (
    <div className="scaffold">
      <div className="top-section">
        <div className="bar"></div>
      </div>
      <div className="middle-section">
        <div className="noose">
          {props.children}
        </div>
        <div className="divider"></div>
        <div className="pole"></div>
      </div>

      <div className="bottom-section">
        <div className="ground-spacer"></div>
        <div className="ground"></div>
      </div>
    </div>)
}

Scaffold.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Scaffold;