import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Route, BrowserRouter, Link } from 'react-router-dom';
import { routeReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as MDL from "react-mdl";
import 'react-mdl/extra/material.js';
import transactions from './transactionList';

const { DataTable, TableHeader, Button, Textfield,Menu,MenuItem } = MDL;
/*
добавление фильтра:
    добавить кнопку
    добавить редьюсер
    обработать редьюсер в BtnRedux
*/
function generalReducer(store = { filters: { up: { val: false }, down: { val: false }, over1000: { val: false }, month: { val: false } }, transactions: [] }, action) {
    switch (action.type) {
        case "ADD": {
            let ret = {
                filters: store.filters,
                transactions: [...store.transactions, Object.assign({}, store.transactions, action.item)]
            };
            return ret;
        }
        case "FILTER:UP": {
            let ret = { filters: { ...store.filters }, transactions: store.transactions };
            ret.filters.up.val = !ret.filters.up.val;
            return ret;
        }
        case "FILTER:DOWN": {
            let ret = { filters: { ...store.filters }, transactions: store.transactions };
            ret.filters.down.val = !ret.filters.down.val;
            return ret;
        }
        case "FILTER:MONTH": {
            let ret = { filters: { ...store.filters }, transactions: store.transactions };
            ret.filters.month.val = !ret.filters.month.val;
            return ret;
        }
        case "FILTER:OVER1000": {
            let ret = { filters: { ...store.filters }, transactions: store.transactions };
            ret.filters.over1000.val = !ret.filters.over1000.val;
            return ret;
        }
        default: return store;
    }
}
let generalStore = createStore(generalReducer, applyMiddleware(thunk));

class Btn extends React.Component {
    render() {
        return <Button raised ripple onClick={() => this.props.changeFilter(this.props.valN)} colored={this.props.filter}>{this.props.val}</Button>
    }
}
let BtnRedux = connect(
    (store, props) => {
        return { filter: store.filters[props.valN].val };
    },
    dispatch => ({
        changeFilter: filterName => {
            if (filterName === "up") dispatch({ type: "FILTER:UP" });
            if (filterName === "down") dispatch({ type: "FILTER:DOWN" });
            if (filterName === "month") dispatch({ type: "FILTER:MONTH" });
            if (filterName === "over1000") dispatch({ type: "FILTER:OVER1000" });
        }
    })
)(Btn);
class App extends React.Component {
    render() {
        return <div>
            < DataTable
                shadow={0}
                rows={this.props.store.transactions.map((x, n) => {
                    x.date = new Date(x.date).toString();
                    x.number = n;
                    return x;
                })}
            >
                <TableHeader name="number">№</TableHeader>
                <TableHeader name="id">ID</TableHeader>
                <TableHeader name="value">Value</TableHeader>
                <TableHeader name="type">Type</TableHeader>
                <TableHeader name="date">Date</TableHeader>
            </DataTable>
            <BtnRedux valN="up" val="Доход" />
            <BtnRedux valN="down" val="Расход" />
            <BtnRedux valN="month" val="За месяц" />
            <BtnRedux valN="over1000" val="Больше 1000" />
        </div>
    }
}
let AppRedux = connect(
    (store) => {
        let transactions = store.transactions;
        if (store.filters.up.val) transactions = transactions.filter(item => item.type === "plus");
        if (store.filters.down.val) transactions = transactions.filter(item => item.type === "minus");
        if (store.filters.month.val) { let nowMonth = new Date().getMonth(); transactions = transactions.filter(item => new Date(item.date).getMonth() === nowMonth) };
        if (store.filters.over1000.val) transactions = transactions.filter(item => item.value >= 1000);
        return { store: { transactions } };
    }
)(App);
transactions.forEach(tr => generalStore.dispatch({ type: "ADD", item: tr }));

class AppAdd extends React.Component {
    constructor() {
        super();
        this.state = { type: "plus"}
        this.send = this.send.bind(this);
    }
    send() {
        this.props.add(this.valueInput.inputRef.value, this.state.type);
    }
    render() {
        return <div>
            <Button raised ripple id="demo-menu-lower-left">Тип: {this.state.type==="plus"?"Пополнение":"Вывод"}</Button>
            <Menu target="demo-menu-lower-left">
                <MenuItem onClick={()=>this.setState({type:"plus"})}>Пополнить</MenuItem>
                <MenuItem onClick={()=>this.setState({type:"minus"})}>Снять</MenuItem>
            </Menu>
            <Textfield ref={(input) => this.valueInput = input} pattern="-?[0-9]*(\.[0-9]+)?" error="Введите число" label="Value" />
            <Button raised colored onClick={ this.send}>Отправить</Button>
        </div>
    }
}
let AppAddRedux = connect(
    store => store,
    dispatch => ({
        add: (value, type) => {
            dispatch(newDispatch => {
                setTimeout(() => {
                    /*******FROM SERVER*/
                    let status = "OK";
                    let _id = generalStore.getState().transactions.length;
                    let date = +new Date();
                    /********/
                    if (status === "OK") {
                        newDispatch({ type: "ADD", item: { id: _id, value, type, date },endSpinner:true }); 
                    }
                }, 2000);//XHR либо Fetch
            });
        }
    })
)(AppAdd);

export default <Provider store={generalStore}>
    <BrowserRouter>
        <div>
            <ul>
                <li><Link to="/">index</Link></li>
                <li><Link to="/add">add</Link></li>
            </ul>
            <Route exact path="/" component={AppRedux} />
            <Route path="/add" component={AppAddRedux} />
        </div>
    </BrowserRouter>
</Provider>;
