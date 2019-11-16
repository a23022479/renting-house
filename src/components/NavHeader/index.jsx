import React, { Component } from 'react';
import { NavBar } from "antd-mobile";
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styles from './index.module.scss'
function NavHeader({children,history}) {
        return (
            <NavBar
            className={styles.navBar}
            mode='light'
            icon={<i className="iconfont icon-back" />}
            onLeftClick={() => history.goBack()}
            >
                {children}
            </NavBar>
        );
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired
}

export default withRouter(NavHeader);