import PropTypes from 'prop-types';
import React from 'react';
import './styles.css';


const StickMan = (props) => {

  return (
    <div className="stickman">
      {props.displayHead && <div className="head" />}
      {props.displayBody && <div className="body" />}
      {props.displayLeftArm && <div className="left-arm" />}
      {props.displayRightArm && <div className="right-arm" />}
      {props.displayLeftLeg && <div className="left-leg" />}
      {props.displayRightLeg && <div className="right-leg" />}
    </div>
  )
}

StickMan.propTypes = {
  displayHead: PropTypes.bool,
  displayBody: PropTypes.bool,
  displayLeftArm: PropTypes.bool,
  displayRightArm: PropTypes.bool,
  displayLeftLeg: PropTypes.bool,
  displayRightLeg: PropTypes.bool,
}

export default StickMan