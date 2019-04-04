/**
 * Created by dmneeoll on 2016-06-23.
 */
angular.module('evaluationApp.businiessControllers', ['ngSanitize'])
    .controller('GoldidealistCtrl',function($scope,$rootScope,$ionicHistory,CacheFactory,$state,goldIdeaService,commonServices,alertService){
        $scope.goldIdeaList = [];
        var paras= commonServices.getBaseParas();
        //获取金点子类型List
        goldIdeaService.getGoldIdeaType(paras).then(function (response) {
            if(data=="Token is TimeOut")
            {
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.goldIdeaList=response;
        }, function(data) {
            // 处理错误 .reject
            alertService.showAlert(data.template);
        });

    })
    .controller('GoldideaCtrl',function($scope,$rootScope,$state,$ionicHistory,CacheFactory,goldIdeaService,commonServices,alertService){

        $scope.goldIdeaType = [];

        var paras= commonServices.getBaseParas();
        //获取金点子类型List
        goldIdeaService.getGoldIdeaType(paras).then(function (response) {
            $scope.goldIdeaType=response;
            if ($scope.goldIdeaType[0].msg!=null) {
                alertService.showAlert($scope.goldIdeaType[0].msg);
            }
        }, function(data) {
            // 处理错误 .reject
            alertService.showAlert(data.template);
        });
        $scope.goldInputIdea = {
            ideaType:"",
            text: ''
        }
        $scope.CheckChang=function(t){
            $scope.goldInputIdea.ideaType= t.ideaType;
        };
        $scope.Submit=function(){
            if($scope.accessEmployee.Organization=='PCBA-B13'||$scope.accessEmployee.Organization=='Campus Resource B15'||$scope.accessEmployee.Organization=='Regional Resource B15'||$scope.accessEmployee.Organization=='PCBA-B11')
            {
                if($scope.goldInputIdea.text.length>0){
                    if($scope.goldInputIdea.ideaType.length==0){
                        alertService.showLoading('金点子请选择一种类型');
                        return;
                    }
                    if($scope.goldInputIdea.text.length<10){
                        alertService.showLoading('员工金点子不少于10个字');
                        return;
                    }
                    var paras= commonServices.getBaseParas();
                    paras.goldIdeaType=$scope.goldInputIdea.ideaType;
                    paras.goldIdeaContent=$scope.goldInputIdea.text;
                   // var paras={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,goldIdeaType:$scope.goldInputIdea.ideaType,goldIdeaContent:$scope.goldInputIdea.text};
                    commonServices.submit(paras,API.SubmitGoldIdea).then(function(data){
                        if(data.success){
                            alertService.showAlert('谢谢提交，金点子已经收到');

                            $ionicHistory.goBack();
                            $rootScope.updateSlideBox();
                        }
                        else{
                            alertService.showAlert(data.message);
                        }
                    });
                }
            }
            else
            {
                alertService.showLoading('你的事业部还未开通金点子功能');
                return;
            }

        }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

    })
    .controller('MyGoldideaCtrl',function($scope,$state,$ionicHistory,goldIdeaService,commonServices,CacheFactory){

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
        var paras= commonServices.getBaseParas();
        //获取金点子类型List
        goldIdeaService.getGoldIdeaRecode(paras).then(function (response) {
            $scope.goldIdea=response;
        }, function(data) {
            // 处理错误 .reject

        });
    })
    .controller('GoldIdeaShowCtrl',function($scope,$state,$ionicHistory,commonServices ,goldIdeaService,CacheFactory){

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
        var paras= commonServices.getBaseParas();


        goldIdeaService.getGoldIdeaShow(paras).then(function (response) {

            $scope.goldIdeaShow=response;

        }, function(data) {
            // 处理错误 .reject

        });
    })
    .controller('GoodJobCtrl',function($scope,$rootScope,$ionicHistory,CacheFactory,goldIdeaService,commonServices,alertService,goodJobService){


        //记录点击
        var paras1= commonServices.getBaseParas();
        paras1.opType='为TA点赞';
        paras1.opContent='点击进入';

        if(paras1.Organization=='Campus Resource B15'){
            $scope.imgUrl='img/B15Like.jpg';
        }else if(paras1.Organization=='Regional Resource B15'){
            $scope.imgUrl='img/B15Like.jpg';
        }
//        else if(paras1.Organization=='PCBA 57'){
//            $scope.imgUrl='img/B15Like.jpg';
//        }
        else
        {
            $scope.imgUrl='img/goodJob.png';
        }

        commonServices.operationLog(paras1).then(function(data){
            $scope.sucess==data;
        });
        //获取优秀员工
        var paras2= commonServices.getBaseParas();

        goodJobService.getGoodEmployee(paras2).then(function(data){
            $scope.GoodEmployee=data;



        });

        //已点赞的缓存
        $scope.likeInfo = JSON.parse(CacheFactory.get('likeInfo'));
        //点赞
        $scope.like=function(items){
            var isLike=false;
            if ($scope.likeInfo){
                for(var i=0;i<$scope.likeInfo.length;i++){
                    if($scope.likeInfo[i].ID==items.ID&&$scope.likeInfo[i].WorkDayNo==$scope.accessEmployee.WorkdayNO){
                        alertService.showAlert("你已经点过赞了");
                        isLike=true;
                        break;
                    }
                }
            }else{
                $scope.likeInfo=[];
            }

            if(!isLike){
                var paras3={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,GoodEmployeeId:items.ID};
                commonServices.submit(paras3,API.addGoodEmployeeLike).then(function(data){
                    if(data.success){
                        //刷新
                        goodJobService.getGoodEmployee(paras2).then(function(data1){
                            $scope.GoodEmployee=data1;

                        });
                        $scope.likeInfo.push({ID:items.ID,WorkDayNo:$scope.accessEmployee.WorkdayNO});
                        CacheFactory.save("likeInfo",$scope.likeInfo);
                    }
                })
            }
        }

        $scope.Submit=function(goodJob){
//            if($scope.accessEmployee.Segment_ID!='PCBA-B13')
//            {
//                alertService.showLoading('你的事业部还未开通为他点赞功能');
//                return;
//            }

            if(typeof (goodJob.toWorkdayNo)=="undefined"){
                alertService.showLoading('请填写被推荐人的工号');
                return;
            }
            if(typeof(goodJob.name)=="undefined"){
                alertService.showLoading('请填写被推荐人的姓名');
                return;
            }
            if(typeof(goodJob.department)=="undefined"){
                alertService.showLoading('请填写被推荐人的部门');
                return;
            }
            if(typeof(goodJob.text)=="undefined"){
                alertService.showLoading('请详细填写主要事迹（不少于50字符）');
                return;
            }
            if(goodJob.text.length>0){
                if(goodJob.text.length<50){
                    alertService.showLoading('请详细填写主要事迹（不少于50字符）');
                    return;
                }
                var paras={ WorkdayNO: $scope.accessEmployee.WorkdayNO,
                    Token:$scope.accessEmployee.Token,
                    name:goodJob.name,
                    toWorkdayNo:goodJob.toWorkdayNo,
                    department:goodJob.department,
                    specialPropose:goodJob.text};
                // var paras={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,specialPropose:goodJob.text};

                commonServices.submit(paras,API.SubmitSpecialPropose).then(function(data){
                    if(data.success){
                        alertService.showAlert('提交成功，谢谢弘扬正能量');

                        $ionicHistory.goBack();

                    }
                    else{
                        alertService.showAlert(data.message);
                    }
                });
            }
        }

    })
    .controller('KqjlCtrl', function($scope,$ionicHistory,$state,$ionicLoading,kqService,alertService,CacheFactory) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
//        $scope.days = [{day:'三天'},{day:'五天'},{day:'七天'},{day:'一个月'},{day:'两个月'}];

        $scope.getKQ=function(params){
            $scope.kqjl=null;
            kqService.getKq(params).then(function(data){
                if(data=="Token is TimeOut")
                {
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.kqjl=data;
                $scope.kqcount=$scope.kqjl.length;
            });
        };

        $scope.day= "三天";
        //默认加载三天记录
        $scope.getKQ({ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,day:$scope.day});

        $scope.selday=function(day){

            var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,day:day};
            $scope.getKQ(params);
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })    
    .controller('CustCtrl', function($scope,$location,$ionicLoading,custService,alertService,CacheFactory) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        var params1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token};
        custService.getCustOddfare(params1).then(function(data){
            if(data.success)
            {
                $scope.oddfare=data.obj.Oddfare;
            }
            else
            {
                if(data.message=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.oddfare='暂时查询不到';
            }

        });

        $scope.getCost=function(params){
            $scope.custList=null;
            custService.getCust(params).then(function(data){
                if(data.success)
                {
                    $scope.custList=data.list;
                    $scope.custCount = $scope.custList.length;
                    if (data && data.length) {
                        $scope.oddfare = data[0].Oddfare;
                    }                    
                }
                else
                {
                    if(data.message=="Token is TimeOut"){
                        alertService.showAlert("登录失效，请重新登录");
                        $state.transitionTo('signin');
                    }
                }

            });
        };

        $scope.day= "三天";
        //默认加载三天记录
        $scope.getCost({ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,day:$scope.day});

        $scope.selday=function(day){

            var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,day:day};
            $scope.getCost(params);
        };


    })
    .controller('NoticeListCtrl', function($scope,$ionicScrollDelegate,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        $scope.$on("$ionicView.beforeEnter", function() {
            var clearHistoryForIndexPage = function() {
                var history = $ionicHistory.forwardView();
                if (!history) {
                    var params= commonServices.getBaseParas();
                    $scope.GetDateList();

                    $ionicScrollDelegate.scrollTop();
                }
            };
            clearHistoryForIndexPage();
        });

        $scope.GetDateList=function(){
            var params= commonServices.getBaseParas();
            var url=commonServices.getUrl("MsgService.ashx","GetNoticeList");
            commonServices.getDataList(params,url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.noticeList=data;


                for(var i=0;i<$scope.noticeList.length;i++){

                    if($scope.noticeList[i].ImgPath==null||$scope.noticeList[i].ImgPath== "undefined"){
                        $scope.noticeList[i].ImgPath='img/user-100.png'
                    }
                }

            });
        };

        $scope.open=function(notice){
            CacheFactory.remove('noticeID');
            CacheFactory.save('noticeID',notice.NoticeID);
            $state.go('noticeHtml');
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('NoticeHtmlCtrl', function($scope,$rootScope,commonServices,$ionicModal,CacheFactory,noticeService,alertService,$state,$ionicHistory,$location) {

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        var noticeID=CacheFactory.get('noticeID');

        var strHtml='';
        $scope.ReadCount=0;
        $scope.LikeCount=0;
        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,NoticeID:noticeID};

        commonServices.getDataList(params,API.GetNoticeHTML).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data[0].NoticeHtml;
            $('#div_html').html(strHtml);
            CacheFactory.remove('noticeID');
            $scope.ReadCount=data[0].ReadCount;
            $scope.LikeCount=data[0].LikeCount;
            $scope.getComments();

        });

        $scope.like=function(){

            var url=commonServices.getUrl("MsgService.ashx","AddLike");
            commonServices.submit(params,url).then(function(data){
                if(data.success){
                    $scope.LikeCount=  $scope.LikeCount+1;
                }

            });
        };



        $ionicModal.fromTemplateUrl('templates/modalWriteMsg.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })
        $scope.writeMsg = function() {

            $scope.modal.show();

        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });


        $scope.submit=function(){

            var Comments = $("#Comments").val(); //获取
            if(Comments.length==0)
            {
                console.log(Comments);
                return;
            }


            params.SID=noticeID;
            params.Model='Notice';
            params.Comments=Comments;

            var url=commonServices.getUrl("MsgService.ashx","AddComments");
            commonServices.submit(params,url).then(function(data){
                if(data.success){
                    $scope.modal.hide();
                    $scope.getComments();
                }
                else{
                    alertService.showAlert(data.message);
                }
            });

        }

        $scope.getComments=function(){
            var url=commonServices.getUrl("MsgService.ashx","GetReplyComments");
            commonServices.getDataList(params,url).then(function(data){
                 $scope.replyList=data;

            });
        }

        $scope.closePass=function(){
            $rootScope.fromHome='';
            //CacheFactory.remove('noticeID');
//            $ionicHistory.nextViewOptions({
//                disableAnimate: true,
//                disableBack: true
//            });
            $state.go('tab.home');
        }

//        noticeService.getNoticeHTML(params).then(function(data){
//
//            if(data=="Token is TimeOut"){
//                alertService.showAlert("登录失效，请重新登录");
//                $state.transitionTo('signin');
//            }
//            strHtml=data;
//
//
//            $('#div_html').html(strHtml);
//            CacheFactory.remove('noticeID');
//        });



    })
    .controller('EarthdayNoticeListCtrl', function($scope,$ionicScrollDelegate,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        $scope.$on("$ionicView.beforeEnter", function() {
            var clearHistoryForIndexPage = function() {
                var history = $ionicHistory.forwardView();
                if (!history) {
                    var params= commonServices.getBaseParas();
                    $scope.GetDateList();

                    $ionicScrollDelegate.scrollTop();
                }
            };
            clearHistoryForIndexPage();
        });

        $scope.GetDateList=function(){
            var params= commonServices.getBaseParas();
            var url=commonServices.getUrl("MsgService.ashx","GetEarthWeekNoticeList");
            commonServices.getDataList(params,url).then(function(data){
                if(data=="Token is TimeOut"){
                    alertService.showAlert("登录失效，请重新登录");
                    $state.transitionTo('signin');
                }
                $scope.noticeList=data;


                for(var i=0;i<$scope.noticeList.length;i++){

                    if($scope.noticeList[i].ImgPath==null||$scope.noticeList[i].ImgPath== "undefined"){
                        $scope.noticeList[i].ImgPath='img/user-100.png'
                    }
                }

            });
        };

        $scope.open=function(notice){
            CacheFactory.remove('noticeID');
            CacheFactory.save('noticeID',notice.NoticeID);
            $state.go('noticeHtml');
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('ApplyCtrl', function($scope,$rootScope,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {

//        $scope.test='45625824057432332842230066245823423270784587322300590560598210008624961232332842240574345625823328424582344576622405743456258588953';
//
//        if($scope.test.indexOf( $rootScope.accessEmployee.WorkdayNO)!=-1)
//        {
//            $scope.testSee=true;
//        }
//        else
//        {
//            $scope.testSee=false;
//        }
//
//        console.log($scope.testSee);
        var paras= commonServices.getBaseParas();
        var url=commonServices.getUrl("ApplySubmitService.ashx","GetApplyList");
        commonServices.getDataList(paras,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.applyList=data;


        });

        $scope.open=function(apply){
            CacheFactory.remove('applyID');
            CacheFactory.save('applyID',apply.NoticeID);

            $state.go('applyHtml');
        };

        // $scope.openTicket=function(apply){
        //     $state.go('applyTicket');
        // };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('ApplyHtmlCtrl', function($scope,CacheFactory,noticeService,alertService,$state,$ionicPopup,$ionicHistory,$location,commonServices) {


        $scope.applyItem=JSON.parse(CacheFactory.get('applyID'));
        var applyID=$scope.applyItem.NoticeID;


        var strHtml='';
        var paras= commonServices.getBaseParas();
        paras.ApplyID=applyID;


       var  url=commonServices.getUrl("ApplySubmitService.ashx","GetApplyHTML");
        commonServices.getData(paras,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data;
            $('#Apply_html').html(strHtml);

        });


        $scope.Submit=function() {
            $ionicPopup.confirm({
                title: '提示',
                template: '确定报名吗？',
                okText:"OK"
            }) .then(function(res) {
                if(res) {
                    var url=commonServices.getUrl("ApplySubmitService.ashx","SubmitApply");
                    commonServices.submit(paras, url).then(function (data) {
                        if (data.success) {
                            alertService.showAlert('提交成功');

                            $ionicHistory.goBack();

                        }
                        else {
                            alertService.showAlert(data.message);
                        }
                    });
                }
            });
            }
    })
    .controller('ApplyTicketCtrl', function($scope,$rootScope,CacheFactory,noticeService,
        alertService,$state,$ionicPopup,$ionicHistory,$location,commonServices,duplicateSubmitServices) 
    {
        //团购车票
        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/applySubmit/ticketProtocolHtml.html',
          cssClass: 'my-custom-popup-Alter',
          title: '免责声明',
          subTitle: '',
          scope: $scope,
          buttons: [{
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              return;
            }
          }]
        });

        var baseInfo = $.extend({}, commonServices.getBaseParas());
        baseInfo.SubmitGuid = duplicateSubmitServices.genGUID();
        // var dtInit = new Date();
        // var dtBegin = new Date('2019-01-15');
        // var dtEnd = new Date('2019-02-04');
        // if(dtInit<dtBegin || dtInit>dtEnd){
        //     dtInit = dtBegin;
        // }
        var dtInit=null;
        $scope.Submitdata = {
          CName: baseInfo.CName,
          WorkdayNO: baseInfo.WorkdayNO,
          Organization: baseInfo.Organization,
          MobileNo: baseInfo.MobileNo,
          selectedDate: dtInit,
          selectedLine: "",
          selectedDownStation: "",
          expectTime: "",
          Memo:"",
        };

        $scope.selDate = function () {
          $scope.Linelist = '';
          $scope.Stationlist = '';
          $scope.Submitdata.selectedLine = '';
          $scope.Submitdata.selectedDownStation = '';
          baseInfo.selDate = moment($scope.Submitdata.selectedDate).format("YYYY-MM-DD");
          var url = commonServices.getUrl("ApplySubmitService.ashx", "GetApplyTickeLine");
          commonServices.getDataList(baseInfo, url).then(function (data) {
            if (data == "Token is TimeOut") {
              alertService.showAlert("登录失效，请重新登录");
              $state.transitionTo('signin');
            }
            $scope.Linelist = data;
          });
        }

        $scope.other = 'false';
        $scope.selLine = function() {
          var selectedLine = $scope.Submitdata.selectedLine;
          if (selectedLine == '其他线路') {
            $scope.other = 'true';
          } else {
            $scope.other = 'false';
            $scope.Stationlist=null;
            baseInfo.selline = selectedLine;
            baseInfo.selDate = moment($scope.Submitdata.selectedDate).format("YYYY-MM-DD");
            var url = commonServices.getUrl("ApplySubmitService.ashx", "GetApplyTickeStation");
            commonServices.getDataList(baseInfo, url).then(function (data) {
              if (data == "Token is TimeOut") {
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
              }
              $scope.Stationlist = data;
            });
          }
        };

        $scope.selDownStation = function(){
            var st = $scope.Submitdata.selectedDownStation;
            for(var i=0; i<$scope.Stationlist.length; i++){
                if(st == $scope.Stationlist[i].DownStation){
                    $scope.Submitdata.Memo = $scope.Stationlist[i].memo;
                    break;
                }
            }            
        };

        $scope.isNotValid = function(params) {
            if (isEmptyString($scope.Submitdata.selectedDate) || $scope.Submitdata.selectedDate=="请选择") {
                return '请选择一个日期';
              }
              if (isEmptyString($scope.Submitdata.selectedLine)) {
                return '请选择一个线路';
              }
              if (isEmptyString($scope.Submitdata.selectedDownStation)) {
                return '请选择落客站点';
              }
              return null;
        };

        $scope.Submit = function () {
          var serr = $scope.isNotValid();
          if(!isEmptyString(serr)){
            alertService.showAlert(serr);
            return;
          }
          var dtLogin = commonServices.getLoginServerTime();
          var dtBegin = new Date('2019-01-03 14:00');
          var dtEnd = new Date('2019-01-10 11:00');
          if (dtLogin < dtBegin || dtLogin > dtEnd) {
            alertService.showAlert('无法提交：<br>预购票时间：2019年1月3日 14:00 ~ 2019年1月10日 11:00');
            $ionicHistory.goBack();
            return;
          }

          $ionicPopup.confirm({
            title: '提示',
            template: '确定报名吗？',
            okText: "OK"
          }).then(function (res) {
            if (res) {
              baseInfo.submitDate = moment($scope.Submitdata.selectedDate).format("YYYY-MM-DD");
              baseInfo.submitLine = $scope.Submitdata.selectedLine;
              baseInfo.submitStation = $scope.Submitdata.selectedDownStation;
              baseInfo.submitMobileNo = $scope.Submitdata.MobileNo;
              var timSel = $scope.Submitdata.expectTime;
              baseInfo.expectTime = !!timSel ? moment(timSel).format("HH:mm") :"";
              
              var url = commonServices.getUrl("ApplySubmitService.ashx", "SubmitApplyTicke");
              commonServices.submit(baseInfo, url).then(function (data) {
                if (data.success) {
                  alertService.showAlert('预报名提交成功，信禾公司将与你确认订票、是否成团等情况，请保持手机畅通!');
                  $ionicHistory.goBack();
                } else {
                  alertService.showAlert(data.message);
                }
              });
            }
          });
        }
    })
    .controller('InsuranceCtrl', function($scope,CacheFactory,noticeService,alertService,$state,$ionicHistory,commonServices) {
        //商业保险
        var paras= commonServices.getBaseParas();
        var url=commonServices.getUrl("InsuranceService.ashx","GetInsuranceList");
        commonServices.getDataList(paras,url).then(function(data){
            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.InsuranceList=data;
        });

        $scope.open=function(insurance){
            CacheFactory.remove('Insurance_ID');
            CacheFactory.save('Insurance_ID',insurance.Insurance_ID);
            $state.go('insuranceHtml');
        };

    })
    .controller('InsuranceHtmlCtrl', function($scope,CacheFactory,noticeService,alertService,$state,$ionicPopup,$ionicHistory,$location,commonServices) {

        var Insurance_ID=CacheFactory.get('Insurance_ID');

        var strHtml='';
        var paras= commonServices.getBaseParas();
        paras.Insurance_ID=Insurance_ID;


        var  url=commonServices.getUrl("InsuranceService.ashx","GetInsuranceHTML");
        commonServices.getData(paras,url).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data;
            $('#Insurance_html').html(strHtml);

        });


        $scope.Submit=function() {
            $ionicPopup.confirm({
                title: '提示',
                template: '确定报名吗？',
                okText:"OK"
            }) .then(function(res) {
                if(res) {
                    var url=commonServices.getUrl("ApplySubmitService.ashx","SubmitApply");
                    commonServices.submit(paras, url).then(function (data) {
                        if (data.success) {
                            alertService.showAlert('提交成功');

                            $ionicHistory.goBack();

                        }
                        else {
                            alertService.showAlert(data.message);
                        }
                    });
                }
            });



        }



    })
    .controller('HomeNoticeCtrl', function($scope,CacheFactory,noticeService,alertService,$state,$ionicHistory,$location) {

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        var HomeNoticeID=CacheFactory.get('HomeNoticeID');


        var strHtml='';

        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,NoticeID:HomeNoticeID};
        noticeService.getNoticeHTML(params).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data;
            $('#HomeHtml').html(strHtml);
            CacheFactory.remove('HomeNoticeID');
        });
        $scope.closePass=function(){
            CacheFactory.remove('HomeNoticeID');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

//        $scope.closePass=function(){
//            $ionicHistory.nextViewOptions({
//                disableAnimate: true,
//                disableBack: true
//            });
////            $location.path("tab/noticeList");
//            $ionicHistory.goBack();
//        };
    })
    .controller('ActivityListCtrl', function($scope,$rootScope,CacheFactory,noticeService,alertService,eHSActService,
        $state,$ionicHistory,commonServices,$location,actionVisitServices) 
    {
        $scope.canUseAction = function (action) {
            return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
        };
        $scope.checkActionUpdate = function (action) {
            return actionVisitServices.checkUpdate(action);
        };

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        $scope.isMechanical = isMech($scope.accessEmployee.Organization);
        $scope.isMultek     = isMultek($scope.accessEmployee.Organization);
        $scope.isB11        = isB11($scope.accessEmployee.Organization);

        var params=commonServices.getBaseParas();
        //获取一般活动列表
        noticeService.getActivityList(params).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.activityList=data;

            if(typeof ($scope.activityList) == 'undefined'||$scope.activityList!=null){
                for(var i=0;i<$scope.activityList.length;i++){

                    if($scope.activityList[i].ImgPath==null||$scope.activityList[i].ImgPath== "undefined"){
                        $scope.activityList[i].ImgPath='img/user-100.png'
                    }
                }
            }
        });
        $scope.ChoujiangWorkday='4582342332842470745';
        $scope.shouCj=$scope.ChoujiangWorkday.indexOf( $scope.accessEmployee.WorkdayNO)!=-1;
        //获取是否有抽奖活动列表权限
