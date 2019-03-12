/**
 * Created by DMNeeoll on 2016/3/22.
 */
/**
 * 路由
 */
angular.module('evaluationApp.router', [])
    .config(['$provide', '$stateProvider', '$urlRouterProvider', function ($provide, $stateProvider, $urlRouterProvider) {

        $stateProvider
//            .state('menu', {
//                url: "/menu",
//                abstract: true,
//                templateUrl: "templates/menu.html",
//                controller: 'AppCtrl'
//            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/tab-signin.html',
                controller: 'AppCtrl'
            })
//            .state('signin', {
//                url: '/signin',
//                templateUrl: 'templates/choujiang/choujiangInPutName.html',
//                controller: 'ChoujiangNameCtrl'
//            })
//            .state('signin', {
//                url: '/signin',
//                templateUrl: 'templates/choujiangForGame/choujiangGame.html',
//                controller: 'ChoujiangGameCtrl'
//            })
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: 'templates/tab-home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.goodJob', {
                url: '/goodJob',
                views: {
                    'home': {
                        templateUrl: 'templates/tab-goodJob.html',
                        controller: 'GoodJobCtrl'
                    }
                }
            })
            .state('tab.kqjl', {
                url: '/kqjl',
                views: {
                    'home': {
                        templateUrl: 'templates/tab-kqjl.html',
                        controller: 'KqjlCtrl'
                    }
                }
            })

            .state('tabKQCX', {
                url: "/tabKQCX",
                abstract: true,
                templateUrl: "templates/kqcx/tabkqcx.html"
            })
            .state('tabKQCX.kqjl', {
                url: '/kqjl',
                views: {
                    'kqjl': {
                        templateUrl: 'templates/kqcx/kqjl.html',
                        controller: 'KqjlCtrl'
                    }
                }
            })
            .state('tabKQCX.kqyc', {
                url: '/kqyc',
                views: {
                    'kqyc': {
                        templateUrl: 'templates/kqcx/kqyc.html',
                        controller: 'KqAbnormalCtrl'
                    }
                }
            })
            .state('kqyc', {
                url: '/kqyc',
                templateUrl: 'templates/kqcx/kqyc.html',
                controller: 'KqAbnormalCtrl'
            })
