/**
 * 用于CSER及相关子菜单
 * johnsing he 2018-11-20
 */
angular.module('evaluationApp.CSERControllers', [])
  .controller('CSERCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, actionVisitServices) 
{
    $scope.canUseAction = function (action) {
      return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
    };
    $scope.checkActionUpdate = function (action) {
      return actionVisitServices.checkUpdate(action);
    };

    $scope.open = function (action) {
      actionVisitServices.visit(action); //save state
      switch (action) {
        case "CSER日历":
          $state.go("cserDate");
          break;
        case "CSER托管":
          $state.go('cser_kidsCaring');
          break;
        case "CSER夏令营冬令营":
          $state.go('cser_sumwinCamp');
          break;
        case "CSER员工娱乐中心":
          $state.go('cser_activityCenter');
          break;
        default:
          break;
      }
    };
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.home');
    };

  })
  .controller('CserDateCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, externalLinksService) 
  {
    var paras = commonServices.getBaseParas();
    var url = commonServices.getUrl("CSERSevice.ashx", "GetCSERDate");

    commonServices.getDataList(paras, url).then(function (data) {
      if (data == "Token is TimeOut") {
        alertService.showAlert("Token is TimeOut");
        $state.transitionTo('signin');
      }
      $scope.CserDateList = data;
    });

    $scope.open = function (cserDate) {
      if(isEmptyString(cserDate.URL)){
        return;
      }
      try {
        externalLinksService.openUr(cserDate.URL);
      } catch (ex) {
        alertService.showAlert(ex.message);
      }
    };

    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('cser');
    }

  })
  .controller('CSERKidsCaringCtrl', function ($scope, $rootScope, $state, $ionicHistory, 
        commonServices, CacheFactory, alertService, UrlServices) 
  {
    //CSER托管
    $scope.openGeneralNotice = function (isUrlHtml, id, html) {
      UrlServices.openGeneralNotice(isUrlHtml, id, html);
    };
  })
  .controller('CSERSumwinCampCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal,
    $state, $ionicHistory, commonServices, CacheFactory, alertService, UrlServices) 
{
    //CSER夏令营/冬令营
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("MechCharityService.ashx", "GetActList");
      var paras = {
        WorkdayNo: baseInfo.WorkdayNO
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr;
          alertService.showAlert(msg);
        }
      });
    }
    InitInfo();

    $scope.open = function (act) {
      if (act.Url && act.Url.length > 0) {
        //访问外链
        UrlServices.openForeignUrl(act.Url);
      } else if (act.ContentLen > 0) {
        //打开动态内容页
        var objDyn = {
          PageTitle: '活动详情',
          TabName: 'ESE_MechCharityActivity',
          SrcCol: 'Content',
          WhereColName: 'ID',
          WhereColVal: act.ID
        };
        CacheFactory.save(GLOBAL_INFO.KEY_DYNPAGE, JSON.stringify(objDyn));
        $state.go("dynpage");
      }
    };

    function checkValid() {
      var sTemp = $.trim($scope.modal.dat.MobileNo);
      $scope.modal.dat.MobileNo = sTemp;
      if (!sTemp || sTemp.length < 5) {
        alertService.showAlert("请提供联系电话!");
        return false;
      }

      var vsex = $scope.modal.dat.sex;
      if (!vsex) {
        alertService.showAlert("请选择性别!");
        return false;
      }

      sTemp = $.trim($scope.modal.dat.email);
      $scope.modal.dat.email = sTemp;
      if (sTemp && sTemp.length && !ValidateEmail(sTemp)) {
        alertService.showAlert("邮箱地址格式有误!");
        return false;
      }
      sTemp = $.trim($scope.modal.dat.manageEmail);
      $scope.modal.dat.manageEmail = sTemp;
      if (sTemp && sTemp.length && !ValidateEmail(sTemp)) {
        alertService.showAlert("邮箱地址格式有误!");
        return false;
      }
      return true;
    }

    $scope.isSumbiting = false;
    $scope.SubmitAttend = function (params) {
      if (!checkValid()) {
        return;
      }
      $scope.isSumbiting = true;
      var paras = $.extend({}, baseInfo);
      paras.ActID = params.actID;
      paras.nsex = $scope.modal.dat.sex;
      paras.MailAddr = $scope.modal.dat.email;
      paras.MngMailAddr = $scope.modal.dat.manageEmail;
      paras.Fav = $scope.modal.dat.favourite;
      paras.PastAct = GetSelItems($scope.pastActTypes);
      paras.FreeTime = GetSelItems($scope.freeTimeTypes);

      var url = commonServices.getUrl("MechCharityService.ashx", "ActBook");
      try {
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            var msg = resp.message;
            alertService.showAlert(msg);
            $scope.closeModal();
            //$ionicHistory.goBack();
          } else {
            var msg = $rootScope.Language.common.CommunicationErr;
            alertService.showAlert(msg);
            $ionicHistory.goBack();
          }
        });
      } finally {
        $scope.isSumbiting = false;
      }
    };

    $scope.pastActTypes = [{
        name: "敬老活动自愿",
        check: false
      },
      {
        name: "环保行动自愿",
        check: false
      },
      {
        name: "文体活动后勤自愿",
        check: false
      },
      {
        name: "亲子活动后勤自愿",
        check: false
      }
    ];
    $scope.freeTimeTypes = [{
        name: "周末",
        check: false
      },
      {
        name: "晚上加班时间",
        check: false
      },
      {
        name: "工作日",
        check: false
      }
    ];

    function GetSelItems(arr) {
      var keys = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].check) {
          keys.push(arr[i].name);
        }
      }
      return keys.join(";");
    };

    BindSubmitModal($scope, $ionicModal, 'submitForm.html', baseInfo);
    $scope.Submit = function (actID) {
      var para = {
        'actID': actID
      };
      $scope.openModal(para);
    };

  })
  .controller('CSERActivityCenterCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, actionVisitServices) 
  {
    // CSER员工娱乐中心
    $scope.canUseAction = function (action) {
      return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
    };
    $scope.checkActionUpdate = function (action) {
      return actionVisitServices.checkUpdate(action);
    };

    $scope.open = function (action) {
      //actionVisitServices.visit(action); //save state
      switch (action) {
        case "员工娱乐中心地图":
          $state.go("cser_center_map");
          break;
        case "娱乐中心使用须知":
          $state.go('cser_center_protocol');
          break;
        case "娱乐设施常见问题":
          $state.go('cser_center_faq');
          break;
        case "娱乐设施报修":
          $state.go('cser_center_repair');
          break;
        case "建议箱":
          $state.go('cser_center_suggest');
          break;
        default:
          break;
      }
    };
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.home');
    };

  })
  .controller('CSERActivityCenterMapCtrl', function ($scope, $rootScope, $state, $ionicHistory) 
  {
      //员工娱乐中心地图
      $("#auto-loop").lightGallery({
          mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
          mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
          swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).
          hideControlOnEnd : false,
          closable:false
      });
  })  
  .controller('CSERActivityCenterProtocolCtrl', 
    function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, commonServices) 
  {
    //娱乐中心使用须知
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("CSERSevice.ashx", "AddProtocolRead");
      var paras = {
        Token: baseInfo.Token,
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
  .controller('CSERActivityCenterFaqCtrl', 
      function ($scope, $rootScope, $state, $ionicHistory, commonServices) 
  {
      //娱乐设施常见问题
      function InitInfo() {
        var url = commonServices.getUrl("CSERSevice.ashx", "GetFaq");
        var baseInfo = commonServices.getBaseParas();
        commonServices.submit(baseInfo, url).then(function (resp) {
          if (resp) {
            $scope.listAskAndAnswer = resp.list;
            //$ionicHistory.goBack();
          }
        });
      }
      InitInfo();
  })
  .controller('CSERActivityCenterRepairCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                        commonServices, CacheFactory, alertService, duplicateSubmitServices,
                                        PicServices, UrlServices) 
  {
    //娱乐设施报修
    var baseInfo = commonServices.getBaseParas();
    $scope.model = {
      SubmitGuid: duplicateSubmitServices.genGUID(),
      Token: baseInfo.Token,
      CName: baseInfo.CName,
      WorkdayNO: baseInfo.WorkdayNO,
      MobileNo: baseInfo.MobileNo,
      ACArea: null,
      ACPos: null,
      FoundDate: moment().toDate(),
      DeviceType: null,
      RepairDesc: null
    };

    function InitInfo() {
      $scope.acAreas=[
        {name:'B7'},
        {name:'B11'},
        {name:'B13'},
        {name:'B15'},
        {name:'B17'},
        {name:'South Campus'},
      ];
      $scope.deviceTypes=[
        {name:'空调'},
        {name:'热水器'},
        {name:'跑步机'},
        {name:'美腰机'},
        {name:'桌球'},
        {name:'乒乓球'},
        {name:'游戏机'},
        {name:'桌面足球'},
        {name:'仰卧板'},
        {name:'健身车'},
        {name:'其它'},
      ];
    }
    InitInfo();

    $scope.imgs = [];
    $scope.SelPic = function (bCamera) {
      PicServices.selectImage(function (pic) {
        PicServices.resizeImage(1024, pic, function (sdata) {
          $scope.imgs.push(sdata);
        });
      }, bCamera);
    };

    var Reset = function () {
      $scope.imgs = [];
    };
    Reset();
    $scope.Reset = Reset;

    $scope.isSumbiting = false;
    $scope.Submit = function () {
      $scope.isSumbiting = true;

      var sTemp = $.trim($scope.model.MobileNo);
      $scope.model.MobileNo = sTemp;
      if (!sTemp || sTemp.length < 5) {
        alertService.showAlert("请提供联系电话!");
        $scope.isSumbiting = false;
        return;
      }
      if (!$scope.model.ACArea) {
        alertService.showAlert("请选择娱乐中心区域!");
        $scope.isSumbiting = false;
        return;
      }      
      sTemp = $.trim($scope.model.FoundDate);
      if (isEmptyString(sTemp)) {
        alertService.showAlert("请填写发现时间!");
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
      if (!$scope.imgs || !$scope.imgs.length) {
        try {
          DoSubmit(paras);
        } finally {
          $scope.isSumbiting = false;
        }
      } else {
        alertService.showOperating('Processing...');
        var url = commonServices.getUrl("UploadService.ashx", "");
        UrlServices.uploadImages('CSERActivityCenterRepair', 'CSER活动中心', $scope.imgs, url, function (resp) {
            alertService.hideOperating();
            if (resp) {
              if (resp.success) {
                paras.ImageBatchNo = resp.obj;
                try {
                  DoSubmit(paras);
                } catch (e) {
                  console.log(e);
                }
              } else {
                alertService.showAlert("上传图片失败, " + resp.message);
              }
            } else {
              alertService.showAlert("上传图片失败!");
            }
            $scope.isSumbiting = false;
          },
          function (msg) {
            alertService.showAlert("上传图片失败, " + msg);
          });
      }
    };

    function DoSubmit(paras) {
      var url = commonServices.getUrl("CSERSevice.ashx", "SubmitRepairAC");
      commonServices.submit(paras, url).then(function (resp) {
        if (resp.success) {
          var msg = $rootScope.Language.CSER.activityCenterRepairSucc;
          alertService.showAlert(msg);
          $ionicHistory.goBack();
        } else {
          alertService.showAlert(resp.message);
          $ionicHistory.goBack();
        }
      });
    }
  })
  .controller('CSERActivityCenterSuggestCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, duplicateSubmitServices) 
  {
    //建议箱
    var baseInfo = commonServices.getBaseParas();
    $scope.hisSuggest = [];

    function InitInfo() {
      var url = commonServices.getUrl("CSERSevice.ashx", "GetSuggest");
      var paras = {
        WorkdayNO: baseInfo.WorkdayNO,
        Token: baseInfo.Token,
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.hisSuggest = resp.list;
          }
        }
      });
    }
    InitInfo();

    $scope.model = {
      SubmitGuid: duplicateSubmitServices.genGUID(),
      Token: baseInfo.Token,
      CName: baseInfo.CName,
      WorkdayNO: baseInfo.WorkdayNO,
      MobileNo: baseInfo.MobileNo,
      Suggest: "",
    };
    $scope.GetSuggest = function () {
      var txt = $.trim($scope.model.Suggest);
      return txt;
    };

    $scope.isSumbiting = false;
    $scope.Submit = function () {
      $scope.isSumbiting = true;
      var sugg = $scope.GetSuggest();
      if (sugg.length < 3) {
        alertService.showAlert("请填写你的建议!");
        $scope.isSumbiting = false;
        return;
      }

      $scope.model.Suggest = sugg;
      var paras = $scope.model;
      var url = commonServices.getUrl("CSERSevice.ashx", "SubmitSuggest");
      try {
        commonServices.submit(paras, url).then(function (resp) {
          if (resp.success) {
            var msg = $rootScope.Language.dormManage.suggestSucc;
            alertService.showAlert(msg);
            $ionicHistory.goBack();
          } else {
            alertService.showAlert(resp.message);
            $ionicHistory.goBack();
          }
        });
      } finally {
        $scope.isSumbiting = false;
      }
    };

  })

///////////////////////////////////////
;