import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

// 导入字体文件
import './assets/fonts/iconfont.css'

// 导入react-virtualized样式
import 'react-virtualized/styles.css'

// 最后导入我们自己的样式文件
import './index.css'
import './utils/axios'
ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
