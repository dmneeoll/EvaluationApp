/**
 * 用于工会及相关子菜单
 * johnsing he 2018-09-11
 */
angular.module('evaluationApp.unionControllers', [])
  .controller('UnionCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
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
        case "员工沟通":
          $state.go("union_commu");
          break;
        case "员工福利":
          $state.go('union_welfare');
          break;
        case "工会活动及报名":
          $state.go('union_activity');
          break;
        case "员工帮扶":
          $state.go('union_helpsupport');
          break;
        case "精彩瞬间":
          $state.go('union_wonderfulmoment');
          break;
        case "团购汽车票": //临时
          $state.go('applyTicket');
          break;
        default:
          break;
      }
    }
    $scope.closePass = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.home');
    }

  })
  /*sub of UnionCtrl*/
  .controller('UnionCommuCtrl', function ($scope, $state, $ionicHistory, commonServices, CacheFactory) {
    $scope.open = function (action) {
      switch (action) {
        case "热线号码":
          $state.go("union_commu_hotline");
          break;
        case "其他沟通渠道":
          $state.go("union_commu_other");
          break;
        case "建议留言":
          $state.go('union_suggest');
        default:
          break;
      }
    }

  })
  .controller('CommuOtherCtrl', function ($scope, $state, $ionicHistory, commonServices) {
    //其他沟通渠道

    $scope.contacts = [{
        building: "Mechanical",
        basePeople: "Iris Jin",
        baseEmail: "iris.jin@flex.com",
        basePhone: "5187155"
      },
      {
        building: "PCBA-South Campus",
        basePeople: "Minhua Lu",
        baseEmail: "minhua.lu@flex.com",
        basePhone: "5186714"
      },
      {
        building: "PCBA-B11",
        basePeople: "Willa Wan",
        baseEmail: "willa.wan@flex.com",
        basePhone: "5183394"
      },
      {
        building: "CR & RR",
        basePeople: "Ellis Zhou",
        baseEmail: "ellis.zhou@flex.com",
        basePhone: "5189889"
      }
    ];

    $("#auto-loop").lightGallery({
      mobileSrc: false, // If "data-responsive-src" attr. should be used for mobiles.
      mobileSrcMaxWidth: 640, // Max screen resolution for alternative images to be loaded for.
      swipeThreshold: 50, // How far user must swipe for the next/prev image (in px).
      hideControlOnEnd: false,
      closable: false
    });
  })
  .controller('UnionWelfareCtrl', function ($scope, $state, $ionicHistory, commonServices, CacheFactory) {
    //员工福利
    $scope.open = function (action) {
      switch (action) {
        case "年节福利":
          $state.go("union_welfare_fest");
          break;
        case "工惠福利汇":
          $state.go("union_welfare_union");
          break;
        case "工惠福利汇往期福利":
          $state.go("union_welfare_old");
          break;
        case "斗门公众号福利":
          $state.go("union_welfare_dmUnion");
          break;
        case "领取通知":
          $state.go("union_welfare_notice");
          break;
        default:
          break;
      }
    };

    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "CheckWelfareNotice");
      var paras = {
        WorkdayNo: baseInfo.WorkdayNO
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.hasNewWelfareNotice = resp.obj;
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr;
          alertService.showAlert(msg);
        }
      });
    }
    InitInfo();
  })
  .controller('UnionWelfareNoticeCtrl', function ($scope, $state, $ionicHistory, commonServices, CacheFactory) {
    //领取通知
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetWelfareNoticeList");
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

    $scope.open = function (ID) {
      var url = commonServices.getUrl("UnionService.ashx", "SubmitWelfareNoticeRead");
      var paras = {
        'NoticeID': ID,
        'WorkdayNo': baseInfo.WorkdayNO,
      };
      commonServices.submit(paras, url);    

      //打开动态内容页
      var objDyn = {
        PageTitle: '详情',
        TabName: 'ESE_Union_WelNotice',
        SrcCol: 'Html',
        WhereColName: 'ID',
        WhereColVal: ID
      };
      CacheFactory.save(GLOBAL_INFO.KEY_DYNPAGE, JSON.stringify(objDyn));
      $state.go("dynpage");
    };
  })
  .controller('UnionWelfareFestCtrl', function ($scope, $state, $ionicHistory) {
    //年节福利
    $scope.Items = [{
        welfare: "餐厅赠餐",
        target: "全体员工",
        detail: "春节、元宵节、端午节、中秋节在各餐厅赠餐（饺子/汤圆/粽子）",
        date: "节日当天"
      },
      {
        welfare: "生日红包",
        target: "全体员工",
        detail: "生日礼金60元（生日当月转至工资卡）",
        date: "每月"
      },
      {
        welfare: "端午节礼包",
        target: "全体员工",
        detail: "端午礼包一份",
        date: "节前一周"
      },
      {
        welfare: "夏送清凉",
        target: "全体员工",
        detail: "全园送凉茶，每月每人2罐，发放3个月",
        date: "7月-9月"
      },
      {
        welfare: "中秋节礼包",
        target: "全体员工",
        detail: "中秋大礼包一份",
        date: "节前一周"
      },
      {
        welfare: "开工红包",
        target: "全体员工",
        detail: "开工红包50元（转至工资卡）",
        date: "春节后开工之月"
      }
    ];
  })
  .controller('UnionWelfareDMCtrl', function ($scope, $state, $ionicHistory,
    commonServices, CacheFactory, UrlServices) {
    //斗门公众号福利
    $scope.open = function (action) {
      switch (action) {
        case "往期福利":
          $state.go("union_welfare_dm_his");
          break;
        case "关注指南":
          $state.go("union_welfare_dm_guide");
          break;
        case "幸运抽奖":
          UrlServices.openForeignUrl('https://www.wjx.top/jq/21587410.aspx');
        default:
          break;
      }
    }
  })
  .controller('UnionWelfareDMHistoryCtrl', function ($scope, $state, $ionicHistory,
    commonServices, CacheFactory, UrlServices) {
    //斗门往期福利
    $scope.Items = [{
        date: "不定期",
        detail: "1000个两癌筛查体检名额",
        category: "健康关爱"
      },
      {
        date: "新春",
        detail: "新春职工亲子一天游（每期50名，三期）",
        category: "旅游"
      },
      {
        date: "新春",
        detail: "1000个新春交通返程补贴（300元）",
        category: "补贴"
      },
      {
        date: "五一",
        detail: "五一职工广州一天游（每期100名，三期）",
        category: "旅游"
      },
      {
        date: "五一",
        detail: "五一轮盘抽奖 （烤箱、电风扇、腾讯王卡、书卡、娘家米）",
        category: "抽奖"
      },
      {
        date: "端午",
        detail: "端午轮盘大抽奖（天地一号饮料、花生油、电影票、雨伞）",
        category: "抽奖"
      },
      {
        date: "三八妇女节",
        detail: "女职工权益知识答题抽奖（娘家米）",
        category: "答题抽奖"
      },
      {
        date: "三月",
        detail: "十九大有奖知识问答（娘家米）",
        category: "答题抽奖"
      },
      {
        date: "六月",
        detail: "安全生产月答题送礼活动（1500份娘家米）",
        category: "答题抽奖"
      },
      {
        date: "七月",
        detail: "庆七 · 一留言活动 – 书卡",
        category: "答题抽奖"
      },
      {
        date: "不定期",
        detail: "积分兑换活动（3次）（珠海渔女工艺品、充电宝、天地一号饮料、书卡、羽毛球拍）",
        category: "其他"
      },
      {
        date: "不定期",
        detail: "其他福利活动",
        category: "其他"
      },
    ];
  })
  .controller('UnionWelfareWnionCtrl', function ($scope, $state, $ionicHistory,
    commonServices, CacheFactory, UrlServices) 
  {
    //工惠福利汇
    //"<a class='padding' href='#' ng-click='openGeneralNotice(0, \"751A73EC-E97B-4099-974F-79068BBEBE4C\")'>了解详情</a>"
    $scope.Items = [{
        type: "医疗",
        business: "拜博口腔",
        detail: "<ul><li>洁牙套餐A-【挂号+口腔检查+超声波洁牙+抛光】188元（原价200）；</li>"+
                "<li>洁牙套餐B-【挂号+口腔检查+超声波洁牙+抛光+喷砂】200元（原价280元）;</li>"+
                "<li>拍全景口腔片免费（原价100元）；</li>"+
                "<li>小孩窝沟封闭免费治疗（原价100元/1颗）；</li>"+
                "<li>口腔检查、治疗（除洁牙项目外）凭厂牌，员工及家属享受8折优惠（不可同享店内其他优惠）</li></ul>"
                ,
        beginDate: "7/1/2018",
        endDate: "7/1/2019",
        contact: "0756-2160088",
      },
      {
        type: "教育",
        business: "九拍音乐教育机构",
        detail: "<ul><li>2018年10月31日至2019年12月30日 课时费享8折优惠；</li>"+
                "<li>后续续费5年内享8折 首次报名可报多期课程（享5折优惠）;</li>"+
                "<li>2018年10月31日至2019年12月30日 课时费享8折优惠</li></ul>",
        beginDate: "8/17/2018",
        endDate: "12/30/2019",
        contact: "梁老师 18025078894",
      },
      {
        type: "购房",
        business: "华发又一城",
        detail: "凭厂牌享华发内部折扣价，最高优惠2%",
        beginDate: "8/10/2018",
        endDate: "\\",
        contact: "0756-5888888",
      }
    ];

    $scope.openGeneralNotice = function (isUrlHtml, id, html) {
      UrlServices.openGeneralNotice(isUrlHtml,id,html);
    };
  })
  .controller('UnionWelfareOldCtrl', function ($scope, $state, $ionicHistory,
    commonServices, CacheFactory, UrlServices) 
  {
    //工惠福利汇往期福利
    $scope.Items = [{
      "date": "元旦、新春",
      "type": "购物",
      "business": "威丝曼",
      "detail": "服饰特价专享"
    }, {
      "date": "年节",
      "type": "购物",
      "business": "罗西尼",
      "detail": "手表特卖"
    }, {
      "date": "不定期",
      "type": "购物",
      "business": "山姆会员店",
      "detail": "办卡、续卡享额外好礼"
    }, {
      "date": "不定期",
      "type": "餐饮",
      "business": "来魅力酒店",
      "detail": "自助餐，午餐158，晚餐215"
    }, {
      "date": "不定期",
      "type": "购房",
      "business": "华发楼盘",
      "detail": "华发各楼盘凭厂牌享华发内部折扣价"
    }, {
      "date": "夏季（约7~10月）",
      "type": "休闲",
      "business": "梦幻水城",
      "detail": "梦幻水城特享门票"
    }, {
      "date": "不定期",
      "type": "休闲",
      "business": "御温泉",
      "detail": "温泉及大餐庙会特惠"
    }, {
      "date": "寒暑假、年节",
      "type": "休闲",
      "business": "腾飞假期",
      "detail": "各地景点优惠门票、旅游报团"
    }, {
      "date": "不定期",
      "type": "休闲",
      "business": "长隆酒店",
      "detail": "长隆酒店住宿优惠"
    }, {
      "date": "不定期",
      "type": "休闲",
      "business": "海泉湾",
      "detail": "酒店、温泉、景点门票优惠"
    }, {
      "date": "不定期",
      "type": "理财",
      "business": "中国银行",
      "detail": "粤通卡、信用卡、志愿者证、理财产品办理"
    }, {
      "date": "年节时期",
      "type": "家居",
      "business": "华帝",
      "detail": "购买优惠，工厂价格，价保全年，差价3倍返"
    }, {
      "date": "年节时期",
      "type": "家居",
      "business": "劳卡",
      "detail": "家具定制优惠 11月11日专场优惠"
    }, {
      "date": "每季度",
      "type": "家居",
      "business": "国美",
      "detail": "内购会"
    }, {
      "date": "不定期",
      "type": "医疗",
      "business": "摩尔口腔",
      "detail": "优惠口腔健康检查、牙齿治疗、洁牙美白、矫正种植"
    }, {
      "date": "航展",
      "type": "休闲",
      "business": "中国邮政",
      "detail": "航展优惠门票，最优折扣"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "卓越艺术",
      "detail": "兴趣班优惠"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "景山实验学校",
      "detail": "子女就读优惠"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "箐华学校",
      "detail": "子女就读优惠"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "睿恩幼稚",
      "detail": "子女就读、托管优惠"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "九拍音乐教育机构",
      "detail": "兴趣班优惠"
    }, {
      "date": "开学、寒暑假前",
      "type": "教育",
      "business": "香山安琪儿幼儿园",
      "detail": "子女就读、托管、兴趣班优惠"
    }];
  })    
  .controller('UnionWelfareApplyResultCtrl', 
    function ($scope, $state, $ionicHistory, commonServices, CacheFactory, UrlServices) 
  {
    //补贴申请结果查询
    var baseInfo = commonServices.getBaseParas();
    $scope.model={
      WorkdayNO: baseInfo.WorkdayNO
    };

    $scope.LoadData = function () {
      var url = commonServices.getUrl("UnionService.ashx", "GetWelfareApplyResult");
      var paras = {
        WorkdayNo: $scope.model.WorkdayNO
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          } else {
            $scope.items=null;
            $scope.errMessage = resp.message;
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr;
          alertService.showAlert(msg);
        }
      });
    }
    $scope.LoadData();
  })
  .controller('UnionHelpSupportCtrl', function ($scope, $state, $ionicHistory, commonServices, CacheFactory) {
    //员工帮扶
    $scope.open = function (action) {
      switch (action) {
        case "申请指引":
          $state.go("union_helpSupport_guide");
          break;
        case "联系信息":
          $state.go("union_helpSupport_contact");
          break;
        default:
          break;
      }
    }
  })
  .controller('UnionHelpSupportGuideCtrl', function ($scope, $state, $ionicHistory) {
    //公司爱心帮扶
    $scope.helps = [{
        ItemName: "死亡",
        Object: "职工本人",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "死亡",
        Object: "配偶",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "重大疾病",
        Object: "职工本人",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "重大疾病",
        Object: "配偶或子女",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "重大疾病",
        Object: "父母",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "工伤住院",
        Object: "职工本人",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "生活困难",
        Object: "一人收入照顾全家※",
        Memo: "仅做一次性帮扶"
      },
      {
        ItemName: "灾难救助",
        Object: "职工本人",
        Memo: "仅做一次性帮扶"
      }
    ];

    $scope.projHelps = [{
        ItemName: "阳光助学<br>（金秋助学补充项目）",
        Object: "职工子女",
        Memo: "不与金秋助学重复申领，不限户籍"
      }
    ];

    $scope.dmHelps=[
      {
        ItemName: "临时困难救助",
        Object: "职工本人或家庭成员",
        Memo: "仅做一次性帮扶需发票复印件",
        Material:"<span class='redtext'>临救申请表</span>、档案表、户口薄复印件、近1年社保清单、家庭成员收入证明、银行卡复印件、<span class='redtext'>发票复印件</span>及致困相关证明"
      },
      {
        ItemName: "大病救助",
        Object: "患重大疾病的职工本人",
        Memo: "仅做一次性帮扶需发票原件",
        Material:"<span class='redtext'>大病申请表</span>、档案表、户口薄复印件、近1年社保清单、家庭成员收入证明、银行卡复印件、<span class='redtext'>发票原件</span>及致困相关证明"
      },
      {
        ItemName: "农民工子女成长关爱",
        Object: "外来工或本地户籍农民工",
        Memo: "隔年申请",
        Material:"<span class='redtext'>助学申请表</span>、档案表、户口薄复印件、近1年社保清单、家庭成员收入证明、银行卡复印件、<span class='redtext'>发票复印件</span>及致困相关证明"
      },
    ];

    $scope.dmProjHelps=[
      {
        ItemName: "秋送助学",
        Object: "职工子女",
        Memo: "珠海就读高中"
      },
      {
        ItemName: "冬送温暖",
        Object: "职工本人或家庭成员",
        Memo: "/"
      }
    ];

  })
  .controller('UnionHelpSupportContactCtrl', function ($scope, $state, $ionicHistory) {
    //爱心帮扶联系方式
    $scope.contacts = [{
        Building: "CR & RR",
        hrPeople: "Ellis Zhou",
        hrPhone: "5189889",
        basePeople: "Tara Qiu",
        basePhone: "5188838"
      },
      {
        Building: "Mechanical",
        hrPeople: "Boswell Jin",
        hrPhone: "5181017",
        basePeople: "Sirong He",
        basePhone: "5189160"
      },
      {
        Building: "PCBA-B11",
        hrPeople: "Sandy Liu",
        hrPhone: "5183914",
        basePeople: "Willa Wan",
        basePhone: "5183394"
      },
      {
        Building: "PCBA-South Campus",
        hrPeople: "Aaron Guo",
        hrPhone: "5186026",
        basePeople: "Minhua Lu",
        basePhone: "5186714"
      },
    ];
  })
  .controller('UnionActivityCtrl', function ($scope, $rootScope, $ionicPopup,
    $state, $ionicHistory, commonServices, CacheFactory, alertService, UrlServices) 
  {
    //工会活动及报名
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetActList");
      var paras = {
        WorkdayNo: baseInfo.WorkdayNO
      };
      alertService.showOperating('Loading...');
      commonServices.submit(paras, url).then(function (resp) {
        alertService.hideOperating();
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr;
          alertService.showAlert(msg);
        }
      },
      function(err){
        alertService.hideOperating();
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
          TabName: 'ESE_UnionActivity',
          SrcCol: 'Content',
          WhereColName: 'ID',
          WhereColVal: act.ID
        };
        CacheFactory.save(GLOBAL_INFO.KEY_DYNPAGE, JSON.stringify(objDyn));
        $state.go("dynpage");
      }
    };

    $scope.isSumbiting = false;

    function SubmitAttend(actID) {
      $scope.isSumbiting = true;
      var paras = baseInfo;
      paras.ActID = actID;
      var url = commonServices.getUrl("UnionService.ashx", "ActBook");
      try {
        commonServices.submit(paras, url).then(function (resp) {
          if (resp) {
            var msg = resp.message;
            alertService.showAlert(msg);
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
    }

    $scope.Submit = function (actID) {
      $ionicPopup.confirm({
        title: '提示',
        template: '确定报名吗？',
        okText: "OK"
      }).then(function (res) {
        if (res) {
          SubmitAttend(actID);
        }
      });
    };

  })
  .controller('UnionWonderfulmomentCtrl', function ($scope, $rootScope, $ionicPopup,
    $state, $ionicHistory, commonServices, CacheFactory, alertService, UrlServices) 
  {
    //精彩瞬间
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetWonderfulMomList");
      var paras = {
        WorkdayNo: baseInfo.WorkdayNO
      };
      alertService.showOperating('Loading...');
      commonServices.submit(paras, url).then(function (resp) {
        alertService.hideOperating();
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        } else {
          var msg = $rootScope.Language.common.CommunicationErr;
          alertService.showAlert(msg);
        }
      },
      function(err){
        alertService.hideOperating();
      });
    }
    InitInfo();

    $scope.open = function (item) {
      if (item.IsOutLink) {
        UrlServices.openForeignUrl(item.Html);
      } else {
        CacheFactory.save(GLOBAL_INFO.KEY_UNION_WONDERFULMON_ID, item.ID);
        $state.go('union_wonderfulmoment_detail');
      }
    };
  })
  .controller('UnionWonderfulmomentDetailCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal,
    $state, $ionicHistory, commonServices, CacheFactory, alertService, duplicateSubmitServices) {
    //精彩瞬间 详细
    var wonderfulMomID = CacheFactory.get(GLOBAL_INFO.KEY_UNION_WONDERFULMON_ID);
    var baseInfo = commonServices.getBaseParas();

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetWonderfulMomDetail");
      var paras = {
        "WonderfulMomID": wonderfulMomID
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (!resp.success) {
            var msg = $rootScope.Language.common.CommunicationErr;
            alertService.showAlert(msg);
            $ionicHistory.goBack();
          } else {
            $scope.ret = resp.obj;
            $('#div_html').html(resp.obj.Html);
          }
        }
      });
    }
    InitInfo();

    $scope.like = function () {
      var paras = {
        //"SubmitGuid": duplicateSubmitServices.genGUID(),
        "WonderfulMomID": wonderfulMomID,
        "WorkdayNo": baseInfo.WorkdayNO,
      };
      var url = commonServices.getUrl("UnionService.ashx", "AddLike");
      commonServices.submit(paras, url).then(function (data) {
        if (data.success) {
          $scope.ret.LikeCount = $scope.ret.LikeCount + 1;
        }
      });
    };

    $ionicModal.fromTemplateUrl('templates/modalWriteMsg.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal
    })
    $scope.writeMsg = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.submitComment = function () {
      var Comments = $("#Comments").val();
      if (Comments.length == 0) {
        console.log(Comments);
        return;
      }

      var para = {
        "SubmitGuid": duplicateSubmitServices.genGUID(),
        "WonderfulMomID": wonderfulMomID,
        "WorkdayNo": baseInfo.WorkdayNO,
        "Comments": Comments
      };

      var url = commonServices.getUrl("UnionService.ashx", "AddWonderfulMomComments");
      commonServices.submit(para, url).then(function (data) {
        if (data.success) {
          $scope.modal.hide();
          InitInfo(); //refresh
        } else {
          alertService.showAlert(data.message);
        }
      });
    };

  })
  .controller('UnionSuggestCtrl', function ($scope, $rootScope, $ionicPopup,
    $state, $ionicHistory, commonServices) {
    //建议留言
    $scope.open = function (action) {
      switch (action) {
        case "我的留言":
          $state.go("union_suggest_my");
          break;
        case "留言公开":
          $state.go("union_suggest_open");
          break;
        default:
          break;
      }
    };
  })
  .controller('UnionSuggestMyCtrl', function ($scope, $rootScope, $ionicPopup,
    $state, $ionicHistory, commonServices, alertService, duplicateSubmitServices) 
  {
    //我的留言
    var baseInfo = commonServices.getBaseParas();
    $scope.hisSuggest = [];

    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetMySuggest");
      var paras = {
        WorkdayNO: baseInfo.WorkdayNO
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
      CName: baseInfo.CName,
      WorkdayNO: baseInfo.WorkdayNO,
      MobileNo: baseInfo.MobileNo,
      Organization: baseInfo.Organization,
      Suggest: ""
    };
    $scope.GetSuggest = function () {
      return $.trim($scope.model.Suggest);
    };

    var swMap = null;
    function HasSensWord(txt) {
      if (!swMap) {
        swMap = sw_buildMap();
      }
      return sw_check(swMap, txt)
    }

    $scope.isSumbiting = false;
    $scope.Submit = function () {
      $scope.isSumbiting = true;
      var sugg = $scope.GetSuggest();
      if (sugg.length < 3) {
        alertService.showAlert("请填写你的建议!");
        $scope.isSumbiting = false;
        return;
      }
      if(HasSensWord(sugg)){
        alertService.showAlert("请填写你的建议!");
        $scope.model.Suggest="";
        $scope.isSumbiting = false;
        return;
      }

      $scope.model.Suggest = sugg;
      var paras = $scope.model;
      var url = commonServices.getUrl("UnionService.ashx", "SubmitMySuggest");
      try {
        commonServices.submit(paras, url).then(function (resp) {
          if (resp.success) {
            var msg = $rootScope.Language.dormManage.suggestSucc;
            alertService.showAlert(msg);
            //$ionicHistory.goBack();
            InitInfo(); //refresh
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
  .controller('UnionSuggestOpenCtrl', function ($scope, $rootScope, $ionicPopup,
    $state, $ionicHistory, commonServices, CacheFactory) {
    //留言公开
    //var baseInfo = commonServices.getBaseParas();
    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetOpenSuggest");
      var paras = {};
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.items = resp.list;
          }
        }
      });
    }
    InitInfo();

    $scope.open = function (suggID) {
      CacheFactory.save(GLOBAL_INFO.KEY_UNION_SUGGOPEN_ID, suggID);
      $state.go('union_suggest_openDetail');
    };
  })
  .controller('UnionSuggestOpenDetailCtrl', function ($scope, commonServices, CacheFactory) {
    //留言公开 详情
    var suggID = CacheFactory.get(GLOBAL_INFO.KEY_UNION_SUGGOPEN_ID);
    //var baseInfo = commonServices.getBaseParas();
    function InitInfo() {
      var url = commonServices.getUrl("UnionService.ashx", "GetOpenSuggestDetail");
      var paras = {
        suggID: suggID
      };
      commonServices.submit(paras, url).then(function (resp) {
        if (resp) {
          if (resp.success) {
            $scope.item = resp.obj;
          }
        }
      });
    }
    InitInfo();
  })

///////////////////////////////////////
;