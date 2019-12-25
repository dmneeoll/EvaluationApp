/**
 * 用于Admin及相关子菜单
 * johnsing he 2018-06-29
 */
angular.module('evaluationApp.adminControllers', [])
    .controller('AdminCtrl', function ($scope, $rootScope, $state, $ionicHistory,$ionicPopup,
        commonServices, CacheFactory, alertService, actionVisitServices, externalLinksService
        ) 
    {
        $scope.canUseAction = function (action) {
          return actionVisitServices.canUseAction(action, commonServices.getCurrentWorkdayNo());
        };
        $scope.checkActionUpdate = function (action) {
          return actionVisitServices.checkUpdate(action);
        };

        $scope.isCanCarCheck = commonServices.CanLimitUse(GLOBAL_INFO.LIMIT_USE_CARCHECK);
        //===================================
        $scope.open = function (action) {
            actionVisitServices.visit(action); //save state
            switch (action) {
                case "班车信息":
                    $state.go("Carlist");
                    break;
                case "班车信息new":
                    {
                        var sUrl = 'https://wx.zhchuangyi.com/flex/wx/index/line_area';
                        //$scope.openGeneralNotice(true, 0, sUrl);
                        try {
                            externalLinksService.openUrNoTitle(sUrl);
                          } catch (ex) {
                            alertService.showAlert(ex.message);
                          }
                    }
                    break;
                case "点餐":
                    {
                        $state.go("tabMealOrder.mealList");
                        //$state.go("tab.404");
                    }
                    break;
                case "挂失IC卡":
                    $state.go('icCardLost');
                    break;
                case "dormManage":
                    $state.go('dormManage');
                    break;
                case "餐厅菜单":
                    $state.go('canteenImg');
                    break;   
                case "EAdmin":
                     $state.go('EAdminList');
                    break;
                case "车辆点检":
                    $state.go('carCheck');
                    break;
                case "车辆点检记录":
                    $state.go('carCheckRecord');
                    break;
                default: break;
            }
        }
        $scope.closePass = function () {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

        $scope.openGeneralNotice = function(isUrlHtml, id, html){
            if(isUrlHtml){
                //打开外链
                try {
                    externalLinksService.openUr(html);
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
            }else{
                CacheFactory.remove('gnID');
                CacheFactory.save('gnID', id);
                $state.go("generalNoticeDetail");
            }
        };
    })
    /*sub of AdminCtrl*/
    .controller('CarListCtrl',function($scope,$state,$ionicHistory,commonServices,CacheFactory,alertService,externalLinksService)
    {
        //班车信息
        var params=commonServices.getBaseParas();
        var url=commonServices.getUrl("MapService.ashx","GetCarList");
        $scope.openGeneralNotice = function(isUrlHtml, id, html){
            if(isUrlHtml){
                //打开外链
                try {
                    externalLinksService.openUr(html);
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
            }else{
                CacheFactory.remove('gnID');
                CacheFactory.save('gnID', id);
                $state.go("generalNoticeDetail");
            }
        };

        //获取car列表
        commonServices.getDataList(params,url).then(function(data){
            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.carList=data;
            console.log($scope.carList)
        });
        $scope.open=function(car){            
            CacheFactory.remove('car');
            CacheFactory.save('car',car);
            $state.go("CarMap");
        };
        $scope.openBusTime=function(){
            //$state.go("carBusTime");
            $scope.openGeneralNotice(0, '51586037-E097-4080-B571-85B433DF8070');
        };
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('admin');
        }
    })
    // .controller('CarPictureCtrl', function($scope,CacheFactory,commonServices,$state,$ionicHistory) {
    //     $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
    //     //记录点击
    //     var paras1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,opType:'班车查询',opContent:'点击进入'};
    //     commonServices.operationLog(paras1).then(function(data){
    //         $scope.sucess=data;
    //     });

    //     $("#auto-loop").lightGallery({
    //         mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
    //         mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
    //         swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).
    //         hideControlOnEnd : false,
    //         closable:false
    //     });

    //     $scope.closePass=function(){
    //         $ionicHistory.nextViewOptions({
    //             disableAnimate: true,
    //             disableBack: true
    //         });
    //         $state.go('admin');
    //     }
    // })
    .controller('MealListCtrl',function($scope,$rootScope,$state,$ionicModal,$ionicHistory,commonServices,CacheFactory,alertService,$ionicPopup)
    {
        //点餐
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/mealOrder/mealProtocolHtml.html',
            cssClass: 'my-custom-popup-Alter',
            title: '订餐须知',
            subTitle: '',
            scope: $scope,
            buttons: [
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return;
                    }
                }
            ]
        });

        var params=commonServices.getBaseParas();
        $scope.MobileNo=$rootScope.accessEmployee.MobileNo;

        commonServices.getDataList(params,API.GetMealList).then(function(data){
            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.mealList=data;
            console.log( $scope.mealList);
        });

        $scope.SubmitList=[];
        $scope.MealCount=0;
        $scope.MealPay=0;

        $scope.cutDown=function(meal){
            if(meal.Count>0){
                meal.Count=meal.Count-1
                $scope.MealCount=$scope.MealCount-1;
                $scope.MealPay=$scope.MealPay-meal.Price;

                // console.log(meal);
                // console.log($scope.SubmitList);

                for(var i=0;i<$scope.SubmitList.length;i++){
                    if($scope.SubmitList[i].id==meal.id){
                        $scope.SubmitList[i].Count=$scope.SubmitList[i].Count-1;
                        if( $scope.SubmitList[i].Count==0){
                            $scope.SubmitList.splice(i,1);
                        }
                        break;
                    }
                    //console.log($scope.SubmitList);
                }
            }
        };

        $scope.add=function(meal){
            meal.Count=meal.Count+1;
            $scope.MealCount=$scope.MealCount+1;
            $scope.MealPay=$scope.MealPay+meal.Price;
            var isOK=false;
            for(var i=0;i<$scope.SubmitList.length;i++){
                if($scope.SubmitList[i].id==meal.id){
                    $scope.SubmitList[i].Count=$scope.SubmitList[i].Count+1;
                    isOK=true;
                    break;
                }
            }

            if(isOK==false){
                $scope.SubmitList.push({id:meal.id,foodName:meal.foodName,Count:meal.Count,Price:meal.Price});
            }
            //console.log($scope.SubmitList);
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('admin');
        };

        $scope.like = function (meal) {
            params.foodName = meal.foodName;
            params.isLike = '1';
            var url = commonServices.getUrl("MealOrder.ashx", "AddLike");
            commonServices.submit(params, url).then(function (data) {
                if (data.success) {
                    meal.LikeQty = meal.LikeQty + 1;
                }
                else {
                    alertService.showLoading(data.message);
                }
            });
        };

        $scope.unLike = function (meal) {
            params.foodName = meal.foodName;
            params.isLike = '0';
            var url = commonServices.getUrl("MealOrder.ashx", "AddLike");
            commonServices.submit(params, url).then(function (data) {
                if (data.success) {
                    meal.UnLikeQty = meal.UnLikeQty + 1;
                } else {
                    alertService.showLoading(data.message);
                }
            });
        };

        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        });
        $scope.openModal = function() {
            if($scope.MealCount==0){
                alertService.showAlert("请选择后再下单");
                return;
            }
            $scope.modal.show();
            var now = new Date();
            var str = now.getFullYear() + "-" + fix((now.getMonth() + 1),2) + "-" + fix(now.getDate(),2) + "T" + fix(now.getHours(),2) + ":" + fix(now.getMinutes(),2)+ ":" + fix(now.getSeconds(),2);

            $("#lcTime").val(str);
        };
        function fix(num, length) {
            return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
        }
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.mealPerson="请选择";
        $scope.selMealPerson=function(mealPerson){
            $scope.mealPerson=mealPerson;
        };

        $scope.submit=function(){
            var selTime = $("#lcTime").val(); //获取
            if(selTime.length==0)
            {
                alertService.showAlert("请选择就餐时间");
                return;
            }
            if($scope.mealPerson=="请选择"){
                alertService.showLoading("请选择就餐人数");
                return;
            }

            params.SubmitList=$scope.SubmitList;
            params.sMobile=$scope.MobileNo;
            params.MealCount=$scope.MealCount;
            params.MealPay=$scope.MealPay;
            params.MealTime=selTime;
            params.bz=$("#bz").val();
            params.mealPerson=$scope.mealPerson;
            //console.log(params);
            var url=commonServices.getUrl("MealOrder.ashx","SubmitOder");
            commonServices.submit(params,url).then(function(data){
                if(data.success){
                    $scope.modal.hide();
                    $state.go("tabMealOrder.myOrder");
                }
                else{
                    alertService.showAlert(data.message);
                }
            });
        }
    })
    .controller('MealLinkManCtrl',function($scope,$state,$ionicHistory,commonServices,CacheFactory,alertService)
    {
        var params=commonServices.getBaseParas();
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('admin');
        }
    })
    .controller('MyOrderCtrl',function($scope,$state,$ionicHistory,commonServices,CacheFactory,alertService)
    {
        var params=commonServices.getBaseParas();
        $scope.load=function(){
            var url=commonServices.getUrl("MealOrder.ashx","GetMyOrderList");
            commonServices.getDataList(params,url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.myOrderList=data;
            });
        }

        $scope.load();

        $scope.cancelOrder=function(number,mealTime){
            var url=commonServices.getUrl("MealOrder.ashx","CancelOrder");
            params.number=number;
            params.mealTime=mealTime;
            commonServices.submit(params,url).then(function(data){
                if(data.success){
                    alertService.showAlert("取消成功");
                }
                else{
                    alertService.showAlert(data.message);
                }
                $scope.load();
            });
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('admin');
        }
    })
    .controller('ICCardLostCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService) 
    {
        //挂失IC卡
        $scope.canUseAction = function (action) {
            return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
        };

        var paras = commonServices.getBaseParas();
        $scope.model = {
            CName: paras.CName,
            WorkdayNO: paras.WorkdayNO,
            MobileNo: paras.MobileNo
        };

        function GetLastLostICCardState() {
            var paras = $scope.model;
            var url = commonServices.getUrl("AdminService.ashx", "GetLastLostICCardState");
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    $scope.LastState = resp.obj; //{upDATEdt, upDATEflag}
                    switch (resp.obj.upDATEflag) {
                        case 1:
                            $scope.LastState.State = '正在执行中';
                            $scope.canSubmit = false;
                            break;
                        case 99:
                            $scope.LastState.State = '已完成';
                            $scope.canSubmit = true;
                            break;
                        default:
                            $scope.LastState.State = null;
                            $scope.canSubmit = true;
                            break;
                    }
                }
            });
        }
        GetLastLostICCardState();

        $scope.HasLastState = function () {
            return $scope.LastState && $scope.LastState.State;
        }

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;

            // var idno = $.trim($scope.model.IDNO);
            // if (idno.length == 18) {
            //     if (!CheckIdCard(idno)) {
            //         alertService.showAlert("身份证号码有误，请更正!");
            //         return;
            //     }
            // }
            // else if (!idno || !idno.length) {
            //     alertService.showAlert( $rootScope.Language.common.InfoProvideIDNO);
            //     return;
            // }
            // $scope.model.IDNO = idno;
            var confirmPopup = $ionicPopup.confirm({
                title: $rootScope.Language.admin.promptTitle,
                template: $rootScope.Language.admin.promptReportLost,
                okText: $rootScope.Language.admin.promptOK,
                cancelText: $rootScope.Language.admin.promptCancel
            });

            confirmPopup.then(function (res) {
                if (res) {
                    var paras = $scope.model;
                    var url = commonServices.getUrl("AdminService.ashx", "SubmitLostICCard");
                    commonServices.submit(paras, url).then(function (data) {
                        if (data.success) {
                            alertService.showAlert($rootScope.Language.admin.submitSucc);
                            $ionicHistory.goBack();
                        }
                        else {
                            alertService.showAlert(data.message);
                        }
                    });
                }
                $scope.isSumbiting = false;
            });
        };

        // $scope.closePass = function () {
        //     $ionicHistory.nextViewOptions({
        //         disableAnimate: true,
        //         disableBack: true
        //     });
        //     $state.go('tab.home');
        // };
    })
    .controller('DormManageCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                commonServices, CacheFactory, alertService, actionVisitServices, externalLinksService) 
    {        
        //宿舍管理
        $scope.canUseAction = function (action) {
          return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
        };
        $scope.checkActionUpdate = function (action) {
          return actionVisitServices.checkUpdate(action);
        };
        $scope.openGeneralNotice = function(isUrlHtml, id, html){
            if(isUrlHtml){
                //打开外链
                try {
                    externalLinksService.openUr(html);
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
            }else{
                CacheFactory.remove('gnID');
                CacheFactory.save('gnID', id);
                $state.go("generalNoticeDetail");
            }
        };

        $scope.open=function(action){
            actionVisitServices.visit(action); //save state
            switch (action) {
                case "宿舍热线":
                    $state.go('dormHotline');
                    break;
                case "住房津贴":
                    $state.go('housingAllowance');
                    break;
                case "入住须知":
                    $state.go('dormNoticeProtocol');
                    break;                    
                case "宿舍申请":
                    $state.go('applyDorm');
                    break;
                case "费用查询":
                    $state.go('chargingDefine');
                    break;
                case "宿舍公告":
                    $state.go('dormNotice');
                    break;
                case "宿舍地图":
                    //$state.go('dormMap');
                    $scope.openGeneralNotice(0, '671705D6-DEAE-4B19-9969-ABED6400F251');
                    break;
                case "臭虫防治须知":
                    $scope.openGeneralNotice(0, 'D71A0AE7-5C4C-4573-9F78-A6FD82F76BCA');
                    break;
                case "宿舍报修":
                    $state.go('repairDorm');
                    break;
                case "补办钥匙":
                    $state.go('reissueKey');
                    break;
                case "免费WIFI使用指引":
                    $state.go('freeDormWifi');
                    break;
                case "宿舍常见问题":
                    $state.go('dormAskAndAns');
                    break;
                case "建议箱":
                    $state.go('dormSuggest');
                    break;
                default: break;
            }
        }
        // $scope.closePass = function () {
        //     $ionicHistory.nextViewOptions({
        //         disableAnimate: true,
        //         disableBack: true
        //     });
        //     $state.go('tab.home');
        // };
    })
    .controller('DormHotlineCtrl', function ($scope, $state, $ionicHistory, commonServices) {
        $scope.contacts = [{
            dormArea: "北厂宿舍",
            basePhone: "18926985305"
          },
          {
            dormArea: "南厂宿舍",
            basePhone: "18926980025" 
          },
          {
            dormArea: "三洲本土宿舍",
            basePhone: "18926980019" 
          },
          {
            dormArea: "山水豪苑（别墅区）",
            basePhone: "18926980027" 
          }
        ];
    })
    .controller('HousingAllowanceCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService, duplicateSubmitServices) 
    {
        //住房津贴
        var paras= commonServices.getBaseParas();
        $scope.canSubmit=false;
        $scope.hasAllowance=false;
        $scope.model = {
            SubmitGuid: duplicateSubmitServices.genGUID(),
            CName: paras.CName,
            WorkdayNO: paras.WorkdayNO,
            Organization: paras.Organization,
            hiredDate: null,
            EmployeeType: null,
            checkInState: null,
            checkOutDate: "",
            memo: ""
        };

        $scope.dormStates = [
            {name:"未住宿舍", value:0},
            {name:"住宿", value:1},
            {name:"退宿", value:-1},
        ];
        function InitInfo() {
            var url = commonServices.getUrl("DormManageService.ashx", "InitDormAllowance");
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(!resp.success){
                        var his = JSON.parse(resp.data);
                        if(his && his.HasAllowance>0){
                            $scope.hasAllowance=true;
                            $scope.EffDate=his.EffDate;
                        }else{
                            alertService.showAlert(resp.message);
                            $ionicHistory.goBack();
                        }
                    }else{                        
                        $scope.model.hiredDate = resp.obj.HireDate;
                        $scope.model.EmployeeType = resp.obj.EmployeeType;
                        var checkInState = resp.obj.CheckInState
                        if(checkInState<0){
                            $scope.model.checkOutDate = resp.obj.CheckOutDate;
                        }
                        $scope.model.checkInState = checkInState;
                        $scope.canSubmit=true;
                    }
                }
            });
        }
        InitInfo();

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;

            if (1 == $scope.model.checkInState) {
                alertService.showAlert("已住宿员工不能申请住房津贴!");
                $scope.isSumbiting = false;
                return;
            }
            else if (-1 == $scope.model.checkInState
                    && 0 == $scope.model.checkOutDate.length) {
                alertService.showAlert("请填写退宿日期!");
                $scope.isSumbiting = false;
                return;     
            }

            var paras = $scope.model;
            var url = commonServices.getUrl("DormManageService.ashx", "SubmitHousingAllowance");
            try {
                commonServices.submit(paras, url).then(function (resp) {
                    if (resp.success) {
                        var msg = $rootScope.Language.dormManage.allowanceSucc + resp.message;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    }
                    else {
                        alertService.showAlert(resp.message);
                    }
                });
            } finally {
                $scope.isSumbiting = false;
            }
        };
    })
    .controller('ApplyDormCtrl', function ($scope, $rootScope, $state, $ionicHistory,$ionicPopup, 
                                            commonServices, CacheFactory, alertService, duplicateSubmitServices) 
    {
        //宿舍申请
        var paras = commonServices.getBaseParas();
        $scope.canSubmit = false;
        $scope.model = {
            SubmitGuid: duplicateSubmitServices.genGUID(),
            CName: paras.CName,
            WorkdayNO: paras.WorkdayNO,
            MobileNo: paras.MobileNo,
            Organization: paras.Organization,
            Grade: null,
            DormArea: null,
            RequireType:null,
            RequireReason:null,
            HasHousingAllowance:null,
            memo: ""
        };
       
        $scope.protocol = {
            IsAggree:0
        };
        function InitInfo() {
            $ionicPopup.show({
                title: '入住宿舍承诺书',
                cssClass:'my-custom-popup-Alter',
                templateUrl: 'templates/admin/dorm/protocolDorm.html',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if(!$scope.protocol.IsAggree){
                                alertService.showLoading("请接受承诺书！");
                                e.preventDefault();
                            }else{
                                return;
                            }                            
                        }
                    }
                ]
            });

            var grades=[];
            for(var i=0;i<7;i++){
                grades.push(i+1);
            }
            for(var i=20;i<25;i++){
                grades.push(i+1);
            }
            $scope.grades=grades;
            $scope.requireTypes=[];
            $scope.requireTypes.push({name:"新入住",value:1});
            $scope.requireTypes.push({name:"复入住",value:2});
            $scope.requireTypes.push({name:"调房",value:3});

            var yesNo=[];
            yesNo.push({name:"是",value:true});
            yesNo.push({name:"否",value:false});
            $scope.yesNo=yesNo;

            var url = commonServices.getUrl("DormManageService.ashx", "BeforeApplyDorm");
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(!resp.success){
                        alertService.showAlert("获取宿舍区失败，无法申请");
                        $ionicHistory.goBack();
                    }else{                        
                        $scope.dormAreas = resp.list; //ID,SiteID,Name
                        var hasHousingAllowance = !!resp.data;
                        if(hasHousingAllowance){
                            $scope.yesNo = [{name:"是",value:true}];
                            $scope.model.HasHousingAllowance = hasHousingAllowance;
                        }
                        $scope.canSubmit=true;
                    }
                }
            });
        }
        InitInfo();

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;

            var sMobile = $.trim($scope.model.MobileNo);
            $scope.model.MobileNo=sMobile;
            if (!sMobile || sMobile.length<5) {
                alertService.showAlert("请提供联系电话!");
                $scope.isSumbiting = false;
                return;
            }            
            if (!$scope.model.Grade) {
                alertService.showAlert("请提供你的薪资级别!");
                $scope.isSumbiting = false;
                return;     
            }
            if (!$scope.model.DormArea) {
                alertService.showAlert("请选择拟入住的宿舍区!");
                $scope.isSumbiting = false;
                return;     
            }
            if (!$scope.model.RequireType) {
                alertService.showAlert("请选择入住类型!");
                $scope.isSumbiting = false;
                return;     
            }
            if (null===$scope.model.HasHousingAllowance) {
                alertService.showAlert("是否正在享有住房补贴?");
                $scope.isSumbiting = false;
                return;     
            }
            if ($scope.model.HasHousingAllowance) {
                alertService.showAlert("已享受住房津贴，不能申请宿舍!<br>请先到宿舍管理处申请取消津贴。");
                $scope.isSumbiting = false;
                return;
            }
            if(!$scope.model.RequireReason || !$scope.model.RequireReason.length){
                alertService.showAlert("请填写入住理由!");
                $scope.isSumbiting = false;
                return; 
            }

            var paras = $scope.model;
            var url = commonServices.getUrl("DormManageService.ashx", "SubmitApplyDorm");
            try {
                commonServices.submit(paras, url).then(function (resp) {
                    if (resp.success) {
                        var msg = $rootScope.Language.dormManage.applyDormSucc;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    }
                    else {
                        alertService.showAlert(resp.message);
                        $ionicHistory.goBack();
                    }
                });
            } finally {
                $scope.isSumbiting = false;
            }
        };
    })
    .controller('ChargingDefineCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                                commonServices, CacheFactory, alertService) 
    {
        //费用查询
        var paras= commonServices.getBaseParas();
        
        $scope.selday = function(day){
            //TODO
        };

        $scope.totFee={
            sum:0
        };
        $scope.hasFee = function(){
            return $scope.totFee.sum>0.0;
        }

        function InitInfo() {            
            var url = commonServices.getUrl("DormManageService.ashx", "GetCharging");
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(!resp.success){
                        alertService.showAlert("查询费用失败，请稍候再试!<br>"+resp.message);
                        $ionicHistory.goBack();
                    }else{                        
                        $scope.totFee = resp.obj;
                    }
                }
            });
        }
        InitInfo();
    })
    .controller('DormMapCtrl', function ($scope, $rootScope, $state, $ionicHistory) 
    {
        //宿舍地图
        $("#auto-loop").lightGallery({
            mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
            mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
            swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).
            hideControlOnEnd : false,
            closable:false
        });
    })
    .controller('DormNoticeCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                            commonServices, CacheFactory, alertService) 
    {
        //宿舍公告
        function InitInfo() {            
            var url = commonServices.getUrl("DormManageService.ashx", "GetDormNoticeList");
            var paras = {};
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(!resp.success){
                        alertService.showAlert("最近没有宿舍公告!");
                        $ionicHistory.goBack();
                    }else{                        
                        $scope.noticeList = resp.list;
                    }
                }
            });
        }
        InitInfo();

        $scope.open = function(notice){
            CacheFactory.save(GLOBAL_INFO.KEY_DORM_NOTICE_ID, notice.ID);
            $state.go('dormNoticeDetail');
        }
    })
    .controller('DormNoticeDetailCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                                  commonServices, CacheFactory, alertService) 
    {
        //宿舍公告 详细
        var noticeID = CacheFactory.get(GLOBAL_INFO.KEY_DORM_NOTICE_ID);

        function InitInfo() {
            var url = commonServices.getUrl("DormManageService.ashx", "GetDormNoticeDetail");
            var baseInfo = commonServices.getBaseParas();
            var paras = {
                "WorkdayNo": baseInfo.WorkdayNO,
                "NoticeID": noticeID
            };
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if (!resp.success) {
                        alertService.showAlert("获取宿舍公告详细失败!");
                        $ionicHistory.goBack();
                    } else {
                        $scope.curNotice = resp.obj;
                        var strHtml = resp.obj.NoticeHtml;
                        $('#div_html').html(strHtml);
                    }
                }
            });
        }        
        InitInfo();
    })
    .controller('RepairDormCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                            commonServices, CacheFactory, alertService, duplicateSubmitServices,
                                            PicServices, UrlServices) 
    {            
        //宿舍报修
        var baseInfo = commonServices.getBaseParas();
        $scope.canSubmit=false;
        $scope.model={
            SubmitGuid: duplicateSubmitServices.genGUID(),
            CName: baseInfo.CName,
            WorkdayNO: baseInfo.WorkdayNO,
            MobileNo: baseInfo.MobileNo,
            DormArea: null,
            DormAddress: null,
            RepairTime: moment().add(1,'h').minute(0).toDate(),
            DeviceType: null,
            RepairDesc: null
        };

        function InitInfo() {
            var url = commonServices.getUrl("DormManageService.ashx", "GetDormCheckInInfo");            
            var paras = {
                WorkdayNO: baseInfo.WorkdayNO,
                Extra: "GetRepairType"
            };
            commonServices.submit(paras, url).then(function (resp) {
                if (resp && resp.obj) {
                    var curCheckInfo = resp.obj;
                    if (!resp.success) {
                        /* 不作强制检查
                        alertService.showAlert("报修失败："+resp.message);
                        $ionicHistory.goBack();
                        */
                        $scope.model.DormAddress = '';                        
                        $scope.canSubmit = true;
                    } else {
                        var checkInInfo = curCheckInfo.CheckInfo;
                        $scope.model.DormArea = checkInInfo.DormAreaID;
                        $scope.model.DormAddress = checkInInfo.DormAddress;
                        $scope.canSubmit=true;
                    }
                    var arr = JSON.parse(resp.data);
                    $scope.deviceTypes = arr;
                    $scope.dormAreas = curCheckInfo.DormAreas;
                }else{
                    alertService.showAlert("获取报修信息失败，请稍候再试!");
                    return;
                }
            });
        }
        InitInfo();

        $scope.imgs = [];
        $scope.SelPic = function(bCamera){
            PicServices.selectImage(function(pic){
                PicServices.resizeImage(1024, pic, function(sdata){
                    $scope.imgs.push(sdata);
                });
            }, bCamera);
        };
    
        var Reset=function(){
            $scope.imgs=[];
        };
        Reset();
        $scope.Reset = Reset;

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;

            var sTemp = $.trim($scope.model.MobileNo);
            $scope.model.MobileNo=sTemp;
            if (!sTemp || sTemp.length<5) {
                alertService.showAlert("请提供联系电话!");
                $scope.isSumbiting = false;
                return;
            }
            if (!$scope.model.DormArea) {
                alertService.showAlert("请选择宿舍区!");
                $scope.isSumbiting = false;
                return;     
            }
            sTemp = $.trim($scope.model.DormAddress);            
            if(isEmptyString(sTemp)){
                alertService.showAlert("请提供具体地址(例：北厂宿舍77栋A77房Z床)!");
                $scope.isSumbiting = false;
                return;
            }else{
                var sDormArea = $.trim($("#idDormArea option:selected").text());
                if(0!=sTemp.indexOf(sDormArea)){
                    sTemp = sDormArea + sTemp;
                }
                $scope.model.DormAddress=sTemp;
            }
            sTemp = $.trim($scope.model.RepairTime);
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请填写维修时间!");
                $scope.isSumbiting = false;
                return;
            }
            sTemp = $.trim($scope.model.DeviceType);
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请选择要维修的设备类型!");
                $scope.isSumbiting = false;
                return;
            }           
            sTemp = $.trim($scope.model.RepairDesc);
            $scope.model.RepairDesc = sTemp;
            // if (isEmptyString(sTemp)) {
            //     alertService.showAlert("请填写报修内容!");
            //     $scope.isSumbiting = false;
            //     return;     
            // }

            var paras = $scope.model;
            if(!$scope.imgs || !$scope.imgs.length){
                try {
                  DoSubmit(paras);
                } finally {
                  $scope.isSumbiting = false;
                }
            }else{
                alertService.showOperating('Processing...');
                var url = commonServices.getUrl("UploadService.ashx","");
                UrlServices.uploadImages('DormRepair', '宿舍报修', $scope.imgs, url, function(resp){
                    alertService.hideOperating();
                    if(resp){
                        if(resp.success){
                            paras.ImageBatchNo = resp.obj;
                            try{
                                DoSubmit(paras);
                            }catch(e){
                                console.log(e);
                            }                            
                        }else{
                            alertService.showAlert("上传图片失败, " + resp.message);
                        }
                    }else{
                        alertService.showAlert("上传图片失败!");
                    }
                    $scope.isSumbiting = false;
                },
                function(msg){
                    alertService.showAlert("上传图片失败, " + msg);
                });
            }
        };

        function DoSubmit(paras){            
            var url = commonServices.getUrl("DormManageService.ashx", "SubmitRepairDorm");
            commonServices.submit(paras, url).then(function (resp) {
              if (resp.success) {
                var msg = $rootScope.Language.dormManage.repairDormSucc;
                alertService.showAlert(msg);
                $ionicHistory.goBack();
              } else {
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
              }
            });
        }
    })
    .controller('ReissueKeyCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                            commonServices, CacheFactory, alertService, duplicateSubmitServices) 
    {
        //补办钥匙
        var baseInfo = commonServices.getBaseParas();
        $scope.canSubmit=false;
        $scope.model={
            SubmitGuid: duplicateSubmitServices.genGUID(),
            CName: baseInfo.CName,
            WorkdayNO: baseInfo.WorkdayNO,
            MobileNo: baseInfo.MobileNo,
            DormAddress: null,
            KeyTypes: null,
            Money: 0.0,
            Reason: null,
            memo: null,
        };
        $scope.KeyTypes = [
            {name:"大门钥匙", check:false},
            {name:"衣柜外门", check:false},
            {name:"衣柜抽屉", check:false}
        ];
        $scope.totalMoney=0;
        $scope.OnChangeKeyType = function(item){
            $scope.totalMoney=0;
            for(var i=0; i<$scope.KeyTypes.length; i++){
                if($scope.KeyTypes[i].check){
                    $scope.totalMoney += 10;
                }
            }
        };
        $scope.GetSelKeys = function(){
            var keys=[];
            for(var i=0; i<$scope.KeyTypes.length; i++){
                if($scope.KeyTypes[i].check){
                    keys.push($scope.KeyTypes[i].name);
                }
            }
            return keys;
        };

        function InitInfo() {
            var url = commonServices.getUrl("DormManageService.ashx", "GetDormCheckInInfo");            
            var paras = {
                WorkdayNO: baseInfo.WorkdayNO,
                Extra: ""
            };
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if (!resp.success) {
                        alertService.showAlert("补办钥匙失败："+resp.message);
                        $ionicHistory.goBack();
                    } else {
                        var checkInInfo = resp.obj;
                        $scope.model.DormAddress = checkInInfo.DormAddress;
                        var arr = JSON.parse(resp.data);                        
                        $scope.canSubmit=true;
                    }
                }
            });
        }
        InitInfo();

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;

            var sTemp = $.trim($scope.model.MobileNo);
            $scope.model.MobileNo=sTemp;
            if (!sTemp || sTemp.length<5) {
                alertService.showAlert("请提供联系电话!");
                $scope.isSumbiting = false;
                return;
            }
            sTemp = $.trim($scope.model.DormAddress);
            $scope.model.DormAddress=sTemp;
            if(isEmptyString(sTemp)){
                alertService.showAlert("请提供你的宿舍地址!");
                $scope.isSumbiting = false;
                return;     
            }
            if (0==$scope.GetSelKeys().length) {
                alertService.showAlert("请选择要补办的钥匙类型!");
                $scope.isSumbiting = false;
                return;
            }           
            sTemp = $.trim($scope.model.Reason);
            $scope.model.Reason = sTemp;
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请填写原因!");
                $scope.isSumbiting = false;
                return;
            }
            
            $scope.model.KeyTypes=$scope.GetSelKeys().join(";");
            $scope.model.Money = $scope.totalMoney;
            var paras = $scope.model;
            var url = commonServices.getUrl("DormManageService.ashx", "SubmitReissueKey");
            try {
                commonServices.submit(paras, url).then(function (resp) {
                    if (resp.success) {
                        var msg = $rootScope.Language.dormManage.reissueKeySucc;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    }
                    else {
                        alertService.showAlert(resp.message);
                        $ionicHistory.goBack();
                    }
                });
            } finally {
                $scope.isSumbiting = false;
            }
        };
    })
    .controller('FreeDormWifiCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService,externalLinksService) 
    {
        //免费WIFI使用指引
        $scope.open = function (action) {
            switch (action) {
                case "wifi_ios":
                    $state.go("freeDormWifi_ios");
                    break;
                case "wifi_android":
                    $state.go("freeDormWifi_android");
                    break;
            }
        };
        
        $scope.openApplyUrl = function(){
            try {
                var url = "http://www.189eshop.cn/catentry/catentryDetail.action?recCode=12345678&recStaff=2044029868&catentryId=1196525&storeId=13759&systemId=MINI_WAP";
                externalLinksService.openUr(url);
            }
            catch (ex) {
                alertService.showAlert(ex.message);
            }
        }
    })
    .controller('DormAskAndAnsCtrl', function ($scope, $rootScope, $state, $ionicHistory, 
                                               commonServices, AskAndAnswerService) 
    {
        //宿舍问答，使用 AskAndAnswerCtrl
        function GetList(paras){
            AskAndAnswerService.getAskAndAnswer(paras).then(function(resp){
                if(resp.success){
                    $scope.listAskAndAnswer = resp.list;
                }                
            });
        }
        var paras = commonServices.getBaseParas();
        paras.keyword = "宿舍";
        GetList(paras);
    })
    .controller('DormSuggestCtrl', function($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                            commonServices, CacheFactory, alertService, duplicateSubmitServices) 
    {
        //建议箱
        var baseInfo = commonServices.getBaseParas();
        $scope.hisSuggest=[];
        function InitInfo() {
            var url = commonServices.getUrl("DormManageService.ashx", "GetDormSuggest");            
            var paras = {
                WorkdayNO: baseInfo.WorkdayNO
            };
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if (resp.success) {
                        $scope.hisSuggest = resp.list;
                    }
                    $scope.dormAreas = JSON.parse(resp.data);
                }
            });
        }
        InitInfo();

        $scope.model = {
            SubmitGuid: duplicateSubmitServices.genGUID(),
            CName: baseInfo.CName,
            WorkdayNO: baseInfo.WorkdayNO,
            MobileNo: baseInfo.MobileNo,
            Suggest: "",
            DormArea:null
        };
        $scope.GetSuggest = function(){
            var txt = $.trim($scope.model.Suggest);
            return txt;
        };

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            $scope.isSumbiting = true;
            if (!$scope.model.DormArea) {
                alertService.showAlert("请选择宿舍区!");
                $scope.isSumbiting = false;
                return;
            }
            var sugg = $scope.GetSuggest();
            if (sugg.length<3) {
                alertService.showAlert("请填写你的建议!");
                $scope.isSumbiting = false;
                return;
            }

            $scope.model.Suggest = sugg;
            var paras = $scope.model;
            var url = commonServices.getUrl("DormManageService.ashx", "SubmitDormSuggest");
            try {
                commonServices.submit(paras, url).then(function (resp) {
                    if (resp.success) {
                        var msg = $rootScope.Language.dormManage.suggestSucc;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    }
                    else {
                        alertService.showAlert(resp.message);
                        $ionicHistory.goBack();
                    }
                });
            } finally {
                $scope.isSumbiting = false;
            }
        };

    })
    .controller('ProtocolDormPageCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices) 
    {
      //宿舍申请协议
      var baseInfo = commonServices.getBaseParas();

      function InitInfo() {
        var url = commonServices.getUrl("DormManageService.ashx", "AddProtocolRead");
        var paras = {
          WorkdayNO: baseInfo.WorkdayNO,
          CName: baseInfo.CName,
        };
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            if (resp.success) {
              $scope.ReadCount = resp.obj;
            }
          }
        });
      }
      InitInfo();
    })
    .controller('DynpageCtrl', function($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService, duplicateSubmitServices)
    {
        //动态只读页
        var baseInfo = commonServices.getBaseParas();
        function InitInfo() {
            var url = commonServices.getUrl("Common.ashx", "GetDynPage");
            var objDyn = JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_DYNPAGE));
            var paras = {
                WorkdayNO: baseInfo.WorkdayNO,
                Token: baseInfo.Token,
                TabName: objDyn.TabName,
                SrcCol: objDyn.SrcCol,
                WhereColName: objDyn.WhereColName,
                WhereColVal: objDyn.WhereColVal
            };

            $scope.pageTitle = objDyn.PageTitle;
            commonServices.submit(paras, url).then(function (resp) {
              if (resp && resp.success) {
                $scope.html = resp.data;
              }
            });
        }
        InitInfo();
    })
    .controller('CanteenImgCtrl', function($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService, externalLinksService)
    {
        //餐厅菜单
        $scope.openGeneralNotice = function(isUrlHtml, id, html){
            if(isUrlHtml){
                //打开外链
                try {
                    externalLinksService.openUr(html);
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
            }else{
                CacheFactory.remove('gnID');
                CacheFactory.save('gnID', id);
                $state.go("generalNoticeDetail");
            }
        };
        
    })

.controller('EAdminListCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                commonServices, CacheFactory, alertService, externalLinksService) 
    {        
        //EAdmin
        $scope.open = function (action) {

          switch (action) {
            case "eCarApproveList":
              $state.go('eCarApproveList');
              break;
            case "DormMngApplication":
              CacheFactory.remove(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE);
              CacheFactory.save(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE, 'DormMngApplication');
              $state.go('DormMngApplication');
              break;
            case "DormVisitorApplication":
              CacheFactory.remove(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE);
              CacheFactory.save(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE, 'DormVisitorApplication');
              $state.go('DormMngApplication');
              break;
            case "DormHousingSubsidy":
              $state.go('DormHousingSubsidy');
              break;
            default:
              break;
          }
        }

        $scope.UserPrivi={
            dormUsers:[]
        };
        function InitInfo(){
            var url = commonServices.getUrl("AdminService.ashx", "GetUserPrivi");
            var paras={};
            commonServices.submit(paras, url).then(function (resp) {
              if (resp) {
                if (resp.success) {
                  var userPrivi = resp.obj;
                  $scope.UserPrivi.dormUsers = userPrivi.dormUsers || [];
                }
              }
            });
        }
        InitInfo();

        $scope.CanUse=function(typ){
            var baseInfo = commonServices.getBaseParas();
            switch(typ){
                case 'Dorm':
                {
                    var myad = baseInfo.ADAcount.toLowerCase();
                    for(var i=0; i<$scope.UserPrivi.dormUsers.length; i++){
                        if(myad == $scope.UserPrivi.dormUsers[i].UserAD){
                            return true;
                        }
                    }
                }
                break;
                default:break;
            }
            //for test
            if(baseInfo.WorkdayNO=='2566117'){return true;}
            return false;
        };
       
})
.controller('ECarApproveListCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                commonServices, CacheFactory, alertService, externalLinksService) {
    //EAdmin
    var params = commonServices.getBaseParas();  
    var url = commonServices.getUrl("AdminService.ashx", "eAdmin_eCar_GetApproveBill");

    $scope.eCarApproverList=null;
    commonServices.getDataList(params, url).then(function (data) {
        if (data == "Token is TimeOut") {
            alertService.showAlert("登录失效，请重新登录");
            $state.transitionTo('signin');
        }
        $scope.eCarApproverList = data;       
    });

    $scope.open = function (eCar) {
        CacheFactory.remove('eCar');
        CacheFactory.save('eCar', eCar);      
        $state.go('eCarApproveDetail');
    };
  
})
.controller('ECarApproveDetailsCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                commonServices, CacheFactory, alertService, externalLinksService) {
    //EAdmin
    $scope.eCar = JSON.parse(CacheFactory.get('eCar'));
    console.log($scope.eCar);
    var params = commonServices.getBaseParas();
    $scope.CarFrom = '车队申请';

    $scope.selCarFrom = function (CarFrom) {

        switch (CarFrom) {
            case '自有':
                $scope.eCar.CarFrom = 1;
                break;
            case '车队申请':
                $scope.eCar.CarFrom = 2;
                break;
            case '滴滴专车':
                $scope.eCar.CarFrom = 3;
                break;
        }
    };   

    $scope.Submit = function () {      
        var confirmPopup = $ionicPopup.confirm({
            title: 'Approve',
            template: 'Confirm Approve?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var eCar = $scope.eCar;
                params.OrderNumber = eCar.OrderNumber;
                params.Status = eCar.Status == 1000 ? 3000 : 5000;
                params.CarFrom = (!eCar.CarFrom ||eCar.CarFrom=="") ? (eCar.CarFrom = 2) : eCar.CarFrom;
                params.IsApprove ='Yes';
                var url = commonServices.getUrl("AdminService.ashx", "eAdmin_eCar_Approve");
                commonServices.submit(params, url).then(function (data) {
                    if (data.success) {
                        alertService.showAlert(data.message);
                        $state.go('eCarApproveList');
                    }
                    else {
                        alertService.showAlert(data.message);
                    }
                });
            } else {
                return;
            }
        });          
    };

    $scope.Reject = { Reson: "" };
   
    $scope.Reject = function () {
       
        if (typeof ($scope.Reject.Reson) == "undefined") {
            alertService.showAlert('请填写Reject理由');
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: 'Reject',
            template: 'Confirm Reject?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var eCar = $scope.eCar;
                params.OrderNumber = eCar.OrderNumber;
                params.Status = -1;
                params.CarFrom = "";
                params.IsApprove = 'NO';
                params.RejectReson = $scope.Reject.Reson;
                var url = commonServices.getUrl("AdminService.ashx", "eAdmin_eCar_Approve");
                commonServices.submit(params, url).then(function (data) {
                    if (data.success) {
                        alertService.showAlert(data.message);
                        $state.go('eCarApproveList');
                    }
                    else {
                        alertService.showAlert(data.message);
                    }
                });
            } else {
                return;
            }
        });

    };

})
.controller('DormMngApplicationCtrl',
  function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory) 
  {
    // Manager Dorm Application
    // 与Visitor House Application共用
    $scope.StatusList = [
        {name:'All', status:-9999},
        {name:'提单', status:0},
        {name:'部门经理审批', status:1000},
        {name:'宿舍经理', status:4000},
        {name:'行政总监', status:5000},
        {name:'宿舍管理员', status:2000},
        {name:'关闭', status:8000},
        {name:'拒绝', status:-1},
    ];
    $scope.IntervalList = [
        {name:'一个星期', value:7},
        {name:'一个月', value:30},
        {name:'三个月', value:93},
        {name:'半年', value:186},
    ];

    var appkind = CacheFactory.get(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE);
    $scope.model ={
        selStatus: -9999,
        selDays: 7,
        kind:appkind,
    };

    function RefreshList() {
    switch (appkind) {
        case 'DormMngApplication':
            $scope.title = 'Manager Dorm Application';
            break;
        case 'DormVisitorApplication':
            $scope.title = 'Visitor House Application';
            break;
        default:
            break;
        }
      var url = commonServices.getUrl("AdminService.ashx", "GetDormMngApplicationList");
      var paras = $scope.model;
      paras.kind=appkind;
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        }
      });
    }
    RefreshList();

    $scope.FilterList=function(){
        RefreshList();
    };

    $scope.openDormMngApp=function(orderNum){
        CacheFactory.remove(GLOBAL_INFO.KEY_EADMIN_DORM);
        CacheFactory.save(GLOBAL_INFO.KEY_EADMIN_DORM, orderNum);
        switch (appkind) {
          case 'DormMngApplication':
            $state.go('DormMngApplicationDetail');
            break;
          case 'DormVisitorApplication':
            $state.go('DormVisitorApplicationDetail');
            break;
          default:
            break;
        }        
    };

  })
