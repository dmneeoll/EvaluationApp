/**
 * Created by dmneeoll on 2017-03-03.
 */
angular.module('evaluationApp.businiess2Controllers', [])
    .controller('ResearchCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices,
                                        CacheFactory, alertService,
                                        externalLinksService, actionVisitServices)
    {
        var params=commonServices.getBaseParas();
        $scope.canUseAction = function (action) {
            switch(action){
                case '园区38女王节有奖答题':{
                    if(actionVisitServices.isTesting(action, $rootScope.accessEmployee.WorkdayNO)){
                        return true;
                    }
                    // if(!betweenTime('2019-03-06 08:30', '2019-03-07 17:30')){
                    //     return false;
                    // }
                }                
                break;
                default:break;
            }
            return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
        };
        $scope.checkActionUpdate = function (action) {
            return actionVisitServices.checkUpdate(action);
        };

        $scope.isSouthCamp = isSouthCamp($scope.accessEmployee.Organization); 
        $scope.openActivityGood = function(actID){
            CacheFactory.remove(GLOBAL_INFO.KEY_ACT_GOOD_ITEMID);
            CacheFactory.save(GLOBAL_INFO.KEY_ACT_GOOD_ITEMID, actID);
            $state.go('activityGood');
        };

        function InitInfo(){
            var url=commonServices.getUrl("ResearchService.ashx","GetResearchList");
            //获取一般活动列表，GeneralNotice列表
            commonServices.submit(params, url).then(function (resp) {
                if (resp) {
                    if (resp.success) {
                        $scope.researchList=resp.list;
                        $scope.gnList=JSON.parse(resp.data);
                    }
                }
            });
        }
        InitInfo();
        
        $scope.open=function(research){
            CacheFactory.remove('researchID');
            CacheFactory.remove('ResearchName');
            CacheFactory.save('researchID',research.ID);
            CacheFactory.save('ResearchName',research.ResearchName);
          $state.go('researchHtml');
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

        // $scope.openGH=function(){
        //     try {
        //         externalLinksService.openUr('http://cn.mikecrm.com/pSIKpIJ');
        //     }
        //     catch (ex) {
        //         alertService.showAlert(ex.message);
        //     }
        // };
        //$scope.openMECH=function(){
        //    $scope.isNotMECH=$scope.accessEmployee.Organization.toUpperCase().indexOf('MECH')==-1;

        //    if($scope.isNotMECH)
        //    {
        //        alertService.showAlert("本项调查只开放给Mech员工");
        //        return;
        //    }
        //    if($scope.accessEmployee.Organization.toUpperCase()=='MECH-PCBA')
        //    {
        //        alertService.showAlert("本项调查只开放给Mech（非PCBA）员工");
        //        return;
        //    }
        //    try {
        //        externalLinksService.openUr('https://www.wjx.top/jq/25582325.aspx');
        //    }
        //    catch (ex) {
        //        alertService.showAlert(ex.message);
        //    }
        //};

        $scope.openSpecial = function (action) {
            switch (action) {
                case '园区38女王节有奖答题':
                    $state.go('researchTrainer');
                    break;
                default: break;
            }
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('ResearchDetailsCtrl',function($scope,$rootScope,$state,$ionicPopup,$ionicHistory,commonServices,CacheFactory,alertService){
        var researchID=CacheFactory.get('researchID');
        $scope.ResearchName=CacheFactory.get('ResearchName');
        var params=commonServices.getBaseParas();
        params.researchID=researchID;
        var url=commonServices.getUrl("ResearchService.ashx","GetResearchHTML");

        var strHtml='';
        commonServices.getData(params,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data;
            $('#html').html(strHtml);
        });
        url=commonServices.getUrl("ResearchService.ashx","GetsResearchDetails");
        commonServices.getDataList(params,url).then(function(data){
            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.researchDetailList=data;

            //是否激活启动
            $scope.isActivate=data[0].IsActivate;
            //启动日期
            $scope.activateDate=data[0].ActivateDate;
        });
        $scope.isSumbiting=false;

        $scope.Submit=function() {

            if($scope.isSumbiting==true) return;
            $scope.isSumbiting=true;

            $scope.SubmitList=[];
            $scope.sumScore=0;
            for (var i = 0; i < $scope.researchDetailList.length; i++) {
                var rname=$scope.researchDetailList[i].sort;

                var selVaule= $("input[name='"+rname+"'"+"]:checked").val();
                console.log(i+":"+selVaule);
                if(typeof (selVaule)!='undefined'){
                    var sScore=selVaule.split("^")[2];
                    $scope.sumScore=$scope.sumScore+parseInt(sScore);
                    if(selVaule.split("^")[0]=='OtherItem')
                    {
                        selVaule='OtherItem'+'^'+$scope.researchDetailList[i].OtherText+'^'+sScore;

                        if($scope.researchDetailList[i].OtherText==null)
                        {
                            alertService.showAlert("请填写你的意见后再提交");
                            $scope.isSumbiting=false;
                            return;
                        }
                    }
                    $scope.SubmitList.push({
                      ResearchID: researchID,
                      ResearchDetailsID: $scope.researchDetailList[i].DetailsID,
                      SelItem: selVaule,
                      Comments: $scope.researchDetailList[i].Comments
                    });
                    }
                else
                {
                    if( $scope.researchDetailList[i].listItem.length==1
                        &&$scope.researchDetailList[i].listItem[0].Type=='Comments')
                    {
                        var Comments= $("input[name='"+rname+"'"+"]").val();
                        $scope.SubmitList.push({
                          ResearchID: researchID,
                          ResearchDetailsID: $scope.researchDetailList[i].DetailsID,
                          Comments: Comments
                        });
                    }
                    else if($scope.researchDetailList[i].listItem[0].Type=='InputText'){
                        var inputText= $.trim($scope.researchDetailList[i].Comments);
                        if( !isEmptyString(inputText)){
                            $scope.SubmitList.push({
                                ResearchID: researchID,
                                ResearchDetailsID: $scope.researchDetailList[i].DetailsID,
                                Comments: inputText
                              });
                        }
                    }
                }
            }

            if($scope.SubmitList.length!=$scope.researchDetailList.length){
                 alertService.showAlert("还有未选择的项目，请选择完成后再提交");
                $scope.isSumbiting=false;
            }
            else{
                $scope.SubmitList=angular.toJson($scope.SubmitList);
                params.SubmitResult=$scope.SubmitList;
                params.ResearchName=$scope.ResearchName;
                commonServices.submit(params,API.ResearchSubmit).then(function(data){
                    if(data.success){
                        var x = parseFloat(data.data)
                        if(x>0)
                        {
                            $rootScope.money='红包金额:'+data.data+'元';
                            $rootScope.rebagPopup=$ionicPopup.show({
                                cssClass:'er-popup',
                                templateUrl: 'templates/comm/hongbao.html',
                                scope: $rootScope
                            });
                            $rootScope.rebagPopup.then(function(res) {
                                $scope.isSumbiting=false;
                                $state.go('myAccountMoney');
                            });
                        }
                        else
                        {
                            $scope.isSumbiting=false;
                            alertService.showAlert('问卷调查提交成功，谢谢你的参与');
                            $ionicHistory.goBack();
                            $rootScope.updateSlideBox();
                        }
                    }
                    else{
                        $scope.isSumbiting=false;
                        alertService.showAlert(data.message);
                    }
                });

            }
        }
    })
    .controller('MyAccountMoneyCtrl', function($scope,pointsService,commonServices,$ionicHistory,$state, CacheFactory,alertService) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };
        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token };

        commonServices.getDataList(params,API.GetMyRedEnvelopLog).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            console.log(data);
            $scope.myRedEnvelopLog=data;
            $scope.myRedEnvelopSum=$scope.myRedEnvelopLog[0].RedEnvelopSum;

        });

    })
    .controller('AskForHelpCtrl',function($scope,$rootScope,$state,$ionicHistory,CacheFactory,goldIdeaService,commonServices,alertService,goodJobService){
        var paras= commonServices.getBaseParas();

        $scope.MobileNo=$rootScope.accessEmployee.MobileNo;

        $scope.Submit=function(helpContent){

            if(typeof($scope.MobileNo)=="undefined"){
                alertService.showLoading('请填写联系电话');
                return;
            }
            if(typeof(helpContent)=="undefined"){
                alertService.showLoading('具体描述遇到困难或问题');
                return;
            }
            if(helpContent.length>0){
                if(helpContent.length<10){
                    alertService.showLoading('具体描述遇到困难或问题（不少于10字符）');
                    return;
                }
                paras.sContent=helpContent;
                paras.sMobile=$scope.MobileNo;
                var url=commonServices.getUrl("EvaluationAppService.ashx","SubmitAskForHlep");
                commonServices.submit(paras,url).then(function(data){
                    if(data.success){
                        alertService.showAlert('已经收到，我们会尽快回复你的求助');

                        $state.go('tabAskForHelp.myHelp');

                    }
                    else{
                        alertService.showAlert(data.message);
                    }
                });
            }
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };

    })
    .controller('MyHelpCtrl',function($scope,$state,$ionicHistory,goldIdeaService,commonServices){

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
        var paras= commonServices.getBaseParas();
        var url=commonServices.getUrl("EvaluationAppService.ashx","GetMyHelp");
        commonServices.getDataList(paras,url).then(function(data){
           $scope.myHelp=data;
        });
    })  
    .controller('BaiduMapCtrl', function($scope,$interval,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices,$location) {

        $scope.map;

        setTimeout(function () {
            // 百度地图API功能
            $scope.map = new BMap.Map("allmap");
            $scope.map.centerAndZoom(new BMap.Point(113.273383,22.170500),18);
            $scope.map.enableScrollWheelZoom(true);
            $scope.theLocation();
        }, 300)

        var timer1= $interval(function(){
            $scope.theLocation();

        },5000);   //间隔5秒定时执行

        $scope.$on(
            "$destroy",
            function( event ) {
                $interval.cancel(timer1);
            }
        );

        // 用经纬度设置地图中心点
        $scope.theLocation=function (){
            $scope.getGPS();
            $scope.map.clearOverlays();
            var icon = new BMap.Icon('./img/car.png', new BMap.Size(25, 25), {      //20，30是图片大小
                anchor: new BMap.Size(12, 30)
            });
            var new_point = new BMap.Point($scope.bgGPS[0],$scope.bgGPS[1]);

            var marker = new BMap.Marker(new_point,{
                icon: icon
            });  // 创建标注

            var marker1 = new BMap.Marker(new_point);  // 创建标注

            $scope.map.addOverlay(marker);              // 将标注添加到地图中
//            $scope.map.addOverlay(marker1);
            $scope.map.panTo(new_point);

        }

        var paras= commonServices.getBaseParas();
        var car=JSON.parse(CacheFactory.get('car'));

        paras.plate=car.plate;
        $scope.carName=car.Name;

        var url=commonServices.getUrl("MapService.ashx","GetGPS");

        $scope.getGPS=function(){
            commonServices.getDataListNoMask(paras,url).then(function(data){

                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.GPS=data;
                $scope.changWGS84ToBg($scope.GPS);
            });
        }

        $scope.changWGS84ToBg=function(gps){

            //wgs84转国测局坐标
            var wgs84togcj02 = coordtransform.wgs84togcj02(gps[0].lng, gps[0].lat);

            //国测局坐标转百度经纬度坐标
            var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
            $scope.bgGPS=gcj02tobd09;
        }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('Carlist');
        }


    })

    .controller('LuckyGameCtrl', function($scope,$rootScope,$ionicPopup,$interval,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {


        $scope.openDog=function(){

            $('#btnChai').addClass('animated shake');

            var params=commonServices.getBaseParas();
            var url=commonServices.getUrl("LuckyGameService.ashx","GetLuckyGame");
            //获取一般活动列表
            commonServices.getData(params,url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                if(data.indexOf('^')!=-1){
                    alertService.showLoading(data.split('^')[1])
                    return;
                }
                var dogNo=data.split(',')[0];
                var haveFive=data.split(',')[1];
                switch(dogNo)
                {
                    case "1":$rootScope.dog='guowangfu.png'; break;
                    case "2":$rootScope.dog='jiawangfu.png'; break;
                    case "3":$rootScope.dog='fuwangfu.png'; break;
                    case "4":$rootScope.dog='caiwangfu.png'; break;
                    case "5":$rootScope.dog='wangwangfu.png'; break;
                }

                console.log($rootScope.dog);

                $rootScope.rebagPopup=$ionicPopup.show({
                    cssClass:'my-custom-popup',
                    templateUrl: 'templates/luckyDrawGame/luckydog.html',
                    scope: $rootScope
                });
                $rootScope.rebagPopup.then(function(res) {
                    $('#btnChai').removeClass('animated shake');
                    $scope.getDogCount();
                    if(haveFive=='true'){
                        $rootScope.dog='congratulate.png';
                        $rootScope.rebagPopup=$ionicPopup.show({
                            cssClass:'my-custom-popup',
                            templateUrl: 'templates/luckyDrawGame/luckydog.html',
                            scope: $rootScope
                        });
                        $rootScope.rebagPopup.then(function(res) {
                            $('#btnChai').removeClass('animated shake');
                            $scope.getDogCount();
                            if(haveFive=='true'){

                            }
                        });
                    }
                });

            });


        }

        $scope.getDogCount=function(){
            var params=commonServices.getBaseParas();
            var url=commonServices.getUrl("LuckyGameService.ashx","GetLuckyDogCount");
            commonServices.getDataListNoMask(params,url).then(function(data){

                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                console.log(data);
                $scope.dogList=data;
                if($scope.dogList.length>0){
                    for(var i=0;i<$scope.dogList.length;i++){
                        if($scope.dogList[i].dog==1)  $scope.dog1=$scope.dogList[i].dogCount;
                        if($scope.dogList[i].dog==2)  $scope.dog2=$scope.dogList[i].dogCount;
                        if($scope.dogList[i].dog==3)  $scope.dog3=$scope.dogList[i].dogCount;
                        if($scope.dogList[i].dog==4)  $scope.dog4=$scope.dogList[i].dogCount;
                        if($scope.dogList[i].dog==5)  $scope.dog5=$scope.dogList[i].dogCount;
                    }
                }
            });
        }

        $scope.getDogCount();

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

    })

    .controller('ChunwanZJCtrl', function($scope,$rootScope,externalLinksService,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {
        $scope.checkIDNO='23328424582344576622405743456258588953';

        var paras= commonServices.getBaseParas();
        var url=commonServices.getUrl("ResearchService.ashx","GetChunwanZJListByWorkdayNo");
        $scope.Msg='';
        commonServices.getDataList(paras,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }

            $scope.zjList=data;

            if($scope.zjList.length==0)
            {
                $scope.Msg='您没有中奖';
            }


        });





        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('ChunwanCtrl', function($scope,$rootScope,externalLinksService,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {
        $scope.checkIDNO='23328424582344576622405743456258588953';

//        var paras= commonServices.getBaseParas();
//        var url=commonServices.getUrl("ApplySubmitService.ashx","GetChunwanApplyList");
//        commonServices.getDataList(paras,url).then(function(data){
//
//            if(data=="Token is TimeOut"){
//                alertService.showAlert("登录失效，请重新登录");
//                $state.transitionTo('signin');
//            }
//            $scope.applyList=data;
//
//
//        });

        $scope.open=function(apply){
            CacheFactory.remove('applyID');
            CacheFactory.save('applyID',apply);

            console.log(apply);
            $state.go('applyHtml');
        };

        $scope.openZhibo=function(){

            try {
                externalLinksService.openUr('http://zklive-aliyun.myzaker.com/xlive/al151658441329265809c05_sd.m3u8');
            }
            catch (ex) {
                alertService.showAlert(ex.message);
            }
        };

        $scope.openHudong=function(){

            try {
                externalLinksService.openUr('https://yun.aiyaopai.com/live/20180130wcl?from=singlemessage&isappinstalled=0');
            }
            catch (ex) {
                alertService.showAlert(ex.message);
            }
        };

        $scope.openNamelist=function(){

            $state.go('chunwanNameListHtml');
        };


        $scope.openjiangpin=function(){

            $state.go('chunwanjiangpin');
        };
        $scope.openjiemu=function(){

            $state.go('chunwanjiemu');
        };
        $scope.openZJ=function(){
            $state.go('chunwanZJ');
        }

        $scope.chunwanZJName=function(){
            $state.go('chunwanZJName');
        }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('ChunwanZJNameCtrl', function($scope,$rootScope,externalLinksService,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {

        var paras= commonServices.getBaseParas();
        var url=commonServices.getUrl("ResearchService.ashx","GetChunwanZJList");

        commonServices.getDataList(paras,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }

            $scope.zjList=data;


        });


        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })    
    

//////////////////////////////////////////////
;
