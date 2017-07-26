(function($){
	$.scrollBar = function(options){
        var defaults = {
            scrollWrap: $('#period-list'), //滚动元素的父元素
            scrollCon: $('#period-list').children('ul'), //滚动元素
            wrapHeight : 177, //滚动区域的高度
            scrollBarColor: '#333', //滚动条颜色
            scrollBarWidth: 10, //滚动条宽度
            sliderColor: '#666', //滚动条背景颜色
            sliderRate: 20
        };
        var param = $.extend(defaults, options);

        var wrapHei = param.wrapHeight;
        conHei = param.scrollCon.height();

        if(wrapHei >= conHei){
            param.scrollWrap.css('height','auto');
            param.scrollCon.css({
                width: 'auto',
                position: 'static'
            });
            if($('#scrollBar').length){
                $('#scrollBar').remove();
            }
            return;
        }else{
        	param.scrollWrap.height(wrapHei)
        }

        var scrollFun = function() {
            this.$scrollCon = param.scrollCon;
            this.$scrollWrap = param.scrollWrap;
            this.wrapHei = this.$scrollWrap.height() - 2;
            this.conHei = this.$scrollCon.height();

            this.scale = this.wrapHei / this.conHei;
            this.sliderHei = this.wrapHei * this.scale;
            this.scrollConWidth = this.$scrollCon.width();
            this.$scrollCon.css({
                'width':this.scrollConWidth,
                position : 'absolute',
                top:'0'
            });
            this.$scrollWrap.css({
                width: this.scrollConWidth + param.scrollBarWidth
            });
        };

        scrollFun.prototype = {
            scrStyle: function() {
                var scrollBar = '<div id="scrollBar" style="position:absolute;top:0;right:0;">' +
                    '<div id="slider" style="position:absolute;width:100%;border-radius: 5px;cursor:default"></div></div>';
                if (!$('#scrollBar').length) {
                    this.$scrollWrap.append(scrollBar);
                }

                this.$scrollBar = $scrollBar = $('#scrollBar');
                this.$slider = $slider = $('#scrollBar').children();

                $scrollBar.css({
                    width: param.scrollBarWidth - 2 + 'px',
                    height: this.wrapHei,
                    backgroundColor: param.scrollBarColor,
                    border:'1px solid '+param.scrollBarColor
                });

                $slider.css({
                    backgroundColor: param.sliderColor,
                    height: this.sliderHei
                });
            },
            _eventCompat: function(event) {
                var type = event.type;
                if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                    event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
                }

                if (event.srcElement && !event.target) {
                    event.target = event.srcElement;
                }
                if (!event.preventDefault && event.returnValue !== undefined) {
                    event.preventDefault = function() {
                        event.returnValue = false;
                    };
                }

                return event;
            },
            // 滚轮
            addEvent: function(el, type, fn, capture) {
                var _eventCompat = this._eventCompat;
                if (window.addEventListener) {
                    if (type === 'mousewheel' && document.mozHidden !== undefined) {
                        type = 'DOMMouseScroll';
                    }
                    el.addEventListener(type, function(event) {
                        fn.call(this, _eventCompat(event));
                    }, capture || false);

                } else if (window.attachEvent) {
                    el.attachEvent('on' + type, function(event) {
                        event = event || window.event;
                        fn.call(el, _eventCompat(event));
                    });
                }
            },
            // 鼠标滚轮事件
            mouseWheel: function() {

                var that = this,
                    hei = this.conHei,
                    wrapHei = this.wrapHei,
                    sliderHei = this.sliderHei,
                    scale = this.scale;

                this.addEvent(this.$scrollWrap[0], 'mousewheel', function(event) {
                    if (window.attachEvent) {
                        event.returnValue = false;
                    }else{
                        event.preventDefault();
                    }
                    var scrollTop = that.$scrollCon[0].offsetTop + event.delta * param.sliderRate,
                        sliderTop = that.$slider[0].offsetTop - event.delta * param.sliderRate * scale;
                    scrollTop = scrollTop > 0 ? 0 : -scrollTop > (hei - wrapHei) ? (wrapHei - hei) : scrollTop;
                    sliderTop = sliderTop < 0 ? 0 : sliderTop > (wrapHei - sliderHei) ? (wrapHei - sliderHei) : sliderTop;
                    that.$scrollCon.css('top', scrollTop);
                    that.$slider.css('top', sliderTop);

                })
            },
            //滚动条滑块点击事件
            sliderClick: function() {
                var firX, firY, firTop;
                var $slider = this.$slider,
                    $scrollCon = this.$scrollCon,
                    that = this,
                    scale = this.scale,
                    wrapHei = this.wrapHei,
                    sliderHei = this.sliderHei,
                    hei = this.conHei;
                $slider.mousedown(function(e) {
                    if (e.which !== 1) {
                        return
                    }
                    firX = e.pageX, firY = e.pageY;
                    firTop = this.offsetTop;
                    scrTop = $scrollCon[0].offsetTop;
                });
                $slider.mousemove(function(e) {
                    if (e.which !== 1) {
                        return
                    }
                    var sliderTop = firTop + (e.pageY - firY),
                        scrollTop = scrTop - (e.pageY - firY) / scale;
                    sliderTop = sliderTop < 0 ? 0 : sliderTop > (wrapHei - sliderHei) ? (wrapHei - sliderHei) : sliderTop;
                    scrollTop = scrollTop > 0 ? 0 : -scrollTop > (hei - wrapHei) ? (wrapHei - hei) : scrollTop;

                    $(this).css('top', sliderTop);
                    $scrollCon.css('top', scrollTop);
                });
            },
            init: function() {
                this.scrStyle();
                this.mouseWheel();
                this.sliderClick();
            }
        };
        var scr = new scrollFun();
        scr.init();
	}
})(jQuery);

//初始化
$.scrollBar();