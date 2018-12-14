$(function() {
	// 动画间隔
	const interval = 1000;
	// 定义动画队列
	const animates = [];

	let arrowTimer1 = arrowTimer2 = null;
	// 实例化Swiper
	let boxSwiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		loop: false,
		on: {
			slideChangeTransitionEnd() {
				// 每次切屏完成
				const index = this.activeIndex;
				$('.trangle').removeClass('fadeInUp').addClass('hide');

				//箭头
				delayAnimate(animates[index]);
				clearTimeout(arrowTimer1);
				clearTimeout(arrowTimer1);
				switch (index) {
					case 0:
						arrowAnimate(5000);
						break;
					case 3:
						arrowAnimate(5500);
						break;
					case 6:
						console.log(index);
						break;
					default:
						arrowAnimate(2000);
				}
			},
		},
	});

	// init
	$('.swiper-container .swiper-slide').each(function() {
		animates.push($(this).find('.animated').addClass('hide'));
	});

	let $loading = $('.loading-container'),
		bgMusic = $('#music').get(0),
		u = navigator.userAgent,
		isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

	//图片预加载
	//加载图片列表
	let imgList = [
		'./images/index-bg.jpg',
		'./images/shading.png',
		'./images/logo.png',
		'./images/index-text1.png',
		'./images/index-text2.png',
		'./images/recruit-text.png',
		'./images/index-intro.png',
		'./images/slide2.jpg',
		'./images/intro-title.png',
		'./images/intro-text.png'
	];

	imgPreload(imgList, function() {
		//放到预加载后面
		setTimeout(function() {
			$loading.fadeOut(800, function() {
				init();
				if (isAndroid) {
					document.getElementById('music').play();
					document.addEventListener("WeixinJSBridgeReady", function() {
						document.getElementById('music').play(); //自动播放
					}, false);
				} else {
					autoPlay();
				}
			});
		}, 500);
	});


	function autoPlay() {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			WeixinJSBridge.invoke('getNetworkType', {}, function(res) {
				bgMusic.play();
			});
		}
	}

	function imgPreload(imgArr, callback) {
		var solvedNum = imgArr.length;
		imgArr.forEach(function(v, i) {
			var img = new Image();
			img.src = v;
			if (img.complete) { //如果图片已经存在于浏览器缓存，直接调用回调函数
				checkSolved();
				return; // 直接返回，不用再处理onload事件
			}
			img.onload = function() {
				checkSolved();
			}
		});

		function checkSolved() {
			solvedNum--;
			if (solvedNum == 0) {
				callback && callback();
			}
		}
	}

	// 音乐 todo
	$(".music").click(function() {
		if (bgMusic.paused) {
			bgMusic.play();
			$(".music").addClass('rotate').removeClass('pause');
		} else {
			bgMusic.pause();
			$(".music").removeClass('rotate').addClass('pause')
		}
	});

	// 首页动画
	function init() {
		delayAnimate(animates[0]);
		arrowAnimate(5000);
	}

	function arrowAnimate(interval) {
		arrowTimer1 = setTimeout(function() {
			arrowTimer1 = setInterval(function() {
				$('.trangle').removeClass('hide').toggleClass('fadeInUp');
			}, 800)
		}, interval)
	}

	function delayAnimate(element) {
		$('.trangle').removeClass('fadeInUp').addClass('hide');
		// 清除旧的动画队列
		animates.forEach(v => {
			v.addClass('hide').each(function() {
				let $this = $(this);
				$this.removeClass($this.data('animate') || 'fadeIn');
				clearTimeout($this[0].timer);
			})
		});

		// 新建动画队列
		element.each(function(i, v) {
			let $this = $(this);
			$this[0].timer = setTimeout(function() {
				$this.removeClass('hide').addClass($this.data('animate') || 'fadeIn');
			}, 100 + i * interval);
		});
	}
})