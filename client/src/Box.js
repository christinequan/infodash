import React from 'react';

const Box = (props) => {
  return(
    <div className={props.title + ' Box'}>
      <div className='header'>{props.title}</div>
      <div className={'insight ' + props.title}>{props.children}</div>
    </div>
  )
}

export default Box;
