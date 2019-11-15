import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'
import { Flex } from 'antd-mobile'

// 路由的高阶组件
import { withRouter } from 'react-router-dom'

function SearchHeader({ cityName, history }) {
  return (
    <div className={styles.root}>
      <Flex>
        <Flex className={styles.searchLeft}>
          <div
            className={styles.location}
            onClick={() => history.push('/citylist')}
          >
            <span>{cityName}</span>
            <i className="iconfont icon-arrow"></i>
          </div>
          <div className={styles.searchForm}>
            <i className="iconfont icon-search"></i>
            <span>请输入小区或是地址</span>
          </div>
        </Flex>
        <i
          className="iconfont icon-map"
          onClick={() => history.push('/map')}
        ></i>
      </Flex>
    </div>
  )
}
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)
