/**
 * 路由权限过滤
 *
 * @param {*} routes //真实路由
 * @param {*} menuTree //权限路由
 */
export function filterRouter(routes,menuTree){

    routes.map(r1 => {
        menuTree.map(m1 => {
            /**
             * 一级目录
             * 码值：20400001-目录，20400002-页面，20400004-功能
             */
            if(r1.path == m1.url && m1.menuType == '20400001'){
                //是否显示在菜单
                if(m1.isUserAble == '13900001'){
                    r1.meta.hidden = false
                    r1.meta.title = m1.menuName
                }
                //设置icon
                if(m1.menuIcon) r1.meta.iconClass = m1.menuIcon


                //二级目录
                if(m1.childNodes && r1.children){
                    r1.children.map(r2 => {
                        m1.childNodes.map(m2 => {
                            if(r2.path == m2.url && m2.menuType == '20400002'){
                                //是否显示在菜单
                                if(m2.isUserAble == '13900001'){
                                    r2.meta.hidden = false
                                    r2.meta.title = m2.menuName
                                }

                                //保存按钮权限到路由
                                r2.meta.btnAuth = []
                                if(m2.childNodes){
                                    m2.childNodes.map(item => {
                                        r2.meta.btnAuth.push(item.menuCode);
                                    })
                                }


                                //三级目录
                                // if(m2.childNodes && r2.children){
                                //     r2.children.map(r3 => {
                                //         m2.childNodes.map(m3 => {
                                //             if(r3.path == m3.url && m3.menuType == '20400002'){
                                //                 r3.meta.hidden = false
                                //                 r3.meta.title = m3.menuName
                                //             }
                                //         })
                                //     })
                                // }

                            }
                        })
                    })
                }
            }
        })
    });

    return routes
}
/**
 * 获取按钮权限
 *
 * @param [*] btnAuth //真实路由
 * @param String item //权限路由
 */
export function getBtnAuth(item){
    let authList = localStorage.getItem('permissionList')

    if(authList){
        authList = JSON.parse(authList)
        
        for(let el of authList){
            if(el == item){
                return true
            }
        }
        return false;
    }

}

/**
 * 验证方法集合-基于element-ui
 */

//手机号码验证
export function checkPhone(rule,value,callback){
    let reg = /^1[3456789]\d{9}$/

    if (value === "") {
        callback(new Error("请输入手机号"))
    }else if(!reg.test(value)){
        callback(new Error("手机号码格式错误"))
    }else{
        callback()
    }
}
//身份证号码验证
export function checkIdCard(rule,value,callback){
    let reg = /^(\d{15})|(\d{17}([0-9]|X))$/

    if (value === "") {
        callback(new Error("请输入身份证号"))
    }else if(!reg.test(value)){
        callback(new Error("身份证号码格式错误"))
    }else{
        callback()
    }
}

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2013-12-06 01:05:04"
 * 为false时, 格式如 "2013-12-06"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
  var pattern = "";
  if (isFull == true || isFull == undefined) {
    pattern = "yyyy-MM-dd hh:mm:ss";
  } else {
    pattern = "yyyy-MM-dd";
  }
  return getFormatDate(date, pattern);
}
/**
 *转换当前日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2013-12-06 01:05:04"
 * 为false时, 格式如 "2013-12-06"
 * @return 符合要求的日期字符串
 */
function getSmpFormatNowDate(isFull) {
  return getSmpFormatDate(new Date(), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2013-12-06 01:05:04"
 * 为false时, 格式如 "2013-12-06"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDateByLong(l, isFull) {
  return getSmpFormatDate(new Date(l), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
export function getFormatDateByLong(l, pattern) {
  return getFormatDate(new Date(l), pattern);
}
/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
export function getFormatDate(date, pattern) {
  if (date == undefined) {
    date = new Date();
  }
  if (pattern == undefined) {
    pattern = "yyyy-MM-dd hh:mm:ss";
  }
  return date.format(pattern);
}