//        noticeService.getChoujiangList(params).then(function(data){
//
//
//            if(data=="Token is TimeOut"){
//                alertService.showAlert("登录失效，请重新登录");
//                $state.transitionTo('signin');
//            }
//           if(data.success){
//               $scope.shouCj=true;
//               console.log($scope.shouCj);
//           }
//        });

        $scope.openCJ=function(){
            $location.path("choujiang");
        }
        $scope.openHandelAddAct = function () {
            try {
               // externalLinksService.openUr('http://cn.mikecrm.com/TcqdeQz');
                window.cordova.InAppBrowser.open('http://cn.mikecrm.com/TcqdeQz', '_system', 'location=yes');
            }
            catch (ex) {
                alertService.showAlert(ex.message);
            }
        };

//        获取有奖调查列表
//        commonServices.getDataList(params,API.GetResearchList).then(function(data){
//
//            if(data=="Token is TimeOut"){
//                alertService.showAlert("登录失效，请重新登录");
//                $state.transitionTo('signin');
//            }
//            $scope.researchList=data;
//        });
        $scope.openDC=function(research){
            CacheFactory.remove('researchID');
            CacheFactory.remove('ResearchName');
            CacheFactory.save('researchID',research.ID);
            CacheFactory.save('ResearchName',research.ResearchName);
            $state.go('researchHtml');
        };

        $scope.open=function(activity){
            if(activity.IsOutLink){
                //打开外链
                try {
                    var url = $.trim(activity.ActivityHtml);
                    window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
                }
                catch (ex) {
                    alertService.showAlert(ex.message);
                }
            }else{
                CacheFactory.remove('activityID');
                CacheFactory.save('activityID',activity.ActivityID);
                actionVisitServices.visit(activity.ActivityID); //save state
                console.log(activity.ActivityID);
                $state.go('activityHtml');
            }
        };

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

        //下线的活动
        $scope.openOfflineAct = function(){
            alertService.showAlert('该活动已下线，欢迎下次参与!');
        };

        $scope.openOutLink=function(url){
            //打开外链
            try {
                window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
            } catch (ex) {
                alertService.showAlert(ex.message);
            }
        };
        //2018-09-22 活动点赞
        $scope.openActivityGood = function(actID){
            CacheFactory.remove(GLOBAL_INFO.KEY_ACT_GOOD_ITEMID);
            CacheFactory.save(GLOBAL_INFO.KEY_ACT_GOOD_ITEMID, actID);
            $state.go('activityGood');
        };
        
        //2018-06-20 EHS有奖答题活动
        $scope.canShow = !isMultek($scope.accessEmployee.Organization);
        eHSActService.getEHSActList(params).then(function(data){
            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }

            $scope.ehsActList=data;
            // if(typeof ($scope.ehsActList) == 'undefined'||$scope.ehsActList!=null){
            //     for(var i=0;i<$scope.ehsActList.length;i++){
            //         if($scope.ehsActList[i].ImageUrl==null||$scope.ehsActList[i].ImageUrl== "undefined"){
            //             $scope.ehsActList[i].ImageUrl='img/user-100.png'
            //         }
            //     }
            // }
        });
        $scope.openEHS=function(activity){
            CacheFactory.remove('ehsAct');
            CacheFactory.save('ehsAct', activity);            
            actionVisitServices.visit(activity.ActID); //save state
            $state.go('activityEHS');
        };

        $scope.openSpecial = function (action) {
          switch (action) {
            case "补贴申请结果查询":
              $state.go("union_welfare_applyResult");
              break;
            case "Flex工会2019春节返程补贴":
              $state.go("act_2019SpringSubsidy");
              break;
            case "地球周环保知识竞赛":
              $state.go("act_PoetryContest");
              break;
            default:
              break;
          }
        };
        
        $scope.canUseMech38 = function() {
            if($scope.isMechanical){                
                //todo check gender
                return true;
            }
            return false;
        };
        $scope.checkOpenMech38 = function() {
            // if(!betweenTime('2019-03-06 08:30', '2019-03-07 17:00')){
            //     alertService.showAlert("活动时间是2019年3月6日 8:30 ~ 2019年3月7日 17:00。");
            //     return;
            // }
            $scope.openOutLink('https://www.wjx.cn/jq/34994975.aspx');
        }

        //历史活动列表
        $scope.outDateActivities=[];
        actionVisitServices.getOutDateActivity($scope);        
    })
    .controller('ActivityGoodCtrl',function($scope,$ionicHistory,CacheFactory,alertService,commonServices,UrlServices) 
    {
        //2018-11-12 活动点赞        
        var baseInfo = commonServices.getBaseParas();
        var actID = Number.parseInt(CacheFactory.get(GLOBAL_INFO.KEY_ACT_GOOD_ITEMID));
        if(actID > 9000){
            $scope.IsSuggest = true; //2018-11-12 特殊处理，是否录入建议
            actID -= 9000;
        }

        function InitInfo() {
            $scope.titleImgUrl=null;//'img/other/shufaTitle.jpg';
            $scope.activityGoodIcon="img/user.jpg";
            $scope.actDesc = '欢迎参与“南厂餐厅一楼风味档口喜欢度调查问卷”，每个人最多可投三票。';
            var url = commonServices.getUrl("EvaluationAppService.ashx", "getActivityGoods");
            var paras = {
                Token: baseInfo.Token,
                WorkdayNO:baseInfo.WorkdayNO,
                ActID: actID,
            };            
            commonServices.submit(paras, url).then(function (resp) {
              if (resp && resp.success) {
                $scope.Activities=resp.list;
                var arr = JSON.parse(resp.data);
                CacheFactory.save(GLOBAL_INFO.KEY_ACT_GOOD_ID, arr);
                setTimeout(InitPhotoScale, 1500); //图片缩放
              }
            });
        }
        InitInfo();

        var MAX_CLICK = 3; //一个人的最多点赞个数
        var TActivityGoodEntry = function(itemID, WorkDayNo){
            var self=this;
            self.RefActivityGoodID=0;
            self.WorkdayNo=0;
        }
        function GetActivityGoodCache(){
            return JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_ACT_GOOD_ID)) || []; //数组
        }

        $scope.like = function(item){
            var likeInfo = GetActivityGoodCache();
            var nClick = likeInfo.length;
            if(nClick >= MAX_CLICK){
                //alertService.showAlert("最多只能点赞"+MAX_CLICK+"个");
                alertService.showAlert("最多只能投"+MAX_CLICK+"票");
                return;
            }
            var hasClicked=false;
            for(var i=0; i<likeInfo.length; i++){
                var entry = likeInfo[i];
                if(item.ID==entry.RefActivityGoodID
                    && entry.WorkdayNo==$scope.accessEmployee.WorkdayNO
                   ){
                    //alertService.showAlert("你已经点过赞了");
                    alertService.showAlert("你已经投过票了");
                    hasClicked=true;
                    break;
                }
            }
            if(!hasClicked){
                var url = commonServices.getUrl("EvaluationAppService.ashx", "addActivityGoods");
                var paras={
                    Token: baseInfo.Token,
                    WorkdayNO: baseInfo.WorkdayNO,
                    CName: baseInfo.CName,
                    ItemID:item.ID
                };
          
                commonServices.submit(paras, url).then(function (resp) {
                    if(resp.success){
                        var likeInfo = GetActivityGoodCache();
                        likeInfo.push(new TActivityGoodEntry(item.ID, $scope.accessEmployee.WorkdayNO));
                        CacheFactory.save(GLOBAL_INFO.KEY_ACT_GOOD_ID, likeInfo);
                        //刷新
                        InitInfo();                        
                    }
                });
            }
        };

        $scope.model={
            suggestion:""
        };
        $scope.submitSuggest = function(){
            var sugg = $.trim($scope.model.suggestion);
            if(isEmptyString(sugg)){
                return;
            }
            var url = commonServices.getUrl("EvaluationAppService.ashx", "submitActivityGoodSuggest");
            var paras={
                Token: baseInfo.Token,
                ActID: actID,
                WorkdayNO: baseInfo.WorkdayNO,
                CName: baseInfo.CName,
                Suggest: sugg
            };
      
            commonServices.submit(paras, url).then(function (resp) {
                if(resp.success){
                    alertService.showAlert("感谢您的建议");
                }
                $ionicHistory.goBack();
            });
        };
        $scope.openGeneralNotice = function(isUrlHtml, id, html) {
            UrlServices.openGeneralNotice(isUrlHtml,id,html);
        };
    })
    .controller('ActivityEHSCtrl',function($scope,$rootScope,$ionicPopup,
                CacheFactory,alertService,$state,$ionicHistory,commonServices,$location) 
    {
        //2018-06-20 EHS有奖答题活动
        var ehsAct = JSON.parse(CacheFactory.get('ehsAct'));
        $scope.imgUrl = ehsAct.ImageUrl;
        $scope.htmlConent = ehsAct.HtmlConent;

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        var url = commonServices.getUrl("EHSActService.ashx", "GetEHSActDetails");
        var params = { ActID: ehsAct.ActID };
        commonServices.getDataList(params, url).then(function (data) {
            if (data == "Token is TimeOut") {
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }

            if (!data) {
                alertService.showAlert("该活动还没有题目");
                $state.transitionTo('activityList');
                return;
            }
            $scope.researchDetailList = data;
        });
        function CalcFullScore(items){
            var fullScore=0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                for(var j=0; j<item.Items.length; j++){
                    fullScore += item.Items[j].ItemScore;
                }
            }
            return fullScore;
        }

        $scope.isSumbiting = false;
        $scope.Submit = function () {
            if ($scope.isSumbiting) { return; }
            $scope.isSumbiting = true;

            var SubmitList = [];
            var sumScore = 0;
            var nDoItem = 0;
            var fullScore = CalcFullScore($scope.researchDetailList);

            for (var i = 0; i < $scope.researchDetailList.length; i++) {
                var item = $scope.researchDetailList[i];
                var qChecks = $("input[name='Item" + item.Sort + "'" + "]:checked");
                if (qChecks.length > 0) {
                    nDoItem++;
                }
                for (var j = 0; j < qChecks.length; j++) {
                    var selVaule = $(qChecks[j]).val();
                    if (typeof (selVaule) == 'undefined') {
                        continue;
                    }
                    var sScore = selVaule.split("^")[1];
                    sumScore += parseInt(sScore);
                    SubmitList.push({ Item: item.Sort, ItemResult: selVaule });
                }
            }

            if(fullScore>0 && (sumScore/fullScore < 0.60)){
                alertService.showAlert("分数尚未及格，仍需继续努力!");
                $scope.isSumbiting = false;
                return;
            }

            if (nDoItem != $scope.researchDetailList.length) {
                alertService.showAlert("还有未选择的项目，请选择完成后再提交");
                $scope.isSumbiting = false;
                return;
            }
            else {
                params.WorkdayNo = $scope.accessEmployee.WorkdayNO;
                params.ActID = ehsAct.ActID;
                params.SumScore = sumScore;
                params.SubmitResult = angular.toJson(SubmitList);
                var url = commonServices.getUrl("EHSActService.ashx", "SubmitActResult");
                try {
                    commonServices.submit(params, url).then(function (data) {
                        if (data.success) {
                            var x = parseFloat(data.data)
                            if (x > 0) {
                                $rootScope.money = '红包金额:' + data.data + '元';
                                $rootScope.rebagPopup = $ionicPopup.show({
                                    cssClass: 'er-popup',
                                    templateUrl: 'templates/comm/hongbao.html',
                                    scope: $rootScope
                                });
                                $rootScope.rebagPopup.then(function (res) {
                                    $scope.isSumbiting = false;
                                    //$state.go('activityList');
                                    $state.go('myAccountMoney');
                                });
                            }
                            else {
                                $scope.isSumbiting = false;
                                alertService.showAlert('谢谢你的参与!');
                                $ionicHistory.goBack();
                                $rootScope.updateSlideBox();
                            }
                        }
                        else {
                            $scope.isSumbiting = false;
                            alertService.showAlert(data.message);
                        }
                    }
                    );
                } finally {
                    $scope.isSumbiting = false;
                }
            }
        };

        $scope.SkipToNotice = function(noticeID){
            if(!noticeID){return;}
            CacheFactory.remove('noticeID');
            CacheFactory.save('noticeID', noticeID);
            $state.go('noticeHtml');
        }
    })
    .controller('ResearchTrainerCtrl', function ($scope, $rootScope, $ionicPopup,
                    CacheFactory, alertService, $state, $ionicHistory, commonServices, $location,
                    duplicateSubmitServices)
    {
        //旧的活动答题，题目有分数
        //支持单选、多选
        //2019-03-01 园区38女王节有奖答题

        var url = commonServices.getUrl("EHSActService.ashx", "GetSingleActWithDetail");
        var actID = '98D2DF42-DDCA-417F-A328-E87B2DD188C9';
        var params = {
            ActID: actID,
            SubmitGuid: duplicateSubmitServices.genGUID(),
            WorkdayNo: $rootScope.accessEmployee.WorkdayNO
        };
        commonServices.submit(params, url).then(function (resp) {
            if (!resp) {
                alertService.showAlert("该活动还没有题目");
                $state.transitionTo('researchList');
                return;
            }
            if(!resp.success){
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
                return;
            }
            var obj = resp.obj;
            $scope.researchDetailList = obj.details;
            $scope.researchTitle = obj.act.ActName;
            $scope.imgUrl = obj.act.ImageUrl;
            $scope.htmlConent = obj.act.HtmlConent;
        });
        function CalcFullScore(items) {
            var fullScore = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                for (var j = 0; j < item.Items.length; j++) {
                    fullScore += item.Items[j].ItemScore;
                }
            }
            return fullScore;
        }

        $scope.isSumbiting = false;

        $scope.Submit = function () {
            if ($scope.isSumbiting) { return; }
            $scope.isSumbiting = true;

            var SubmitList = [];
            var sumScore = 0;
            var nDoItem = 0;
            var fullScore = CalcFullScore($scope.researchDetailList);

            for (var i = 0; i < $scope.researchDetailList.length; i++) {
                var item = $scope.researchDetailList[i];
                var stype = item.Items[0].Type;          
                if ("radio" == stype) {
                  var $rad = $("input[name='Rad" + item.Sort + "'" + "]:checked");
                  if ($rad.length > 0) {
                    nDoItem++;
                  }
                  for (var j = 0; j < $rad.length; j++) {
                    var selVaule = $($rad[j]).val();
                    if (typeof (selVaule) == 'undefined') {
                      continue;
                    }
                    var sScore = selVaule.split("^")[2];
                    sumScore += parseInt(sScore);
                    SubmitList.push({
                      Item: item.Sort,
                      ItemResult: selVaule
                    });
                  }
                } else if ("checkbox" == stype) {
                  var $chk = $("input[name='Chk" + item.Sort + "'" + "]:checked");
                  if ($chk.length > 0) {
                    nDoItem++;
                  }
                  for (var j = 0; j < $chk.length; j++) {
                    var selVaule = $($chk[j]).val();
                    if (typeof (selVaule) == 'undefined') {
                      continue;
                    }
                    var sScore = selVaule.split("^")[2];
                    sumScore += parseInt(sScore);
                    SubmitList.push({
                      Item: item.Sort,
                      ItemResult: selVaule
                    });
                  }
                }
            }
                        
            if (nDoItem != $scope.researchDetailList.length) {
                alertService.showAlert("还有未选择的项目，请选择完成后再提交");
                $scope.isSumbiting = false;
                return;
            }
            else {
                //var scoreRate = fullScore > 0 ? (sumScore / fullScore) : 0;
                if(sumScore<10){
                    alertService.showAlert("分数过低，仍需继续努力!");
                    $scope.isSumbiting = false;
                    return;
                }

                // $rootScope.msgPopupPara = {
                //     msgTitle: sTitle,
                //     msgContext: sContext,
                //     msgPic: 'img/mygood.png',
                // };
                // $rootScope.msgPopup = $ionicPopup.show({
                //     cssClass: 'er-popup',
                //     templateUrl: 'templates/comm/msg_dlg.html',
                //     scope: $rootScope
                // });
                // $rootScope.msgPopup.then(function (res) {
                //     params.SumScore = sumScore;
                //     //params.SubmitResult = angular.toJson(SubmitList);
                //     DoChouJian();
                // });
                DoChouJian();
            }
        };

        function DoChouJian() {
            var url = commonServices.getUrl("ChoujiangServiceNew.ashx", "Choujiang_Game");            
            try {
                commonServices.submit(params, url).then(function (data) {
                    if (data.success) {
                        $rootScope.money = '' + data.data;
                        $rootScope.memo = '请于3月8日10:00 - 17:00 到B15中央饭堂B区领取奖品';
                        $rootScope.rebagPopup = $ionicPopup.show({
                            cssClass: 'my-custom-popup',
                            templateUrl: 'templates/comm/hongbaoChoujiang.html',
                            scope: $rootScope
                        });
                        $rootScope.rebagPopup.then(function (res) {
                        });
                    }
                    else {
                        alertService.showAlert('提示', data.message);
                    }
                });
            }
            catch (ex) {
                var msg = '通讯异常，请稍候再试<br>' + ex.message;
                alertService.showAlert('提示', msg);
            }
            finally {
                $scope.isSumbiting = false;
            }
        }
    })
    .controller('ResearchNewCtrl', function ($scope, $rootScope, $ionicPopup,
                CacheFactory, alertService, $state, $ionicHistory, commonServices, $location,
                duplicateSubmitServices) 
    {
      //2019 活动答题，题目没有分数，题目的选项最多可以有8项
      //支持单选、多选、填空
      var searchID = CacheFactory.get(GLOBAL_INFO.KEY_RESEARCH_NEW_ID);
      var baseInfo = commonServices.getBaseParas();
      var params = {
        Token: baseInfo.Token,
        SubmitGuid: duplicateSubmitServices.genGUID(),
        WorkdayNO: baseInfo.WorkdayNO,
        SearchID: searchID,        
      };

      function InitInfo(){
        var url = commonServices.getUrl("ResearchNewService.ashx", "GetDetails");
          commonServices.submit(params, url).then(function (resp) {
            if (!resp) {
              alertService.showAlert("该活动还没有题目");
              $ionicHistory.goBack();
              return;
            }

            $scope.CanAttend = resp.success;
            $scope.LastMsg = resp.message;
            var objResearch = JSON.parse(resp.data);
            $scope.researchTitle = objResearch.ResearchName;
            $scope.htmlConent = objResearch.ResearchConent;
            $scope.researchDetailList = resp.list;
          });
      }
      InitInfo();

      $scope.isSumbiting = false;
      $scope.Submit = function () {
        if ($scope.isSumbiting) {
          return;
        }
        $scope.isSumbiting = true;

        $scope.SubmitList = [];
        var bok = true;
        for (var i = 0; i < $scope.researchDetailList.length; i++) {
          var item = $scope.researchDetailList[i];
          var stype = item.TitleType;          
          if ("radio" == stype) {
            var $rad = $("input[name='Rad" + item.Sort + "'" + "]:checked");
            if (!$rad || !$rad.length) {
              bok = false;
              break;
            }
            var sel = $rad.val();
            $scope.SubmitList.push({
              ID: item.ID,
              Type: stype,
              Value: sel
            });
          } else if ("checkbox" == stype) {
            var $chk = $("input[name='Chk" + item.Sort + "'" + "]:checked");
            if (!$chk || !$chk.length) {
              bok = false;
              break;
            }
            var sel = "";
            for(var j=0; j<$chk.length; j++){
                sel += $chk[j].value +";";
            }
            $scope.SubmitList.push({
              ID: item.ID,
              Type: stype,
              Value: sel
            });
          } else if ("text" == stype) {
              var tval = $.trim($("textarea[name='Text" + item.Sort + "^" + i + "']").val());
              $scope.SubmitList.push({
                ID: item.ID,
                Type: stype,
                Value: tval
              });
          }
        }

        if (!bok) {
          alertService.showAlert("还有未选择的项目，请选择完成后再提交");
          $scope.isSumbiting = false;
          return;
        }
        else {
          DoSubmit();
        }
      };

      function DoSubmit() {
        params.SubmitResult = angular.toJson($scope.SubmitList);
        var url = commonServices.getUrl("ResearchNewService.ashx", "Submit");
        try {
          commonServices.submit(params, url).then(function (resp) {
            if (!resp) {
              var msg = $rootScope.Language.common.CommunicationErr;
              alertService.showAlert(msg);
              $scope.isSumbiting = false;
              return;
            } else if (!resp.success) {
              var msg = resp.message;
              alertService.showAlert(msg);
              //$ionicHistory.goBack();
              return;
            }else if(resp.success){
                var redenv=0.0;
                try {
                    redenv = parseFloat(resp.obj);
                } catch (error) {
                    console.dir(error);
                }
                if(redenv>0.0){
                    $rootScope.money = '' + redenv+'元';
                    //$rootScope.memo = '';
                    $rootScope.rebagPopup = $ionicPopup.show({
                        cssClass: 'my-custom-popup',
                        templateUrl: 'templates/comm/hongbaoChoujiang.html',
                        scope: $rootScope
                    });
                    $rootScope.rebagPopup.then(function (res) {
                    });
                }else{
                    alertService.showAlert('谢谢参与!');
                }
                $ionicHistory.goBack();
            }
          });
        } catch (ex) {
          var msg = '通讯异常，请稍候再试<br>' + ex.message;
          alertService.showAlert('提示', msg);
        } finally {
          $scope.isSumbiting = false;
        }
      }
    })
    .controller('ActivityHtmlCtrl', function($scope,CacheFactory,noticeService,alertService,$state,$ionicHistory,$location,commonServices) 
    {

        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        var activityID=CacheFactory.get('activityID');

        var strHtml='';

        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,ActivityID:activityID};
        noticeService.getActivityHTML(params).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            strHtml=data;

            $('#Activity_html').html(strHtml);
            CacheFactory.remove('activityID');
        });

        noticeService.getActivityDetails(params).then(function(data){

            if(data=="Token is TimeOut"){
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.activityDetailsList=data;

            //总人数
            $scope.activityCount=$scope.activityDetailsList[0].ActivityCount;

            //我的选择
            $scope.MySelItems=$scope.activityDetailsList[0].MySelItems;

            //柱状图
            $scope.labels=[];
            $scope.SelCount=[];
            for(var i=0; i<$scope.activityDetailsList.length;i++){
                $scope.labels.push($scope.activityDetailsList[i].Items);
                $scope.SelCount.push($scope.activityDetailsList[i].Count);
            }

            $scope.series = ['人数'];
            $scope.data = [];
            $scope.data.push($scope.SelCount);
        });

        $scope.CheckChang=function(t){
            $scope.detailsID= t.ID;

            for(var i=0;i<$scope.activityDetailsList.length;i++){

                if($scope.activityDetailsList[i]!=t){
                    $scope.activityDetailsList[i].check=false;
                }
            }
        };
        $scope.Submit=function() {
            if ($scope.detailsID.length > 0) {
                if ($scope.detailsID.length == 0) {
                    alertService.showLoading('请选择后再提交');
                    return;
                }

                var paras = commonServices.getBaseParas();
                paras.ActivityID = activityID;
                paras.detailsID = $scope.detailsID;
                // var paras={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,goldIdeaType:$scope.goldInputIdea.ideaType,goldIdeaContent:$scope.goldInputIdea.text};
                commonServices.submit(paras, API.SubmitActivity).then(function (data) {
                    if (data.success) {
                        alertService.showAlert('提交成功');

                        $ionicHistory.goBack();

                    }
                    else {
                        alertService.showAlert(data.message);
                    }
                });

            }

        }

    })
    .controller('HotPhoneCtrl', function($scope,$window,commonServices,CacheFactory,$ionicHistory,$state) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        //记录点击
        var paras1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,opType:'免费热线电话',opContent:'点击进入'};
        commonServices.operationLog(paras1).then(function(data){
            $scope.sucess=data;
        });

        // $scope.Hotline='4001099899';
        // $scope.callPhone=function(){
        //     $window.location.href="tel:"+$scope.Hotline+"";
        // }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

        $scope.open=function(itmes){
            CacheFactory.save('hotItems', itmes);
            $state.go('hotPhoneDetails');
        }

    })
    .controller('B15HotPhoneCtrl', function($scope,$window,commonServices,CacheFactory,$ionicHistory,$state) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));

        //记录点击
        var paras1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,opType:'免费热线电话',opContent:'点击进入'};
        commonServices.operationLog(paras1).then(function(data){
            $scope.sucess=data;
        });

        // $scope.Hotline='4001099899';
        // $scope.callPhone=function(){
        //     $window.location.href="tel:"+$scope.Hotline+"";
        // }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }
    })
    .controller('HotPhoneDetailsCtrl', function($scope,$window,commonServices,CacheFactory,$ionicHistory,$state) {
        $scope.hotItems =CacheFactory.get('hotItems');
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        if($scope.hotItems==1){
            // 园区热线
            $scope.items=[
                {description:"400员工服务热线",phone:"4001099899",bz:"24小时值班电话"},
                {description:"工会热线",phone:"18926985395",bz:"24小时值班电话"},
                {description:"心灵热线",phone:"18926985442",bz:"24小时值班电话"},
                {description:"医务室",phone:"18926985310",bz:"24小时值班电话"},
                {description:"园区安全部",phone:"18926988110",bz:"24小时值班电话"},
                {description:"餐厅饭卡",phone:"5121667 18926980035",bz:"正常工作日8:30~17:30"},
                {description:"南厂宿舍管理",phone:"15912607056",bz:"24小时值班电话"},
                {description:"园区DL招聘热线",phone:"4001662221",bz:"正常工作日8:30~17:30"},
                {description:"Flex+ / LTP密码重置",phone:"0755-86155600转2",bz:"正常工作日8:30~17:30"},
            ];
        }
        else if($scope.hotItems==2){
            // B13 PCBA-South Campus热线
            $scope.items=[
                {description:"新入职DL接待热线",phone:"5186137",bz:"正常工作日8:30~17:30"},
                {description:"安全部（门禁卡、手机标签）",phone:"5186489",bz:"正常工作日8:30~17:30"},
                {description:"工衣柜管理",phone:"18926971043",bz:"24小时值班电话"},
                {description:"在职考勤咨询",phone:"5189082",bz:"正常工作日8:30~17:30"},
                {description:"在职薪资/住房公积金咨询",phone:"5188140 5186514",bz:"正常工作日8:30~17:30"},
                {description:"离职薪资/生日礼金咨询",phone:"5189541",bz:"正常工作日8:30~17:30"},
                {description:"离职考勤咨询",phone:"5186300",bz:"正常工作日8:30~17:30"},
                {description:"社会保险咨询",phone:"5189005",bz:"正常工作日8:30~17:30"},
                {description:"工伤保险咨询",phone:"5189216 5188672",bz:"正常工作日8:30~17:30"},
                {description:"商业保险咨询",phone:"5188108",bz:"正常工作日8:30~17:30"},                
                {description:"员工申诉投诉",phone:"5186026 5186829 5186866",bz:"正常工作日8:30~17:30"},
                {description:"违纪单咨询",phone:"5186866",bz:"正常工作日8:30~17:30"},
                {description:"员工服务中心",phone:"5186509",bz:"周一至周六07:30~20:30"},
                {description:"员工培训中心",phone:"5186133",bz:"正常工作日08:30~17:30"},
            ];
        }
        else{
            $scope.items=[
                {description:"收集中",phone:"",bz:""}
            ];
        }



        $scope.callB13Phone=function(item){
            $window.location.href="tel:"+item.phone+"";

        }

        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        }

    })
    .controller('MyMsgCtrl', function($scope,$rootScope,$location,$state,$ionicLoading,myMsgService,alertService,CacheFactory,commonServices) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token};

        $rootScope.updateMsgCount=function(){
            commonServices.getMsgCount(params).then(function(data){
                $rootScope.MsgCount=data.MyMsgCount>0?data.MyMsgCount:'';
                $scope.NoticeCount=data.MyNoticeCount>0?data.MyNoticeCount:'';

            });
        };
        myMsgService.getMsgList(params).then(function(data){
            if(data=="Token is TimeOut")
            {
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
            $scope.msgList=data;
        });

        $rootScope.updateMsgCount();
        $scope.open=function(msg){
            CacheFactory.remove('MsgDetails');
            CacheFactory.save('MsgDetails', msg);
            $state.go('tab.myMsgDetail');
        }

    })
    .controller('MyMsgDetailCtrl', function($scope,$location,$ionicLoading,myMsgService,alertService,CacheFactory) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        $scope.MsgDetails = JSON.parse(CacheFactory.get('MsgDetails'));


        var params={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,Msg_ID:$scope.MsgDetails.Msg_ID};
        myMsgService.updateMsgStatus(params).then(function(data){
            if(data=="Token is TimeOut")
            {
                alertService.showAlert("登录失效，请重新登录");
                $state.transitionTo('signin');
            }
        });

    })    
    .controller('AskAndAnswerCtrl', 
        function($scope,CacheFactory,commonServices,AskAndAnswerService,$state,$ionicHistory,alertService) 
    {
//        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
//        //记录点击
//        var paras1={ WorkdayNO: $scope.accessEmployee.WorkdayNO,Token:$scope.accessEmployee.Token,opType:'问与答',opContent:'点击进入'};
//        commonServices.operationLog(paras1).then(function(data){
//            $scope.sucess=data;
//        });

        function GetCatList() {
          var url = commonServices.getUrl("EvaluationAppService.ashx", "AskAndAnswerCate");
          var paras = commonServices.getBaseParas();
          commonServices.submit(paras, url).then(function (resp) {
            if (resp) {
              if (!resp.success) {
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
              } else {
                $scope.catList = resp.list;
              }
            }
          });
        }
        $scope.catList = [];
        GetCatList();
        
        $scope.open = function(keyw){
            CacheFactory.save(GLOBAL_INFO.KEY_ASK_AND_ANS_ID, keyw);
            $state.go('askAndAnswerDetail');
        };
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };

    })
    .controller('AskAndAnswerDetailCtrl', 
                function($scope,CacheFactory,commonServices,AskAndAnswerService,$state,$ionicHistory) 
    {
        var paras= commonServices.getBaseParas();
        paras.keyword =  CacheFactory.get(GLOBAL_INFO.KEY_ASK_AND_ANS_ID) || 'all';
        $scope.title = paras.keyword;

        function GetList(paras){
            AskAndAnswerService.getAskAndAnswer(paras).then(function(resp){
                $scope.listAskAndAnswer = resp.list;
                //$scope.keywords = JSON.parse(resp.data);
            });
        }
        GetList(paras);
    })
    .controller('LightPowerCtrl', function($scope,$rootScope,$ionicSlideBoxDelegate ,$timeout,$state,$location,alertService, CacheFactory ,commonServices,externalLinksService) {
        $rootScope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        if ($rootScope.accessEmployee) {

            $scope.closePass=function(){

                $state.go('tab.home');
            }
            var parameter = commonServices.getBaseParas();

            $scope.ledup=function(){
                parameter.op="led_up";
                commonServices.setLed(parameter).then(function (data) {

                });
            }
            $scope.leddown=function(){
                parameter.op="led_down";
                console.log(parameter);
                commonServices.setLed(parameter).then(function (data) {

                });
            }

        }

    })
    .controller('CJCtrl', function($scope,$rootScope,CacheFactory,commonServices,$state,$ionicHistory,$interval,$ionicPopup,alertService,noticeService) {
        $scope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
     console.log("cj");
        var params= commonServices.getBaseParas();
        var submitParams= params;
        $scope.InitSelect=function(){
            noticeService.getChoujiangGuestList(params).then(function(data){
                if(data.success){
                    console.log("choujiang");
                    $scope.listGuest=data.list;

                }
            });
        }
        $scope.InitSelect();

        $scope.showGuest=function(){

            var html1='';
            for(var i=0;i<$scope.listGuest.length;i++){
                html1=html1+ $scope.listGuest[i].WorkdayNo+" "+$scope.listGuest[i].CName+'<br/>';
                if(i==2) break;
            }

            var html2='<section class="editor selected">'+
                ' <section style="border: 0px none;">'+
//                '<section style="padding: 10px">'+
                '<section>'+
                '<section style="width: 330px;height: 330px;margin:0 auto; border-radius:50%;background-image: url(http://newcdn.96weixin.com/c/mmbiz.qlogo.cn/mmbiz_png/uN1LIav7oJicb1xwsm8bcFPB7HFvv8Ze5y1lJWBfYPnoEfQaqIiaywMib0EK46dmD2LX9ibeoibvhXBMfRspFgjMwwQ/0?wx_fmt=png);background-size: 100% auto;background-repeat: no-repeat;background-position: center; overflow: hidden;color: #db214c;text-align: center;display: flex;display: -webkit-flex;justify-content: center;-webkit-justify-content: center;align-items: center;-webkit-align-items:  center;">'+
                '<section><p style="margin: 0;font-size: 20px;letter-spacing: 3px;line-height: 30px">'+
                '<strong>'+html1+'</strong></p><br/>'+
                '<p style="margin: 0;border: 1px solid #db214c;font-size: 14px;padding: 0 10px"> <strong>吉 祥 如 意</strong></p> </section> </section> </section> </section> </section>';



            $ionicPopup.show({
                template:html2,
                cssClass:'my-custom-popup-Alter',
                title: '抽奖人员',
                subTitle: '',
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


        $scope.selGuest=function(guest){

            submitParams.sumbmitWorkdayNo=guest;

        };




        $scope.isSumbiting=false;

        $scope.Submit=function() {

            if($scope.listGuest.length==0) return;
            if($scope.isSumbiting==true) return;
            $scope.isSumbiting=true;
            try{
                commonServices.submit(submitParams, API.Choujiang).then(function (response) {
                    if (response.success) {
                        $scope.isSumbiting=false;
                        $rootScope.money=''+response.data;
                        $rootScope.rebagPopup=$ionicPopup.show({
                            cssClass:'my-custom-popup',
                            templateUrl: 'templates/comm/hongbaoChoujiang.html',
                            scope: $rootScope
                        });
                        $rootScope.rebagPopup.then(function(res) {

//                    $state.go('tabPoints.points');
                        });

                    }
                    else {
                        $scope.isSumbiting=false;
                        alertService.showAlert('提示',response.message);
                    }
                    // submitParams.sumbmitWorkdayNo='';

                    $scope.InitSelect();
                });
            }
            catch (ex){

            }

        }




        $scope.closePass=function(){
            $interval.cancel($scope.timer);
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });


            $state.go('tab.home');
        }

    })
    .controller('ChoujiangNameCtrl', function($scope,$rootScope,CacheFactory,commonServices,$state,$ionicHistory,$interval,$ionicPopup,alertService,noticeService) {

        $scope.userInput = {
            Employee_ID:'',
            CName:''
        };
        
        $scope.isSumbiting = false;

        $scope.Submit=function() {
            if($scope.userInput.Employee_ID.length==0) return;
            if($scope.userInput.CName.length==0) return;
            $scope.isSumbiting=true;

            var url=commonServices.getUrl("ChoujiangService.ashx","SubmitName");
            commonServices.submit($scope.userInput,url).then(function(data){
                alertService.showAlert(data.message);

            });
        }

    })
    .controller('ChoujiangGameCtrl', function ($scope, $rootScope, CacheFactory, commonServices, $state, $ionicHistory, $interval, $ionicPopup, alertService, noticeService)
    {
        $scope.userInput = {
            Employee_ID:''
        };

        $scope.isSumbiting=false;

        $scope.Submit=function() {

            if($scope.userInput.Employee_ID.length==0) return;

            $scope.isSumbiting=true;

            var url=commonServices.getUrl("ChoujiangService.ashx","Choujiang_Game");
            try{
                commonServices.submit($scope.userInput,url).then(function(data){
                    if (data.success) {
                        $scope.isSumbiting=false;
                        $rootScope.money=''+data.data;
                        $rootScope.rebagPopup=$ionicPopup.show({
                            cssClass:'my-custom-popup',
                            templateUrl: 'templates/comm/hongbaoChoujiang.html',
                            scope: $rootScope
                        });
                        $rootScope.rebagPopup.then(function(res) {

//                    $state.go('tabPoints.points');
                        });

                    }
                    else {
                        $scope.isSumbiting=false;
                        alertService.showAlert('提示',data.message);
                    }

                    $scope.userInput.Employee_ID="";

                });
            }
            catch(ex){

            }
        }

        $scope.showGuest=function(){
            if($scope.userInput.Employee_ID.length==0) return;
            var html1='';

            var url=commonServices.getUrl("ChoujiangService.ashx","Choujiang_GameResult");
            commonServices.submit($scope.userInput,url).then(function(data){
                if (data.success) {

                    var html2='<section class="editor selected">'+
                        ' <section style="border: 0px none;">'+
                        '<section>'+
                        '<section style="width: 330px;height: 330px;margin:0 auto; border-radius:50%;background-image: url(http://newcdn.96weixin.com/c/mmbiz.qlogo.cn/mmbiz_png/uN1LIav7oJicb1xwsm8bcFPB7HFvv8Ze5y1lJWBfYPnoEfQaqIiaywMib0EK46dmD2LX9ibeoibvhXBMfRspFgjMwwQ/0?wx_fmt=png);background-size: 100% auto;background-repeat: no-repeat;background-position: center; overflow: hidden;color: #db214c;text-align: center;display: flex;display: -webkit-flex;justify-content: center;-webkit-justify-content: center;align-items: center;-webkit-align-items:  center;">'+
                        '<section><p style="margin: 0;font-size: 20px;letter-spacing: 3px;line-height: 30px">'+
                        '<strong>'+data.message+'</strong></p><br/>'+
                        '<p style="margin: 0;border: 1px solid #db214c;font-size: 14px;padding: 0 10px"> <strong>吉 祥 如 意</strong></p> </section> </section> </section> </section> </section>';

                    $ionicPopup.show({
                        template:html2,
                        cssClass:'my-custom-popup-Alter',
                        title: '中奖查询',
                        subTitle: '',
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
                else {

                    alertService.showAlert('提示',data.message);
                }

                $scope.userInput.Employee_ID="";

            });
        }

        $scope.txtChange=function(){
            console.log('11');
            if($scope.userInput.Employee_ID.length==0) return;
            if($scope.userInput.Employee_ID.length>=10){
                console.log('aa');
                var url=commonServices.getUrl("AccountService.ashx","GetOneCartID");

                try{
                    commonServices.getData($scope.userInput,url).then(function(data){
                        if(data=='读取不到工号数据'){
                            alertService.showAlert(data);
                        }
                        else{
                            $scope.userInput.Employee_ID=data;
                        }
                    });
                }
                catch(ex){
                }

            }
        }
    })

    .controller('PhotoCtrl', function($scope,$rootScope,$ionicSlideBoxDelegate ,$timeout,$state,$location,alertService, CacheFactory ,commonServices,externalLinksService) {
        $rootScope.accessEmployee = JSON.parse(CacheFactory.get('accessEmployee'));
        if ($rootScope.accessEmployee) {

            $scope.closePass=function(){

                $state.go('tab.home');
            }
            var parameter = commonServices.getBaseParas();

            var video=document.getElementById("video");
            var context=canvas.getContext("2d");
              var errocb=function(){
                console.log("sth srong");
                 }
            if(navigator.getUserMedia){
               navigator.getUserMedia({
                   "video":{
                   'optional': [{
                       'sourceId': exArray[1] //0为前置摄像头，1为后置
                   }]
               }},function(stream){
                    video.src=stream;
                     video.play();
                   },errocb);
                }else if(navigator.webkitGetUserMedia){
                navigator.webkitGetUserMedia({"video":true},function(stream){
                   video.src=window.webkitURL.createObjectURL(stream);
                    video.play();
                     },errocb);
               }
            document.getElementById("paizhao").addEventListener("click",function(){
                 context.drawImage(video,0,0,480,640);
                });

        }

    })
    .controller('AnnualPartyTicket2019Ctrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                            commonServices, CacheFactory, alertService, actionVisitServices) 
    {
        //2019年新春文艺晚会
        function InitInfo() {
          var url = commonServices.getUrl("ApplySubmitService.ashx", "GetAnnualPartyTicket2019");
          var paras = commonServices.getBaseParas();
          $scope.model = paras;
          $scope.ticket = '很抱歉，您还没有2019春晚门票！';
          $scope.bHasTicket=false;
          $scope.clsTick="noTick";
          commonServices.submit(paras, url).then(function (resp) {
            if (resp) {
              if (resp.success) {
                var obj = resp.obj;
                $scope.bHasTicket=true;
                $scope.clsTick="hasTick";
                $scope.ticket = obj.Employee_ID +'<br>'+obj.Chinese_Name+'<br>'+obj.Organization;
                if(!isEmptyString(obj.Employee_ID)){
                    JsBarcode("#idBarcode", obj.Employee_ID);
                }                
              }
            }
          });
        }
        InitInfo();

    })
    .controller('Act2019SpringSubsidyCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, alertService, duplicateSubmitServices, UrlServices) 
    {
        //工会2019春节返程补贴
        var paras = $.extend({}, commonServices.getBaseParas());
        paras.ActID = '0BADD6A6-F030-4BD9-9569-283C03D47484';        
        var idNull = 9999;

        function InitInfo() {
            paras.SubmitGuid = duplicateSubmitServices.genGUID();
            var url = commonServices.getUrl("choujiangservicenew.ashx", "Choujiang_GameResult");            
            $scope.model = paras;
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    $scope.hasSubmit = resp.success;
                    //2019-03-05 特殊处理，空奖
                    if(resp.success){
                        if(resp.data && resp.data>0 && resp.data!=idNull){
                            $scope.jpType = 1;
                        }else{
                            $scope.jpType = 0;
                        } 
                    }
                }
            });
        }
        InitInfo();

        $scope.openSubmitMat = function(){
            try {
                var url = "http://flexzhunion0756.mikecrm.com/juc1zbd";
                UrlServices.openForeignUrl(url);
            }
            catch (ex) {
                alertService.showAlert(ex.message);
            }
        };

        function DoChouJian() {
            var url = commonServices.getUrl("ChoujiangServiceNew.ashx", "Choujiang_Game");            
            try {
                commonServices.submit(paras, url).then(function (data) {
                    if (data.success && data.data>0 && data.data!=idNull) {
                        var smsg = '恭喜您！待核对不与斗门区总新春补助资格重复后即为中奖，请及时提交相关资料！如有疑问请电话咨询40010-99899转5';
                        alertService.showAlert('提示', smsg);
                        $scope.hasSubmit=true;
                        $scope.jpType = 1;
                    }
                    else if(data.data == -2){
                        var smsg = '感谢您对工会活动的支持！本次抽奖不成功！您已经成功申请斗门区总工会的新春返程补助，如已经递交资料，敬请留意到账情况。如有疑问请电话咨询40010-99899转5';
                        alertService.showAlert('提示', smsg);
                        $ionicHistory.goBack();
                    }else{
                        var smsg = '未抽中！感谢您支持工会活动！如有疑问请电话咨询40010-99899转5';
                        alertService.showAlert('提示', smsg);
                        $ionicHistory.goBack();
                    }                    
                });
            }
            catch (ex) {
                var msg = '通讯异常，请稍候再试<br>' + ex.message;
                alertService.showAlert('提示', msg);
            }
        }
        $scope.Submit = function() {
            DoChouJian();
        };
    })
    .controller('ActPoetryContestCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, alertService, duplicateSubmitServices, UrlServices) 
    {
        //地球周环保知识竞赛
        var baseInfo = commonServices.getBaseParas();
        var SubmitGuid = duplicateSubmitServices.genGUID();
        $scope.SubActID=null;
        $scope.CanAns=false;

        function InitInfo() {
            var paras = {
                Token: baseInfo.Token,
                ActID:'AF8F0BFC-F53F-488C-9E61-3BF223846CC7',
                WorkdayNo: baseInfo.WorkdayNO,
            };
            //paras.SubmitGuid = duplicateSubmitServices.genGUID();
            var url = commonServices.getUrl("ActivityService.ashx", "GetInitRand");            
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(resp.success){
                        $scope.CanAttend=true;
                        $scope.SubActID=resp.data;
                        $scope.htmlConent = "<h3>欢迎参加地球周环保知识竞赛在线答题</h3><br>一共10道题，<span style='color:red'>每题答题限时20秒</span>。"
                                            +"<br>每答对一题奖励红包0.5元，一起来瓜分4000元吧，你准备好了吗？"
                                            +"<br>备注：红包奖金将于活动结束之后，统一充值到一卡通帐号，后续请留意Flex+“我的消息”的消息。";
                        $scope.showStartButton=true;
                    }else{
                        $scope.CanAttend=false;
                        $scope.LastMsg = resp.message;
                    }
                }
            });
        }
        InitInfo();

        var questsions = null;        
        $scope.curQuest = null;
        $scope.StartAns = function() {
            var url = commonServices.getUrl("EHSActService.ashx", "GetEHSActDetails");
            var paras = { ActID: $scope.SubActID};
            commonServices.submit(paras, url).then(function (resp) {
                if (resp) {
                    if(resp.success){
                        questsions = resp.list;
                        $scope.CanAns = (resp.list && resp.list.length>0);
                        UserStartAns();
                    }else{
                        alertService.showAlert("该活动还没有题目");
                        $ionicHistory.goBack();
                    }
                }
            });
        };

        var MAX_TIMEOUT=(20+0)*1000; //limit
        $scope.curIndex = -1;
        var idTim=null;
        var idRemain=null;
        var fullScore=100;
        var sumScore=0; //实际分数

        function KillIDTim(){
            if(idTim){
                clearInterval(idTim);
                idTim=null;
            }
        }
        function KillIDRemain(){
            if(idRemain){
                clearInterval(idRemain);
                idRemain=null;
            }
        }
        function SwitchQues(){
            KillIDRemain();
            $scope.curIndex++;
            $scope.curQuest = questsions[$scope.curIndex];
            var nsec=MAX_TIMEOUT;
            idRemain = setInterval(function(){
                $scope.$apply(function(){
                    $scope.remainSec = nsec/1000;
                });                
                nsec-=1000;
                if(nsec<=0){
                    KillIDRemain();
                }
            }, 1000);
        }
        function CalcFullScore(items) {
            var fullScore = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                for (var j = 0; j < item.Items.length; j++) {
                    fullScore += item.Items[j].ItemScore;
                }
            }
            return fullScore;
        }
        function UserStartAns(){
            fullScore = CalcFullScore(questsions);
            AutoSwitch();
        }
        function AutoSwitch(){
            KillIDTim();
            if(!$scope.hasMore()){
                TriggerFinal();
                return;
            }
            SwitchQues();
            idTim=setInterval(function(){
                 if(!$scope.hasMore()){
                    KillIDTim();
                    TriggerFinal();
                }else{
                    KillIDRemain();            
                    sumScore += CalcAnsScore();
                    SwitchQues();
                }
            },MAX_TIMEOUT);
        }
        $scope.AnsQues = function(){
            KillIDTim();
            KillIDRemain();
            var score = CalcAnsScore();
            sumScore += score;
            if($scope.curIndex==questsions.length-1){                
                KillIDTim();                
                TriggerFinal();
            }else{
                AutoSwitch();
            }            
        }
        $scope.hasMore=function(){
            return questsions && $scope.curIndex<questsions.length;
        }

        function CalcAnsScore() {
          var item = $scope.curQuest;
          var score = 0;
          //只支持单选
          var $rad = $("input[name='Rad" + item.Sort + "'" + "]:checked");
          for (var j = 0; j < $rad.length; j++) {
            var selVaule = $($rad[j]).val();
            if (typeof (selVaule) == 'undefined') {
              continue;
            }
            var sScore = selVaule.split("^")[2];
            score += parseInt(sScore);
            //SubmitList.push({ Item: item.Sort, ItemResult: selVaule });
          }
          return score;
        }

        $scope.ansDone=false;
        //最终分数提交
        function TriggerFinal(){
            $scope.ansDone=true;
            $scope.CanAns=false;
            $scope.CanAttend=false;
            var paras = {
                Token: baseInfo.Token,
                SubmitGuid: SubmitGuid,
                ActID: $scope.SubActID,
                WorkdayNo: baseInfo.WorkdayNO,
                SumScore: sumScore,
                SubmitResult:""//not use
            };

            var url = commonServices.getUrl("ActivityService.ashx", "SubmitActResult");
            commonServices.submit(paras, url).then(function (resp) {
              if (resp.success) {
                var x = parseFloat(resp.data)
                if (x > 0) {
                  $rootScope.money = '红包金额:' + resp.data + '元';
                  $rootScope.rebagPopup = $ionicPopup.show({
                    cssClass: 'er-popup',
                    templateUrl: 'templates/comm/hongbao.html',
                    scope: $rootScope
                  });
                  $rootScope.rebagPopup.then(function (res) {
                    //$state.go('activityList');
                    //$state.go('myAccountMoney');
                    $ionicHistory.goBack();
                  });
                } else {
                  alertService.showAlert('谢谢你的参与!');
                  $ionicHistory.goBack();
                  $rootScope.updateSlideBox();
                }
              } else {
                alertService.showAlert(resp.message);
                $ionicHistory.goBack();
              }
            });
        }

    })    
////////////////////////////////////////////////    
;