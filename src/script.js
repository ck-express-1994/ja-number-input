angular.module('myApp', []).controller('namesCtrl', function($scope) {
    
})
.filter('ja_number_input', function () {
  /**
   * 
   * '10000'から'1万'に
   *
   * @param str input 入力する数字 
   * @param str prefix 接頭文字 
   * @param str suffix 接尾文字
   * 
   * @return str 
   */
  return function(input, prefix, suffix) {

  	/**
  	 * _num2ja()は下記のURLのソースに基づいている
  	 * http://www.drk7.jp/MT/archives/001587.htmlを参考した。
  	 */
    var _num2ja = function (num, opt) {
        var sign = {
            '+': '',
            '-': '−'
        };
        var zero = '零';
        var point = '点';
        var zero2nine = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        var ten2thou = ['', '十', '百', '千'];
        var suffices = ['', '万', '億', '兆', '京', '垓', '禾予', '穣', '溝', '澗', '正', '載,', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];

        num = num.toString();

        num = num.replace(/,/g, '');
        num.match(/([+-])?(\d+)(?:\.(\d+))?/i);
        var sig = RegExp.$1;
        var int = RegExp.$2;
        var fract = RegExp.$3;
        var seisuu = '';
        var shins = [];

        for (var i = int.length; i > 0; i -= 4) {
            shins.push(int.substring(i, i - 4));
        }
        if (shins.length >= 18) {
            return suffices[17];
        }

        var suffix = 0;
        for (i = 0; i < shins.length; i++) {
            var shin = shins[i];
            if (shin == '0000') {
                suffix++;
                continue;
            }
            var sens = '';
            var keta = 0;
            var digits = shin.split('').reverse();
            for (var j = 0; j < digits.length; j++) {
                var digit = digits[j];

                if (opt.fixed4 || opt.with_arabic) {
                    if (opt.with_arabic) {
                        var flg = 0;
                        // 余分な 0 を削除する
                        if (digit == '0') {
                            for (var k = j + 1; k < digits.length; k++) {
                                flg += (digits[k] == '0') ? 0 : 1;
                            }
                            if (flg === 0) digit = '';
                        }
                        sens = digit + sens;
                    } else {
                        sens = zero2nine[digit] + sens;
                    }
                } else {
                    var suuji = (digit == 1 && !opt.p_one && keta > 0) ? '' : zero2nine[digit];
                    if (digit !== 0) sens = suuji + ten2thou[keta] + sens;
                }
                keta++;
            }
            seisuu = sens + suffices[suffix++] + seisuu;
        }
        var result = (sign[sig] || '') + seisuu;
        result = result || zero;
        if (fract) {
            result = result + point + fract;
        }
        return result;
    };

    //console.log(input);
    if( !input || isNaN(input)) {
        return '';
    } else {
      
      var output = _num2ja(input, {'with_arabic':1});
      
      if(prefix !== undefined){
        output = prefix + output;
      }

      if(suffix !== undefined){
        output = output += suffix;
      }

      return output;
    }
  };

});
