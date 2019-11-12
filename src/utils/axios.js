import { Component } from "react";
import axios from 'axios'
import {BASEURL} from './url'

axios.defaults.baseURL = BASEURL

// 挂载到组件原型
Component.prototype.http = axios