.controller('DormMngApplicationDetailCtrl',
  function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory) 
  {
    // Manager Dorm Application Detail
    $scope.DormList=[
        {name:'山水豪苑'},
        {name:'南厂客房'},
        {name:'北厂客房'},
    ];

    $scope.ValidDate=function(sdt){
        var dt = new Date(sdt);
        var dtNow = new Date(2018,1,1,12,0,0);
        return dt>dtNow;
    }
    $scope.CanSubmit=function(){
        var status = 0;
        if($scope.item && $scope.item.Status){
            status=$scope.item.Status;
        }
        if(0==status||-1==status||8000==status){
            return false;
        }
        if($scope.IsApprover
            &&(
                1000==status
                || 2000==status
                || 4000==status
                || 5000==status
            )
        ){
            return true;
        }
        return false;
    };

    var baseInfo = commonServices.getBaseParas();
    $scope.IsApprover=false;
    function InitInfo(){
        var orderNum = CacheFactory.get(GLOBAL_INFO.KEY_EADMIN_DORM);
        var url = commonServices.getUrl("AdminService.ashx", "GetDormMngApplicationDetail");
        var paras={
            'OrderNumber':orderNum,
            'ADAcount':baseInfo.ADAcount
        };
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            if (resp.success) {
              $scope.item = resp.obj;
              $scope.IsApprover=$scope.item.IsApprover;
              $scope.ApprovelRecords = JSON.parse(resp.data);
            }
          }
        });
    }
    InitInfo();    

    $scope.Approve=function(){
        var url = commonServices.getUrl("AdminService.ashx", "ApproveDormMngApplication");
        var paras={
            'OrderNumber':orderNum,
            'ADAcount':baseInfo.ADAcount,
            'DormArea':item.DormArea,
            'RoomNo':item.RoomNo,
            'AdminRemark':item.AdminRemark,
        };
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            if (resp.success) {                
                alertService.showAlert('提交成功');
                $ionicHistory.goBack();
            }else{
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
            }
          }
        });
    };
    $scope.Reject=function(){
        var url = commonServices.getUrl("AdminService.ashx", "RejectDormMngApplication");
        var paras={
            'OrderNumber':orderNum,
            'ADAcount':baseInfo.ADAcount,
            'Remark':item.Remark,
        };
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            if (resp.success) {                
                alertService.showAlert('提交成功');
                $ionicHistory.goBack();
            }else{
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
            }
          }
        });
    };
  })
  .controller('DormVisitorApplicationDetailCtrl',
    function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory) 
  {
    // Visitor House Application Detail
    $scope.DormList = [
      {name: '山水豪苑'},
      {name: '南厂客房'},
      {name: '北厂客房'},
    ];

    $scope.ValidDate = function (sdt) {
      var dt = new Date(sdt);
      var dtNow = new Date(2018, 1, 1, 12, 0, 0);
      return dt > dtNow;
    };
    $scope.CanSubmit = function () {
      var status = 0;
      if ($scope.item && $scope.item.Status) {
        status = $scope.item.Status;
      }
      if (0 == status || -1 == status || 8000 == status) {
        return false;
      }
      if ($scope.IsApprover &&
        (
          1000 == status ||
          2000 == status ||
          4000 == status ||
          5000 == status
        )
      ) {
        return true;
      }
      return false;
    };

    var baseInfo = commonServices.getBaseParas();
    $scope.IsApprover = false;

    function InitInfo() {
      var orderNum = CacheFactory.get(GLOBAL_INFO.KEY_EADMIN_DORM);
      var url = commonServices.getUrl("AdminService.ashx", "GetDormVisitorApplicationDetail");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.item = resp.obj;
            $scope.IsApprover = $scope.item.IsApprover;
            $scope.ApprovelRecords = JSON.parse(resp.data);
          }
        }
      });
    }
    InitInfo();

    $scope.Approve = function () {
      var url = commonServices.getUrl("AdminService.ashx", "ApproveDormMngApplication");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount,
        'DormArea': item.DormArea,
        'RoomNo': item.RoomNo,
        'AdminRemark': item.AdminRemark,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            alertService.showAlert('提交成功');
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            $ionicHistory.goBack();
          }
        }
      });
    };
    $scope.Reject = function () {
      var url = commonServices.getUrl("AdminService.ashx", "RejectDormMngApplication");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount,
        'Remark': item.Remark,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            alertService.showAlert('提交成功');
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            $ionicHistory.goBack();
          }
        }
      });
    };
  })
  .controller('DormHousingSubsidyCtrl',
  function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory) 
  {
    // Manager Housing Subsidy
    $scope.StatusList = [
        {name:'All', status:-9999},
        {name:'提单', status:0},
        {name:'宿舍经理', status:1000},
        {name:'行政总监', status:2000},
        {name:'宿舍管理员', status:3000},
        {name:'关闭', status:8000},
        {name:'取消', status:9000},
        {name:'拒绝', status:-1},
    ];

    $scope.IntervalList = [
        {name:'一个星期', value:7},
        {name:'一个月', value:30},
        {name:'三个月', value:93},
        {name:'半年', value:186},
    ];

    var appkind = CacheFactory.get(GLOBAL_INFO.KEY_EADMIN_DORMAPP_TYPE);
    $scope.model ={
        selStatus: -9999,
        selDays: 7,
    };

    function RefreshList() {
      var url = commonServices.getUrl("AdminService.ashx", "GetDormHousingSubsidyList");
      var paras = $scope.model;
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        }
      });
    }
    RefreshList();

    $scope.FilterList=function(){
        RefreshList();
    };

    $scope.openDormHousingSubsidy=function(orderNum){
        CacheFactory.remove(GLOBAL_INFO.KEY_EADMIN_DORM);
        CacheFactory.save(GLOBAL_INFO.KEY_EADMIN_DORM, orderNum);
        $state.go('DormHousingSubsidyDetail');      
    };

  })
  .controller('DormHousingSubsidyDetailCtrl',
    function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory) 
  {
    // Manager Housing Subsidy Detail
    
    $scope.ValidDate = function (sdt) {
        var dt = new Date(sdt);
        var dtNow = new Date(2018, 1, 1, 12, 0, 0);
        return dt > dtNow;
    };
    $scope.CanSubmit = function () {
      var status = 0;
      if ($scope.item && $scope.item.Status) {
        status = $scope.item.Status;
      }
      if (0==status || -1==status || 8000==status || 9000==status) {
        return false;
      }
      if ($scope.IsApprover &&
        (
          1000 == status ||
          2000 == status ||
          3000 == status
        )
      ) {
        return true;
      }
      return false;
    };

    var baseInfo = commonServices.getBaseParas();
    $scope.IsApprover = false;

    function InitInfo() {
      var orderNum = CacheFactory.get(GLOBAL_INFO.KEY_EADMIN_DORM);
      var url = commonServices.getUrl("AdminService.ashx", "GetDormHousingSubsidyDetail");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.item = resp.obj;
            $scope.IsApprover = $scope.item.IsApprover;
            $scope.ApprovelRecords = JSON.parse(resp.data);
          }
        }
      });
    }
    InitInfo();

    $scope.Approve = function () {
      var url = commonServices.getUrl("AdminService.ashx", "ApproveDormHousingSubsidy");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount,
        'EffectiveDate': item.EffectiveDate,
        'RoomNumber': item.RoomNumber,
        'CheckOutDate': item.CheckOutDate,
        'DormRemark': item.Remark2,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            alertService.showAlert('提交成功');
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            $ionicHistory.goBack();
          }
        }
      });
    };
    $scope.Reject = function () {
      var url = commonServices.getUrl("AdminService.ashx", "RejectDormHousingSubsidy");
      var paras = {
        'OrderNumber': orderNum,
        'ADAcount': baseInfo.ADAcount,
        'DormRemark': item.Remark2,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            alertService.showAlert('提交成功');
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            $ionicHistory.goBack();
          }
        }
      });
    };
  })
  .controller('CarCheckCtrl',
    function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory, 
        alertService, duplicateSubmitServices) 
  {
    // 车辆点检
    var baseInfo = commonServices.getBaseParas();
    // $scope.updateCheckOpt = function(selOpt){
    //     var sid = selOpt.ID.toString();
    //     var idOpt = 'idCheckOpt'+sid;
    //     var sval = $('select[name=' +idOpt+ ']').val();
    //     $scope.model["CheckOpt"+sid] = sval;
    // };

    function InitInfo() {
      var url = commonServices.getUrl("AdminService.ashx", "GetCarCheckInfo");
      var paras = {
        WorkdayNO: baseInfo.WorkdayNO,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            var obj = resp.data;
            $scope.carList = obj.CarList;
            $scope.checkOpts = obj.CheckOpts;
            $scope.cleanTimes = obj.CleanTimes;

            $scope.canSubmit = isValidArray(obj.CarList);
            //init select
            $scope.SelectedOpt={};
            angular.forEach($scope.checkOpts, function(value, key) {
                var it = value;
                $scope.SelectedOpt['CheckOpt'+it.ID] = '0';
            });            
            $scope.model.SelClearTimeID = '0';
          }
        }
      });
    }
    InitInfo();

    $scope.canSubmit = false;
    $scope.model = {
        SubmitGuid: duplicateSubmitServices.genGUID(),
        CName: baseInfo.CName,
        WorkdayNO: baseInfo.WorkdayNO,
        MobileNo: baseInfo.MobileNo,
        //Token: baseInfo.Token,
        CheckDate: moment().format('YYYY-MM-DD'),
        SelCarID: -1,
        SelClearTimeID: 0,
        OptResults: null,
        FailedReson:null,
    };
    
    function CheckValid() {
        var sTemp = $.trim($scope.model.MobileNo);
        $scope.model.MobileNo = sTemp;
        if (!sTemp || sTemp.length < 5) {
            alertService.showAlert("请提供联系电话!");
            return false;
        }
        sTemp = $.trim($scope.model.CheckDate);
        $scope.model.CheckDate = sTemp;
        if (isEmptyString(sTemp)) {
            alertService.showAlert("请提供日期!");
            return false;
        }
        if ($scope.model.SelCarID < 0) {
            alertService.showAlert("请选择车牌号!");
            $scope.isSumbiting = false;
            return false;
        }
        if($scope.model.SelClearTimeID<=0){
            alertService.showAlert("请选择清洁次数!");
            $scope.isSumbiting = false;
            return false;
        }

        //检查项
        var bNeedReason = false;
        var opts = $scope.SelectedOpt;
        for (var field in opts) {
            if (opts.hasOwnProperty(field)) {
                var val = opts[field];
                if ('0' != val) {
                    bNeedReason = true;
                    break;
                }
            }
        }

        sTemp = $.trim($scope.model.FailedReson);
        $scope.model.FailedReson = sTemp;
        if (bNeedReason && isEmptyString(sTemp)) {
            alertService.showAlert("请填写不合格项原因!");
            return false;
        }
        return true;
    }
    function PackageParas(){
        var opts = $scope.SelectedOpt;
        var arrOpt=[];
        for (var field in opts) {
            if (opts.hasOwnProperty(field)) {
                var val = opts[field];
                var sid = field.match(/CheckOpt(\d+)/);
                if(sid){
                    arrOpt.push({
                        'ID': sid[1],
                        'Res': val
                    });
                }
            }
        }
        $scope.model.OptResults = JSON.stringify(arrOpt);
        return $scope.model;
    }

    $scope.Submit = function () {
      if(!CheckValid()){
          return;
      }
      var url = commonServices.getUrl("AdminService.ashx", "SubmitCarCheck");
      var paras = PackageParas();
      commonServices.submit(paras, url).then(function(resp) {
        if (resp) {
          if (resp.success) {
            alertService.showAlert('提交成功');
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            //$ionicHistory.goBack();
          }
        }
      });
    };
  })
  .controller('CarCheckRecordCtrl',
    function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices, CacheFactory, 
              alertService) 
  {
    // 车辆点检记录  
      $scope.model = {
        SelDate:moment().format('YYYY-MM-DD'),
      };
      $scope.LoadData = function(){
        if(isEmptyString($scope.model.SelDate)){
          alertService.showAlert('请选择日期');
          return;
        }
        var url = commonServices.getUrl("AdminService.ashx", "GetCarCheckRecord");
        var paras = {
          "SelDate": moment($scope.model.SelDate).format('YYYY-MM-DD')
        };
        alertService.showOperating('Processing...');
        commonServices.submit(paras, url).then(function (resp) {
          alertService.hideOperating();
          if (resp) {
            if (!resp.success) {
              var msg = resp.message;
              alertService.showAlert(msg);
            } else {
              $scope.items = resp.data;
            }
          }
        });
      };

      $scope.ChangeDate = function(){
        $scope.LoadData();
      };
      $scope.LoadData(); //init load
  })
  
///////////////////////////////////////////////////////    
;