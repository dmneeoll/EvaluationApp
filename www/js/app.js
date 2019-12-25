// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('evaluationApp', ['ionic', 'ionic.native',
    'evaluationApp.router', 'evaluationApp.appControllers', 'evaluationApp.pointsControllers', 'evaluationApp.businiessControllers',
    'evaluationApp.appServices', 'evaluationApp.directives', 'evaluationApp.utilServices',
    'evaluationApp.pointsService', 'evaluationApp.businessServices', 'evaluationApp.businiess2Controllers', 'evaluationApp.B11WorkShopController',
    'angularMoment', 'chart.js', 'evaluationApp.sharCarController', 
    'ion-datetime-picker', 'evaluationApp.adminControllers', 'evaluationApp.gbshrControllers', 
    'evaluationApp.unionControllers', 'evaluationApp.testControllers', 'evaluationApp.mechCharityControllers',
    'evaluationApp.CSERControllers', 'evaluationApp.otherControllers'
    ])
    //angular.module('evaluationApp', ['ionic', 'evaluationApp.router','evaluationApp.controllers', 'evaluationApp.services'])

    .run(function ($ionicPlatform, SettingFactory, $http, $rootScope, $state, $location, $timeout, $ionicHistory, CacheFactory, commonServices, $window,
        $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaKeyboard, $cordovaTransfer, $cordovaFile, $ionicActionSheet, $cordovaFileOpener, amMoment) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            $rootScope.isIOS = ionic.Platform.isIOS();
            $rootScope.isAndroid = ionic.Platform.isAndroid();

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            try {
                //启动极光推送服务
                window.plugins.jPushPlugin.init();
                //调试模式，这样报错会在应用中弹出一个遮罩层显示错误信息
                window.plugins.jPushPlugin.setDebugMode(false);

                var onGetRegistradionID = function (data) {
                    try {
                        //保存极光推送ID
                        CacheFactory.remove('registrationID');
                        CacheFactory.save('registrationID', data);

                    } catch (exception) {
                        model.console.push(exception);
                    }
                };
                window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);

                plugins.jPushPlugin.openNotificationInAndroidCallback = function (data) {
                    try {
                        var extras = data.extras;
                        var action = extras['cn.jpush.android.EXTRA']["key"];

                        switch (action) {
                            case "redbag":
                                $state.go('tabPoints.account');
                                break;
                            case "msg":
                                $state.go('tab.myMsg');
                                break;
                            case "notice":
                                $state.go('noticeList');
                                break;
                            default:
                                $state.go('tab.home');
                                break;
                        }
                    } catch (e) {
                        alert(e.message);
                    }
                };

                //检测更新
                // var serverAppVersion = "0.0.2";
                // commonServices.getVer().then(function (data) {
                    // var largeLoad = data;
                    // if (largeLoad == 'undefined') return;
                    // serverAppVersion = largeLoad.sVersion;
                    // cordova.getAppVersion.getVersionNumber().then(function (version) {

                        // //如果本地与服务端的APP版本不符合
                        // if (version != serverAppVersion) {
                            // if ($rootScope.isIOS) {
                                // if (serverAppVersion == '1.2.1') {
                                    // return;
                                // }
                            // }

                            // showUpdateConfirm(largeLoad);
                        // }
                    // });
                // });

                document.addEventListener("menubutton", onHardwareMenuKeyDown, false);
            } catch (ex2) {
                //浏览器调试时报异常
            }
            //      checkUpdate();
            
        });


        // 检查更新
        //        function checkUpdate() {
        //
        //            //获取版本
        //            var serverAppVersion = "0.0.2";
        //
        //            $http.get(API.Version).success(function (largeLoad) {
        //
        //                //获取版本
        //                if(largeLoad=='undefined') return;
        //                serverAppVersion = largeLoad.sVersion;
        //                cordova.getAppVersion.getVersionNumber().then(function(version){
        //                    //如果本地与服务端的APP版本不符合
        //                    if (version != serverAppVersion) {
        //                        showUpdateConfirm(largeLoad);
        //                    }
        //                });
        //
        //            })
        //                .error(function (data, status, headers, config) {
        //                    $ionicLoading.show({ template: '读取版本信息失败！', noBackdrop: true, duration: 2000 });
        //                });
        //        };

        // 显示是否更新对话框
        function showUpdateConfirm(version) {
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级-' + version.sVersion,
                template: version.sDescription, //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    if ($rootScope.isIOS) {
                        console.log('访问appstore进行更新');

                        $window.open("itms-services://?action=download-manifest&amp;url=https://zhmobile.flextronics.com/apps/ios/FlexPlus.plist");
                        return
                    }

                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });

                    var url = "https://zhmobile.flextronics.com/apps/android/Flex.apk";
                    var targetPath = "/mnt/sdcard/Flex.apk";
                    var trustHosts = true
                    var options = {};
                    $cordovaTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                        // 打开下载下来的APP
                        $cordovaFileOpener.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                            //$ionicLoading.hide();
                            // 成功

                        }, function (err) {
                            $ionicPopup.confirm({
                                title: '安装失败',
                                template: "安装失败，是否通过外部链接安装！", //从服务端获取更新的内容
                                cancelText: '取消',
                                okText: '确定'
                            }).then(function (res) {
                                if (res) {
                                    window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                    $ionicLoading.hide();
                                } else {
                                    $ionicLoading.hide();
                                }
                            });
                        });
                    }, function (err) {
                        alert("下载失败:将通过外部链接下载安装，请在弹出的窗口中选择浏览器打开。 ");
                        window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
                        $ionicLoading.hide();
                    }, function (progress) {
                        //进度，这里使用文字显示下载百分比
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.show({
                                    template: "下载完成，准备安装！"
                                }); //$ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    // 取消更新
                }
            });
        }

        // 双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            function showConfirm() {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            //判断处于哪个页面时双击退出
            if ($location.path() == '/tabPoints/points' || $location.path() == '/tab/home' ||
                $location.path().indexOf('/tabPoints/rules') != -1 || $location.path() == '/tab/account' || $location.path() == '/signin'
                || $location.path() == '/tabPoints/PointsAccount') {
                showConfirm();
            } else if ($ionicHistory.backView()) {
                if ($cordovaKeyboard.isVisible) {
                    $cordovaKeyboard.close();
                } else {
                    $ionicHistory.goBack();
                }
            }
            else {
                showConfirm();
            }
            e.preventDefault();
            return false;
        }, 101);
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider) {

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

        var orgin = $sceDelegateProvider.resourceUrlWhitelist();
        orgin.push('https://s*.ax1x.com/2018/**');
        orgin.push('https://s*.ax1x.com/2019/**');
        orgin.push('https://zhmobile.flextronics.com/EvaluationApp/Upload/**');
        $sceDelegateProvider.resourceUrlWhitelist(orgin);

    });
