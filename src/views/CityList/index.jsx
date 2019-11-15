import React, { Component } from 'react';

class Index extends Component {
    state = {
        cityObj: null, //城市数据对象
        cityIndexList: null //城市列表字母索引
    }

    componentWillMount(){
        this.getCityList()
    }

    // 获取城市数据对象
    getCityList = async () => {
        let result = await this.http.get('/area/city?level=1')
        console.log(result);
        // 创建一个空对象用来存放城市列表
        const tempObj = {}
        // 遍历城市数据对象
        result.data.body.forEach(item => {
            // 截取每个城市的首字母
            const firstLetter = item.short.substring(0,1)
            // 判断该首字母中是否已经有数据,如果有,则作为元素往后添加,如果没有,则将item对象作为数组赋值给tempObj
            if (tempObj[firstLetter]) {
                // 如果有,则将对象作为属性值赋给该属性
                tempObj[firstLetter].push(item)
            }else{
                tempObj[firstLetter] = [item]
            }
        })

        // 处理右边的索引,获取tempObj的属性名,并且排序
        const cityIndexList =Object.keys(tempObj).sort()

        // 获取热门城市
        const hotCity = await this.http.get('/area/hot')
        // 取出热门城市数据
        const hotCityData = hotCity.data.body
        // 处理热门城市索引,在索引最前面添加 'hot' 索引
        cityIndexList.unshift('hot')
        // 将热门城市添加到城市列表
        tempObj['hot'] = hotCityData
        console.log(tempObj,cityIndexList);
        
    }

    render() {
        return (
            <div>
                城市列表
            </div>
        );
    }
}

export default Index;