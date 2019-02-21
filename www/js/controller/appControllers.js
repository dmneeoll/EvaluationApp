angular.module('evaluationApp.appControllers', [])

    .controller('AppCtrl', function($scope,$rootScope,$ionicSideMenuDelegate, $state,$location, 
        CacheFactory,$ionicHistory, SettingFactory, alertService, commonServices,actionVisitServices) 
    {
        $scope.ver=CacheFactory.get('version');
        $scope.user = JSON.parse(CacheFactory.get('accessUser'));
        actionVisitServices.loadServerUpdate();

        $scope.LanguageItems = [
            { name: "中文", value: "CN" },
            { name: "English", value: "US" }
        ];
        var v = $scope.LanguageItems[0];
        var languageitem = JSON.parse(CacheFactory.get('LanguageItem'));

        if (languageitem == null) {
            $scope.LanguageItem = { item: $scope.LanguageItems[0] }
            $rootScope.Language = ZH_CN;
        } else {
            if (languageitem.value == 'CN') {
                $scope.LanguageItem = { item: $scope.LanguageItems[0] }
                $rootScope.Language = ZH_CN;
            } else {
                $scope.LanguageItem = { item: $scope.LanguageItems[1] }
                $rootScope.Language = ZH_US;
            }
        }

        $scope.languageUpdate = function () {
            CacheFactory.save('LanguageItem', $scope.LanguageItem.item);
            languageitem = JSON.parse(CacheFactory.get('LanguageItem'));
            
            if (languageitem.value == 'CN') {

                $rootScope.Language = ZH_CN;
            } else {

                $rootScope.Language = ZH_US;
            }
        }

        $scope.login = function (user) {

            if (typeof (user) == 'undefined') {
                if($rootScope.Language==ZH_CN)
                alertService.showAlert('工号或密码不能为空');
                else
                    alertService.showAlert('The EmployeeID or password can not be empty');
                return false;
            }
            commonServices.login(user).then(function(data) {
                var result = data;
                if(result.success){
                    CacheFactory.save('accessUser', user);
                    $state.go('tab.home');
                   // $location.path("tab/home");
                }else{
                   alertService.showAlert(result.msg);
//                    alertService.showAlert('6月25号星期天8:00-20:30，系统服务器进行维护，预计12个小时，暂时无法登陆，对此造成的不便，敬请谅解');
                }
            });
        };

        $scope.register=function(){
            $state.go('register');
        };
        $scope.forgetPsw=function(){
            $state.go('forgetPsw');
        }
        $scope.rebindPhone=function(){
            $state.go('rebindPhone');
        }
    })
    .controller('HomeCtrl', function($scope,$rootScope,$ionicHistory,$ionicSlideBoxDelegate,
                $timeout,$state,$ionicPopup,$location,alertService, CacheFactory,
                commonServices,externalLinksService,actionVisitServices) 
    {
        $rootScope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        $ionicHistory.clearHistory()
        var parameter = commonServices.getBaseParas();
        $scope.checkWorkday = '23328424565765889534562582566117';
        $scope.isSouthCamp = isSouthCamp($rootScope.accessEmployee.Organization);
        $scope.isChineseLang = isChineseLang($rootScope);
    console.log(parameter);
//
//
       $rootScope.Power=$scope.checkWorkday.indexOf( $rootScope.accessEmployee.WorkdayNO)!=-1;

//        var url=commonServices.getUrl("MsgService.ashx","GetIsIn38ActivityName");
//        commonServices.getDataNoMask(parameter,url).then(function(data){
//
//            $rootScope.Power=data=='Y'?true:false;
//        });



        if ($rootScope.accessEmployee) {

            $scope.showPopup = function () {

                $rootScope.selPersonType ='中国';

                $rootScope.data = {}
                $rootScope.data.PersonType=$scope.selPersonType;
                $rootScope.PersonTypeUpdate = function (selPersonType) {
                    $rootScope.data.PersonType=selPersonType;

                }



                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/realNameRegistration/IDNOFilling.html',
                    title: $rootScope.Language.realName.title,
                    subTitle: $rootScope.Language.realName.title1,
                    scope: $rootScope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                console.log($rootScope.data.PersonType);
                                if (!$rootScope.data.IDNO) {
                                    //不允许用户关闭，除非他键入wifi密码
                                    console.log(1);
                                    e.preventDefault();
                                }
                                else if($rootScope.data.PersonType=='中国'&&$rootScope.data.IDNO.length!=18) {
                                    alertService.showAlert("身份证信息必须是18位");
                                    e.preventDefault();
                                }else {
                                    console.log(2);
                                    $scope.submitIDNO($rootScope.data.IDNO);
                                    return ;
                                }
                            }
                        }
                    ]
                });
            }

            $scope.submitIDNO=function(IDNO){
                parameter.IDNO=IDNO;
                var url=commonServices.getUrl("EvaluationAppService.ashx","RealNameRegistration");
                commonServices.submit(parameter,url).then(function(data){
                    if(data.success){
                        $rootScope.accessEmployee.strIsHRConfirm='WaitRegistration';
                        CacheFactory.save('accessEmployee', $rootScope.accessEmployee);

                        if($rootScope.Language==ZH_CN)
                            alertService.showAlert('谢谢你的提交，身份证信息需要等待HR确认后，Flex+账户才正式生效');
                        else
                            alertService.showAlert('Thank you for your submission. The ID card information needs to wait for HR confirmation, and the Flex+ account will take effect.');

                    }

                });
            }



            if($rootScope.accessEmployee.strIsHRConfirm=='UnRegistration'||$rootScope.accessEmployee.strIsHRConfirm=='FailedRegistration') {
                $scope.showPopup();

            }


            $scope.Scan = function () {
                //johnsing 2018-09-07
                //cordova.plugins.barcodeScanner.scan(
                //    function (result) {
                //        if (result.wasCancelled) {
                //            popup.loadMsg("返回按钮回到这个页面");
                //        }
                //        if(result.text.indexOf('http')>=0){
                //            externalLinksService.openUr(result.text);
                //        }
                //    },
                //    function (error) {
                //        alert("Scanning failed: " + error);
                //    },
                //    {
                //        preferFrontCamera: false, // iOS and Android
                //        showFlipCameraButton: true, // iOS and Android
                //        showTorchButton: true, // iOS and Android 显示开起手电筒的按钮
                //        torchOn: false, // Android, launch with the torch switched on (if available)  默认开启手电筒
                //        prompt: "请将二维码放在扫描框中", // Android 提示信息
                //        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 多久开始识别
                //        formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                //        orientation: "portrait"// Android only (portrait|landscape), default unset so it rotates with the device 垂直还是水平
                //        // disableAnimations : true // iOS
                //    }
                //);
            };

            commonServices.getHomeSlideImg(parameter).then(function(data) {
                if(data=="Token is TimeOut")
                {
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.homeSlideImg = data;


                $ionicSlideBoxDelegate.$getByHandle("homeSlide").update();
                $timeout(function(){
                    $ionicSlideBoxDelegate.$getByHandle("homeSlide").update();
                }, 10000);
                $timeout(function(){
                    $ionicSlideBoxDelegate.$getByHandle("homeSlide").loop(true);
                }, 10000);

            });

            $rootScope.updateMsgCount=function(){
                commonServices.getMsgCount(parameter).then(function(data){
                    $rootScope.MsgCount=data.MyMsgCount>0?data.MyMsgCount:'';
                    $scope.NoticeCount=data.MyNoticeCount>0?data.MyNoticeCount:'';

                });
            };

            $rootScope.updateMsgCount();

            $rootScope.updateSlideBox=function(){
                $ionicSlideBoxDelegate.$getByHandle("homeSlide").next();
            }


        } else {
            alertService.showAlert('凭证过时，请重新登录');
            $state.go('signin');
        }

        $scope.openNotice=function(homeImg){
           if(homeImg.NoticeID.length>0) {

//               CacheFactory.save('HomeNoticeID',homeImg.NoticeID);
//               $location.path('HomeNotice');
               $rootScope.fromHome='home';
                console.log(homeImg.NoticeID);
              // CacheFactory.remove('noticeID');
               CacheFactory.save('noticeID',homeImg.NoticeID);
               $location.path('noticeHtml');
           }

        };

        $scope.checkActionUpdate=function(action){
            return actionVisitServices.checkUpdate(action);
        }        
        $scope.activityUpdateCount = 0;
        actionVisitServices.getActivityUpdateCount($scope, isMultek($rootScope.accessEmployee.Organization));
        //控制是否显示项，在 ESE_ACTION_UPDATE 表设置
        $scope.canUseAction = function(action){
            return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
        };

        $scope.open=function(action){
            actionVisitServices.visit(action); //save state

            switch (action)
            {
                case "自评":
                      $state.go('tabPoints.rules');
                    break;
                case "金点子":
                    $state.go("tabGoldIdea.goldidea");
//                    $location.path("handbook_item1");
                    break;
                case "E-gate":
                try {

                    externalLinksService.openUr('https://zhmobile.flextronics.com/egate/Login/Signin.aspx');
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
                break;
                case "员工手册":
                    $state.go("handbook_lg");
                    break;
                case "报名":
                    $state.go("apply");
                    break;
                case "CSER":
                    $state.go("cser");
                    break;
                case "map":
                    $state.go("baiduMap");
                    break;
                case "choujiang":
                   $state.go("choujiang");
                  //  $state.go("choujiangName");
                    break;
                case "chunwan":
                    $state.go("chunwan");
                    break;
                case "GBS":/*人事综合*/
                    $state.go("GBS");
                    break;
                case "earthday":
                    $state.go("earthWeekNoticeList");
                    break;
                case "admin":
                    $state.go("admin");
                    break;
                case "工会之窗":
                    $state.go("union");
                    break;
                case "MECH基金会":
                    $state.go("mechCharity");
                    break;
            }
            
            if(action=='自评'){
                $state.go('tabPoints.rules');
            }else if(action=='金点子'){
                $state.go("tabGoldIdea.goldidea");
            }
            else if(action=="为TA点赞"){
                $location.path("tab/goodJob");
            }
            else if(action=="考勤查询"){
                //$state.go("tabKQCX.kqjl");
                $location.path("tab/kqjl");
            }
            else if(action=="消费查询"){
                $location.path("tab/cust");
            }
            else if(action=="内部招聘"){

//                try {
////                    window.open('https://appcentermobile.flextronics.com/mobileac/www/login.html', '_blank', 'location=no');
////                    window.cordova.InAppBrowser.open('https://appcentermobile.flextronics.com/mobileac/www/login.html');
//
//                        //window.cordova.InAppBrowser.open('http://insight.flextronics.com/t/LASI/views/ZhuhaiVoluntary/ZhuhaiVoluntary?:embed=y&:showShareOptions=true&:display_count=no&:showVizHome=no','_blank','location=no');
//                    externalLinksService.openUr('https://zhmobile.flextronics.com/EvaluationApp/download/13.pdf');
//                }
//                catch (ex) {
//                    alertService.showAlert(ex.message);
//                }



                var timestamp = Date.parse(new Date());
                externalLinksService.openUr('https://zhmobile.flextronics.com/InterHiringApp/www/interhr.html?workdayNo='+$scope.accessEmployee.WorkdayNO+'&timestamp='+timestamp);

                //记录点击
                var paras1= commonServices.getBaseParas();
                paras1.opType='内部招聘';
                paras1.opContent='点击进入';
               var paras1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,opType:'内部招聘',opContent:'点击进入'};
                commonServices.operationLog(paras1).then(function(data){
                    $scope.sucess=data;
                });

            }
            else if(action=="园区公告"){
                $location.path("noticeList");

            }
            else if(action=="热线电话"){
                if($rootScope.accessEmployee.Segment_ID!='EF922594-5FB1-409E-A3D8-F7BC940AACD9'){
                    $location.path("b15hotPhone");
                }
//                if($rootScope.accessEmployee.Organization=='Campus Resource B15'){
//                    $location.path("b15hotPhone");
//                }
//                else if($rootScope.accessEmployee.Organization=='Regional Resource B15'){
//                    $location.path("b15hotPhone");
//                }
//                else if($rootScope.accessEmployee.Organization=='PCBA 57'){
//                    $location.path("b15hotPhone");
//                }
                else
                {
                    $location.path("hotPhone");
                }

            }
            else if(action=="活动"){


//                if($rootScope.accessEmployee.Segment_ID=='EF922594-5FB1-409E-A3D8-F7BC940AACD9'){
//                    $state.go("luckyGame");
//                }
//
//                else if($rootScope.Power)
//                {
//                    $state.go("luckyGame");
//                }
//                else
//                {
//                    $location.path("activityList");
//                }

//                if($rootScope.Power)
//                {
//                    $state.go("38Activity");
//                }
//                else
//                {
//                    $location.path("activityList");
//                }

                $location.path("activityList");

            }
            else if(action=="聊天室"){
                $location.path("chartRoom");

            }
            else if(action=="问与答"){
                $location.path("askAndAnswer");

            }
            else if(action=="灯光控制"){
                $location.path("lightPower");

            }
            else if(action=="抽奖"){
                $location.path("choujiang");

            }
            else if(action=="拍照"){
                $location.path("Photo");
            }
            else if(action=="testPage"){
                $state.go('testPage');
            }
            else if(action=="问卷调查"){
               $location.path("researchList");
                //$state.go("tab.404");
            }
            else if(action=="失物招领"){
                $state.go("tab_LostFound.List");
             }
            else if(action=="我要求助"){
                $state.go("tabAskForHelp.askForHelp");
            }
            else if(action=="shareCar"){
                $state.go("tab_ShareCar.List");
                $ionicPopup.show({
                    title: 'Flex汽车共享信息服务协议',
                    cssClass:'my-custom-popup-Alter',
                    templateUrl: 'templates/shareCar/protocolHtml.html',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                return ;
                            }
                        }
                    ]
                });

            }
            else if(action=="B11Workshop"){
                $state.go("b11WorkShopHome");
            }

        }
    })
    .controller('RegCtrl', function($scope,$rootScope,$location,$ionicLoading,commonServices,alertService) {
        $scope.passmodels = {
            workdayNo:null,
            CName:null,
            IDNO:null,
            mobile: null,
            securityCode: null,
            newPassword: null,
            newPasswordAgain: null
        };
        $scope.closePass = function () {
            $location.path('signin');
        };

        if($rootScope.Language==ZH_CN)
            $scope.btnText='获取验证码';
        else
            $scope.btnText='Get the verifying code';

        $scope.getSecurityCode=function(passmodels){

            if(!isValidMobile(passmodels.mobile)) {
                if($rootScope.Language==ZH_CN)
                    alertService.showAlert('请输入正确的手机号');
                else
                    alertService.showAlert('Please enter the correct cell phone number');

                return false;
            };
            if(isEmptyString(passmodels.workdayNo)) {
                if($rootScope.Language==ZH_CN)
                    alertService.showAlert('请输入工号');
                else
                    alertService.showAlert('Please enter the employeeid');
                return false;
            };
            if(isEmptyString(passmodels.CName)) {
                if($rootScope.Language==ZH_CN)
                    alertService.showAlert('请输入姓名');
                else
                    alertService.showAlert('Please enter the name');
                return false;
            };


            commonServices.getSecurityCode({WorkdayNo:passmodels.workdayNo,CName:passmodels.CName,Mobile:passmodels.mobile}).then(function (response) {

                if (response.success) {
                    var oBtn = document.getElementById('btnSecurity');
                    oBtn.disabled = 'disabled';
                    var i=60;
                    $ionicLoading.show({ template: '验证码已发送', noBackdrop: true, duration: 2000 });
                    var id= setInterval(function(){
                        i=i-1;
                        $scope.$apply(function(){
                            $scope.btnText=i+'秒后重新获取';
                        });
                        if(i==0){
                            $scope.$apply(function(){
                                $scope.btnText='获取验证码';
                            });
                            oBtn.disabled=false;
                            clearInterval(id);
                        };
                    },1000);//1000为1秒钟

                }
                else  {
                    alertService.showAlert( response.message);
                }
            });
        };

        $scope.checkSecurityCode=function(passmodels){

            try{
                if($rootScope.Language==ZH_CN){
                    if($scope.passmodels.IDNO ==null){
                        alertService.showAlert("身份证号码必须是18位")
                        return;
                    }
                    if(typeof ($scope.passmodels.IDNO) == 'undefined'){
                        alertService.showAlert("身份证号码必须是18位")
                        return;
                    }

                    if($scope.passmodels.IDNO.length!=18){
                        alertService.showAlert("身份证号码必须是18位")
                        return;;
                    }
                }


                commonServices.checkSecurityCode({WorkdayNo:passmodels.workdayNo,Mobile:passmodels.mobile,SecurityCode:passmodels.securityCode}).then(function (response) {
                    if (response.success) {
                        document.getElementById("message").style.display="none";//显示
                        document.getElementById("reg").style.display="";//显示
                    }
                    else  {
                        alertService.showAlert( response.message);
                    }
                });


            }catch(e)
            {

            }


        }

        $scope.register=function(passmodels){

            try{
                if(passmodels.newPassword==null){
                    alertService.showAlert( '密码不能为空！');

                    return;
                }

                if(passmodels.newPassword.replace(""," ").length==0){
                    alertService.showAlert( '密码不能为空！');
                    return;
                }

                if(passmodels.newPassword!=passmodels.newPasswordAgain){
                    alertService.showAlert( '两次密码不一致！');
                    return;
                }

                commonServices.register({WorkdayNo:passmodels.workdayNo,IDNO:passmodels.IDNO,Password:passmodels.newPassword}).then(function (response) {
                    if (response.success) {
                        alertService.showAlert( '注册成功，请重新登录！');

                        $location.path('signin');
                    }
                    else  {
                        alertService.showAlert( response.message);
                    }
                });
            }catch(e)
            {

            }


        };

    })
    .controller('ForgetPswCtrl',  function($scope,$location,$ionicLoading,alertService,commonServices) {


        $scope.passmodels = {
            workdayNo:null,
            mobile: null,
            securityCode: null,
            newPassword: null,
            newPasswordAgain: null
        };
        $scope.btnText='获取验证码';
        $scope.closePass = function () {
            console.log($scope.passmodels);
            $location.path('signin');
        };

        $scope.getSecurityCode=function(passmodels){

            commonServices.getForgetPswSecurityCode({WorkdayNo:passmodels.workdayNo,Mobile:passmodels.mobile}).then(function (response) {
                if (response.success) {
                    var oBtn = document.getElementById('btnSecurity');
                    oBtn.disabled=true;
                    var i=60;
                    $ionicLoading.show({ template: '已发送验证码到登记的手机号码上！', noBackdrop: true, duration: 2000 });
                    var id= setInterval(function(){
                        i=i-1;
                        $scope.$apply(function(){
                            $scope.btnText=i+'秒后重新获取';
                        });

                        if(i==0){
                            $scope.$apply(function(){
                                $scope.btnText='获取验证码';
                            });
                            oBtn.disabled=false;
                            clearInterval(id);
                        };
                    },1000);//1000为1秒钟
                }
                else  {
                    alertService.showAlert(  response.message);
                }
            });
        };


        $scope.checkSecurityCode=function(passmodels){
            try{
                commonServices.checkSecurityCode({WorkdayNo:passmodels.workdayNo,Mobile:passmodels.mobile,SecurityCode:passmodels.securityCode}).then(function (response) {
                    if (response.success) {
                        document.getElementById("message").style.display="none";//显示
                        document.getElementById("reg").style.display="";//显示

                    }
                    else  {
                        alertService.showAlert(  response.message);
                    }
                });
            }catch(e)
            {

            }

        }

        $scope.register=function(passmodels){

            try{
                if(passmodels.newPassword==null){
                    alertService.showAlert( '密码不能为空！');
                    return;
                }
                if(passmodels.newPassword.replace(""," ").length==0){
                    alertService.showAlert( '密码不能为空！');
                    return;
                }
                if(passmodels.newPassword!=passmodels.newPasswordAgain){
                    alertService.showAlert('两次密码不一致！');
                    return;
                }

                commonServices.register({WorkdayNo:passmodels.workdayNo,Password:passmodels.newPassword}).then(function (response) {
                    if (response.success) {
                        alertService.showAlert('密码修改成功，请重新登录');
                        $location.path('signin');
                    }
                    else  {
                        alertService.showAlert( response.message);
                    }
                });
            }catch(e)
            {

            }



        };
    })
    .controller('RebindPhoneCtrl',  function($scope,$rootScope,$location,$ionicLoading,alertService,commonServices) {
        // 修改绑定手机号
        $scope.btnText = '获取验证码';

        $scope.rebindModels = {
            workdayNo: null,
            IDNO:null,
            mobile: null,
            securityCode: null
        };
        
        $scope.closePage = function () {
            $location.path('signin');
        };

        $scope.getSecurityCode = function() {
            var workdayNo = $.trim($scope.rebindModels.workdayNo);
            var mobile = $.trim($scope.rebindModels.mobile)
            $scope.rebindModels.workdayNo = workdayNo;
            $scope.rebindModels.mobile = mobile;

            commonServices.getPhoneSecurityCode({WorkdayNo:workdayNo, Mobile:mobile}).then(function (response) {
                if (response.success) {
                    var oBtn = document.getElementById('btnSecurity');
                    oBtn.disabled = true;
                    var i = 60;
                    $ionicLoading.show({ template: '已发送验证码到指定的手机号码上！', noBackdrop: true, duration: 2000 });
                    var id = setInterval(function () {
                        i = i - 1;
                        $scope.$apply(function () {
                            $scope.btnText = i + '秒后重新获取';
                        });

                        if (i == 0) {
                            $scope.$apply(function () {
                                $scope.btnText = '获取验证码';
                            });
                            oBtn.disabled = false;
                            clearInterval(id);
                        };
                    }, 1000);//1000为1秒钟
                }
                else {
                    alertService.showAlert(response.message);
                }
            });
        };

        $scope.doSubmit = function(model){
            var workdayNo = $.trim($scope.rebindModels.workdayNo);
            var mobile = $.trim($scope.rebindModels.mobile);
            var idno = $.trim($scope.rebindModels.IDNO);
            if(0==workdayNo.length)
            {
                alertService.showAlert($rootScope.Language.rebindPhone.errWorkdayNo);
                return;
            }
            if(0==idno.length)
            {
                alertService.showAlert($rootScope.Language.rebindPhone.errIdno);
                return;
            }
            if(0==mobile.length || mobile.length<11)
            {
                alertService.showAlert($rootScope.Language.rebindPhone.errMobile);
                return;
            }

            commonServices.checkSecurityCode({WorkdayNo:model.workdayNo, Mobile:model.mobile, SecurityCode:model.securityCode}).then(function (response) {
                if (response.success) {
                    //有效验证码
                    var url = commonServices.getUrl("AccountService.ashx", "RebindPhone");
                    var paras = {
                        WorkdayNo: model.workdayNo,
                        Mobile: model.mobile,
                        IDNO: model.IDNO
                    };
                    commonServices.submit(paras, url).then(function (data) {
                        if (data.success) {
                            alertService.showAlert('修改绑定手机号成功!');
                            $location.path('signin');
                        }
                        else {
                            alertService.showAlert(data.message);
                        }
                    });
                }
                else  {
                    alertService.showAlert(response.message);
                }
            });   
        };
    })
    .controller('PassCtrl', function($scope,$state,$location,$ionicPopup,IonicService,CacheFactory) {
        $scope.passmodels = {
            workdayNo:null,
            mobile: null,
            securityCode: null,
            newPassword: null,
            newPasswordAgain: null
        };
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        $scope.closePass = function () {
            console.log($scope.passmodels);
            $state.transitionTo('menu.tab.home');
        };
        $scope.setPass=function(passmodels){

            try{

                if (passmodels.password == null) {
                    warningForm(null, "当前密码不能为空！");
                    return ;
                }
                if (passmodels.newPassword == null) {
                    warningForm(null, "新密码不能为空！");
                    return;
                }
                if (passmodels.newPasswordAgain == null) {
                    warningForm(null, "重复密码和新密码输入不同！");
                    return;
                }

                IonicService.postToServer({WorkdayNO: $scope.accessEmployee.WorkdayNO,OldPassword:passmodels.password,Password:passmodels.newPassword},API.RestPassword).then(function (response) {
                    if (response.success) {
                        $ionicPopup.alert({title:'提示',template: '修改完成，请重新登录'
                        });
                        $location.path('signin');
                    }
                    else  {
                        $ionicPopup.alert({title:'提示',template:  response.message
                        });
                    }
                });
            }catch(e){

            }

        };

    })
    .controller('AccountCtrl', function($scope,$rootScope,$location,$state,$cordovaAppVersion,$ionicHistory,CacheFactory) {

        $cordovaAppVersion.getVersionNumber().then(function (version) {
            $scope.version= version;
        });
        $scope.realName="";
        switch ($rootScope.accessEmployee.strIsHRConfirm){
            case 'UnRegistration':
                $scope.realName='未认证';
                break;
            case 'WaitRegistration':
                $scope.realName='等待HR认证';
                break;
            case 'Registration':
                $scope.realName='已认证';
                break;
            case 'FailedRegistration':
                $scope.realName='认证不通过';
                break;
        }
        // 退出
        $scope.signOut = function () {
//            CacheFactory.remove('accessToken');
//            CacheFactory.remove('accessEmployee');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $location.path('signin');
            //$state.go("signin");

        };
        $scope.quit = function () {
            ionic.Platform.exitApp();
        }
        $scope.modifyPsw=function(){
            $state.go('tab.password');
        }
        $scope.Money=function(){
            $state.go('myAccountMoney');
        }

        var accessEmployee = $rootScope.accessEmployee;
        //$scope.canShow = IsTestAccount(accessEmployee.WorkdayNO); //!for test
        $scope.rebindPhone=function(){
            $state.go('rebindPhone');
        }
        
    })
;
