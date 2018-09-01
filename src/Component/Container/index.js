/**
 * Created by admin on 2018/9/1.
 */
import React,{Component} from 'react'

export default class extends Component{
    render(){
        console.log(this.props)
        return  <div style={{height:'100%',background:'yellow',flex:4}}>
            {this.props.children}
        </div>
    }
}
