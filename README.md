# 滚动条插件
1、初始化插件，代码如下：
```
$.scrollBar();
```


2、初始化的时候传滚动相关的元素,如果结构跟我的结构一样可以忽略，代码如下：

```
$.scrollBar({
    scrollWrap: $('#period-list'), //滚动元素的父元素
    scrollCon: $('#period-list').children('ul'), //滚动元素
    wrapHeight : 177, //滚动区域的高度
    scrollBarColor: '#333', //滚动条颜色
    scrollBarWidth: 10, //滚动条宽度
    sliderColor: '#666', //滚动条背景颜色
    sliderRate: 20
});
```
