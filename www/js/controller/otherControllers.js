/**
 * 其它未分类的功能
 * johnsing he 2019-12-17
 */
angular.module('evaluationApp.otherControllers', [])
    .controller('BallFieldBookingNoticeCtrl', function ($scope, $rootScope, $state, $ionicHistory, 
        $ionicModal, $ionicPopup,$sce,
        commonServices, CacheFactory, alertService,
        UrlServices, duplicateSubmitServices) 
    {
        //球场公告
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };

        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
        };

        var baseInfo = commonServices.getBaseParas();
        $scope.curBallFieldID = 1; //只有一个场，写死
        $scope.curBallFieldName = '新青足球场';

        function InitInfo() {
          var url = commonServices.getUrl("BallFieldService.ashx", "GetNotice");
          var paras = {
            WorkdayNo: baseInfo.WorkdayNO
          };
          commonServices.submit(paras, url).then(function (resp) {
            if (resp) {
              if (resp.success) {
                var obj = resp.obj;
                var noticeLst = obj.noticeList;
                $scope.BallFieldName = $scope.curBallFieldName;
                $scope.BallFieldID = $scope.curBallFieldID;
                $scope.noticeList = noticeLst;
                $scope.bkList = obj.bkList;
              }
            } else {
              var msg = $rootScope.Language.common.CommunicationErr;
              alertService.showAlert(msg);
            }
          });
        }
        InitInfo();

        //预定
        $scope.Params={
            //SubmitGuid: duplicateSubmitServices.genGUID(),
            BallFieldID: $scope.curBallFieldID,
            CName: baseInfo.CName,
            Segment: baseInfo.Organization,
            WorkdayNO: baseInfo.WorkdayNO,
            MobileNo: baseInfo.MobileNo,            
            SelectedDate: moment().toDate(),
            BeginTime:null,
            EndTime:null,
        };
        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {            
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.submit=function(){
            var sTemp = $.trim($scope.Params.MobileNo);
            $scope.Params.MobileNo=sTemp;
            if (!sTemp || sTemp.length<5) {
                alertService.showAlert("请提供联系电话!");
                return;
            }            
            sTemp = $.trim($scope.Params.SelectedDate);
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请选择预定日期!");
                return;
            }
            sTemp = $.trim($scope.Params.BeginTime);
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请选择开始时间!");
                return;
            }
            sTemp = $.trim($scope.Params.EndTime);
            if (isEmptyString(sTemp)) {
                alertService.showAlert("请选择结束时间!");
                return;
            }

            var timBegin = moment($scope.Params.BeginTime);
            var timEnd = moment($scope.Params.EndTime);
            var duration = moment.duration(timEnd.diff(timBegin));
            var mins = duration.asMinutes();
            if( mins<=15){
                alertService.showAlert("时间范围不合理，请检查开始与结束时间!");
                return;
            }
            $scope.Params.SelectedDate=moment($scope.Params.SelectedDate).format('YYYY-MM-DD');
            $scope.Params.BeginTime=timBegin.format('HH:mm');
            $scope.Params.EndTime=timEnd.format('HH:mm');
            $scope.Params.BallFieldID = $scope.BallFieldID;
            DoSubmit($scope.Params);
        };

        function DoSubmit(paras){            
            var url = commonServices.getUrl("BallFieldService.ashx", "SubmitBook");
            commonServices.submit(paras, url).then(function (resp) {
                if (resp.success) {
                    $scope.modal.hide();
                    //$state.go("BallFieldBooking.Notice");
                    InitInfo();
                }
                else {
                    alertService.showAlert(resp.message);
                }
            });
        }
    })
    .controller('BallFieldBookingQueryCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService,
        UrlServices, externalLinksService) 
    {
        //查询
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };

        $scope.modal = {
            BallFieldID: 1, //只有一个场，写死
            StartDate: moment().toDate(),
            EndDate: moment().toDate()
        };

        function InitInfo() {
            var paras = $scope.modal;
            var timBegin = moment(paras.StartDate);
            var timEnd = moment(paras.EndDate);
            if( timEnd < timBegin){
                alertService.showAlert("时间范围不合理，请检查开始与结束时间!");
                return;
            }
            paras.StartDate = timBegin.format('YYYY-MM-DD');
            paras.EndDate = timEnd.format('YYYY-MM-DD');
            var url = commonServices.getUrl("BallFieldService.ashx", "Query");

            //alertService.showOperating('Processing...');
            commonServices.submit(paras, url).then(function (resp) {
                //alertService.hideOperating();
                if (resp) {
                    if (!resp.success) {
                        var msg = $rootScope.Language.common.CommunicationErr;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    } else {
                        $scope.items = resp.list;
                    }
                }
            });
        }
        InitInfo();

        $scope.LoadData = function () {
            if (isEmptyString($scope.modal.StartDate)
                || isEmptyString($scope.modal.EndDate)
               )
            {
                alertService.showAlert($rootScope.Language.BallFieldBooking.promptSelectDate);
                return;
            }
            InitInfo();
        };
    })
    .controller('BallFieldBookingBookCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
        commonServices, CacheFactory, alertService,
        UrlServices, externalLinksService) 
    {
        //我的预定
        $scope.closePass=function(){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('tab.home');
        };
                
        var baseInfo = commonServices.getBaseParas();
        $scope.curBallFieldID = 1; //只有一个场，写死
        function InitInfo() {
            var url = commonServices.getUrl("BallFieldService.ashx", "GetMybook");
            var paras = {
                BallFieldID: $scope.curBallFieldID,
                WorkdayNo: baseInfo.WorkdayNO
              };
            alertService.showOperating('Processing...');
            commonServices.submit(paras, url).then(function (resp) {
                alertService.hideOperating();
                if (resp) {
                    if (!resp.success) {
                        var msg = $rootScope.Language.common.CommunicationErr;
                        alertService.showAlert(msg);
                        $ionicHistory.goBack();
                    } else {
                        $scope.items = resp.list;
                    }
                }
            });
        }
        InitInfo();

        $scope.CheckCancel=function(bk){
            var bRet=false;
            if(bk.Status!=0){return bRet;}
            var timEnd = new Date(bk.EndTime);
            var timNow = moment().toDate();
            if(timEnd && timEnd>timNow){
                bRet=true;
            }
            return bRet;
        };
        $scope.cancelBook = function(bookID){
            var url = commonServices.getUrl("BallFieldService.ashx", "Cancelbook");
            var paras = {
                BallFieldID: $scope.curBallFieldID,
                WorkdayNo: baseInfo.WorkdayNO,
                BookID: bookID
              };
            alertService.showOperating('Processing...');
            commonServices.submit(paras, url).then(function (resp) {
                alertService.hideOperating();
                if (resp) {
                    if (!resp.success) {
                        var msg = $rootScope.Language.common.CommunicationErr;
                        alertService.showAlert(msg);
                        //$ionicHistory.goBack();
                    } else {
                        InitInfo();
                    }
                }
            });
        };
    })        
///////////////////////////////////////
;