/**
 * @file utility functions wrote before (之前小项目中写的一些小工具函数)
 *
 * @author Sam Yang (samyangcoder@gmail.com)
 * @copyright Sam Yang 2017
 * @license MIT
 *
 * Notice: You should import JQuery before these functions.
 */

/*
 * a class including utility functions
 *
 *  Examples:
 *
 *    <form id="form">
 *      <input type='file' id="image">
 *      <img id="box" src="#" alt="your image">
 *    </form>
 *
 *    $('#image').change(function() {
 *      try {
 *        Utility.previewImage(this, $('#box'));
 *      } catch(err) {
 *        layer.msg(err.message, { icon: 5 });
 *      }
 *    });
 *
 *    Assume the URL of current page is: https://www.sogou.com/web?query=webpack&id=8899&name=yang
 *    const id = Utility.getQueryString('id'); // 8899
 * 
 * 
 *    Upload files example:
 * 
 *    const options = {
 *			form: $('form'),
 *			url: 'upload.php',
 *			data: {
 *				username: 'Sam Yang'
 *			},
 *			beforeSubmit: function() {
 *			  // something you want to do before submit
 *			},
 *			complete: function(res) {
 *				if(res.status === 'success') {
 *					// something to do after success
 *				}
 *			}
 *		};
 *		Utility.progress(options);
 */
class Utility {
  // show an image preview when you select an image
  // @param {[HTMLInputElement object]} image - an image file input element from <input type="file">
  // @param {[HTMLImageElement object]} previewBox - an <img> element to place image
  // @throws will throw an error if the file inputed is not an image file
  static previewImage(image, previewBox) {
    const img = image.files[0];
    const filter = /^(?:image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;
    
    if(!img) throw new Error('未选择图片！');
    
    if(!filter.test(img.type)) throw new Error('请选择有效的图片文件！');

    // 上传图片不得大于 300kB
    if(img.size > 307200) throw new Error('上传图片过大，请上传 300 kB 以下的图片！');

    const reader = new FileReader();

    // this event is triggered each time the reading operation is successfully completed
    reader.onload = (event) => {
      if(previewBox.src) {
        previewBox.src = event.target.result;
      } else {
        previewBox.attr('src', event.target.result);
      }
    };

    reader.readAsDataURL(img);
  }

  // get the value of the current URL query name
  // @param {string} name - the name of the value you want to get
  // @return value of the current URL query name
  static getQueryString(name) {
    const reg = new RegExp(`(?:^|&)${name}=(.*?)(?:&|$)`, 'i');
    let value = window.location.search.substr(1).match(reg);

    if(value !== null) value = window.decodeURIComponent(value[1]);

    return value;
  }

  // display progress bar when upload files through `canvas` instead of `css3`
  // @param {object} options - a object containing params
  //        => {object} form - a wrapped jq form element
  //        => {string} url - the upload url
  //        => {object} data - an object containing extra data that should be submitted along with the form
  //        => {function} beforeSubmit - callback function to be invoked before the form is submitted
  //        => {function} complete - callback function to be invoked after the uploading is completed
  static progress(options) {
    // load script asynchronously
    $.getScript('https://cdn.bootcss.com/jquery.form/4.2.2/jquery.form.min.js', function() {
      const shade = '<div class="progress-shade"></div>';
      const progressBar = '<div class="progress"><canvas id="progress" width="350" height="350"></canvas></div>';
      let canvasEnd;

      $(document.body).append(shade, progressBar);

      const canvas = $('#progress')[0];
      const ctx = canvas.getContext('2d');

      const uploadOptions = {
        url: options.url,
        type: 'POST',
        data: options.data,
        beforeSubmit: options.beforeSubmit || function() {},
        uploadProgress(event, position, total, percentComplete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the whole canvas before

          /* start to draw progress bar :) */
          ctx.beginPath();
          ctx.strokeStyle = "#00B5A9";
          ctx.lineWidth = 50;
          ctx.font = "56px serif";
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.textBaseline = 'middle';
          canvasEnd = -0.5 + 2 * percentComplete * 0.01;
          ctx.arc(175, 175, 144, -0.5 * Math.PI, canvasEnd * Math.PI, false); // change the length of progress bar
          ctx.fillText(`${percentComplete}%`, 175, 175); // change the number of progress bar
          ctx.stroke();
          /* finish drawing progress bar :) */

          if(percentComplete === 100) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = "#00B5A9";
            ctx.lineWidth = 50;
            ctx.font = "22px serif";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.arc(175, 175, 144, -0.5 * Math.PI, 2 * Math.PI, false);
            ctx.fillText('正在完成其他操作', 175, 165);
            ctx.fillText('请耐心等候哦...', 175, 205);
            ctx.stroke();
          }
        },
        complete(xhr) {
          $('div').remove('.progress-shade');
          $('div').remove('.progress');

          options.complete(JSON.parse(xhr.responseText));
        }
      };

      options.form.ajaxSubmit(uploadOptions);
    });
  }
}
