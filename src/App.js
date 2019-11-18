import React from 'react';
import './App.css';

// 导入router
import { HashRouter as Router,Switch,Route,Redirect } from "react-router-dom";
// 导入组件
import Layout from "./views/Layout";
import Login from "./views/Login";
import CityList from "./views/CityList";
import Map from './views/Map'
import Detail from './views/Detail'
function NotFound(){
  return <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573454653412&di=038bbffbad099ed90f5243ef97c9bd26&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01565959e6bcfda80121bea5beef4c.jpg%401280w_1l_2o_100sh.jpg" />
}

function App() {
  return (
    <Router>
      <div id="app">
        <Switch>
          <Route path="/layout" component={Layout} />
          <Route path="/login" component={Login} />
          <Route path="/citylist" component={CityList} />
          <Route path="/map" component={Map} />
          <Route path="/detail/:id" component={Detail} />
          <Redirect exact from="/" to="/layout" />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
