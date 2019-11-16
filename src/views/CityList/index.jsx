import React, { Component } from 'react'

import { setLocalCity,getCity } from '../../utils/city'
import styles from './index.module.scss'

// 长列表虚拟化
import { AutoSizer, List } from 'react-virtualized'
import { Toast } from 'antd-mobile'
// 导入公共组件
import NavHeader from '../../components/NavHeader'

// 每一行标题的高度
const TITLE_HEIGHT = 36
// 每一行中，它下面的每一个城市的高度
const ROW_HEIGHT = 50
// 有房源信息的城市
const CITIES = ['北京', '上海', '广州', '深圳']

class Index extends Component {
  state = {
    cityObj: null, //城市数据对象
    cityIndexList: null, //城市列表字母索引
    activeIndex: 0 //右边索引的索引
  }

  // 获取dom元素
  listRef = React.createRef()

  componentWillMount() {
    this.getCityList()
  }

  // 获取城市数据对象
  getCityList = async () => {
    let result = await this.http.get('/area/city?level=1')
    // console.log(result)
    // 创建一个空对象用来存放城市列表
    const tempObj = {}
    // 遍历城市数据对象
    result.data.body.forEach(item => {
      // 截取每个城市的首字母
      const firstLetter = item.short.substring(0, 1)
      // 判断该首字母中是否已经有数据,如果有,则作为元素往后添加,如果没有,则将item对象作为数组赋值给tempObj
      if (tempObj[firstLetter]) {
        // 如果有,则将对象作为属性值赋给该属性
        tempObj[firstLetter].push(item)
      } else {
        tempObj[firstLetter] = [item]
      }
    })

    // 处理右边的索引,获取tempObj的属性名,并且排序
    const cityIndexList = Object.keys(tempObj).sort()

    // 获取热门城市
    const hotCity = await this.http.get('/area/hot')
    // 取出热门城市数据
    const hotCityData = hotCity.data.body
    // 处理热门城市索引,在索引最前面添加 'hot' 索引
    cityIndexList.unshift('hot')
    // 将热门城市添加到城市列表
    tempObj['hot'] = hotCityData

    // 处理定位城市
    const locationCity = await getCity()
    cityIndexList.unshift('#')
    tempObj['#'] = [locationCity]

    this.setState({
      cityObj: tempObj,
      cityIndexList
    })
    console.log(tempObj, cityIndexList)
  }
  // 格式化字母
  formatLetter = letter => {
    switch (letter) {
      case '#':
        return '定位城市'

      case 'hot':
        return '热门城市'

      default:
      // 转为大写
        return letter.toUpperCase()
    }
  }

  // 切换城市选择
  toggleCity = ({label,value}) => {
    // 判断该城市是否有房源
    if (!CITIES.includes(label)) {
      Toast.info('该城市暂无房源哦~', 1)
      return
    }
    // 更新本地的定位城市
    setLocalCity({ label, value })
    // 返回
    this.props.history.goBack()
  }

  // 渲染左边的每一行数据
  rowRenderer = ({ key, index, style }) => {
    // 先获取索引中的每一个字母
    const letter = this.state.cityIndexList[index]

    // 在从 cityObj 中通过字母获取它下面的城市列表数组
    const list = this.state.cityObj[letter]

    return (
      // style一定要设置
      <div key={key} style={style} className={styles.city}>
        {/* 渲染每一行的标题 */}
        <div className={styles.title}>{this.formatLetter(letter)}</div>
        {/* 遍历每一行下面的城市 */}
        {list.map(item => {
          return (
            <div
              key={item.value}
              onClick={() => this.toggleCity(item)}
              className={styles.name}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
  /**
   * 计算每一行的高度
   */
  calcRowHeight = ({ index }) => {
    // 先获取索引中的每一个字母
    const letter = this.state.cityIndexList[index]

    // 在从 cityObj 中通过字母获取它下面的城市列表数组
    const list = this.state.cityObj[letter]

    return TITLE_HEIGHT + list.length * ROW_HEIGHT
  }

  /**
   * 点击右边的索引列表
   */
  clickCityIndexList = index => {
    this.listRef.current.scrollToRow(index)
  }

  /**
   * 渲染右边的索引列表
   */
  renderCityIndexList = () => {
    // 获取数据
    const { activeIndex, cityIndexList } = this.state
    return (
      <div className={styles.cityIndex}>
        {cityIndexList.map((item, index) => {
          return (
            <div
              onClick={() => this.clickCityIndexList(index)}
              key={item}
              className={styles.cityIndexItem}
            >
              <span className={index === activeIndex ? styles.indexActive : ''}>
                {item === 'hot' ? '热' : item.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * 左边滚动的时候执行该方法，可以获取到滚动到的索引位置
   */
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render() {
    return (
      <div className={styles.citylist}>
        {/* 顶部导航条组件 */}
        <NavHeader>城市选择</NavHeader>
        {/* 渲染左边的列表 */}
        {this.state.cityObj && (
          <AutoSizer>
            {(
              { height, width } // 如果没有高度，不会渲染
            ) => (
              <List
                ref={this.listRef}
                height={height}
                rowCount={this.state.cityIndexList.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                width={width}
                scrollToAlignment="start" // 滚动的时候，让其顶部对齐
              />
            )}
          </AutoSizer>
        )}
        {/* 渲染右边的索引 */}
        {this.state.cityIndexList && this.renderCityIndexList()}
      </div>
    )
  }
}

export default Index
