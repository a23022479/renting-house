import React, { Component } from 'react'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { BASEURL } from '../../utils/url'
import { Carousel, Flex, Grid } from 'antd-mobile'

// 通过模块化的方式导入图片(本地图片加载必须通过这种方式)
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

// 导入组件
import SearchHeader from "../../components/SearchHeader";

// 获取定位城市
import { getCity } from '../../utils/city'

class Index extends Component {
  state = {
    swipers: null, //轮播图
    GroupData: null, //租房小组
    NewsData: null, //咨询数据
    cityName: '北京' //搜索城市
  }
  navs = [
    { icon: image1, text: '整租', path: '/layout/houselist' },
    { icon: image2, text: '合租', path: '/layout/houselist' },
    { icon: image3, text: '地图找房', path: '/map' },
    { icon: image4, text: '去出租', path: '/rent/add' }
  ]

  async componentWillMount() {
    const { label, value } = await getCity()
    this.setState({
      cityName: label
    })
    // 轮播图
    this.getSwiper()
    // 租房小组
    this.getGroupData()
    // 咨询数据
    this.getNewsData()
  }

  // 获取轮播图数据
  getSwiper = async () => {
    let result = await this.http.get('/home/swiper')
    this.setState({
      swipers: result.data.body
    })
  }

  // 获取租房小组数据
  getGroupData = async () => {
    let result = await this.http.get('/home/groups')
    this.setState({
      GroupData: result.data.body
    })
  }

  // 获取咨询数据
  getNewsData = async () => {
    let result = await this.http.get('/home/news')
    this.setState({
      NewsData: result.data.body
    })
  }

  // 渲染轮播图
  renderSwiper = () => {
    return (
      <Carousel autoplay={true} infinite className={styles.swiper}>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            style={{
              display: 'inline-block',
              width: '100%',
            }}
          >
            <img
              src={`${BASEURL}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染导航列表,flex布局
  renderNav = () => {
    return (
      <Flex className={styles.nav}>
        {this.navs.map(item => {
          return (
            <Flex.Item key={item.text}>
              <Link to={item.path}>
                <img src={item.icon} alt="" />
                <p>{item.text}</p>
              </Link>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  // 渲染租房小组
  renderGroup = () => {
    return (
      <div className={styles.groups}>
        <Flex>
          <Flex.Item>
            <span className={styles.title}>租房小组</span>
          </Flex.Item>
          <Flex.Item align="end">
            <span>更多</span>
          </Flex.Item>
        </Flex>
        <Grid
          data={this.state.GroupData}
          hasLine={false}
          square={false}
          columnNum={2}
          renderItem={item => {
            return (
              <div className={styles.navItem} key={item.id}>
                <div className={styles.left}>
                  <p>{item.title}</p>
                  <p>{item.desc}</p>
                </div>
                <div className={styles.right}>
                  <img src={`${BASEURL}${item.imgSrc}`} alt="" />
                </div>
              </div>
            )
          }}
        />
      </div>
    )
  }

  // 渲染咨询数据
  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新咨询</h3>
        {this.state.NewsData.map(item => {
          return (
            <div className={styles.newsItem} key={item.id}>
              <div className={styles.imgWrap}>
                <img src={`${BASEURL}${item.imgSrc}`} alt="" />
              </div>
              <Flex
                className={styles.content}
                direction="column"
                justify="between"
              >
                <h3 className={styles.title}>{item.title}</h3>
                <Flex justify="between" className={styles.info}>
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 渲染轮播图,swipers有值的时候再渲染 */}
        {this.state.swipers && this.renderSwiper()}
        {/* 渲染导航nav */}
        {this.renderNav()}
        {/* 渲染租房小组 */}
        {this.state.GroupData && this.renderGroup()}
        {/* 渲染咨询数据 */}
        {this.state.NewsData&&this.renderNews()}
        {/* 渲染头部搜索 */}
        <SearchHeader cityName={this.state.cityName} />
      </div>
    )
  }
}

export default Index
