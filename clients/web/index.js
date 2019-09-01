import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import store from './reducers'
import Main from './pages/Main'

const App = () => (
    <Router>
        <Route path='' component={Main} />
    </Router >
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
