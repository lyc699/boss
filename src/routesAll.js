/**
 * router.js-真实路由
 * routerTemp.js-全量路由
 *
 * Home --- 应用首页
 * Main --- 路由首页
 * menu3 --- 三级菜单入口路由
 * iconClass --- 菜单图标
 * hidden --- 是否隐藏菜单
 * author zxl
 * 2018-08-09
 */

const Home = resolve => require.ensure([], () => resolve(require('./components/home.vue')), 'home')
const Main = resolve => require.ensure([], () => resolve(require('./components/main.vue')), "main")
const menu3 = resolve => require.ensure([], () => resolve(require('./components/menu3.vue')), "menu3")

const routes = [{
        path: '/qxxt',
        component: Home,
        name: 'qxxt',
        redirect: '/auth',
        meta: {
            iconClass: 'el-icon-menu',
            title: '权限系统',
            hidden: true,
        },
        children: [{
                path: '/main',
                name: 'main',
                component: Main,
                meta: {
                    title: '首页',
                    hidden: true
                }
            },
            {
                path: '/role',
                name: 'roleMain',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/role/main.vue')), "roleMain"),
                meta: {
                    title: '角色管理',
                    hidden: true,
                }
            },
            {
                path: '/role/edit',
                name: 'roleEdit',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/role/edit.vue')), "roleEdit"),
                meta: {
                    title: '编辑角色',
                    hidden: true
                }
            },
            {
                path: '/role/staff',
                name: 'roleStaff',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/role/staff.vue')), "roleStaff"),
                meta: {
                    title: '角色员工管理',
                    hidden: true
                }
            },
            {
                path: '/auth',
                name: 'auth',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/auth/main.vue')), "auth"),
                meta: {
                    title: '权限管理',
                    hidden: true
                }
            },
            {
                path: '/auth/edit',
                name: 'authEdit',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/auth/edit.vue')), "authEdit"),
                meta: {
                    title: '新增权限',
                    hidden: true
                }
            },
            {
                path: '/staff',
                name: 'staff',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/staff/main.vue')), "staff"),
                meta: {
                    title: '员工管理',
                    hidden: true
                }
            },
            {
                path: '/staff/edit',
                name: 'staffEdit',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/staff/edit.vue')), "staffEdit"),
                meta: {
                    title: '新增员工',
                    hidden: true
                }
            },
            {
                path: '/staff/resetPwd',
                name: 'resetPwd',
                component: resolve => require.ensure([], () => resolve(require('./components/authority/staff/resetPwd.vue')), "resetPwd"),
                meta: {
                    title: '修改密码',
                    hidden: true
                }
            }
        ]
    }, {
        path: '/htgl',
        component: Home,
        name: 'htgl',
        redirect:'/contract',
        meta: {
            iconClass: 'el-icon-menu',
            title: '合同管理',
            hidden: true,
        },
        children: [
            {
                path: '/contract',
                name: 'contract',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/contract/main.vue')), "contract"),
                meta: {
                    title: '合同管理',
                    hidden: true,
                }
            },
            {
                path: '/contract/edit',
                name: 'contractEdit',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/contract/edit.vue')), "contractEdit"),
                meta: {
                    title: '编辑合同',
                    hidden: true,
                }
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/protocol/main.vue')), "protocol"),
                meta: {
                    title: '协议管理',
                    hidden: true,
                }
            },
            {
                path: '/protocol/edit',
                name: 'protocolEdit',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/protocol/edit.vue')), "protocolEdit"),
                meta: {
                    title: '协议详情',
                    hidden: true,
                }
            },
            {
                path: '/seal',
                name: 'sealMain',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/seal/main.vue')), "sealMain"),
                meta: {
                    title: '公章管理',
                    hidden: true,
                }
            },
            {
                path: '/electronicSign',
                name: 'electronicSign',
                component: resolve => require.ensure([], () => resolve(require('./components/contract/electronicSign/main.vue')), "electronicSign"),
                meta: {
                    title: '电子签章管理',
                    hidden: true,
                }
            }
        ]
    },
    {
        path: '/product',
        component: Home,
        name: 'product',
        redirect:'/rxy',
        meta: {
            iconClass: 'el-icon-menu',
            title: '产品配置',
            hidden: true,
        },
        children: [{
                path: '/rxy',
                name: 'rxyConfig',
                component: resolve => require.ensure([], () => resolve(require('./components/product/config/rxy/config.vue')), "rxyConfig"),
                meta: {
                    title: '任信用',
                    hidden: true,
                }
            },
            {
                path: '/rxy/add',
                name: 'rxyAdd',
                component: resolve => require.ensure([], () => resolve(require('./components/product/config/rxy/add.vue')), "rxyAdd"),
                meta: {
                    title: '产品主体',
                    hidden: true,
                }
            }
        ]
    },
    {
        path: '/qdgl',
        component: Home,
        name: 'qdgl',
        redirect:'/channel',
        meta: {
            iconClass: 'el-icon-menu',
            title: '渠道管理',
            hidden: true,
        },
        children: [{
                path: '/platform',
                name: 'platformMain',
                component: resolve => require.ensure([], () => resolve(require('./components/channelManager/platform/main.vue')), "platformMain"),
                meta: {
                    title: '引流平台',
                    hidden: true,
                }
            },
            {
                path: '/platform/add',
                name: 'platformAdd',
                component: resolve => require.ensure([], () => resolve(require('./components/channelManager/platform/add.vue')), "platformAdd"),
                meta: {
                    title: '新增引流平台',
                    hidden: true
                }
            },
            {
                path: '/platform/scan',
                name: 'platformScan',
                component: resolve => require.ensure([], () => resolve(require('./components/channelManager/platform/scan.vue')), "platformScan"),
                meta: {
                    title: '引流平台详情',
                    hidden:true
                }
            },
            {
                path: '/channel',
                name: 'channelMain',
                component: resolve => require.ensure([], () => resolve(require('./components/channelManager/channel/main.vue')), "channelMain"),
                meta: {
                    title: '引流渠道',
                    hidden: true,
                }
            },
            {
                path: '/channel/add',
                name: 'channelAdd',
                component: resolve => require.ensure([], () => resolve(require('./components/channelManager/channel/add.vue')), "channelAdd"),
                meta: {
                    title: '新增引流渠道',
                    hidden: true
                }
            }
        ]
    },
    {
	    path: '/dataDic',
	    component: Home,
        name: 'data',
        redirect:'/codeType',
	    meta:{
	      iconClass: 'el-icon-menu',
	      title:'数据字典',
	      hidden:true,
	    },
	    children: [
	        {
	            path: '/modelEntry',
	            name: 'modelEntry',
	            component: resolve => require.ensure([], () => resolve(require('./components/dataDic/data/modelEntry.vue')), "modelEntry"),
	            meta: {
		            title: '模式进件配置',
		            hidden:true,
	            }
	        },
	        {
	            path: '/capitalOpenAcc',
	            name: 'capitalOpenAcc',
	            component: resolve => require.ensure([], () => resolve(require('./components/dataDic/data/capitalOpenAcc.vue')), "capitalOpenAcc"),
	            meta: {
		            title: '资方开户配置',
		            hidden:true,
	            }
	        },
	        {
	            path: '/codeType',
	            name: 'codeType',
	            component: resolve => require.ensure([], () => resolve(require('./components/dataDic/codeTable/codeType.vue')), "codeType"),
	            meta: {
		            title: '码表管理',
		            hidden:true,
	            }
	        },
	        {
                path: '/codeType/addType',
                name: 'addType',
                component: resolve => require.ensure([], () => resolve(require('./components/dataDic/codeTable/addType.vue')), "addType"),
                meta: {
                    title: '新增码表',
                    hidden:true
                }
            },
	        {
                path: '/codeType/codeVal',
                name: 'codeVal',
                component: resolve => require.ensure([], () => resolve(require('./components/dataDic/codeTable/codeVal.vue')), "codeVal"),
                meta: {
                    title: '码值管理',
                    hidden:true
                }
            },
	        {
                path: '/codeType/codeVal/addVal',
                name: 'addVal',
                component: resolve => require.ensure([], () => resolve(require('./components/dataDic/codeTable/addVal.vue')), "addVal"),
                meta: {
                    title: '新增码值',
                    hidden:true
                }
            }
        ]
    },{
    path: '/zcfgl',
    component: Home,
    name: 'zcfgl',
    redirect:'/asset',
    meta:{
      iconClass: 'el-icon-menu',
      title:'资产方管理',
      hidden:true,
    },
    children: [
      {
        path: '/asset',
        name: 'asset',
        component: resolve => require.ensure([], () => resolve(require('./components/theAsset/main')), "theAsset"),
        meta: {
          title: '资产方管理',
          hidden:true,
        }
      }
    ]
  },
  {
    path: '/capitalManagement',
    component: Home,
    name: 'capitalManagement',
    redirect:'/capInfos',
    meta: {
      iconClass: 'el-icon-menu',
      title: '资方管理',
      hidden: true,
    },
    children: [
        {
            path: '/capInfos',
            name: 'capInfos',
            component: resolve => require.ensure([], () => resolve(require('./components/capitalManagement/capInfos')), "capInfos"),
            meta: {
                title: '资方列表',
                hidden: true,
            }
        },
        {
            path: '/capInfos/add',
            name: 'addCapts',
            component: resolve => require.ensure([], () => resolve(require('./components/capitalManagement/addCapts')), "addCapts"),
            meta: {
                title: '新增资方信息',
                hidden: true,
            }
        },
        {
            path: '/capInfos/edit',
            name: 'editCapts',
            component: resolve => require.ensure([], () => resolve(require('./components/capitalManagement/editCapts')), "editCapts"),
            meta: {
                title: '编辑资方信息',
                hidden: true,
            }
        },
        {
            path: '/capChannel',
            name: 'capChannel',
            component: resolve => require.ensure([], () => resolve(require('./components/capitalManagement/capChannel')), "capChannel"),
            meta: {
                title: '业务列表',
                hidden: true,
            }
        },
        {
            path: '/capChannel/add',
            name: 'capChannelAdd',
            component: resolve => require.ensure([], () => resolve(require('./components/capitalManagement/capChannelAdd')), "capChannelAdd"),
            meta: {
                title: '新增资方渠道',
                hidden: true,
            }
        }
    ]
  },
  {
    path: '/fileSystem',
    component: Home,
    name: 'fileSystem',
    redirect:'/fileSystem',
    meta:{
      iconClass: 'el-icon-menu',
      title:'文件系统',
      hidden:true,
    },
    children: [
      {
        path: '/files',
        name: 'files',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/main')), "files"),
        meta: {
          title: '业务文件列表',
          hidden:true,
        }
      },
      {
        path: '/voices',
        name: 'voices',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/voices/main')), "voices"),
        meta: {
          title: '语音文件查询',
          hidden:true,
        }
      },
      {
        path: '/files/record',
        name: 'record',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/record')), "record"),
        meta: {
          title: '日志记录',
          hidden:true,
        }
      },
      {
        path: '/voices/record',
        name: 'record',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/record')), "record"),
        meta: {
          title: '日志记录',
          hidden:true,
        }
      },
      {
        path: '/files/contractDetail',
        name: 'contractDetail',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/contractDetail')), "contractDetail"),
        meta: {
          title: '合同/协议详情',
          hidden:true,
        }
      },
      {
        path: '/files/videoDetail',
        name: 'videoDetail',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/videoDetail')), "videoDetail"),
        meta: {
          title: '视频详情',
          hidden:true,
        }
      },
      {
        path: '/files/flowsheetDetails',
        name: 'flowsheetDetails',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/flowsheetDetails')), "flowsheetDetails"),
        meta: {
          title: '流水单详情',
          hidden:true,
        }
      },
      {
        path: '/files/toPublicDetail',
        name: 'toPublicDetail',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/toPublicDetail')), "toPublicDetail"),
        meta: {
          title: '对公凭证详情',
          hidden:true,
        }
      },
      {
        path: '/files/attachmentDetial',
        name: 'attachmentDetial',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/files/attachmentDetial')), "attachmentDetial"),
        meta: {
          title: '附件详情',
          hidden:true,
        }
      },
      {
        path: '/files/pdf',
        name: 'pdf',
        component: resolve => require.ensure([], () => resolve(require('./components/fileSystem/pdf')), "pdf"),
        meta: {
          title: '查看PDF',
          hidden:true,
        }
      }
    ]
  },
  {
    path: '/approveManager',
    component: Home,
    name: 'approveManager',
    redirect:'/approveManager',
    meta:{
      iconClass: 'el-icon-menu',
      title:'审批管理',
      hidden:true,
    },
    children: [
      {
        path: '/approveSearch',
        name: 'approveSearch',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/approveSearch')), "approveSearch"),
        meta: {
          title: '审批查询',
          hidden:true,
        }
      },
      {
        path: '/myApprove',
        name: 'myApprove',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/myApprove')), "myApprove"),
        meta: {
          title: '我的审批',
          hidden:true,
        }
      },
      {
        path: '/approvePeople',
        name: 'approvePeople',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/approvePeople')), "approvePeople"),
        meta: {
          title: '人员状态查询',
          hidden:true,
        }
      },
      {
        path: '/approveGroup',
        name: 'approveGroup',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/approveGroup')), "approveGroup"),
        meta: {
          title: '审批组管理',
          hidden:true,
        }
      },
      {
        path: '/approveGroup/userManager',
        name: 'userManager',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/userManager')), "userManager"),
        meta: {
          title: '用户管理',
          hidden:true,
        }
      },
      {
        path: '/approveDetail',
        name: 'approveDetail',
        component: resolve => require.ensure([], () => resolve(require('./components/approveManager/approveDetail')), "approveDetail"),
        meta: {
          title: '审批详情',
          hidden:true,
        }
      }
    ]
  }
]
export default routes
