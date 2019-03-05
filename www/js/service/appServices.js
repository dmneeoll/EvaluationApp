/**
 * 服务
 */
angular.module('evaluationApp.appServices', [])
    .service("commonServices",function($http, $q, HttpFactory,CacheFactory,$rootScope){
        return {
            //获取版本号
            getVer:function(){
                var deferred = $q.defer();
                HttpFactory.send({
                    url: API.Version,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            // 获取评分列表
            login: function (user) {
                var deferred = $q.defer();
                var result={success:false,msg:null};
                HttpFactory.send({
                    url: API.User_Login+'&registrationID='+  CacheFactory.get('registrationID')+'&isIOS='+$rootScope.isIOS,// 记录极光推送的机器ID
                    params: user,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if (response.success) {
                        CacheFactory.save('accessUser', user);
                        CacheFactory.save('accessEmployee', response.obj);
                        result.success=true;
                        result.msg='登录成功';
                    } else {
                        result.success=false;
                        if(!isEmptyString(response.message)){
                            result.msg=response.message;
                        }
                        else if($rootScope.Language==ZH_CN){
                            result.msg='用户名或密码错误,未注册请先注册';
                        }                            
                        else{
                            result.msg='Incorrect username or password. Please register first without registration';
                        }                        
                    }
                    deferred.resolve(result);
                }) .error(function(response) {
                        deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                    });
                return deferred.promise;
            },

            getHomeSlideImg:function(paras){
                var deferred = $q.defer();
                var slideImg = [];
                HttpFactory.send({
                    url:API.GetSlideImg,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if (response.success) {
                        for(var i=0;i<response.list.length;i++){
                            slideImg.push({ imgUrl:response.list[i].SlideImgUrl,NoticeID:response.list[i].NoticeID,NoticeTitle:response.list[i].NoticeTitle});
                        }
                        deferred.resolve(slideImg);
                    }
                    else  {
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            getMsgCount:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.GetMsgCount,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if (response.success) {
                        deferred.resolve(response.obj);
                    }
                    else  {
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            //一般提交方法 提交的参数，URL
            submit: function (params,apiUrl) {
                var deferred = $q.defer();
                HttpFactory.send({
                    url: apiUrl,
                    method: 'post',
                    params: params
                }).success(function (response) {
                        deferred.resolve(response);
                    }
                ) .error(function(response) {
                        deferred.reject(response);   // 声明执行失败，即服务器返回错误
                    });
                return deferred.promise;
            },

            getSecurityCode:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.GetSecurityCode,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            checkSecurityCode:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.CheckSecurityCode,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            register:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.Register,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            getForgetPswSecurityCode:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.GetForgetPswSecurityCode,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            getPhoneSecurityCode:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.GetPhoneSecurityCode,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            operationLog:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:API.OperationLog,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);
                }) .error(function(response) {
                    deferred.reject(response.template);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },

            getBaseParas:function(){
                var accessEmployee = $rootScope.accessEmployee;
                var parameter={
                    WorkdayNO: accessEmployee.WorkdayNO,
                    CName:accessEmployee.CName,
                    Token:accessEmployee.Token,
                    MobileNo:accessEmployee.MobileNo,
                    Segment_ID:accessEmployee.Segment_ID,
                    ADAcount:accessEmployee.ADAccount,
                    Organization:accessEmployee.Organization
                };
                return parameter;
            },
            getLoginServerTime:function(){
                var accessEmployee = $rootScope.accessEmployee;
                return new Date(accessEmployee.LoginServerTime);
            },
            getUrl:function(pageName,methodName){
//                API_HOST+'/MealOrder.ashx?action=GetMealList'
                return API_HOST+'/'+pageName+'?action='+methodName;
            },
            getData:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.data);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataNoMask:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.data);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataList:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: true
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.list);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            getDataListNoMask:function(paras,url){
                var deferred = $q.defer();
                HttpFactory.send({
                    url:url,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    if(response.success){
                        deferred.resolve(response.list);
                    } else{
                        deferred.resolve(response.message);
                    }

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            },
            setLed:function(paras){
                var deferred = $q.defer();
                HttpFactory.send({
                    url: API.LightControl,
                    params: paras,
                    method: 'post',
                    mask: false
                }).success(function (response) {
                    deferred.resolve(response);

                }) .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            }
        }
    })
    .service('IonicService', function ($http, $q, ConfigService, HttpFactory, CacheFactory) {
        return {
            // 获取指定的action数据
            postToServer: function (data,actionURL) {
                var deferred = $q.defer();
                HttpFactory.send({
                    url: actionURL,
                    method: 'post',
                    params: data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    mask: true
                }).success(function (response) {
                        deferred.resolve(response);
                    }
                )
                    .error(function(response) {
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });
                return deferred.promise;
            }
        }
    })
    .service('ConfigService', [function () {
        var hostURL = "https://sgp-sys.multek.com/Points/";

        var service = {
            getHost: function () {
                return hostURL;
            }
        }
        return service;
    }])
    .service('CacheFactory', function ($window) {
        var append = function (key, value) {
        };
        var save = function (key, value) {
            $window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);
        };
        var get = function (key) {
            return $window.localStorage.getItem(key) || null;
        };
        var remove = function (key) {
            $window.localStorage.removeItem(key);
        };
        return {
            append: append,
            save: save,
            get: get,
            remove: remove
        };
    })
    .service('SettingFactory', function (CacheFactory) {
        var setting = JSON.parse(CacheFactory.get('setting'));
        var get = function (key) {
            return !!key ? (setting[key] || null) : setting;
        };
        var save = function () {
            if (arguments.length > 1) {
                setting[arguments[0]] = arguments[1];
            } else {
                setting = arguments[0];
            }
            CacheFactory.save('setting', setting);
        };
        var remove = function (key) {
            save(key, null);
        };
        return {
            save: save,
            get: get,
            remove: remove
        };
    })
    .service('HttpFactory', function ($http, $ionicPopup, $ionicLoading, CacheFactory,$rootScope) {

        /**
         * method – {string} – HTTP method (e.g. 'GET', 'POST', etc)
         * url – {string} – Absolute or relative URL of the resource that is being requested.
         * params – {Object.<string|Object>} – Map of strings or objects which will be turned to ?key1=value1&key2=value2 after the url. If the value is not a string, it will be JSONified.
         * data – {string|Object} – Data to be sent as the request message data.
         * headers – {Object} – Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent.
         * xsrfHeaderName – {string} – Name of HTTP header to populate with the XSRF token.
         * xsrfCookieName – {string} – Name of cookie containing the XSRF token.
         * transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations
         * transformResponse – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http response body and headers and returns its transformed (typically deserialized) version. See Overriding the Default Transformations
         * cache – {boolean|Cache} – If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
         * timeout – {number|Promise} – timeout in milliseconds, or promise that should abort the request when resolved.
         * withCredentials - {boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
         * responseType - {string} - see requestType.
         */
        var send = function (config) {

            !!config.scope && (config.scope.loading = true);

            !!config.mask && $ionicLoading.show({
                template: typeof config.mask == "boolean" ?$rootScope.Language.menu.wait: config.mask
            });

            config.method == 'post' && (config.data = config.data || {}) && ionic.extend(config.data, {
                accesstoken: CacheFactory.get('accessToken')
            });

            ionic.extend(config, {
                timeout: ERROR.TIME_OUT
            });

            var http = $http(config);

            http.catch(function (error) {
                
                if(false==IsDebugMode){
                    API_HOST = 'https://zhmobile.flextronics.com/EvaluationApp';
                }                
                if (error.status <= 0) {
                    error.data = {
                      template: !navigator.onLine || error.data == '' ?
                        '网络不通' : '请求失败, 请稍后重试...'
                    };
                } else if (error.data.error_msg == ERROR.WRONG_ACCESSTOKEN || status == 403) {
                    error.data = {
                        template: '好像是鉴权失效了，该不会是<b>@alsotang</b>的API有啥问题吧？'
                    }
                } else {
                    error.data = {
                        template: '错误信息：' + JSON.stringify(error.data)
                    }
                }
                $ionicPopup.alert({
                    title: 'Warning ...',
                    template: error.data.template,
                    buttons: [
                        {
                            text: '算了',
                            type: 'button-positive'
                        }
                    ]
                });
            });

            http.finally(function () {
                !!config.scope && (config.scope.loading = false);
                !!config.mask && $ionicLoading.hide();
            });

            return http;
        };

        return {
            send: send
        }

    })
    .service('alertService', ['$ionicPopup','$ionicLoading' ,function ($ionicPopup,$ionicLoading) {
        return {
            showAlert: function (stitle, sMsg) {
                $ionicPopup.alert({
                  title: stitle,
                  template: sMsg
                });
              },
              showLoading: function (sMsg) {
                $ionicLoading.show({
                  template: sMsg,
                  noBackdrop: true,
                  duration: 2000
                });
              },

              showOperating: function (sMsg) {
                $ionicLoading.show({
                  template: sMsg
                });
              },
              hideOperating: function () {
                $ionicLoading.hide();
              }
      }
    }])
    .service('externalLinksService',function () {
        return {
            openUr: function (url) {
                cordova.ThemeableBrowser.open(url, '_blank', {
                    statusbar: {
                        color: '#0099FF'
                    },
                    toolbar: {
                        height: 44,
                        color: '#0099FF'
                    },
                    title: {
                        color: '#FFFFFF',
                        showPageTitle: true
                    },
                    backButton: {
                        wwwImage: 'img/back_pressed.png',
                        wwwImagePressed: 'img/back_pressed.png',
                        // image: 'back',
                        // imagePressed: 'back_pressed',
                        align: 'left',
                        event: 'backPressed'
                    },
                    closeButton: {
                        wwwImage: 'img/close_pressed.png',
                        wwwImagePressed: 'img/close_pressed.png',
                        // image: 'close',
                        // imagePressed: 'close_pressed',
                        align: 'right',
                        event: 'closePressed'
                    },
                    backButtonCanClose: true
                }).addEventListener('backPressed', function(e) {
//            alert('back pressed');
                }).addEventListener('helloPressed', function(e) {
//            alert('hello pressed');
                }).addEventListener('sharePressed', function(e) {
//            alert(e.url);
                }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
                    //console.error(e.message);
                }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
                   // console.log(e.message);
                });
            }
        }
    })
    .service('actionVisitServices', function (commonServices,CacheFactory) {
        //action访问时间列表
        //调试的时候，如果跨域报错的话，要再刷新一下来运行，以保证初始化正常
        //
        var self=this;
        self.actionVisit = loadCacheVisit();
        self.serverUpdate = [];//ActName,UpdateTime,IsTesting,TestingAccount
        var DEF_UPDATE_VAL = new Date(GLOBAL_INFO.LAST_PUBLISH_DATE);

        var loadServerUpdate = function(){
            var url = commonServices.getUrl("ActionVisitService.ashx", "LoadServerUpdate");
            var params={};
            commonServices.submit(params, url).then(function (resp) {
                if (resp.success) {
                    var srvUpdate = resp.list || [];
                    //use Date
                    for(var i=0; i<srvUpdate.length; i++){
                        var dt = DEF_UPDATE_VAL;
                        try {
                            dt = new Date(srvUpdate[i].UpdateTime);
                        } catch (error) {                            
                        }
                        srvUpdate[i].UpdateTime=dt;
                        var sWorknos = srvUpdate[i].TestingAccount;
                        if(sWorknos){
                            var worknos = sWorknos.split(',');
                            srvUpdate[i].TestingAccount = worknos;
                        }
                    }
                    self.serverUpdate = srvUpdate;
                    console.log("***loadServerUpdate");
                }
            });
        };
        loadServerUpdate();
        
        function FindByActName(arr, actName){
            for(var i=0; i<arr.length; i++){
                var it = arr[i];
                if(it.ActName == actName){
                    return it;
                }
            }
        }
        function loadCacheVisit() {
            var actV = JSON.parse(CacheFactory.get('actionVisit')) || []; //ActName,LastVisitTime
            //use Date
            for (var i = 0; i < actV.length; i++) {
                var dt = DEF_UPDATE_VAL;
                try {
                    dt = new Date(actV[i].LastVisitTime);
                } catch (error) {
                }
                actV[i].LastVisitTime = dt;
            }
            return actV;
        }
        var checkUpdate = function (actName) {
            var actVis = FindByActName(self.actionVisit, actName);
            var lastVistTime = actVis ? actVis.LastVisitTime : DEF_UPDATE_VAL;
            var serUpdate = FindByActName(self.serverUpdate, actName);
            var serUpdateTime = serUpdate ? serUpdate.UpdateTime : null;
            if(serUpdateTime && serUpdateTime>lastVistTime){
                return true;
            }
            return false;
        };
        var visit = function (actName) {
            var actVis = FindByActName(self.actionVisit, actName);
            if(!actVis)
            {
                actVis = {ActName:actName,LastVisitTime:new Date()};
                self.actionVisit.push(actVis);                
            }else{
                actVis.LastVisitTime = new Date();
            }
            CacheFactory.save('actionVisit', self.actionVisit);
        };
        var checkUnVisit = function(actName){
            var actVis = FindByActName(self.actionVisit, actName);
            return !actVis || !actVis.LastVisitTime;
        };
        var getActivityUpdateCount = function(oScope, bMultek){
            //for tab-home.html
            var url = commonServices.getUrl("ActionVisitService.ashx", "GetActivityList"); //[ActID]
            var params={};
            commonServices.submit(params, url).then(function (resp) {
                if (resp.success) {
                    var actLst = resp.list || [];
                    var nNew=0;
                    for(var i=0; i<actLst.length; i++){
                        if( !actLst[i].CanMultek && bMultek)
                        {
                            continue;
                        }
                        if(checkUnVisit(actLst[i].ActID)){
                            nNew++;
                        }
                    }
                    oScope.activityUpdateCount = nNew;
                }
            });
        };
        var getOutDateActivity = function(oScope){
            //for activity-list.html
            var url = commonServices.getUrl("ActionVisitService.ashx", "GetOutDateActivity"); //[ActID,]
            var params={};
            commonServices.submit(params, url).then(function (resp) {
                if (resp.success) {
                    var actLst = resp.list || [];
                    oScope.outDateActivities = actLst;
                }
            });
        };
        var isTesting = function(actName, workNo) {
            var serUpdate = FindByActName(self.serverUpdate, actName);
            if (!serUpdate || !workNo) {
                return false;
            } 
            if(serUpdate.IsTesting && serUpdate.TestingAccount) {
                for(var i=0; i<serUpdate.TestingAccount.length; i++){
                    if (workNo == serUpdate.TestingAccount[i]) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        }
        var canUseAction = function(actName, workNo) {
            var serUpdate = FindByActName(self.serverUpdate, actName);
            if (!serUpdate || !workNo) {
                return false;
            } else if (serUpdate.IsTesting && serUpdate.TestingAccount) {
                for(var i=0; i<serUpdate.TestingAccount.length; i++){
                    if (workNo == serUpdate.TestingAccount[i]) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        };

        return {
            checkUpdate: checkUpdate,
            checkUnVisit: checkUnVisit,
            visit: visit,
            loadServerUpdate: loadServerUpdate,
            getActivityUpdateCount: getActivityUpdateCount,
            getOutDateActivity: getOutDateActivity,
            canUseAction: canUseAction,
            isTesting: isTesting,
        };
    })
    .service('duplicateSubmitServices', function () {
        var genGUID = function () {
            var sguid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c){
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            });
          if (!sguid || 0 == sguid.length) {
            sguid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = Math.random() * 16 | 0;
              var v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
          return sguid;
        };

        return {
            genGUID: genGUID,
        };
    })
;
