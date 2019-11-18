import React from 'react'

import { BASEURL } from '../../utils/url'

import styles from './index.module.scss'

import classNames from 'classnames'

import { withRouter } from 'react-router-dom'

function HouseItem({ houseCode, houseImg, title, desc, tags, price, history }) {
  return (
    <div
      className={styles.house}
      onClick={() => history.push(`/detail/${houseCode}`)}
    >
      <div className={styles.imgWrap}>
        <img className={styles.img} src={`${BASEURL}${houseImg}`} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        {/* 标签 */}
        <div>
          {tags.map((item, index) => {
            const tagName = `tag${(index % 3) + 1}`
            return (
              <span
                className={classNames(styles.tag, styles[tagName])}
                key={item}
              >
                {item}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span>元/月
        </div>
      </div>
    </div>
  )
}

export default withRouter(HouseItem)