//            .state('tabAskForHelp.myHelp', {
//                url: '/myHelp',
//                views: {
//                    'myHelp': {
//                        templateUrl: 'templates/askForHelp/tab-myHelp.html',
//                        controller: 'MyHelpCtrl'
//                    }
//                }
//            })


            .state('tab.cust', {
                url: '/cust',
                views: {
                    'home': {
                        templateUrl: 'templates/cust/tab-cust.html',
                        controller: 'CustCtrl'
                    }
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            .state('tab.password', {
                url: '/password',
                views: {
                    'account': {
                        templateUrl: 'templates/account/account_password.html',
                        controller: 'PassCtrl'
                    }
                }
            })
            .state('hotPhone', {
                url: '/hotPhone',
                templateUrl: 'templates/hotPhone/tab-hotPhone.html',
                controller: 'HotPhoneCtrl'
            })

            //.state('38Activity', {
            //    url: '/38activity',
            //    templateUrl: 'templates/38/38activity.html',
            //    controller: '38ActivityCtrl'
            //})

            .state('tabPoints', {
                url: "/tabPoints",
                abstract: true,
                templateUrl: "templates/points/tabPoints.html"
            })
            .state('tabPoints.rules', {
                url: '/rules/:ID',
                views: {
                    'rules': {
                        templateUrl: 'templates/points/tab-rules.html',
                        controller: 'RulesCtrl'
                    }
                }
            })
            .state('tabPoints.points', {
                url: '/points',
                views: {
                    'points': {
                        templateUrl: 'templates/points/tab-points.html',
                        controller: 'PointsCtrl'
                    }
                }
            })
            .state('tabPoints.ranking', {
                url: '/ranking',
                views: {
                    'ranking': {
                        templateUrl: 'templates/points/tab-ranking.html',
                        controller: 'RankingCtrl'
                    }
                }
            })
            .state('tabPoints.account', {
                url: '/PointsAccount',
                views: {
                    'pointsAccount': {
                        templateUrl: 'templates/points/tab-account.html',
                        controller: 'PointsAccountCtrl'
                    }
                }
            })

            .state('tabGoldIdea', {
                url: "/tabGoldIdea",
                abstract: true,
                templateUrl: "templates/goldIdea/tabGoldIdea.html"
            })
            .state('tabGoldIdea.goldIdeaShow', {
                url: '/goldIdeaShow',
                views: {
                    'goldIdeaShow': {
                        templateUrl: 'templates/goldIdea/tab-goldIdeaShow.html',
                        controller: 'GoldIdeaShowCtrl'
                    }
                }
            })
            .state('tabGoldIdea.goldidea', {
                url: '/goldidea',
                views: {
                    'goldIdea': {
                        templateUrl: 'templates/goldIdea/tab-goldIdea.html',
                        controller: 'GoldideaCtrl'
                    }
                }
            })
            .state('tabGoldIdea.myGoldIdea', {
                url: '/myGoldIdea',
                views: {
                    'myGoldIdea': {
                        templateUrl: 'templates/goldIdea/tab-myGoldIdea.html',
                        controller: 'MyGoldideaCtrl'
                    }
                }
            })

            .state('b15hotPhone', {
                url: '/b15hotPhone',
                templateUrl: 'templates/hotPhone/tab-B15hotPhone.html',
                controller: 'B15HotPhoneCtrl'
            })
            .state('hotPhoneDetails', {
                url: '/hotPhoneDetails',
                templateUrl: 'templates/hotPhone/hotPhoneDetails.html',
                controller: 'HotPhoneDetailsCtrl'
            })

            .state('tab.myMsg', {
                url: '/myMsg',
                views: {
                    'msg': {
                        templateUrl: 'templates/myMsg/tab-myMsg.html',
                        controller: 'MyMsgCtrl'
                    }
                }
            })
            .state('tab.myMsgDetail', {
                url: '/myMsgDetail',
                views: {
                    'msg': {
                        templateUrl: 'templates/myMsg/myMsgDetail.html',
                        controller: 'MyMsgDetailCtrl'
                    }
                }
            })

            .state('tab.404', {
                url: '/404',
                views: {
                    'home': {
                        templateUrl: 'templates/404.html'

                    }
                }
            })
            .state('noticeList', {
                url: '/noticeList',
                templateUrl: 'templates/notice/notice-list.html',
                controller: 'NoticeListCtrl'
            })
            .state('noticeHtml', {
                url: '/noticeHtml',
                templateUrl: 'templates/notice/noticeHtml.html',
                controller: 'NoticeHtmlCtrl'
            })
            .state('homeNotice', {
                url: '/HomeNotice',
                templateUrl: 'templates/HomeNotice.html',
                controller: 'HomeNoticeCtrl'
            })

            .state('activityList', {
                url: '/activityList',
                templateUrl: 'templates/activity/activity-list.html',
                controller: 'ActivityListCtrl'
            })
            .state('activityHtml', {
                url: '/activityHtml',
                templateUrl: 'templates/activity/activityHtml.html',
                controller: 'ActivityHtmlCtrl'
            })
            .state('activityGood',{
                url: '/activityGood',
                templateUrl: 'templates/activity/activityGood.html',
                controller: 'ActivityGoodCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/account/account_register.html',
                controller: 'RegCtrl'
            })
            .state('forgetPsw', {
                url: '/forgetPsw',
                templateUrl: 'templates/account/account_forgetPasswordNoMobile.html',
                controller: 'ForgetPswCtrl'
            })
            .state('rebindPhone', {
                url: '/rebindPhone',
                templateUrl: 'templates/account/account_rebindPhone.html',
                controller: 'RebindPhoneCtrl'
            })
            

            //移除tab
            // .state('tabCar', {
            //     url: "/tabCar",
            //     abstract: true,
            //     templateUrl: "templates/carGps/tabCar.html"
            // })
            // .state('tabCar.carlist', {
            //     url: '/carlist',
            //     views: {
            //         'carlist': {
            //             templateUrl: 'templates/carGps/tab-carList.html',
            //             controller: 'CarListCtrl'
            //         }
            //     }
            // })
            // .state('tabCar.map', {
            //     url: '/map',
            //     views: {
            //         'map': {
            //             templateUrl: 'templates/carGps/tab-map.html',
            //             controller: 'BaiduMapCtrl'
            //         }
            //     }
            // })
            // .state('tabCar.carPicture', {
            //     url: '/carPicture',
            //     views: {
            //         'carPicture': {
            //             templateUrl: 'templates/carGps/tab-carPicture.html',
            //             controller: 'CarPictureCtrl'
            //         }
            //     }
            // })
            .state('Carlist', {
                url: '/carList',
                templateUrl: 'templates/carGps/tab-carList.html',
                controller: 'CarListCtrl'
            })
            .state('CarMap', {
                url: '/carMap',
                templateUrl: 'templates/carGps/tab-map.html',
                controller: 'BaiduMapCtrl'
            })
            // .state('carBusTime', {
            //     url: '/carBusTime',
            //     templateUrl: 'templates/carGps/tab-carBusTime.html',
            //     controller: 'CarPictureCtrl'
            // })
            .state('chartRoom', {
                url: '/chartRoom',
                templateUrl: 'templates/chartRoom/tab-chartRoom.html',
                controller: 'ChartRoomCtrl'
            })
            .state('askAndAnswer', {
                url: '/askAndAnswer',
                templateUrl: 'templates/askAndAnswer/askAndAnswerList.html',
                controller: 'AskAndAnswerCtrl'
            })
            .state('askAndAnswerDetail', {
                url: '/askAndAnswerDetail',
                templateUrl: 'templates/askAndAnswer/askAndAnswerDetail.html',
                controller: 'AskAndAnswerDetailCtrl'
            })
            .state('lightPower', {
                url: '/lightPower',
                templateUrl: 'templates/lightPower.html',
                controller: 'LightPowerCtrl'
            })
            .state('Photo', {
                url: '/Photo',
                templateUrl: 'templates/Photo.html',
                controller: 'PhotoCtrl'
            })
            .state('choujiang', {
                url: '/choujiang',
                templateUrl: 'templates/choujiang/choujiangNew.html',
                controller: 'CJCtrl'
            })
            .state('choujiangName', {
                url: '/choujiangName',
                templateUrl: 'templates/choujiang/choujiangInPutName.html',
                controller: 'ChoujiangNameCtrl'
            })

            .state('researchList', {
                url: '/researchList',
                templateUrl: 'templates/research/research-list.html',
                controller: 'ResearchCtrl'
            })
            .state('researchHtml', {
                url: '/researchHtml',
                templateUrl: 'templates/research/researchHtml.html',
                controller: 'ResearchDetailsCtrl'
            })

            .state('tabMealOrder', {
                url: "/tabMealOrder",
                abstract: true,
                templateUrl: "templates/mealOrder/tabMealOrder.html"
            })
            .state('tabMealOrder.mealList', {
                url: '/mealList',
                views: {
                    'mealList': {
                        templateUrl: 'templates/mealOrder/tab-mealList.html',
                        controller: 'MealListCtrl'
                    }
                }
            })
            .state('tabMealOrder.mealLinkMan', {
                url: '/mealLinkMan',
                views: {
                    'mealLinkMan': {
                        templateUrl: 'templates/mealOrder/tab-mealLinkMan.html',
                        controller: 'MealLinkManCtrl'
                    }
                }
            })
            .state('tabMealOrder.myOrder', {
                url: '/myOrder',
                views: {
                    'myOrder': {
                        templateUrl: 'templates/mealOrder/tab-myOrder.html',
                        controller: 'MyOrderCtrl'
                    }
                }
            })

            .state('myAccountMoney', {
                url: '/myAccountMoney',
                templateUrl: 'templates/account/myAccountMoney.html',
                controller: 'MyAccountMoneyCtrl'
            })
            .state('tabAskForHelp', {
                url: "/tabAskForHelp",
                abstract: true,
                templateUrl: "templates/askForHelp/tabAskForHelp.html"
            })
            .state('tabAskForHelp.askForHelp', {
                url: '/askForHelp',
                views: {
                    'askForHelp': {
                        templateUrl: 'templates/askForHelp/tab-askForHelp.html',
                        controller: 'AskForHelpCtrl'
                    }
                }
            })
            .state('tabAskForHelp.myHelp', {
                url: '/myHelp',
                views: {
                    'myHelp': {
                        templateUrl: 'templates/askForHelp/tab-myHelp.html',
                        controller: 'MyHelpCtrl'
                    }
                }
            })

            .state('b11WorkShopHome', {
                url: '/b11WorkShopHome',
                templateUrl: 'templates/b11Workshop/HomePage.html',
                controller: 'B11WorkShopHomeCtrl'
            })
            .state('agenda', {
                url: '/agenda',
                templateUrl: 'templates/b11Workshop/agenda.html',
                controller: 'AgendaCtrl'
            })
            .state('hotel', {
                url: '/hotel',
                templateUrl: 'templates/b11Workshop/hotel.html'

            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'templates/b11Workshop/contact.html'

            })
            .state('volunteer', {
                url: '/volunteer',
                templateUrl: 'templates/b11Workshop/volunteer.html',
                controller: 'VolunteerCtrl'
            })
            .state('transport', {
                url: '/transport',
                templateUrl: 'templates/b11Workshop/transport.html',
                controller: 'RransportCtrl'
            })

            .state('tab_ShareCar', {
                url: "/tab_ShareCar",
                abstract: true,
                templateUrl: "templates/shareCar/tab_ShareCar.html"
            })
            .state('tab_ShareCar.List', {
                url: '/sharcarList',
                views: {
                    'sharcarList': {
                        templateUrl: 'templates/shareCar/tab-shareCarList.html',
                        controller: 'ShareCarListCtrl'
                    }
                }
            })
            .state('tab_ShareCar.Detail', {
                url: '/shareCarDetail',
                views: {
                    'sharcarList': {
                        templateUrl: 'templates/shareCar/shareCarDetail.html',
                        controller: 'ShareCarDetailCtrl'
                    }
                }

            })
            .state('tab_ShareCar.MyShareCar', {
                url: '/myShareCar',
                views: {
                    'myShareCar': {
                        templateUrl: 'templates/shareCar/tab-myOrder.html',
                        controller: 'ShareMyOrderCtrl'
                    }
                }
            })

            .state('handbook_lg', {
                url: '/handbook_lg',
                templateUrl: 'templates/handBook/handbook_lg.html',
                controller: 'Handbook_lgCtrl'
            })
            .state('HandbookItemOne', {
                url: '/HandbookItemOne',
                templateUrl: 'templates/handBook/handbookItemOne.html',
                controller: 'HandbookItemOneCtrl'
            })
            .state('handbookitemTwo', {
                url: '/handbookitemTwo',
                templateUrl: 'templates/handBook/handbookitemTwo.html',
                controller: 'HandbookItemTwoCtrl'
            })
            .state('handbookitemThree', {
                url: '/handbookitemThree',
                templateUrl: 'templates/handBook/handbookitemThree.html',
                controller: 'HandbookItemThreeCtrl'
            })
            .state('handbookitemFour', {
                url: '/handbookitemFour',
                templateUrl: 'templates/handBook/handbookitemFour.html',
                controller: 'HandbookItemFourCtrl'
            })
            .state('apply', {
                url: '/apply',
                templateUrl: 'templates/applySubmit/apply-list.html',
                controller: 'ApplyCtrl'
            })
            .state('applyHtml', {
                url: '/applyHtml',
                templateUrl: 'templates/applySubmit/apply-Html.html',
                controller: 'ApplyHtmlCtrl'
            })
            .state('applyTicket', {
                url: '/applyTicket',
                templateUrl: 'templates/applySubmit/applyTicket.html',
                controller: 'ApplyTicketCtrl'
            })
            .state('baiduMap', {
                url: '/baiduMap',
                templateUrl: 'templates/baiduMap/gps.html',
                controller: 'BaiduMapCtrl'
            })
            .state('insurance', {
                url: '/insurance',
                templateUrl: 'templates/insurance/insurance-list.html',
                controller: 'InsuranceCtrl'
            })
            .state('insuranceHtml', {
                url: '/insuranceHtml',
                templateUrl: 'templates/insurance/insurance-Html.html',
                controller: 'InsuranceHtmlCtrl'
            })

            .state('luckyGame', {
                url: '/luckyGame',
                templateUrl: 'templates/luckyDrawGame/lucyGame.html',
                controller: 'LuckyGameCtrl'
            })
            .state('chunwan', {
                url: '/chunwan',
                templateUrl: 'templates/chunwan/chunwan-list.html',
                controller: 'ChunwanCtrl'
            })
            .state('chunwanjiangpin', {
                url: '/chunwanjiangpin',
                templateUrl: 'templates/chunwan/chunwanjiangpinHtml.html',
            })
            .state('chunwanjiemu', {
                url: '/chunwanjiemu',
                templateUrl: 'templates/chunwan/chunwanjiemuHtml.html',
            })
            .state('chunwanNameListHtml', {
                url: '/chunwanNameListHtml',
                templateUrl: 'templates/chunwan/chunwanNameListHtml.html'
            })
            .state('chunwanZJ', {
                url: '/chunwanZJ',
                templateUrl: 'templates/chunwan/chunwanZJ.html',
                controller: 'ChunwanZJCtrl'
            })
            .state('chunwanZJName', {
                url: '/chunwanZJName',
                templateUrl: 'templates/chunwan/chunwanZJName.html',
                controller: 'ChunwanZJNameCtrl'
            })
//            .state('GBS', {
//                url: '/GBS',
//                templateUrl: 'templates/GBS/gbs-list.html'
//
//            })

            .state('GBS', {
                url: '/GBS',
                templateUrl: 'templates/GBS/gbs-list.html',
                controller: 'GBSListCtrl'
            })
            .state('certificate', {
                url: '/certificate',
                templateUrl: 'templates/GBS/certificate/certificate-list.html',
                controller: 'CertificateCtrl'
            })
            .state('certificateSubmit', {
                url: '/certificateSubmit',
                templateUrl: 'templates/GBS/certificate/certificate-submit.html',
                controller: 'CertificateSubmit'
            })
            .state('reissueWorkingCard', {
                url: '/reissueWorkingCard',
                templateUrl: 'templates/GBS/certificate/reissueWorkingCard.html',
                controller: 'reissueWorkingCard'
            })
            .state('visaApply', {
                url: '/visaApply',
                templateUrl: 'templates/GBS/certificate/visaApply.html',
                controller: 'VisaApplyCtrl'

            })
            .state('tab_LostFound', {
                url: '/tab_LostFound',
                templateUrl: 'templates/GBS/lostFound/lostFound.html',
                abstract: true,
            })
                .state('tab_LostFound.List', {
                    url: '/lostFoundList',
                    views: {
                        'lostFoundList': {
                            templateUrl: 'templates/GBS/lostFound/lostFound_list.html',
                            controller: 'LostFoundListCtrl'
                        }
                    }
                })
                .state('tab_LostFound.My', {
                    url: '/lostFoundMy',
                    views: {
                        'lostFoundMy': {
                            templateUrl: 'templates/GBS/lostFound/lostFound_my.html',
                            controller: 'LostFoundMyCtrl'
                        }
                    }
                })
                .state('tab_LostFound.Public', {
                    url: '/lostFoundPublic',
                    views: {
                        'lostFoundPublic': {
                            templateUrl: 'templates/GBS/lostFound/lostFound_public.html',
                            controller: 'LostFoundPublicCtrl'
                        }
                    }
                })
                .state('tab_LostFound.Detail', {
                    url: '/lostFoundDetail',
                    views: {
                        'lostFoundList': {
                            templateUrl: 'templates/GBS/lostFound/lostFound_detail.html',
                            controller: 'LostFoundDetailCtrl'
                        }
                    }
                })
            .state('earthWeekNoticeList', {
                url: '/earthWeekNoticeList',
                templateUrl: 'templates/earthWeek/notice-list.html',
                controller: 'EarthdayNoticeListCtrl'
            })
            .state('cser', {
                url: '/cser',
                templateUrl: 'templates/cser/cser-list.html',
                controller: 'CSERCtrl'
            })
                .state('cserDate', {
                    url: '/cserDate',
                    templateUrl: 'templates/cser/cser-Date.html',
                    controller: 'CserDateCtrl'
                })
                .state('cser_kidsCaring', {
                    url: '/cser_kidsCaring',
                    templateUrl: 'templates/cser/cser-kidsCaring.html',
                    controller: 'CSERKidsCaringCtrl'
                })
                .state('cser_sumwinCamp', {
                    url: '/cser_sumwinCamp',
                    templateUrl: 'templates/cser/cser-sumwinCamp.html',
                    controller: 'CSERSumwinCampCtrl'
                })
                .state('cser_activityCenter', {
                    url: '/cser_activityCenter',
                    templateUrl: 'templates/cser/cser_activityCenterList.html',
                    controller: 'CSERActivityCenterCtrl'
                })
                    .state('cser_center_map', {
                        url: '/cser_center_map',
                        templateUrl: 'templates/cser/activityCenter/cser_activityCenterMap.html',
                        controller: null
                    })
                    .state('cser_center_protocol', {
                        url: '/cser_center_protocol',
                        templateUrl: 'templates/cser/activityCenter/cser_activityCenterProtocol.html',
                        controller: 'CSERActivityCenterProtocolCtrl'
                    })
                    .state('cser_center_faq', {
                        url: '/cser_center_faq',
                        templateUrl: 'templates/cser/activityCenter/cser_activityCenterFaq.html',
                        controller: 'CSERActivityCenterFaqCtrl'
                    })
                    .state('cser_center_repair', {
                        url: '/cser_center_repair',
                        templateUrl: 'templates/cser/activityCenter/cser_activityCenterRepair.html',
                        controller: 'CSERActivityCenterRepairCtrl'
                    })
                    .state('cser_center_suggest', {
                        url: '/cser_center_suggest',
                        templateUrl: 'templates/cser/activityCenter/cser_activityCenterSuggest.html',
                        controller: 'CSERActivityCenterSuggestCtrl'
                    })
            .state('activityEHS',{
                url: '/activityEHS',
                templateUrl: 'templates/ehs/activityEHS.html',
                controller: 'ActivityEHSCtrl'
            })
            .state('basicGuide',{
                url: '/basicGuide',
                templateUrl: 'templates/GBS/basicGuide.html',
                controller: 'BasicGuideCtrl'
            })            
            .state('admin',{
                url: '/admin',
                templateUrl: 'templates/admin/admin-list.html',
                controller: 'AdminCtrl'
            })
            /*sub of admin*/
            .state('icCardLost',{
                url: '/icCardLost',
                templateUrl: 'templates/admin/icCardLost.html',
                controller: 'ICCardLostCtrl'
            })
            .state('dormManage',{
                url: '/dormManage',
                templateUrl: 'templates/admin/dormManage-list.html',
                controller: 'DormManageCtrl'
            })
                /*sub of dormManage*/
                .state('housingAllowance',{
                    url: '/housingAllowance',
                    templateUrl: 'templates/admin/dorm/housingAllowance.html',
                    controller: 'HousingAllowanceCtrl'
                })            
                .state('dormNoticeProtocol',{
                    url: '/dormNoticeProtocol',
                    templateUrl: 'templates/admin/dorm/protocolDormPage.html',
                    controller:'ProtocolDormPageCtrl'
                })
                .state('applyDorm',{
                    url: '/applyDorm',
                    templateUrl: 'templates/admin/dorm/applyDorm.html',
                    controller: 'ApplyDormCtrl'
                })
                .state('chargingDefine',{
                    url: '/chargingDefine',
                    templateUrl: 'templates/admin/dorm/chargingDefine.html',
                    controller: 'ChargingDefineCtrl'
                })
                // .state('dormMap', {
                //     url: '/dormMap',
                //     templateUrl: 'templates/admin/dorm/dormMap.html',
                //     controller: 'DormMapCtrl'
                // })
                .state('dormNotice', {
                    url: '/dormNotice',
                    templateUrl: 'templates/admin/dorm/dormNotice-list.html',
                    controller: 'DormNoticeCtrl'
                })
                .state('dormNoticeDetail', {
                    url: '/dormNoticeDetail',
                    templateUrl: 'templates/admin/dorm/dormNotice-detail.html',
                    controller: 'DormNoticeDetailCtrl'
                })
                .state('repairDorm', {
                    url: '/repairDorm',
                    templateUrl: 'templates/admin/dorm/repairDorm.html',
                    controller: 'RepairDormCtrl'
                })
                .state('reissueKey', {
                    url: '/reissueKey',
                    templateUrl: 'templates/admin/dorm/reissueKey.html',
                    controller: 'ReissueKeyCtrl'
                })
                .state('freeDormWifi', {
                    url: '/freeDormWifi',
                    templateUrl: 'templates/admin/dorm/freeDormWifi.html',
                    controller: 'FreeDormWifiCtrl'
                })
                .state('freeDormWifi_ios', {
                    url: '/freeDormWifi_ios',
                    templateUrl: 'templates/admin/dorm/freeDormWifi_ios.html',
                    controller: null
                })
                .state('freeDormWifi_android', {
                    url: '/freeDormWifi_android',
                    templateUrl: 'templates/admin/dorm/freeDormWifi_android.html',
                    controller: null
                })
                .state('dormAskAndAns', {
                    url: '/dormAskAndAns',
                    templateUrl: 'templates/admin/dorm/dormAskAndAns.html',
                    controller: 'DormAskAndAnsCtrl'
                })
                .state('dormSuggest', {
                    url: '/dormSuggest',
                    templateUrl: 'templates/admin/dorm/dormSuggest.html',
                    controller: 'DormSuggestCtrl'
                })
            /*sub of EAdmin*/
              .state('EAdminList',{
                url: '/EAdminList',
                templateUrl: 'templates/admin/EAdmin/eAdmin-List.html',
                controller: 'EAdminListCtrl'
            })
            .state('eCarApproveList',{
                url: '/eCarApproveList',
                templateUrl: 'templates/admin/EAdmin/eCarApproveList-List.html',
                controller: 'ECarApproveListCtrl'
            })
              .state('eCarApproveDetail', {
                  url: '/eCarApproveDetail',
                  templateUrl: 'templates/admin/EAdmin/eCarApprover_Details.html',
                  controller: 'ECarApproveDetailsCtrl'
              })
            .state('DormMngApplication',{
                url: '/DormMngApplication',
                templateUrl: 'templates/admin/EAdmin/DormMngApplication-List.html',
                controller: 'DormMngApplicationCtrl'
            })
                .state('DormMngApplicationDetail',{
                    url: '/DormMngApplicationDetail',
                    templateUrl: 'templates/admin/EAdmin/DormMngApplication-Detail.html',
                    controller: 'DormMngApplicationDetailCtrl'
                })
                .state('DormVisitorApplicationDetail',{
                    url: '/DormVisitorApplicationDetail',
                    templateUrl: 'templates/admin/EAdmin/DormVisitorApplication-Detail.html',
                    controller: 'DormVisitorApplicationDetailCtrl'
                })
            .state('DormHousingSubsidy',{
                url: '/DormHousingSubsidy',
                templateUrl: 'templates/admin/EAdmin/DormHousingSubsidy-List.html',
                controller: 'DormHousingSubsidyCtrl'
            })
                .state('DormHousingSubsidyDetail',{
                    url: '/DormHousingSubsidyDetail',
                    templateUrl: 'templates/admin/EAdmin/DormHousingSubsidy-Detail.html',
                    controller: 'DormHousingSubsidyDetailCtrl'
                })
            /*sub of GBSHR*/
            .state('generalNotice', {
                url: '/generalNotice',
                templateUrl: 'templates/generalNotice/generalNoticeList.html',
                controller: 'GeneralNoticeCtrl'
            })
            .state('generalNoticeDetail', {
                url: '/generalNoticeDetail',
                templateUrl: 'templates/generalNotice/generalNoticeDetail.html',
                controller: 'generalNoticeDetailCtrl'
            })
            .state('employeeDismiss', {
                url: '/employeeDismiss',
                templateUrl: 'templates/GBS/employeeDismiss/dismiss-list.html',
                controller: 'EmployeeDismissCtrl'
            })
            .state('dismissIntro', {
                url: '/dismissIntro',
                templateUrl: 'templates/GBS/employeeDismiss/dismissIntro-list.html',
                controller: 'DismissIntroCtrl'
            })        
            .state('dismissStatus', {
                url: '/dismissStatus',
                templateUrl: 'templates/GBS/employeeDismiss/dismissStatus.html',
                controller: 'DismissStatusCtrl'
            })
            .state('researchTrainer', {
                url: '/researchTrainer',
                templateUrl: 'templates/research/researchTrainer.html',
                controller: 'ResearchTrainerCtrl'
            })
        .state('dynpage', {
            url: '/dynpage',
            templateUrl: 'templates/generalNotice/dynPage.html',
            controller: 'DynpageCtrl'
        })
        .state('testPage', {
            url: '/testPage',
            templateUrl: 'templates/test/testPage.html',
            controller: 'TestPageCtrl'
        })
        .state('union', {
            url: '/union',
            templateUrl: 'templates/union/union-list.html',
            controller: 'UnionCtrl'
        })
            /*sub of union*/
            .state('union_commu', {
                url: '/union_commu',
                templateUrl: 'templates/union/communicate.html',
                controller: 'UnionCommuCtrl'
            })
                .state('union_commu_hotline',{
                    url: '/union_commu_hotline',
                    templateUrl: 'templates/union/commu_hotline.html',
                    controller: null
                })
                .state('union_commu_other',{
                    url: '/union_commu_other',
                    templateUrl: 'templates/union/commu_other.html',
                    controller: 'CommuOtherCtrl'
                })            
            .state('union_welfare', {
                url: '/union_welfare',
                templateUrl: 'templates/union/welfare.html',
                controller: 'UnionWelfareCtrl'
            })
                .state('union_welfare_fest', {
                    url: '/union_welfare_fest',
                    templateUrl: 'templates/union/welfare_fest.html',
                    controller: 'UnionWelfareFestCtrl'
                })
                .state('union_welfare_union', {
                    url: '/union_welfare_union',
                    templateUrl: 'templates/union/welfare_union.html',
                    controller: 'UnionWelfareWnionCtrl'
                })
                .state('union_welfare_old', {
                    url: '/union_welfare_old',
                    templateUrl: 'templates/union/welfare_Old.html',
                    controller: 'UnionWelfareOldCtrl'
                })
                .state('union_welfare_dmUnion', {
                    url: '/union_welfare_dmUnion',
                    templateUrl: 'templates/union/welfare_dmUnion.html',
                    controller: 'UnionWelfareDMCtrl'
                })
                    .state('union_welfare_dm_his', {
                        url: '/union_welfare_dm_his',
                        templateUrl: 'templates/union/welfare_dm_history.html',
                        controller: 'UnionWelfareDMHistoryCtrl'
                    })
                    .state('union_welfare_dm_guide', {
                        url: '/union_welfare_dm_guide',
                        templateUrl: 'templates/union/welfare_dm_guide.html',
                        controller: null
                    })                
                .state('union_welfare_notice', {
                    url: '/union_welfare_notice',
                    templateUrl: 'templates/union/welfare_notice.html',
                    controller: 'UnionWelfareNoticeCtrl'
                })
                .state('union_welfare_applyResult', {
                    url: '/union_welfare_applyResult',
                    templateUrl: 'templates/union/welfare_applyResult.html',
                    controller: 'UnionWelfareApplyResultCtrl'
                })
            .state('union_activity', {
                url: '/union_activity',
                templateUrl: 'templates/union/union-activity.html',
                controller: 'UnionActivityCtrl'
            })
            .state('union_helpsupport', {
                url: '/union_helpsupport',
                templateUrl: 'templates/union/helpSupport.html',
                controller: 'UnionHelpSupportCtrl'
            })
            .state('union_helpSupport_guide', {
                url: '/union_helpSupport_guide',
                templateUrl: 'templates/union/helpSupportGuide.html',
                controller: 'UnionHelpSupportGuideCtrl'
            })
            .state('union_helpSupport_contact', {
                url: '/union_helpSupport_contact',
                templateUrl: 'templates/union/helpSupportContact.html',
                controller: 'UnionHelpSupportContactCtrl'
            })            
            .state('union_wonderfulmoment', {
                url: '/union_wonderfulmoment',
                templateUrl: 'templates/union/wonderfulMoment.html',
                controller: 'UnionWonderfulmomentCtrl'
            })
                .state('union_wonderfulmoment_detail', {
                    url: '/union_wonderfulmoment_detail',
                    templateUrl: 'templates/union/wonderfulMomentDetail.html',
                    controller: 'UnionWonderfulmomentDetailCtrl'
                })
            .state('union_suggest', {
                url: '/union_suggest',
                templateUrl: 'templates/union/suggest.html',
                controller: 'UnionSuggestCtrl'
            })
                .state('union_suggest_my', {
                    url: '/union_suggest_my',
                    templateUrl: 'templates/union/suggest_my.html',
                    controller: 'UnionSuggestMyCtrl'
                })
                .state('union_suggest_open', {
                    url: '/union_suggest_open',
                    templateUrl: 'templates/union/suggest_open.html',
                    controller: 'UnionSuggestOpenCtrl'
                })
                .state('union_suggest_openDetail', {
                    url: '/union_suggest_openDetail',
                    templateUrl: 'templates/union/suggest_openDetail.html',
                    controller: 'UnionSuggestOpenDetailCtrl'
                })
        .state('mechCharity', {
            url: '/mechCharity',
            templateUrl: 'templates/mechCharity/mech-list.html',
            controller: 'MechCharityCtrl'
        })
            .state('mechCharity_introduce', {
                url: '/mechCharity_introduce',
                templateUrl: 'templates/mechCharity/mech-introduce.html',
                controller: 'MechCharityIntroduceCtrl'
            })
                .state('mechCharity_introduce_detail', {
                    url: '/mechCharity_introduce_detail',
                    templateUrl: 'templates/mechCharity/mech-introDetail.html',
                    controller: null
                })
                .state('mechCharity_introduce_arch', {
                    url: '/mechCharity_introduce_arch',
                    templateUrl: 'templates/mechCharity/mech-introArch.html',
                    controller: null
                })
                .state('mechCharity_introduce_proj', {
                    url: '/mechCharity_introduce_proj',
                    templateUrl: 'templates/mechCharity/mech-introProj.html',
                    controller: null
                })                                
            .state('mechCharity_activity', {
                url: '/mechCharity_activity',
                templateUrl: 'templates/mechCharity/mech-activity.html',
                controller: 'MechCharityActivityCtrl'
            })
            .state('mechCharity_wonderfulMoment', {
                url: '/mechCharity_wonderfulMoment',
                templateUrl: 'templates/mechCharity/mech-wonderfulMoment.html',
                controller: 'MechCharityWonderfulMomentCtrl'
            })
                .state('mechCharity_wonderfulMoment_Detail', {
                    url: '/mechCharity_wonderfulMoment_Detail',
                    templateUrl: 'templates/mechCharity/mech-wonderfulMomentDetail.html',
                    controller: 'MechCharityWonderfulMomentDetailCtrl'
                })
            .state('mechCharity_accountingPublic', {
                url: '/mechCharity_accountingPublic',
                templateUrl: 'templates/mechCharity/mech-accountingPublic.html',
                controller: 'MechCharityAccountingPublicCtrl'
            })
                .state('mechCharity_publicMoney', {
                    url: '/mechCharity_publicMoney',
                    templateUrl: 'templates/mechCharity/mech-accountingPublicMoney.html',
                    controller: 'MechCharityAccountingPublicMoneyCtrl'
                })
                .state('mechCharity_publicMaterial', {
                    url: '/mechCharity_publicMaterial',
                    templateUrl: 'templates/mechCharity/mech-accountingPublicMaterial.html',
                    controller: 'MechCharityAccountingPublicMaterialCtrl'
                })
                .state('mechCharity_publicYear', {
                    url: '/mechCharity_publicYear',
                    templateUrl: 'templates/mechCharity/mech-accountingPublicYear.html',
                    controller: 'MechCharityAccountingPublicYearCtrl'
                })            
            .state('mechCharity_research', {
                url: '/mechCharity_research',
                templateUrl: 'templates/mechCharity/mech-researchList.html',
                controller: 'MechCharityResearchCtrl'
            })
                .state('mechCharity_research_detail', {
                    url: '/mechCharity_research_detail',
                    templateUrl: 'templates/mechCharity/mech-researchDetail.html',
                    controller: 'MechCharityResearchDetailCtrl'
                })
        .state('canteenImg', {
            url: '/canteenImg',
            templateUrl: 'templates/admin/canteen-list.html',
            controller: 'CanteenImgCtrl'
        })                
        .state('act_AnnualPartyTicket2019', {
            url: '/act_AnnualPartyTicket2019',
            templateUrl: 'templates/activity/annualPartyTicket2019.html',
            controller: 'AnnualPartyTicket2019Ctrl'
        })
        .state('act_2019SpringSubsidy', {
            url: '/act_2019SpringSubsidy',
            templateUrl: 'templates/activity/activity2019SprintSubsidy.html',
            controller: 'Act2019SpringSubsidyCtrl'
        })

        
        $urlRouterProvider.otherwise('signin');

    }])