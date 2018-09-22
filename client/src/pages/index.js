/**
 * Created by admin on 2018/9/1.
 */
import React,{Component} from 'react'
import {Row,Col} from 'antd'


import Header from 'Component/Header'
import Container from 'Component/Container'
import Silider from 'Component/Silider'

import Page1 from './pages'
import './index.less'
export default class extends Component {
    render() {
        return <div className="base-container">
            <Header />
            <div>
                <Col span={4}>
                    <Silider/>
                </Col>
                <Col span={20}>
                    <Container >
                        <Page1/>
                    </Container>
                </Col>
            </div>
        </div>
    }
}
