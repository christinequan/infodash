import React, {Component} from 'react';


class Select extends Component{

  selectCB = (event) => {
    let val = event.currentTarget.value;
    this.props.selectCallBack(val);
  }

  render(){
    return(
    <select name={this.props.name} onSelect={this.selectCB}>
      <option disabled selected value="">Select {this.props.prompt}</option>
      {this.props.opts.map(opt => <option value={opt} key={opt}>{opt}</option>)}
    </select>
  )}

}

export default Select;
