import React, { Component } from 'react'
import styles from './index.module.scss'

import { Toast } from 'antd-mobile'

// 导入NavHeader 子组件
import NavHeader from '../../components/NavHeader'

// 获取城市
import { getCity } from '../../utils/city'

import { Link } from 'react-router-dom'

import classNames from 'classnames'

import HouseItem from '../../components/HouseItem'

const BMap = window.BMap

// 圆形覆盖物的样式：
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

class Index extends Component {
  state = {
    houseList: null, //房源列表
    isShowHouseList: false //是否显示房源列表
  }

  componentDidMount() {
    // 初始化地图
    this.initMap()
  }

  // 初始化地图
  initMap = async () => {
    const { label, value } = await getCity()
    this.map = new BMap.Map('container')

    // 给map添加一个触摸事件
    this.map.addEventListener('touchstart', () => {
      this.setState({
        isShowHouseList: false
      })
    })
    // 逆地址解析，根据当前的城市名称，获取它的经纬度
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          // 必须的，设置中心点和地图缩放级别
          this.map.centerAndZoom(point, 11)
          // 添加覆盖物
          this.renderOverlays(value)
        }
      },
      label
    )
  }

  //获取下一次的缩放级别与当前覆盖物类型
  getNextZoomAndType = () => {
    // nextZoom，代表我点击了当前覆盖物之后，展示下一级覆盖物，地图的缩放级别
    let nextZoom, type
    // 拿到当前的地图缩放级别
    const zoom = this.map.getZoom()

    if (zoom > 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom > 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else {
      type = 'rect'
    }

    return { nextZoom, type }
  }

  // 添加一二级的覆盖物
  renderOverlays = async id => {
    Toast.loading('加载中', 0)
    const result = await this.http.get(`/area/map?id=${id}`)
    Toast.hide()

    // 获取下一个要展示的地图级别与类型
    const { nextZoom, type } = this.getNextZoomAndType()

    // 渲染覆盖物
    result.data.body.forEach(item => {
      if (type === 'circle') {
        // 循环的去生成圆形覆盖物（适用于一二级覆盖物）
        this.renderCircleOverlays(item, nextZoom)
      } else {
        // 渲染第三级覆盖物（方形的）
        this.renderRectOverlays(item)
      }
    })
  }

  // 渲染方形覆盖物(三级覆盖物)
  renderRectOverlays = item => {
    const {
      coord: { longitude, latitude },
      count,
      label: name,
      value: id
    } = item

    // 创建覆盖物所在的点 (经纬度)
    const point = new BMap.Point(longitude, latitude)
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -20) // 设置文本偏移量
    }
    var label = new BMap.Label('', opts) // 创建文本标注对象
    // 写上覆盖物的内容
    // 设置内容
    label.setContent(`<div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}套</span>
        <i class='iconfont icon-arrow ${styles.arrow}'/>
    <div>`)
    // 添加覆盖物的样式
    label.setStyle(labelStyle)

    // 给覆盖物添加点击事件
    label.addEventListener('click', e => {
      if (e && e.changedTouches) {
        const { clientX, clientY } = e.changedTouches[0]

        // 计算应该移动的像素
        const moveX = window.innerWidth / 2 - clientX
        const moveY = (window.innerHeight - 330 + 45) / 2 - clientY

        // 移动地图，移动的单位是像素
        this.map.panBy(moveX, moveY)

        // 根据小区的id，获取该小区下面的房源列表
        this.getHouseListById(id)
      }
    })

    // 添加覆盖物到地图上
    this.map.addOverlay(label)
  }

  // 渲染圆形覆盖物 (一二级)
  renderCircleOverlays = (item, nextZoom) => {
    const {
      coord: { longitude, latitude },
      count,
      label: name,
      value: id
    } = item

    // 创建覆盖物所在的点（包含了经纬度）
    /**
     * 第一参数是经度，我们国家的经度大部分大于100度
     * 第二参数是纬度，纬度最多南北纬只有90度
     */
    const point = new BMap.Point(longitude, latitude)

    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(30, -30) //设置文本偏移量
    }
    var label = new BMap.Label('', opts) // 创建文本标注对象

    // 写上覆盖物的内容
    label.setContent(`
      <div class=${styles.bubble}>
        <p class=${styles.name}>${name}</p>
        <p class=${styles.name}>${count}套</p>
      </div>  
    `)

    // 添加覆盖物的样式
    label.setStyle(labelStyle)

    // 添加点击事件
    label.addEventListener('click', () => {
      // 清除已有的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 放大地图
      this.map.centerAndZoom(point, nextZoom)

      // 根据id请求，请求下一级的数据 & 循环生成新的覆盖物
      this.renderOverlays(id)
    })

    // 添加覆盖物到地图上
    this.map.addOverlay(label)
  }

  /**
   * 根据点击的小区的id，获取该小区下面的房源列表
   */
  getHouseListById = async id => {
    Toast.loading('拼命加载中...', 0)
    const result = await this.http.get(`/houses?cityId=${id}`)
    Toast.hide()

    this.setState({
      houseList: result.data.body.list,
      isShowHouseList: true
    })
  }

  /**
   * 渲染小区下面的房源信息
   */
  renderHouseList = () => {
    // return <div className={[styles.houseList,this.state.isShowHouseList ? styles.show : ''].join(' ')}>
    return (
      <div
        className={classNames(styles.houseList, {
          [styles.show]: this.state.isShowHouseList
        })}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <Link className={styles.titleMore} to="/houselist">
            更多房源
          </Link>
        </div>
        <div className={styles.houseItems}>
          {this.state.houseList.map(item => {
            return <HouseItem key={item.houseCode} {...item} />
          })}
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
        {/* 渲染小区下面的房屋列表 */}
        {this.state.houseList && this.renderHouseList()}
      </div>
    )
  }
}

export default Index
