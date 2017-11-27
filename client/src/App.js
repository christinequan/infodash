import React, { Component } from 'react';
import {query_top, get_brands, query_counthhs, query_affinity} from './Client';
import './App.css';
import Box from './Box';
import Select from './Select';

class App extends Component {
  constructor(){
    super();
    this.brands = [];
    this.retailers = ['CVS', 'Costco', 'Walgreens'];
    this.state = {
      retailer: '',
      numHH: 0,
      topBrand: '',
      brands: [],
    }
    this.getTop = this.getTop.bind(this);
    this.getBrands = this.getBrands.bind(this);
    this.getCounts = this.getCounts.bind(this);
    this.getAffinity = this.getAffinity.bind(this);
    this.submitHandlerHouse = this.submitHandlerHouse.bind(this);
    this.submitHandlerAffinity = this.submitHandlerAffinity.bind(this);
  }

  componentDidMount(){
    query_top(this.getTop);
    get_brands(this.getBrands);
  }

  getTop(text){
    this.setState({topBrand: text})
  }

  getBrands(text){
    this.brands = text.split(',');
    this.setState({brands: text.split(',')})
  }

  getAffinity(text){
    this.setState({affinity: text});
  }

  selectCallBack(val){
    this.setState({focus_brand: val})
  }

  submitHandlerHouse(e){
    e.preventDefault();
    const form_vals = e.currentTarget.elements;
    const args = ['brand', 'retailer', 'start_date', 'end_date'];

    let params_obj = args.map(arg => {
      let value = form_vals[arg].value;
      return([arg, value])
    });
    query_counthhs(params_obj, this.getCounts);
  }

  getCounts(text){
    console.log(text);
    this.setState({numHH: text})
  }

  submitHandlerAffinity(e){
    e.preventDefault();
    let focus = e.currentTarget.elements['focus_brand'].value;
    query_affinity(focus, this.getAffinity);
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">InfoScout Dash</h1>
        </header>

        <Box title='Households'>
          <form id='hhform' onSubmit={e => this.submitHandlerHouse(e)}>
            <Select name='brand' opts={this.brands} prompt='brand' selectCB={this.selectCallBack.bind(this)}/>
          <br/>
            <Select name='retailer' opts={this.retailers} prompt='retailer' selectCB={this.selectCallBack.bind(this)}/>
          <br/>
            Start Date (mm/dd/yyyy): <input type="text" name='start_date' />
          <br/>
            End Date (mm/dd/yyyy): <input type="text" name='end_date'/>
          <br/>
            <input type="submit" className='submit-btn' value="Count Households"/>
          </form>
          <h3 className='numHH'>{this.state.numHH}</h3>
          <img alt='houses' className='houseimg' src='./houses.png'/>
        </Box>
        <Box title='Affinity'>
          <form id='affinityform' onSubmit={e => this.submitHandlerAffinity(e)}>
            <Select name='focus_brand' opts={this.brands} prompt='brand' selectCB={this.selectCallBack.bind(this)}/>
            <input type="submit" className='submit-btn' value="Get Affinity Retailer"/>
          </form>
          <h3 className='affinityBrand'>{this.state.affinity}</h3>
          <img className='affinityImg' alt='ggAffinityPlot' src='./ggplot.png'/>
        </Box>
        <Box title='Top Brand'>
          <h3> {this.state.topBrand} </h3>
        </Box>

      </div>
    );
  }
}

export default App;
