/**
 * 用于测试
 * johnsing he 2018-09-20
 */
angular.module('evaluationApp.testControllers', [])
  .controller('TestPageCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup,
                                      commonServices, CacheFactory, alertService, 
                                      actionVisitServices, UrlServices, PicServices, externalLinksService) 
  {
    // $scope.canUseAction = function (action) {
    //   return actionVisitServices.canUseAction(action, $rootScope.accessEmployee.WorkdayNO);
    // };
    $scope.closePass = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('tab.home');
      }  

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
        //$("#images").empty();
    };
    Reset();
    $scope.Reset=Reset;

    $scope.HasImgs = function(){
        return $scope.imgs.length > 0;
    };

    $scope.doUpload = function(){
        alertService.showOperating('Processing...');
        var url = commonServices.getUrl("UploadService.ashx","");
        UrlServices.uploadImages('testUpload', '我的测试', $scope.imgs, url, function(resp){
            alertService.hideOperating();
            if(resp){
                if(resp.success){
                    alert("success, batch no=" + resp.obj);
                }else{
                    alert("failed, " + resp.message);
                }
            }else{
                alert("Failed!");
            }
        });
    };

    $scope.OpenOutLink = function(){
        try {
            //externalLinksService.openUr('http://u3379629.viewer.maka.im/k/9DTNKL9FW3379629');
            var url = 'https://v.qq.com/x/page/n30310tfzkb.html';
            //var url = 'https://v.qq.com/x/page/j0506qcq93d.html';
            //var url = 'https://v.qq.com/x/page/y0876xuxfdg.html';
            externalLinksService.openUr(url);
          } catch (ex) {
            alertService.showAlert(ex.message)
          }
    };

      $('#html5-videos').lightGallery(
          {
              download: 'false',
              share: 'false',
              zoom: 'false',
              enableDrag: 'false',
              mousewheel: 'false',
              fullScreen: 'false'
          }
      );
      $('#html5-videos2').lightGallery(
        {
            download: 'false',
            share: 'false',
            zoom: 'false',
            enableDrag: 'false',
            mousewheel: 'false',
            fullScreen: 'false'
        }
    );
    
  })

