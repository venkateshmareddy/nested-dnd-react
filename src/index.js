import React, {Component} from "react";
import ReactDOM from "react-dom";
import initData from './initData';
import NestedDnd from './ParentContainer';
import styles from './style.js';
// Put the thing into the DOM!
class App extends Component{
  stateChanged = (changedData)=>{
    console.log(changedData)
  }
  render(){
    return (
      <NestedDnd data={initData} changedValues={this.stateChanged} styleObj={styles}/>
    )
  }
}

ReactDOM.render(
    <section>
    <App />
</section>, document.getElementById("root"));