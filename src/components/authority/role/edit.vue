<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="8">
            <el-form label-position="top" :model="params" :rules="rules" ref="ruleForm" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="params.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input type="textarea" v-model="params.remark"></el-input>
                </el-form-item>
                <el-form-item label="权限配置">
                    <el-tree ref="tree" :data="menuTree" show-checkbox node-key="id" check-strictly :default-checked-keys="checkedNodes" :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="submit">保存</el-button>
                    <el-button @click="back">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: {
                id: this.$route.query.id,
                roleName: "",
                remark: "",
                menuIds: ""
            },
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { type: 'string',min: 2, max: 10, message: '请输入2-10位角色名称', trigger: 'blur' }
                ],
                remark:[
                    { type: 'string',min: 0, max: 60, message: '请输入0-60位备注', trigger: 'blur' }
                ]
            },
            menuTree: [],
            checkedNodes:[],
            defaultProps: {
                children: "childNodes",
                label: "menuName"
            }
        };
    },
    mounted() {
        if(this.params.id){
            this.getQueryList()
            this.$route.meta.title = '编辑角色'
            document.title = '编辑角色'
        }else{
            this.$route.meta.title = '新增角色'
            document.title = '新增角色'
        }
        this.getMenuTree()
    },
    methods: {
        getQueryList(){
            this.$axios.post('/api/bycx-syst-service/aSysRole/queryList',{params: {
                id:this.params.id
            }}).then(res => {
                this.params = res.data.result[0]
            })
        },
        getMenuTree(){
            this.$axios.post('/api/bycx-syst-service/aSysMenu/queryMenuTree',{params: {
                roleId:this.params.id
            }}).then(res => {
                this.menuTree = res.data.result
                this.getCheckedTree(this.menuTree)
            })
        },
        getIndeterminate() {
            //获取未选中的父级节点
            let nodesDOM = this.$refs.tree.$el.querySelectorAll('.el-tree-node');
            let nodesVue = [].map.call(nodesDOM, node => node.__vue__);
            let parentNode = nodesVue.filter(item => item.indeterminate === true)
            
            return parentNode.length ? parentNode.map(item => item.node.data.id) : ''
        },
        getCheckedTree(tree){
            tree.map(item => {
                if(item.hasAuth){
                    this.checkedNodes.push(item.id)
                }
                if(Array.isArray(item.childNodes)){
                    this.getCheckedTree(item.childNodes)
                }
            })
        },
        back(){
            this.$router.push('/role')
        },
        submit(){
            let url = '/api/bycx-syst-service/aSysRole/addRole'
            if(this.params.id){
                url = '/api/bycx-syst-service/aSysRole/editRole'
            }

            this.params.menuIds = this.getIndeterminate().concat(this.$refs.tree.getCheckedKeys().join(','))
      
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.$axios.post(url,{params: this.params}).then(res => {
                        if(res.data.code == '0000'){
                            this.$router.push('/role')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        }
        
    }
};
</script>