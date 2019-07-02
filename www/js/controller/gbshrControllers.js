/**
 * 用于人事综合及相关子菜单
 * 2018-07-11 johnsing he 整理
 */
angular.module('evaluationApp.gbshrControllers', [])
  .controller('GBSListCtrl', function ($scope, $rootScope, $state, $ionicHistory,
    commonServices, CacheFactory, alertService, externalLinksService, actionVisitServices, UrlServices) {
    $scope.canUseAction = function (action) {
      return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO)
    }
    $scope.checkActionUpdate = function (action) {
      return actionVisitServices.checkUpdate(action)
    }
    $scope.openGeneralNotice = function (isUrlHtml, id, html) {
      UrlServices.openGeneralNotice(isUrlHtml, id, html)
    }

    $scope.open = function (action) {
      actionVisitServices.visit(action) // save state
      switch (action) {
        case 'KQAbnormal':
          $state.go('kqyc')
          break
        case 'Certificate':
          $state.go('certificate')
          break
        case '员工手册':
          $state.go('handbook_lg')
          break
        case 'LTP':
          try {
            externalLinksService.openUr('https://appcenter.flextronics.com/GMIS/Template/LTPPasswordReset_Mobile.html')
          } catch (ex) {
            alertService.showAlert(ex.message)
          }
          break
        case '保险':
          $state.go('insurance')
          break
        case '入职文件':
          $state.go('newEmployeeIntro')
          break
        case '社会保险':
        case '公积金信息':
          CacheFactory.remove('gnAction')
          CacheFactory.save('gnAction', action)
          $state.go('generalNotice')
          break
        case '离职须知':
          $state.go('employeeDismiss')
          break
        case 'train':
          try {
            externalLinksService.openUr('https://zhmobile.flextronics.com/EvaluationApp/course/course/1.html')
          } catch (ex) {
            alertService.showAlert(ex.message)
          }
          break
        case 'LTP培训资料':
          $state.go('ltpTraining')
          break
        case '人事指南':
          $state.go('hrGuide')
          break
        case '人权政策':
          $scope.openGeneralNotice(0, '79BAF6EB-15B3-435D-A06E-24F468DF97D2')
          break
        case '道德热线':
          $scope.openGeneralNotice(0, '79BAF6EB-15B3-435D-A06E-24F468DF97D3')
          break
        case '银行卡号自助变更培训':
          $scope.openGeneralNotice(0, '23955A71-4D92-4322-A25E-6128CCC65B69')
          break
        default:
          break
      }
    }
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('CertificateCtrl', function ($scope, $rootScope, $state, CacheFactory) {
    var accessEmployee = $rootScope.accessEmployee
    // var bTestAccount = IsTestAccount(accessEmployee.WorkdayNO)
    // 屏蔽multek
    // var bIsNotMultek = accessEmployee.Organization.toLowerCase().indexOf("multek")<0
    $scope.isMultek = isMultek(accessEmployee.Organization)

    $scope.open = function (action) {
      switch (action) {
        case 'visaApply':
          $state.go('visaApply')
          break
        default:
          CacheFactory.save('action', action)
          $state.go('certificateSubmit')
      }
    }
  })
  .controller('CertificateSubmit', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, $ionicPopup) {
    var action = CacheFactory.get('action')
    if (action == 'SR') {
      $scope.title = $rootScope.Language.certificate.incomeCertificate
      $scope.listUse = [{
        name: '购房',
        value: '购房'
      },
        {
          name: '购车',
          value: '购车'
        },
        {
          name: '贷款装修',
          value: '贷款装修'
        },
        {
          name: '保险理赔',
          value: '保险理赔'
        },
        {
          name: '申请补助',
          value: '申请补助'
        },
        {
          name: '司法诉讼',
          value: '司法诉讼'
        }
      ]
    }
    if (action == 'ZZ') {
      $scope.title = $rootScope.Language.certificate.certificateOfEmployment
      $scope.listUse = [{
        name: 'Visa申请',
        value: 'Visa申请'
      },
        {
          name: '资格考试',
          value: '资格考试'
        },
        {
          name: '居住证',
          value: '居住证'
        },
        {
          name: '子女入学',
          value: '子女入学'
        }
      ]
    }
    if (action == 'XJ') {
      $scope.title = $rootScope.Language.certificate.certificateOfTakingLeave
      $scope.listUse = [{
        name: '商业保险申报',
        value: '商业保险申报'
      }

      ]
    }

    var paras = commonServices.getBaseParas()

    $scope.apply = {
      WorkdayNO: paras.WorkdayNO,
      CName: paras.CName,
      MobileNo: paras.MobileNo,
      Organization: paras.Organization,
      Use: null
    }

    $scope.Submit = function () {
      if ($scope.apply.Use == null) {
        alertService.showAlert('请填写用途')
        return
      }

      if ($scope.apply.Use == '') {
        alertService.showAlert('请填写用途')
        return
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '确定提交办证申请吗？',
        okText: 'OK'
      }).then(function (res) {
        if (res) {
          paras.MobileNo = $scope.apply.MobileNo
          paras.Use = $scope.apply.Use.name
          paras.ApplyType = action

          var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitCertificateApply')
          commonServices.submit(paras, url).then(function (data) {
            if (data.success) {
              alertService.showAlert('您的申请已提交，请注意在“我的信息”查收最新进度通知，谢谢！')
              $ionicHistory.goBack()
            } else {
              alertService.showAlert(data.message)
            }
          })
        }
      })
    }

    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('reissueWorkingCard', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, $ionicPopup) {
    // 厂牌补办
    $scope.title = $rootScope.Language.certificate.reissueWorkingCard
    // $scope.listReason = [
    //     { name: "厂牌丢失（扣款10元/次）", value: "厂牌丢失" },
    //     { name: "自然损坏", value: "自然损坏" }
    // ]

    var action = 'CP';
    var paras = commonServices.getBaseParas();

    $scope.apply = {
      WorkdayNO: paras.WorkdayNO,
      CName: paras.CName,
      MobileNo: paras.MobileNo,
      Organization: paras.Organization,
      Use: '厂牌丢失'
    };

    $scope.protocol = {
      IsAggree: 0
    }
    $scope.Submit = function () {
      // if (!$scope.apply.Use || $scope.apply.Use == "") {
      //     alertService.showAlert('请填写原因')
      //     return
      // }
      if ('' == $.trim($scope.apply.MobileNo)) {
        alertService.showAlert('请填写联系电话')
        return
      }
      if (!$scope.protocol.IsAggree) {
        alertService.showAlert('请先勾选扣款说明')
        return
      }

      $ionicPopup.confirm({
        title: '提示',
        template: '确定提交办证申请吗？',
        okText: 'OK'
      }).then(function (res) {
        if (res) {
          paras.MobileNo = $.trim($scope.apply.MobileNo)
          paras.Use = $scope.apply.Use.name
          paras.ApplyType = action

          var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitCertificateApply')
          commonServices.submit(paras, url).then(function (data) {
            if (data.success) {
              alertService.showAlert('您的申请已提交，请注意在“我的信息”查收最新进度通知，谢谢！')
              $ionicHistory.goBack()
            } else {
              alertService.showAlert(data.message)
            }
          })
        }
      })
    }

    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('VisaApplyCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, $ionicPopup) {
    $scope.listVisaType = [{
      name: '1 Year Multiple Entries',
      value: '1 Year Multiple Entries'
    },
      {
        name: '6 Months Double Entries',
        value: '6 Months Double Entries'
      },
      {
        name: '3 Months Single Entry',
        value: '3 Months Single Entry'
      },
      {
        name: '10 Years Multiple Entries',
        value: '10 Years Multiple Entries'
      }
    ]
    $scope.Gender = [{
      name: 'Male',
      value: 'Male'
    },
      {
        name: 'Female',
        value: 'Female'
      }
    ]

    setTimeout(function () {
      var now = new Date()
      var nowAddHour = new Date()
      nowAddHour.setHours(nowAddHour.getHours() + 3)
      var str = now.getFullYear() + '-' + fix((now.getMonth() + 1), 2) + '-' + fix(now.getDate(), 2)
      $('#IssuedDate').val(str)
      $('#PassportDateIssue').val(str)
      $('#PassportDateExpiry').val(str)
      $('#BirthDate').val(str)
      $('#ChinaArrivalDate').val(str)
      $('#DepartureDateFromChina').val(str)
    }, 500)

    function fix (num, length) {
      return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
    }

    var paras = commonServices.getBaseParas()

    $scope.visa = {
      CName: paras.CName,
      WorkdayNO: paras.WorkdayNO,
      Organization: paras.Organization,
      MobileNo: paras.MobileNo,
      IssuedDate: null,
      FullNameInPassport: null,
      PassportNo: null,
      PassportDateIssue: null,
      PassportDateExpiry: null,
      BirthDate: null,
      Nationality: null,
      Gender: null,
      JobTitle: null,
      CompanyName: null,
      PurposeOfVisit: null,
      ChinaArrivalDate: null,
      DepartureDateFromChina: null,
      VisaType: null,
      ContactpersonName: null,
      ContactPersonJobtitle: null,
      ContactPersonTelephone: null,
      ContactPersonEmail: null,
      ExpenseAfford: null
    }

    $scope.Submit = function () {
      $scope.visa.IssuedDate = $('#IssuedDate').val()
      $scope.visa.PassportDateIssue = $('#PassportDateIssue').val()
      $scope.visa.PassportDateExpiry = $('#PassportDateExpiry').val()
      $scope.visa.BirthDate = $('#BirthDate').val()
      $scope.visa.ChinaArrivalDate = $('#ChinaArrivalDate').val()
      $scope.visa.DepartureDateFromChina = $('#DepartureDateFromChina').val()

      $scope.visa.Gender = $scope.visa.Gender.name
      $scope.visa.VisaType = $scope.visa.VisaType.name

      console.log($scope.visa)
      var check = true
      angular.forEach($scope.visa, function (value, key) {
        if (check) {
          if (value == null || value == '') {
            alertService.showAlert('Some information is not filled, please check')
            check = false
          }
        }
      })

      if (!check) return

      $ionicPopup.confirm({
        title: 'Prompt',
        template: 'Do you decide to apply for the application？',
        okText: 'OK'
      }).then(function (res) {
        if (res) {
          paras.visaDetail = $scope.visa
          var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitVisa')
          commonServices.submit(paras, url).then(function (data) {
            if (data.success) {
              alertService.showAlert('Your application has been submitted, please pay attention to "my information", check the latest progress notice, thank you.')
              $ionicHistory.goBack()
            } else {
              alertService.showAlert(data.message)
            }
          })
        }
      })
    }
  })
  .controller('KqAbnormalCtrl', function ($scope, $ionicHistory, alertService, commonServices, $state) {
    var params = commonServices.getBaseParas()
    var url = commonServices.getUrl('KqcxService.ashx', 'GetKQ_Attendance_Abnormal')
    console.log(params)

    commonServices.getDataList(params, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }
      console.log(data)
      $scope.KqAbnormalList = data
    })
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('Handbook_lgCtrl', function ($scope, CacheFactory, noticeService, alertService, $state, $ionicHistory, commonServices) {
    var paras = commonServices.getBaseParas()
    paras.kind = 1
    var url = commonServices.getUrl('HandBookService.ashx', 'GetLgList')
    commonServices.getDataList(paras, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }
      $scope.handBookList = data
    })

    $scope.open = function (info) {
      CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L0)
      CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L0, JSON.stringify({
        'kind': 1,
        'ItemLanguage': info.Language
      }))
      $state.go('HandbookItemOne')
    }

    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('HandbookItemOneCtrl', function ($scope, CacheFactory, noticeService, alertService, $state, $ionicHistory, commonServices) {
    var objL0 = JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_HANDBOOK_L0))
    $scope.ItemLanguage = objL0.ItemLanguage
    var paras = commonServices.getBaseParas()
    paras.kind = objL0.kind
    paras.where = " and Language=N'" + $scope.ItemLanguage + "'"
    paras.item = 'Item1'

    var url = commonServices.getUrl('HandBookService.ashx', 'GetItemList')
    commonServices.getDataList(paras, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }

      $scope.handBookItem1List = data
    })

    $scope.open = function (info) {
      if (info.NextItemCnt <= 0) {
        return
      }
      CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L1)
      CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L1, JSON.stringify({
        'kind': objL0.kind,
        'item': info.Item1
      }))

      $state.go('handbookitemTwo')
    }
  })
  .controller('HandbookItemTwoCtrl', function ($scope, CacheFactory, noticeService, alertService, $state, $ionicHistory, commonServices, $location) {
    var objL1 = JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_HANDBOOK_L1))
    $scope.title = objL1.item
    var paras = commonServices.getBaseParas()
    paras.kind = objL1.kind
    paras.where = " and Item1=N'" + objL1.item + "'"
    paras.item = 'Item2'
    var url = commonServices.getUrl('HandBookService.ashx', 'GetItemList')
    commonServices.getDataList(paras, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }
      $scope.handBookItem2List = data
    })

    $scope.open = function (info) {
      if (info.NextItemCnt <= 0) {
        return
      }
      CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L2)
      CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L2, JSON.stringify({
        'kind': objL1.kind,
        'item': info.Item2
      }))

      $state.go('handbookitemThree')
    }
  })
  .controller('HandbookItemThreeCtrl', function ($scope, CacheFactory, noticeService, alertService, $state, $ionicHistory, commonServices, $location) {
    var objL2 = JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_HANDBOOK_L2))
    $scope.title = objL2.item
    var paras = commonServices.getBaseParas()
    paras.kind = objL2.kind
    paras.where = " and Item2=N'" + objL2.item + "'"
    paras.item = 'Item3'
    var url = commonServices.getUrl('HandBookService.ashx', 'GetItemList')
    commonServices.getDataList(paras, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }
      $scope.DataList = data
      $scope.handBookItem3List = $scope.DataList
    })

    $scope.open = function (info) {
      if (info.NextItemCnt <= 0) {
        return
      }
      CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L3)
      CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L3, JSON.stringify({
        'kind': objL2.kind,
        'item': info.Item3
      }))

      $state.go('handbookitemFour')
    }
  })
  .controller('HandbookItemFourCtrl', function ($scope, CacheFactory, noticeService, alertService, $state, $ionicHistory, commonServices, $location) {
    var objL3 = JSON.parse(CacheFactory.get(GLOBAL_INFO.KEY_HANDBOOK_L3))
    $scope.title = objL3.item
    var paras = commonServices.getBaseParas()
    paras.kind = objL3.kind
    paras.where = " and Item3=N'" + objL3.item + "'"
    paras.item = 'Item4'
    var url = commonServices.getUrl('HandBookService.ashx', 'GetItemList')
    commonServices.getDataList(paras, url).then(function (data) {
      if (data == 'Token is TimeOut') {
        alertService.showAlert('登录失效，请重新登录')
        $state.transitionTo('signin')
      }
      $scope.DataList = data

      $('#Item4_html').html($scope.DataList[0].Item4)
    // console.log($scope.DataList[0].Item4)
    })
  })
  .controller('NewEmployeeIntroCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, $ionicPopup) {
    // 入职文件
    $scope.open = function (action) {
      switch (action) {
        case 'DL入职声明正文页': {
          CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L1)
          CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L1, JSON.stringify({
            'kind': 10,
            'item': 'DL入职声明'
          }))
          $state.go('handbookitemTwo')
        }
        break
        case '职员入职声明正文': {
          CacheFactory.remove(GLOBAL_INFO.KEY_HANDBOOK_L1)
          CacheFactory.save(GLOBAL_INFO.KEY_HANDBOOK_L1, JSON.stringify({
            'kind': 11,
            'item': '职员入职声明'
          }))
          $state.go('handbookitemTwo')
        }
        break
        case '菜鸟手册':
          $state.go('basicGuide')
          break
      }
    }
  })
  .controller('BasicGuideCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices, CacheFactory, alertService, $ionicPopup) {
    // 菜鸟手册
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }
  })
  .controller('GeneralNoticeCtrl', function ($scope, $rootScope, $state, $ionicHistory,
    commonServices, CacheFactory, alertService, $ionicPopup,
    externalLinksService) {
    // GeneralNotice
    // var baseInfo = commonServices.getBaseParas()
    var gnAction = CacheFactory.get('gnAction')
    $scope.gnTitle = gnAction
    $scope.gnHasImg = true; // 使用图标

    function InitInfo () {
      var url = commonServices.getUrl('GeneralNoticeService.ashx', 'GetList')
      var paras = {
        actName: gnAction,
        Extra: ''
      }
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (!resp.success) {
            alertService.showAlert('获取信息失败，请稍后再试。' + resp.message)
            $ionicHistory.goBack()
          } else {
            var lst = resp.list
            if (!lst || 0 == lst.length) {
              alertService.showAlert('没有相关数据')
              $ionicHistory.goBack()
            }
            $scope.list = lst
          }
        }
      })
    }
    InitInfo()

    $scope.openGeneralNotice = function (isUrlHtml, id, html) {
      if (isUrlHtml) {
        // 打开外链
        try {
          externalLinksService.openUr(html)
        } catch (ex) {
          alertService.showAlert(ex.message)
        }
      } else {
        CacheFactory.remove('gnID')
        CacheFactory.save('gnID', id)
        $state.go('generalNoticeDetail')
      }
    }
  })
  .controller('generalNoticeDetailCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, UrlServices) {
    // GeneralNotice 详细
    var baseInfo = commonServices.getBaseParas()
    var gnID = CacheFactory.get('gnID')

    function InitInfo () {
      var url = commonServices.getUrl('GeneralNoticeService.ashx', 'GetDetail')
      var paras = {
        id: gnID,
        WorkdayNO: baseInfo.WorkdayNO,
        Extra: ''
      }
      alertService.showOperating('Loading...')
      commonServices.submit(paras, url).then(function (resp) {
        alertService.hideOperating()
        if (resp) {
          if (!resp.success) {
            alertService.showAlert('获取信息失败，请稍后再试。' + resp.message)
            $ionicHistory.goBack()
          } else {
            var obj = resp.obj
            $scope.gnTitle = obj.title
            $scope.html = obj.html
          }
        }
      })
    }
    InitInfo()

    $scope.openGeneralNotice = UrlServices.openGeneralNotice
  })
  .controller('EmployeeDismissCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, actionVisitServices) {
    // 离职须知
    $scope.canUseAction = function (action) {
      return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO)
    }

    $scope.open = function (action) {
      switch (action) {
        case '离职手续简介':
          $state.go('dismissIntro')
          break
        case '离职手续状态查询':
          $state.go('dismissStatus')
          break
        default:
          break
      }
    }
  })
  .controller('DismissIntroCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService, actionVisitServices) {
    // 离职手续简介
    $scope.open = function (action) {
      switch (action) {
        case '南厂':
          $scope.openGeneralNotice(0, '07FEA336-C85E-4B45-BB3F-F5587D3B6A02')
          break
        case '北厂':
          $scope.openGeneralNotice(0, '165B122C-108F-475E-9B3B-DDB5C4247D93')
          break
        case '外籍':
          $scope.openGeneralNotice(0, '8DF15700-B6BF-4BEB-9796-7D6D0EFA213E')
          break
        default:
          break
      }
    }
    $scope.openGeneralNotice = function (isUrlHtml, id, html) {
      if (isUrlHtml) {
        // 打开外链
        try {
          externalLinksService.openUr(html)
        } catch (ex) {
          alertService.showAlert(ex.message)
        }
      } else {
        CacheFactory.remove('gnID')
        CacheFactory.save('gnID', id)
        $state.go('generalNoticeDetail')
      }
    }
  })
  .controller('DismissStatusCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    commonServices, CacheFactory, alertService) {
    // 离职手续状态
    function InitInfo () {
      var url = commonServices.getUrl('EmployeeDismissService.ashx', 'GetStatus')
      var paras = commonServices.getBaseParas()
      $scope.model = paras
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (!resp.success) {
            alertService.showAlert('获取信息失败，请稍后再试。' + resp.message)
            $ionicHistory.goBack()
          } else {
            var dismiss = resp.obj
            if (!dismiss) {
              return
            }
            $scope.list = dismiss.dismissSteps
            var dismissTim = dismiss.dismissTime
            if (dismissTim) {
              $scope.lastWorkingDay = dismissTim.lastWorkingDay || ''
              $scope.dismissBeginDay = dismissTim.dismissBeginDay || ''
            }
          }
        }
      })
    }
    InitInfo()

    $scope.HasStatus = function () {
      return $scope.list && $scope.list.length > 0
    }
    $scope.GetStatusText = function (st) {
      return st ? $rootScope.Language.GBSHR.Done : $rootScope.Language.GBSHR.Required
    }
  })
  .controller('LostFoundListCtrl', function ($scope, $rootScope, $state, $ionicPopup, $ionicScrollDelegate,
    $ionicModal, $ionicHistory, commonServices, CacheFactory, alertService, PicServices, UrlServices) {
    // 失物招领 列表
    var baseInfo = commonServices.getBaseParas()
    // $scope.MobileNo=$rootScope.accessEmployee.MobileNo

    $scope.$on('$ionicView.beforeEnter', function () {
      // clearHistoryForIndexPage
      var history = $ionicHistory.forwardView()
      if (!history) {
        IninInfo(true)
      }
    })
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }

    $scope.protocol = {
      IsAggree: 0
    }

    function PromptProtocol () {
      $ionicPopup.show({
        title: '失物招领使用承诺书',
        cssClass: 'my-custom-popup-Alter',
        templateUrl: 'templates/GBS/lostFound/protocolLostFound.html',
        scope: $scope,
        buttons: [{
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.protocol.IsAggree) {
              alertService.showLoading('请接受承诺书！')
              e.preventDefault()
            } else {
              return
            }
          }
        }]
      })
    }

    function IninInfo (showProtocol) {
      if (showProtocol) {
        PromptProtocol()
      }
      var url = commonServices.getUrl('GBSHRService.ashx', 'GetLostFoundList')
      commonServices.submit(baseInfo, url).then(function (resp) {
        if (resp) {
          if (resp == 'Token is TimeOut') {
            alertService.showAlert('登录失效，请重新登录')
            $state.transitionTo('signin')
          } else if (resp.success) {
            $scope.items = resp.list
            $ionicScrollDelegate.scrollTop()
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr
          alertService.showAlert(msg)
        }
      })
    }

    $scope.viewDetail = function (lostID) {
      CacheFactory.remove(GLOBAL_INFO.KEY_LOSTFOUND_ID)
      CacheFactory.save(GLOBAL_INFO.KEY_LOSTFOUND_ID, lostID)
      $state.go('tab_LostFound.Detail')
    }

    $scope.lfTypes = [{
      name: $rootScope.Language.lostFound.lost,
      value: 1
    }, {
      name: $rootScope.Language.lostFound.found,
      value: 0
    }]

    var submitPara = {
      CName: baseInfo.CName,
      WorkdayNO: baseInfo.WorkdayNO,
      MobileNo: baseInfo.MobileNo,
      Description: null,
      IsLoser: 1,
      ImageBatchNo: -1,
      Token: baseInfo.Token
    }
    BindSubmitModal($scope, $ionicModal, 'public.html', submitPara)

    function ClearLastFill () {
      $scope.imgs = []
      submitPara.Description = null
      submitPara.ImageBatchNo = -1
    }
    $scope.showPublicDlg = function () {
      ClearLastFill()
      $scope.openModal(baseInfo)
    }

    $scope.imgs = []
    $scope.SelPic = function (bCamera) {
      PicServices.selectImage(function (pic) {
        PicServices.resizeImage(1024, pic, function (sdata) {
          $scope.imgs.push(sdata)
        })
      }, bCamera)
    }
    $scope.Reset = function () {
      $scope.imgs = []
    }
    $scope.Reset()

    var swMap = null

    function HasSensWord (txt) {
      if (!swMap) {
        swMap = sw_buildMap()
      }
      return sw_check(swMap, txt)
    }

    function CheckSubmit () {
      var sTemp = $.trim(submitPara.MobileNo)
      if (isEmptyString(sTemp)) {
        alertService.showAlert('请要填写手机号码!')
        return false
      }
      submitPara.MobileNo = sTemp

      sTemp = $.trim(submitPara.Description)
      if (isEmptyString(sTemp)) {
        alertService.showAlert('请填写描述!')
        return false
      }
      if (HasSensWord(sTemp)) {
        alertService.showAlert('请填写描述!')
        submitPara.Description = ''
        return false
      }

      submitPara.Description = sTemp
      return true
    }
    $scope.isSumbiting = false
    $scope.submit = function () {
      if ($scope.isSumbiting) {
        return
      }
      if (!CheckSubmit()) {
        return
      }
      $scope.isSumbiting = true
      if (!$scope.imgs || !$scope.imgs.length) {
        try {
          alertService.showOperating('Processing...')
          DoSubmit(submitPara)
        } finally {
          alertService.hideOperating()
          $scope.isSumbiting = false
        }
      } else {
        alertService.showOperating('Processing...')
        var url = commonServices.getUrl('UploadService.ashx', '')
        UrlServices.uploadImages('LostFound', '失物招领', $scope.imgs, url, function (resp) {
          alertService.hideOperating()
          if (resp) {
            if (resp.success) {
              submitPara.ImageBatchNo = resp.obj
              try {
                DoSubmit(submitPara)
              } catch (e) {
                console.log(e)
              }
            } else {
              alertService.showAlert('上传图片失败, ' + resp.message)
            }
          } else {
            alertService.showAlert('上传图片失败!')
          }
          $scope.isSumbiting = false
        },
          function (msg) {
            alertService.hideOperating()
            alertService.showAlert('上传图片失败, ' + msg)
          })
      }
    }

    function DoSubmit (paras) {
      var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitLostFound')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp.success) {
          var msg = $rootScope.Language.lostFound.msgPublicSuccess
          alertService.showAlert(msg)
          $scope.closeModal()
          IninInfo(false)
        // $ionicHistory.goBack()
        } else {
          alertService.showAlert(resp.message)
          $ionicHistory.goBack()
        }
      })
    }

  // IninInfo(true);//初始化
  })
  .controller('LostFoundDetailCtrl', function ($scope, $rootScope, $state, $ionicPopup, $ionicScrollDelegate,
    $ionicModal, $ionicHistory, commonServices, CacheFactory, alertService) {
    // 失物招领 逐项详情
    var baseInfo = commonServices.getBaseParas()
    $scope.doRefresh = function () {
      InitInfo()
      $scope.$broadcast('scroll.refreshComplete')
    }

    var lostID = CacheFactory.get(GLOBAL_INFO.KEY_LOSTFOUND_ID)

    function InitInfo () {
      var paras = baseInfo
      paras.LostID = lostID

      var url = commonServices.getUrl('GBSHRService.ashx', 'GetLostFoundDetail')
      commonServices.submit(baseInfo, url).then(function (resp) {
        if (resp == 'Token is TimeOut') {
          alertService.showAlert('登录失效，请重新登录')
          $state.transitionTo('signin')
        } else if (resp.success && resp.obj) {
          $scope.item = resp.obj.item
          $scope.imgs = resp.obj.imgs
          $scope.replyList = resp.obj.replyList
          setTimeout(function () {
            // 图片缩放
            InitPhotoScale()
          }, 1500)
        } else {
          $scope.item = {}
          $scope.imgs = []
          $scope.replyList = []
        }
      })
    }

    InitInfo()

    var swMap = null

    function HasSensWord (txt) {
      if (!swMap) {
        swMap = sw_buildMap()
      }
      return sw_check(swMap, txt)
    }
    $scope.ReplyContent = null
    $scope.submitReply = function () {
      var sRep = $.trim($scope.ReplyContent)
      if (isEmptyString(sRep)) {
        alertService.showLoading('请先填写内容')
        return
      }
      if (HasSensWord(sRep)) {
        $scope.ReplyContent = ''
        alertService.showLoading('请先填写内容')
        return
      }

      doSubmitReply(sRep, null)
      $scope.ReplyContent = ''
    }

    function doSubmitReply (sRep, chatID) {
      var paras = {
        LostID: lostID,
        WorkdayNo: baseInfo.WorkdayNO,
        CName: baseInfo.CName,
        Content: sRep,
        ChatID: chatID || -1,
        Token: baseInfo.Token
      }
      var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitLostFoundReply')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp.success) {
          InitInfo()
          alertService.showLoading('提交成功')
          $ionicScrollDelegate.scrollBottom()
        } else {
          alertService.showAlert(resp.message)
        }
      })
    }

    // 跟贴回复
    $scope.replyTo = function (chatID) {
      $scope.FollowReply = {};; // 跟贴回复
      var myPopup = $ionicPopup.show({
        template: '<textarea rows="5" style="font-size:80%" placeholder="发表回复"  ng-model="FollowReply.ReplyPerson"></textarea>',
        title: '回复',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (isEmptyString($scope.FollowReply.ReplyPerson)) {
                alertService.showLoading('请填写回复内容')
                e.preventDefault()
              } else {
                return $scope.FollowReply.ReplyPerson
              }
            }
          }
        ]
      })

      myPopup.then(function (res) {
        if (isEmptyString(res)) {
          return
        }
        if (HasSensWord(res)) {
          $scope.FollowReply.ReplyPerson = ''
          alertService.showLoading('请填写回复内容')
          return
        }
        doSubmitReply(res, chatID)
      })
    }
  })
  .controller('LostFoundMyCtrl', function ($scope, $rootScope, $state, $ionicPopup, $ionicScrollDelegate,
    $ionicModal, $ionicHistory, commonServices, CacheFactory, alertService) {
    // 失物招领 我的发布
    var baseInfo = commonServices.getBaseParas()

    $scope.$on('$ionicView.beforeEnter', function () {
      // clearHistoryForIndexPage
      var history = $ionicHistory.forwardView()
      if (!history) {
        InitInfo()
      }
    })
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }

    function InitInfo () {
      var paras = baseInfo
      var url = commonServices.getUrl('GBSHRService.ashx', 'GetLostFoundMyDetail')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp == 'Token is TimeOut') {
          alertService.showAlert('登录失效，请重新登录')
          $state.transitionTo('signin')
        } else if (resp.success && resp.obj) {
          $scope.entrys = resp.list
          setTimeout(function () {
            // 图片缩放
            InitPhotoScale()
          }, 1500)
        }
      })
    }

    InitInfo()

    function doSubmitReply (sRep, chatID) {
      var paras = {
        LostID: lostID,
        WorkdayNo: baseInfo.WorkdayNO,
        CName: baseInfo.CName,
        Content: sRep,
        ChatID: chatID || -1,
        Token: baseInfo.Token
      }
      var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitLostFoundReply')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp.success) {
          InitInfo()
          alertService.showLoading('提交成功')
          $ionicScrollDelegate.scrollBottom()
        } else {
          alertService.showAlert(resp.message)
        }
      })
    }

    // 跟贴回复
    $scope.replyTo = function (chatID) {
      $scope.FollowReply = {};; // 跟贴回复
      var myPopup = $ionicPopup.show({
        template: '<textarea rows="5" style="font-size:80%" placeholder="发表回复"  ng-model="FollowReply.ReplyPerson"></textarea>',
        title: '回复',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (isEmptyString($scope.FollowReply.ReplyPerson)) {
                alertService.showLoading('请填写回复内容')
                e.preventDefault()
              } else {
                return $scope.FollowReply.ReplyPerson
              }
            }
          }
        ]
      })

      myPopup.then(function (res) {
        if (isEmptyString(res)) {
          return
        }
        if (HasSensWord(sRep)) {
          $scope.ReplyContent = ''
          alertService.showLoading('请先填写内容')
          return
        }
        doSubmitReply(res, chatID)
      })
    }

    var swMap = null

    function HasSensWord (txt) {
      if (!swMap) {
        swMap = sw_buildMap()
      }
      return sw_check(swMap, txt)
    }

    $scope.closePublic = function (lostID) {
      var paras = {
        LostID: lostID,
        WorkdayNo: baseInfo.WorkdayNO,
        Token: baseInfo.Token
      }
      var url = commonServices.getUrl('GBSHRService.ashx', 'SubmitLostFoundClose')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp.success) {
          InitInfo()
          alertService.showLoading('提交成功')
          $ionicScrollDelegate.scrollBottom()
        } else {
          alertService.showAlert(resp.message)
        }
      })
    }
  })
  .controller('LostFoundPublicCtrl', function ($scope, $rootScope, $state, $ionicHistory, commonServices, alertService) {
    // 失物招领 失物寻主
    var baseInfo = commonServices.getBaseParas()

    $scope.$on('$ionicView.beforeEnter', function () {
      // clearHistoryForIndexPage
      var history = $ionicHistory.forwardView()
      if (!history) {
        InitInfo()
      }
    })
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      })
      $state.go('tab.home')
    }

    function InitInfo () {
      var paras = baseInfo
      var url = commonServices.getUrl('GBSHRService.ashx', 'GetLostFoundPublic')
      commonServices.submit(paras, url).then(function (resp) {
        if (resp == 'Token is TimeOut') {
          alertService.showAlert('登录失效，请重新登录')
          $state.transitionTo('signin')
        } else if (resp.success && resp.obj) {
          $scope.entrys = resp.list
        }
      })
    }

    InitInfo()
  })
  .controller('HrGuideListCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
    actionVisitServices) {
    // 人事指南
    $scope.open = function (action) {
      switch (action) {
        case '合同签核提示':
          $state.go('contractGuide')
          break
        case '身份证资料更新提示':
          $state.go('updateIDInfoGuide')
          break
        default:
          break
      }
    }
  })

  // /////////////////////////////////////////////    
