import React, { Component } from 'react'

import store from '../reducers'
import style from './app.less'

export default class Main extends Component {
    render() {
        return (
            <div>
                {store.getState().user.name}
            </div>
        )
    }
}
