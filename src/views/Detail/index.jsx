import React, { Component } from 'react'

export default class Index extends Component {
    render() {
        return (
            <div>
                房屋详情---{this.props.match.params.id}
            </div>
        )
    }
}
