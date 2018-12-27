<style lang="less" scoped>
.el-select,.el-cascader{
    width: 100%;
}
</style>

<template>
    <div id="content">
        <el-col :span="13">
            <el-form label-width="100px" :model="params" :rules="rules" ref="ruleForm">
                <el-col :span="11">
                    <el-form-item label="权限名称：" prop="menuName">
                        <el-input placeholder="权限名称" v-model="params.menuName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属模块：" :class="{'is-error':!isModule}">
                        <el-cascader
                            change-on-select
                            :props="menuTreeProps"
                            :options="menuTree"
                            :disabled="disabledModule"
                            v-model="menuCasc"
                            @change="menuChange">
                        </el-cascader>
                        <div class="el-form-item__error" v-if="!isModule">{{moduleErr}}</div>
                    </el-form-item>
                    <el-form-item label="权限许可：">
                        <el-input placeholder="权限许可" v-model="params.menuCode"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用：">
                        <el-select placeholder="是否启用" v-model="params.isUserAble">
                            <el-option label="是" value="13900001"></el-option>
                            <el-option label="否" value="13900002"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="权限类型：" prop="menuType">
                        <el-select placeholder="权限类型" v-model="params.menuType" @change="menuTypeChange">
                            <el-option label="目录" value="20400001"></el-option>
                            <el-option label="页面" value="20400002"></el-option>
                            <el-option label="功能" value="20400004"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单顺序：">
                        <el-input placeholder="菜单顺序" v-model="params.byOrder"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单路径：">
                        <el-input placeholder="菜单路径" v-model="params.url"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标：">
                        <el-input placeholder="菜单图标" v-model="params.menuIcon"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" placeholder="备注" v-model="params.remark"></el-input>
                    </el-form-item>
                    <el-form-item class="mt70">
                        <el-button type="primary" @click="submit">确定</el-button>
                        <el-button @click="back">取消</el-button>
                    </el-form-item>
                </el-col>        
            </el-form>
        </el-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id:this.$route.query.id,
            params:{
                menuName:'',
                menuType:'',
                isUserAble:'',
                menuCode:'',
                url:'',
                byOrder:'',
                menuIcon:'',
                remark:'',
                parentMenuId:''
            },
            rules: {
                menuName: [
                    { required: true, message: '请输入权限名称', trigger: 'blur' },
                    { type: 'string',min: 2, max: 15, message: '请输入2-15位权限名称', trigger: 'blur' }
                ],
                menuType: [
                    { required: true, message: '请选择权限类型', trigger: 'change' }
                ],
                remark:[
                    { type: 'string',min: 0, max: 60, message: '请输入0-60位备注', trigger: 'blur' }
                ]
            },
            menuTree:[],
            menuTreeProps:{
                label:'menuName',
                value:'id',
                children:'childNodes'
            },
            menuCasc:[],
            isModule:true,
            moduleErr:'',
            disabledModule:false
        };
    },
    mounted() {
        if(this.id){
            this.getQueryList()
            this.disabledModule = true
            this.$route.meta.title = '编辑权限'
            document.title = '编辑权限'
        }else{
            this.$route.meta.title = '新增权限'
            document.title = '新增权限'
        }
        this.getMenuTree()
    },
    methods: {
        getMenuTree(){
            this.$axios.post('/api/bycx-syst-service/aSysMenu/queryMenuTree',{params: {}}).then(res => {
                if (res.data.code == "0000") {
                    this.menuTree = res.data.result
                }
            })
        },
        getQueryList(){
            this.$axios
                .post("/api/bycx-syst-service/aSysMenu/queryList", {params:{
                    id:this.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.params = res.data.result[0]
                        setTimeout(() => {
                            this.matchParent()
                        }, 400);
                    }
                });
        },
        back(){
            this.$router.push('/auth')
        },
        menuChange(arr){
            this.params.parentMenuId = arr[arr.length - 1]
        },
        matchParent(){
            let pid = this.params.parentMenuId 

            this.menuTree.map(item1 => {
                if(item1.id == pid){
                    this.menuCasc = [item1.id]
                }else{
                    if(Array.isArray(item1.childNodes)){
                        item1.childNodes.map(item2 =>{
                            if(item2.id == pid){
                                this.menuCasc = [item1.id,item2.id]
                            }
                        })
                    }
                }
            })
        },
        checkModule(tree){
            tree.map(item => {
                //递归筛选出选中的数据
                if(item.id == this.params.parentMenuId){
                    /**
                     * 添加逻辑判断
                     * 1、页面只能添加到目录
                     * 2、功能只能添加到页面
                     */
                    if(this.params.menuType == '20400002' && item.menuType != '20400001'){
                        this.isModule = false
                        this.moduleErr = '页面只能添加到目录'
                    }

                    if(this.params.menuType == '20400004' && item.menuType != '20400002'){
                        this.isModule = false
                        this.moduleErr = '功能只能添加到页面'
                    }
                }
                if(item.childNodes){
                    this.checkModule(item.childNodes)
                }
            })
        },
        menuTypeChange(v){
            if(v == '20400001'){
                this.menuCasc = []
                this.moduleErr = ''
                this.isModule = true
                this.disabledModule = true
            }else{
                this.disabledModule = false
            }
        },
        submit(){
            let url = '/api/bycx-syst-service/aSysMenu/addMenu'
            if(this.id){
                url = '/api/bycx-syst-service/aSysMenu/editMenu'
            }

            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    //调用模块判断
                    this.checkModule(this.menuTree);
                    
                    if(this.isModule){
                        this.$axios.post(url,{params: this.params}).then(res => {
                            if(res.data.code == '0000'){
                                this.$router.push('/auth')
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                }
            })
        }
    }
};
</script>