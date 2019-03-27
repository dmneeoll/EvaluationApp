/**
 * 工具类
 * johnsing he 2018-09-11
 */
angular.module('evaluationApp.utilServices', ['ionic.native'])
  .service('UrlServices', function ($state, alertService, CacheFactory) 
  {
    //调用浏览器打开外链
    var openForeignUrl = function (url) {
      url = url.toLocaleLowerCase();
      if (0 != url.indexOf("http")) {
        url = "http://" + url;
      }
      try {
        //externalLinksService.openUr(url);
        cordova.InAppBrowser.open(url, '_system', 'location=yes');
      } catch (ex) {
        alertService.showAlert(ex.message);
      }
    }
    var openGeneralNotice = function (isUrlHtml, id, html) {
      if (isUrlHtml) {
        openForeignUrl(html);
      } else {
        CacheFactory.remove('gnID');
        CacheFactory.save('gnID', id);
        $state.go("generalNoticeDetail");
      }
    };

    function dataURLtoBlob(dataurl) {
      if(!dataurl || !dataurl.length){
          return null;
      }
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    }

    var uploadImages = function (kind, batchName, images, url, cbSuccess, cbFailed) {
        var defs = [];	
        var fd = new FormData();
        fd.append('kind', kind||'unknown');
        fd.append('batchName', batchName||'');

        angular.forEach(images, function(val, k) {
            var def = $.Deferred();

            var imgBlob = dataURLtoBlob(val);
            var fn = "img.jpg";
            fd.append('file'+k, imgBlob, fn);
            def.resolve();

            defs.push(def.promise());
        });

        //for test only
        // {
        //     var def1 = $.Deferred();
        //     var content = '<a id="a"><b id="b">hello johnsing!</b></a>';
        //     var blob = new Blob([content], { type: "text/xml"});
        //     fd.append("file"+10, blob, 'my.xml');
        //     def1.resolve();
        //     defs.push(def1.promise());        
        // }

        $.when.apply($, defs).then(function () {
          var request = new XMLHttpRequest();
          request.responseType = 'json';
          request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              var obj = this.response;
              cbSuccess(obj);
            } else {
              if (cbFailed) {
                cbFailed(this.responseText);
              }
            }
          };

          request.timeout = 120 * 1000; //2分钟
          request.ontimeout = function () {
            if (cbFailed) {
              cbFailed('**Request time out');
            }
          };
          request.open('POST', url);
          request.send(fd);
        });
    };

    return {
      openForeignUrl: openForeignUrl,
      openGeneralNotice: openGeneralNotice,
      uploadImages: uploadImages
    };
  })
  .service('PicServices', function ($state, $q) 
  {
    function createOptions(srcType) {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true //Corrects Android orientation quirks
      }
      return options;
    }

    function asyncResize(maxLongSide, url) {
      var deferred = $q.defer();

      var tempImg = new Image();
      tempImg.src = url;
      tempImg.onload = function () {
        // Get image size and aspect ratio.
        var targetWidth = tempImg.width;
        var targetHeight = tempImg.height;
        var aspect = tempImg.width / tempImg.height;

        // Calculate shorter side length, keeping aspect ratio on image.
        // If source image size is less than given longSideMax, then it need to be
        // considered instead.
        if (tempImg.width > tempImg.height) {
          maxLongSide = Math.min(tempImg.width, maxLongSide);
          targetWidth = maxLongSide;
          targetHeight = maxLongSide / aspect;
        } else {
          maxLongSide = Math.min(tempImg.height, maxLongSide);
          targetHeight = maxLongSide;
          targetWidth = maxLongSide * aspect;
        }

        // Create canvas of required size.
        try {
          var canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);

          // 返回 data:image/jpeg;base64,/9j/5AAQSkZJRgABAQ...9oADAMBAAIRAxEAPwD/AD/6AP/Z"
          var sdata = canvas.toDataURL("image/jpeg", 0.8);
          deferred.resolve(sdata);
        } catch (ex) {
          deferred.reject(ex.message);
        }
      };
      return deferred.promise;
    }

    var resizeImage = function (maxLongSide, url, cbNewImg) {
      var prm = asyncResize(maxLongSide, url);
      prm.then(function (data) {
        cbNewImg(data);
      }, function (err) {
        var msg = 'Failed: ' + err;
        console.log(msg);
        alert(msg);
      });
    };

    //选择或拍摄图片
    var selectImage = function (cbImg, bCamera) {
      if(!navigator.camera){
        //通常是摄像头模块未安装
        alert('无法' + (bCamera?'拍摄':'获取') + '照片');
        return;
      }
      var srcType = bCamera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
      var opt = createOptions(srcType);
      
        navigator.camera.getPicture(function (f) {
          //var newHtml = "<img src='"+f+"'>";
          //$imagesDiv.append(newHtml);
          cbImg(f);
        }, function (e) {
          //select error
          console.dir(e);
        }, opt);
    };

    return {
      selectImage: selectImage,
      resizeImage: resizeImage,
    };
  })

;