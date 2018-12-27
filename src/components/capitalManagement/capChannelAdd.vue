<template>
    <div>
        <div>
            <br><br>
            <el-col :span="24">
                <el-col :span="4">
                    <p>业务编号：{{this.basicData.bizNo}}</p>
                </el-col>
                <el-col :span="4">
                    <p>资金渠道编号：{{this.basicData.chanNo}}</p>
                </el-col>
            </el-col>
            <br>
        </div>
        <el-form :inline="true" :model="basicData" :rules="basicRules" ref="basicForm" :status-icon="true" class="mt20">
                <el-form-item label="资方名称" prop="fundsName">
                    <el-input v-model="basicData.fundsName" placeholder="请输入资方名称" :disabled='true'></el-input>
                </el-form-item>       
                <el-form-item label="业务类型" prop="bizType">
                    <el-select v-model="basicData.bizType" placeholder="请选择业务类型" :disabled="abledEditChan">
                        <el-option
                        v-for="item in bizTypeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="开通状态" prop="isOpen">
                    <el-select v-model="basicData.isOpen" placeholder="请选择开通状态" :disabled="abledEditChan">
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="路由优先级" prop="wayPri">
                    <el-input v-model="basicData.wayPri" placeholder="请输入路由优先级" :disabled="abledEditChan"></el-input>
                </el-form-item>  
                <el-form-item label="路由必选" prop="isMustWay">
                    <el-select v-model="basicData.isMustWay" placeholder="请选择路由必选" :disabled="abledEditChan">
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>                   
                <el-form-item>
                    <el-button type="primary" :disabled="!abledEditChan" @click="editUpdateData(basicData, 'abledEditChan')">编辑</el-button>
                    <el-button type="primary" :disabled="abledEditChan" @click="updateData(basicData, 'basic')">提交</el-button>
                </el-form-item>
        </el-form>
        <div>
            关联合同：<span v-for="item in contracts" :key="item.contractType" class="mr20 blue">{{filterContractAllOptions(item)}}<el-button type="danger" icon="el-icon-delete" @click="delContract(item)" circle></el-button></span>  
             <el-button type="primary" @click="getAllContract">设置</el-button>
             <br>
             <br>      
              关联协议：<span v-for="item in agrs" :key="item.agreeNo" class="mr20 blue">{{item.agreeName}}<el-button type="danger" icon="el-icon-delete" @click="delAgr(item)" circle></el-button></span>  
             <el-button type="primary" @click="getAllAgr">设置</el-button>             
        </div>
        <el-tabs v-model="activeName" type="card" class="mt30">
            <el-tab-pane label="进件要求" name="first">
                 <el-col :offset="1">
                    <el-button type="primary" class="mb20" @click="editUpdateData(progressData, 'abledEditProgress')">编辑</el-button>            
                </el-col>
                <el-form :inline="true" :model="progressData" :rules='progressRules' ref="progressForm">
                    <el-form-item label="最小年龄" prop="minAge">
                        <el-input v-model="progressData.minAge" placeholder="请输入最小年龄" :disabled="abledEditProgress"></el-input>
                    </el-form-item> 
                    <el-form-item label="最大年龄" prop="maxAge">
                        <el-input v-model="progressData.maxAge" placeholder="请输入最大年龄" :disabled="abledEditProgress"></el-input>
                    </el-form-item> 
                    <el-form-item label="最小放款额度" prop="minPosition">
                        <el-input v-model="progressData.minPosition" placeholder="请输入最小放款额度" :disabled="abledEditProgress"></el-input>
                    </el-form-item>  
                    <el-form-item label="最大放款额度" prop="maxPosition">
                        <el-input v-model="progressData.maxPosition" placeholder="请输入最大放款额度" :disabled="abledEditProgress"></el-input>
                    </el-form-item>  
                    <el-form-item label="期数" prop="dateNum">
                        <el-select v-model="progressData.dateNum" multiple placeholder="请选择期数" :disabled="abledEditProgress">
                            <el-option
                            v-for="item in dateNumOptions"
                            :key="item.valCode"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>  
                    <el-form-item label="校验资质" prop="auditAptitude">
                        <el-select v-model="progressData.auditAptitude" multiple placeholder="请选择资质" :disabled="abledEditProgress">
                            <el-option
                            v-for="item in auditAptitudeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                    <!-- <el-form-item label="地域限制" prop="auditAptitude">
                        <el-select v-model="progressData.addrRange" placeholder="请选择地域" :disabled="abledEditProgress">
                            <el-option
                            v-for="item in addrRangeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="附件推送" prop="attpushType">
                        <el-select v-model="progressData.attpushType" multiple placeholder="请选择附件推送" :disabled="abledEditProgress">
                            <el-option
                            v-for="item in attpushTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                    <el-col :span="24" class="text-center" v-if="!abledEditProgress">
                        <el-form-item>
                            <el-button type="primary" @click="updateData(progressData, 'progress')">保存</el-button>
                            <el-button  @click="abledEditProgress=true">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>                
            </el-tab-pane>
            <el-tab-pane label="流程设置" name="second">
                <el-col :offset="1">
                    <el-button type="primary" class="mb20" @click="editUpdateData(processData, 'abledEditProcess')">编辑</el-button>            
                </el-col>
                <el-form :inline="true" :model="processData" ref="processForm">
                    <el-form-item label="开户类型" prop="openType">
                        <el-select v-model="processData.openType" placeholder="请选择开户类型" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in openTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开户环节" prop="openNode">
                        <el-select v-model="processData.openNode" placeholder="请选择开户环节" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in openNodeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="签章模式" prop="signMode">
                        <el-select v-model="processData.signMode" placeholder="请选择签章模式" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in signModeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否分账" prop="isSplit">
                        <el-select v-model="processData.isSplit" placeholder="请选择是否分账" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in isNoOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="还款方式" prop="repayMode">
                        <el-select v-model="processData.repayMode" placeholder="请选择还款方式" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in repayModeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="还款类型" prop="repayType">
                        <el-select v-model="processData.repayType" multiple placeholder="请选择还款类型" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in repayTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="扣款类型" prop="deductType">
                        <el-select v-model="processData.deductType" placeholder="请选择扣款类型" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in deductTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="签约类型" prop="signType">
                        <el-select v-model="processData.signType" placeholder="请选择签约类型" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in signTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存管银行" prop="accBank">
                        <el-select v-model="processData.accBank" placeholder="请选择存管银行" :disabled="abledEditProcess">
                            <el-option
                            v-for="item in accBankOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-col :span="24" class="text-center" v-if="!abledEditProcess">
                        <el-form-item>
                            <el-button type="primary" @click="updateData(processData, 'process')">保存</el-button>
                            <el-button @click="abledEditProcess=true">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="放款账户信息" name="third">
                 <el-col :offset="1">
                    <el-button type="primary" class="mb20" @click="loanDialogVisible=true">新增</el-button>            
                </el-col>
                <el-table :data="loanTableData" index>
                    <el-table-column align="center" prop="loanAcctNo" label="放款账号"></el-table-column>
                    <!-- <el-table-column align="center" prop="loanAcctName" label="放款户名"></el-table-column> -->
                    <el-table-column align="center" prop="strikeType" label="穿透类型" :formatter="filterStrikeTypeOptions"></el-table-column>
                    <el-table-column align="center" prop="isOpen" label="开通状态" :formatter="filterIsOpenOptions"></el-table-column>                  
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="link" @click="changeIsOpen(scope)">{{scope.row.isOpen==='13900001'?'关闭':'开通'}}</a>
                            <a class="link" @click="delLoan(scope)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pag-index">
                    <el-pagination 
                        style="margin-top:20px;" 
                        @size-change="handleSizeChange(listLoanData,getAccountInfo,$event)" 
                        @current-change="handleCurrentChange(listLoanData,getAccountInfo,$event)" 
                        :current-page="listLoanData.pageNo" 
                        :page-sizes="[10, 20, 30, 50]" 
                        :page-size="listLoanData.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper" 
                        :total="listLoanData.totalSize"
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="还款账户信息" name="fourth">
                <el-col :offset="1">
                    <el-button type="primary" class="mb20" @click="addRepayment">新增</el-button>            
                </el-col>
                <el-table :data="repaymentTableData" index>
                    <el-table-column align="center" prop="acctBelong" label="账户归属" :formatter="filterAcctBelongOptions"></el-table-column>
                    <el-table-column align="center" prop="repayMode" label="还款方式" :formatter="filterRepayModeOptions"></el-table-column>
                    <el-table-column align="center" prop="repayChan" label="还款渠道" :formatter="filterRepayChanOptions"></el-table-column>
                    <el-table-column align="center" prop="marNo" label="商户号"></el-table-column>                  
                    <el-table-column align="center" prop="acctNo" label="账户"></el-table-column>                  
                    <el-table-column align="center" prop="acctName" label="账户名称"></el-table-column>                  
                    <el-table-column align="center" prop="acctOrg" label="开户机构" :formatter="filterAcctOrgOptions"></el-table-column>                  
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="link" @click="getRepayment(scope)">修改</a>
                            <a class="link" @click="delRepayment(scope)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pag-index">
                    <el-pagination 
                        style="margin-top:20px;" 
                        @size-change="handleSizeChange(listRepaymentData,getRepayInfo,$event)" 
                        @current-change="handleCurrentChange(listRepaymentData,getRepayInfo,$event)" 
                        :current-page="listRepaymentData.pageNo" 
                        :page-sizes="[10, 20, 30, 50]" 
                        :page-size="listRepaymentData.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper" 
                        :total="listRepaymentData.totalSize"
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="费用项设置" name="fifth">
                <el-col :offset="1">
                    <el-button type="primary" class="mb20" @click="getrepayFeeConf()">新增</el-button>            
                </el-col>
                <el-table :data="feeTableData" index>
                    <el-table-column align="center" prop="feeProNo" label="费用编号"></el-table-column>
                    <el-table-column align="center" prop="feeProName" label="费用名称"></el-table-column>
                    <el-table-column align="center" prop="feeProType" label="费用类型" :formatter='filterFeeProTypeOptions'></el-table-column>
                    <el-table-column align="center" prop="useLimit" label="应用限制"></el-table-column>                  
                    <el-table-column align="center" prop="isCustChoose" label="客户选择">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.editFlag">{{ filterIsCustChooseOptions(scope.row)}}</span>
                            <el-select v-else v-model="feeData.isCustChoose" placeholder="请选择客户选择">
                                <el-option
                                v-for="item in isNoOptions"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode">
                                </el-option>
                            </el-select> 
                        </template>
                    </el-table-column>                  
                    <el-table-column align="center" prop="isMustChoose" label="是否必选">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.editFlag">{{ filterIsMustChooseOptions(scope.row)}}</span>
                            <el-select v-else v-model="feeData.isMustChoose" placeholder="请选择是否必选">
                                <el-option
                                v-for="item in isNoOptions"
                                :key="item.valCode"
                                :label="item.valName"
                                :value="item.valCode">
                                </el-option>
                            </el-select> 
                        </template>
                    </el-table-column>                  
                    <el-table-column align="center" prop="balancePri" label="优先级">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.editFlag">{{ scope.row.balancePri }}</span>
                            <el-input v-else v-model="feeData.balancePri" placeholder="请输入优先级"></el-input>            
                        </template>
                    </el-table-column>                  
                    <el-table-column align="center" prop="isUse" label="是否启用" :formatter="filterIsUseOptions"></el-table-column>                  
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="link" @click="updateFeeProInfo(scope)">{{scope.row.isUse==='13900001'?'禁用':'启用'}}</a>
                            <a class="link" v-if='!scope.row.editFlag' @click="editFeeProInfo(scope)">编辑</a>
                            <a class="link" v-else @click="closeEditFeeProInfo(scope)">保存</a>
                            <a class="link" @click="deleteFeeProInfo(scope)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="期数费用设置" name="sixth">
                <el-table :data="dateFeeTableData" index v-if="dateFeeTableData.length"> 
                    <el-table-column v-for="(value,key,index) in dateFeeTableData[0]" align="center" :label="key" :key="key" v-if="key!=='id'&&key!=='editFlag'">
                        <template slot-scope="scope">
                            <span v-if="key==='期数'">{{dateFeeTableData[scope.$index][key]}}</span>
                            <div v-else>
                                <span v-if="!scope.row.editFlag">{{ dateFeeTableData[scope.$index][key]?dateFeeTableData[scope.$index][key]:'0' }}%</span>
                                <el-input v-else v-model="dateFeeValues[index-2]"></el-input>                                        
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="link" v-if='!scope.row.editFlag' @click="editDateFeeData(scope)">修改</a>
                            <a class="link" v-else @click="closeEditDateFeeData(scope)">保存</a>
                        </template>
                    </el-table-column>
                </el-table>
                <p v-else align="center" class="mt20">请先配置费用项和进件要求中的期数</p>
            </el-tab-pane>
            <el-tab-pane label="日放款额设置" name="seventh">
                <el-form :inline="true">
                    <el-form-item label="日放款总额(元)" prop="dayPosition">
                        <el-input v-model="dayAmountData.dayPosition" placeholder="请输入日放款总额" :disabled="abledEditTotalAmount"></el-input>
                    </el-form-item>  
                    <el-form-item>
                        <el-button type="primary" :disabled="!abledEditTotalAmount" @click="editAmountData(false)">编辑</el-button>
                        <el-button type="primary" :disabled="abledEditTotalAmount" @click="closeEditAmountData(false)">提交</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="dayAmountTableData" index style="width: 30%">
                    <el-table-column align="center" prop="period" label="期数"></el-table-column>
                    <el-table-column align="center" prop="loanDayAmt" label="日放款额(元)">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.editFlag">{{ scope.row.loanDayAmt?scope.row.loanDayAmt:0 }}</span>
                            <el-input v-else v-model="dayAmountData.loanDayAmt" placeholder="请输入日放款额"></el-input>            
                        </template>                        
                    </el-table-column>  
                     <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <a class="link" v-if="!scope.row.editFlag" @click="editAmountData(scope)">修改</a>
                            <a class="link" v-else @click="closeEditAmountData(scope)">保存</a>
                        </template>
                    </el-table-column>    
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="资方产品关联" name="eighth">
                <p>部分资方与我们合作多个产品，可在此进行产品关联配置。<br></p>
                <div class="mt30">
                    <p>资方产品编号</p><br>
                    <el-col :span='6'>
                        <el-input placeholder="请输入产品编号" v-model="goodsOfOne.fundGoodsNo"></el-input>
                    </el-col>
                    <el-col :span='24' class="mt20">
                        <el-button type="primary" @click="addProductOfChan">提 交</el-button>
                    </el-col>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="放款户设置" :visible.sync="loanDialogVisible" center width="40%" style="padding: 0px 10px" :show-close = "false">
            <el-form :model="loanData" style="padding: 0px 10px" :rules="loanRules" ref="loanData" label-width="120px">
                <el-form-item label="业务名称" prop="bizName">
                    <el-input type="text" v-model="loanData.bizName" placeholder="业务名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="放款账号" prop="loanAcctNo">
                    <el-input type="text" v-model="loanData.loanAcctNo" placeholder="放款账号"></el-input>
                </el-form-item>
                <el-form-item label="穿透类型" prop="strikeType">
                    <el-select v-model="loanData.strikeType" placeholder="请选择穿透类型">
                        <el-option
                        v-for="item in strikeTypeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addLoan">提 交</el-button>
                <el-button @click='$refs["loanData"].resetFields();loanDialogVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="还款户设置" :visible.sync="repaymentDialogVisible" center width="40%" style="padding: 0px 10px">
            <el-form :model="repaymentData" style="padding: 0px 10px" :rules="repaymentRules" ref="repaymentData" label-width="120px">
                <el-form-item label="渠道编号" prop="chanNo">
                    <el-input type="text" v-model="repaymentData.chanNo" placeholder="渠道编号" disabled></el-input>
                </el-form-item>
                <el-form-item label="账户归属" prop="acctBelong">
                    <el-select v-model="repaymentData.acctBelong" placeholder="请选择账户归属">
                        <el-option
                        v-for="item in acctBelongOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="还款渠道" prop="repayChan">
                    <el-select v-model="repaymentData.repayChan" placeholder="请选择还款渠道">
                        <el-option
                        v-for="item in repayChanOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="还款方式" prop="repayMode">
                    <el-select v-model="repaymentData.repayMode" placeholder="请选择还款方式">
                        <el-option
                        v-for="item in repayModeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户名称" prop="marName">
                    <el-input type="text" v-model="repaymentData.marName" placeholder="商户名称"></el-input>
                </el-form-item>
                <el-form-item label="商户号" prop="marNo">
                    <el-input type="text" v-model="repaymentData.marNo" placeholder="商户号"></el-input>
                </el-form-item>
                <el-form-item label="账户名称" prop="acctName">
                    <el-input type="text" v-model="repaymentData.acctName" placeholder="账户名称"></el-input>
                </el-form-item>
                <el-form-item label="账户号" prop="acctNo">
                    <el-input type="text" v-model="repaymentData.acctNo" placeholder="账户号"></el-input>
                </el-form-item>
                <el-form-item label="开户机构" prop="acctOrg">
                    <el-select v-model="repaymentData.acctOrg" placeholder="请选择开户机构">
                        <el-option
                        v-for="item in acctOrgOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开户行" prop="openBank">
                    <el-input type="text" v-model="repaymentData.openBank" placeholder="开户行"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUpdateRepayment()">提 交</el-button>
                <el-button @click='$refs["repaymentData"].resetFields();repaymentDialogVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加费用项" :visible.sync="feeDialogVisible" center width="80%" style="padding: 0px 10px">
            <el-table :data="feeAllTableData" index ref="multipleTable" @selection-change="selectionFee">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="feeNo" label="费用编号"></el-table-column>
                <el-table-column align="center" prop="feeName" label="费用名称"></el-table-column>
                <el-table-column align="center" prop="typ" label="费用类型" :formatter='filterFeeTypeOptions'></el-table-column>
                <el-table-column align="center" prop="useLimit" label="应用限制"></el-table-column>                  
                <!-- <el-table-column align="center" prop="isMustChoose" label="数值类型"></el-table-column>                   -->
                <!-- <el-table-column align="center" prop="isCustChoose" label="增值项"></el-table-column>                   -->
                <el-table-column align="center" prop="validFlag" label="是否启用" :formatter='filterValidFlagOptions'></el-table-column>    
                <el-table-column align="center" prop="feeRemark" label="备注"></el-table-column>   
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addFee">提 交</el-button>
                <el-button @click='feeDialogVisible=false'>取 消</el-button>
            </div>
            <div class="pag-index">
                <el-pagination 
                    style="margin-top:20px;" 
                    @size-change="handleSizeChange(listFeeAllData,getrepayFeeConf,$event)" 
                    @current-change="handleCurrentChange(listFeeAllData,getrepayFeeConf,$event)" 
                    :current-page="listFeeAllData.pageNo" 
                    :page-sizes="[10, 20, 30, 50]" 
                    :page-size="listFeeAllData.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="listFeeAllData.totalSize"
                >
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog title="选择要关联的合同" :visible.sync="contractVisible" center width="40%" style="padding: 0px 10px">
            <el-table :data="contractTableData" index ref="multipleTable" @selection-change="selectionContract">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="contractType" label="合同名称" :formatter='filterContractAllOptions'></el-table-column>
                <el-table-column align="center" prop="isPush" label="是否推送">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.isPush" placeholder="请选择客户选择">
                            <el-option
                            v-for="item in isNoOptions"
                            :key="item.valCode"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select> 
                    </template>
                </el-table-column>   
                <el-table-column align="center" prop="pushNode" label="推送环节">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.pushNode" placeholder="请选择客户选择">
                            <el-option
                            v-for="item in contractPushOptions"
                            :key="item.valCode"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select> 
                    </template>
                </el-table-column>   
                <el-table-column align="center" prop="priority" label="优先级">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.priority" placeholder="请输入优先级"></el-input>            
                    </template>
                </el-table-column>   
            </el-table>
            <el-pagination 
                style="margin-top:20px;" 
                @size-change="handleSizeChange(listContractTableData,getAllContract,$event)" 
                @current-change="handleCurrentChange(listContractTableData,getAllContract,$event)" 
                :current-page="listContractTableData.pageNo" 
                :page-sizes="[10, 20, 30, 50]" 
                :page-size="listContractTableData.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="listContractTableData.totalSize"
            >
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addContract">确 定</el-button>
                <el-button @click='contractVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择要关联的协议" :visible.sync="agrVisible" center width="40%" style="padding: 0px 10px">
            <el-table :data="agrTableData" index ref="multipleTable" @selection-change="selectionAgr">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="agreeName" label="协议名称"></el-table-column>
            </el-table>
            <el-pagination 
                style="margin-top:20px;" 
                @size-change="handleSizeChange(listAgrTableData,getAllAgr,$event)" 
                @current-change="handleCurrentChange(listAgrTableData,getAllAgr,$event)" 
                :current-page="listAgrTableData.pageNo" 
                :page-sizes="[10, 20, 30, 50]" 
                :page-size="listAgrTableData.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="listAgrTableData.totalSize"
            >
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addAgr">确 定</el-button>
                <el-button @click='agrVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import _ from 'underscore';
export default {
  data() {
      let minAge = (rule, value, callback) => {
            if(/^\d+$/.test(value) == false){
                callback(new Error("年龄只能输入数字"));
            }else{
                callback();
            }
      }
      let maxAge = (rule,value,callback)=>{
            if(/^\d+$/.test(value) == false){
                callback(new Error("年龄只能输入数字"));
            }else if(value<parseInt(this.progressData.minAge)){
                callback(new Error("最大年龄必须大于最小年龄"));
            }else{
                callback();
            }
      }
      let minPosition = (rule,value,callback)=>{
        if(/^\d+$/.test(value) == false){
            callback(new Error("只能输入数字"));
        }else{
            callback();
        }
    }
    let maxPosition= (rule,value,callback)=>{
        if(/^\d+$/.test(value) == false){
            callback(new Error("只能输入数字"));
        }else if(value<parseInt(this.progressData.minPosition)){
            callback(new Error("最大放款额必须大于最小放款额"));
        }else{
            callback();
        }
    }
    let wayPri = (rule,value,callback)=>{
        if(value>99||value<1){
            callback(new Error("请输入1-99"));
        }else{
            callback();
        }
    }
    return {
        activeName:'first',
        abledEditChan: true,
        basicData:{//基本数据
            bizNo:'',//业务编号
            chanNo:'',//资金渠道编号
            fundsName: '',  // 资方名称
            bizType: '', // 业务类型
            isOpen:'',//开通状态
            wayPri: '',//路由优先级
            isMustWay: '',//路由必选
        },
        basicRules:{
            wayPri:[{validator:wayPri, trigger:'blur'}],
            isMustWay: [
                { required: true, message: '请选择', trigger: 'blur' }
            ]
        },
        abledEditProgress: true,
        progressData:{//进件要求
            minAge:'',//年龄区间
            maxAge:'',
            minPosition:'',//放款额度
            maxPosition:'',
            dateNum:[],//期数
            auditAptitude:[],//校验资质
            // addrRange:'',//地域限制
            attpushType:[],//附件推送
        },
        progressRules:{
            minAge:[{validator:minAge, trigger:'blur'}],
            maxAge:[{validator:maxAge, trigger:'blur'}],
            minPosition:[{validator:minPosition, trigger:'blur'}],
            maxPosition:[{validator:maxPosition, trigger:'blur'}],
        },
        abledEditProcess: true,
        processData:{//流程设置要求
            openType:'',//开户类型
            openNode:'',//开户环节
            signMode:'',//签章模式
            isSplit:'',//是否分账
            repayMode: '',//还款方式
            repayType: [],//还款类型
            deductType: '',//扣款类型
            signType: '',//签约类型
            accBank: '',//存管银行
        },
        loanData:{//放款账户            
            chanNo:'',//资金渠道编号
            chanName:'',//资金渠道名称
            bizName:'',//业务名称
            loanAcctNo:'',//放款账号
            loanAcctName:'',//放款账号名称
            strikeType:'',//穿透类型
        },
        loanTableData:[],
        listLoanData:{},
        loanDialogVisible:false,
        loanRules:{
            loanAcctNo: [
                { required: true, message: '请输入放款账号', trigger: 'blur' }
            ],
            strikeType: [
                { required: true, message: '请输入穿透类型', trigger: 'blur' }
            ]
        },
        repaymentData:{//还款账户
            chanNo:'',//渠道编号
            acctBelong:'',//账户归属
            repayChan:'',//还款渠道
            repayMode: '',//还款方式
            marName:'',//商户名称
            marNo:'',//商户号
            acctName:'',//账户名称
            acctNo:'',//账户号
            acctOrg:'',//开户机构
            openBank:'',//开户行
        },
        repaymentTableData:[],
        listRepaymentData:{},
        repaymentDialogVisible:false,
        repaymentRules:{
            acctBelong: [
                { required: true, message: '请选择账户归属', trigger: 'blur' }
            ],
            repayChan: [
                { required: true, message: '请选择还款渠道', trigger: 'blur' }
            ],
            repayMode: [
                { required: true, message: '请选择还款方式', trigger: 'blur' }
            ],
            marName: [
                { required: true, message: '请输入商户名称', trigger: 'blur' }
            ],
            marNo: [
                { required: true, message: '请输入商户号', trigger: 'blur' }
            ],
            acctName: [
                { required: true, message: '请输入账户名称', trigger: 'blur' }
            ],
            acctNo: [
                { required: true, message: '请输入账户号', trigger: 'blur' }
            ],
            acctOrg: [
                { required: true, message: '请选择开户机构', trigger: 'blur' }
            ],
            openBank: [
                { required: true, message: '请输入开户行', trigger: 'blur' }
            ]
        },
        feeData:{
            isCustChoose:'',//客户选择        
            isMustChoose:'',//是否必选 
            balancePri:''//优先级
        },
        feeTableData:[],
        listFeeData:{},
        feeDialogVisible:false,
        feeAllTableData:[],
        listFeeAllData:{},
        multipleSelectionFee: [],
        feeRules:{
            
        },
        dateFeeTableData:[],
        dateFeeData:{
            busNo:'',
            chanNo:'',
            period:'',
        },
        dateFeeValues:[],        
        dayAmountTableData:[],
        dayAmountData:{
            dayPosition:'',
            loanDayAmt:''
        },
        abledEditTotalAmount: true,
        params:{
            chanName:'',//渠道名称
            loanAcctName:'',//放款账号名称
        },
        codeParam:{
            list: [              
                {
                    type: "Goods_Type"// 业务类型码表
                },
                {
                    type: "Is_No"// 是否开通码表
                },
                {
                    type: "Check_Aptitude"// 校验资质码表
                },
                {
                    type: "Open_Acct_Mode"// 开户类型码表
                },
                {
                    type: "Open_Acct_Node"// 开户环节码表
                },
                {
                    type: "Sign_Mode"// 签章模式码表
                },
                {
                    type: "Atta_Type"// 附件推送码表
                },
                {
                    type: "Repay_Mode"// 还款方式码表
                },
                {
                    type: "Repay_Type"// 还款类型码表
                },
                {
                    type: "Deduct_Type_1"// 扣款类型码表
                },
                {
                    type: "Signing_Type"// 签约类型码表
                },
                {
                    type: "Dep_Acct_Org"// 存管银行码表
                },
                {
                    type: "Strike_Type"// 穿透类型码表
                },
                {
                    type: "Acc_Type"// 账户归属码表
                },
                {
                    type: "Repay_Channel"// 还款渠道码表
                },
                {
                    type: "Open_Org"// 开户机构码表
                },
                {
                    type: "Fee_Type"// 费用类型码表
                },
                {
                    type: "Use_Type"// 应用限制码表
                },  
                {
                    type: "Tmpl_Type"// 合同码表
                },  
                {
                    type: "Push_Node"// 推送方式码表
                },                                    
            ]
        },
        goodsOfOne:{
            id: '',
            fundGoodsNo:''
        },
        bizTypeOptions:[],//业务类型
        isNoOptions:[],//是否开通
        auditAptitudeOptions:[],//校验资质
        // addrRangeOptions:[],//地域限制
        openTypeOptions:[],//开户类型
        openNodeOptions:[],//开户环节
        signModeOptions:[],//签章模式
        attpushTypeOptions:[],//附件推送
        repayModeOptions:[],//还款方式
        repayTypeOptions:[],//还款类型
        deductTypeOptions:[],//扣款类型
        signTypeOptions:[],//签约类型
        accBankOptions:[],//存管银行
        strikeTypeOptions:[],//穿透类型
        acctBelongOptions:[],//账户归属
        repayChanOptions:[],//还款渠道
        acctOrgOptions:[],//开户机构
        feeProTypeOptions:[],//费用类型
        useLimitOptions:[],//应用限制
        dateNumOptions:[
            {
                valCode: "3",
                valName: "3期"
            },
            {
                valCode: "6",
                valName: "6期"
            },
            {
                valCode: "9",
                valName: "9期"
            },
            {
                valCode: "12",
                valName: "12期"
            },
            {
                valCode: "24",
                valName: "24期"
            },
            {
                valCode: "36",
                valName: "36期"
            }
        ],//期数
        contractPushOptions:[],//推送环节
        contractVisible:false,
        contractAll:[],//合同
        contractAllOptions:[],//合同
        contracts:[],
        contractOptions:[],
        contractTableData:[],
        multipleSelectionContract:[],
        listContractTableData:{},
        agrPushOptions:[],//推送环节
        agrVisible:false,
        agrAll:[],//协议
        agrAllOptions:[],//协议
        agrs:[],
        agrOptions:[],
        agrTableData:[],
        multipleSelectionAgr:[],
        listAgrTableData:{},
        temporaryData:null     
    };
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    getCodeList(){
      this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
      .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
            let {Goods_Type, Is_No, Check_Aptitude, Open_Acct_Mode, Open_Acct_Node, Sign_Mode, 
            Atta_Type, Repay_Mode, Repay_Type, Deduct_Type_1, Signing_Type, Dep_Acct_Org, Strike_Type,
            Open_Org, Acc_Type, Repay_Channel, Fee_Type, Use_Type, Tmpl_Type, Push_Node} = result;
            this.bizTypeOptions = Goods_Type  
            this.isNoOptions = Is_No   
            this.auditAptitudeOptions = Check_Aptitude
            this.openTypeOptions = Open_Acct_Mode
            this.openNodeOptions = Open_Acct_Node
            this.signModeOptions = Sign_Mode
            this.attpushTypeOptions = Atta_Type
            this.repayModeOptions = Repay_Mode
            this.repayTypeOptions = Repay_Type
            this.deductTypeOptions = Deduct_Type_1
            this.signTypeOptions = Signing_Type
            this.accBankOptions = Dep_Acct_Org 
            this.strikeTypeOptions = Strike_Type
            this.acctBelongOptions = Acc_Type
            this.repayChanOptions = Repay_Channel
            this.acctOrgOptions = Open_Org
            this.feeProTypeOptions = Fee_Type
            this.useLimitOptions = Use_Type
            this.contractOptions= Tmpl_Type
            this.contractPushOptions = Push_Node
            this.getChanInfo()         
           }else{
              if(msg) this.$message.error(msg)
           }
      })
    },
    getData(){
        this.getContractInfos()//合同
        this.getAgrInfos()//合同
        this.getAccountInfo()//放款
        this.getRepayInfo()//还款
        this.getFeeProInfos()//费用项
        this.getFeeSetList()//期数费用
        this.getDayAmount()//日放款额度
        this.getGoodsOfOne()//资方产品关联
    },
    //获取页面基本数据
    getChanInfo(){
        this.$axios.post('/api/bycx-fund-service/fund/chan/getChanInfo',{id: this.$route.query.id})
        .then(res => {
          let {code,msg,data} = res.data
           if (code == "0000") {  
               let filerParams = ['dateNum','attpushType','repayType','auditAptitude'];
               for(let item of filerParams) {
                   data[item] = this.formatArray(data[item]);
               }
              this.basicData = _.pick(data,'bizNo','chanNo','fundsName','bizType','isOpen','wayPri','isMustWay')
              this.progressData = _.pick(data,'minAge','maxAge','minPosition','maxPosition','dateNum','auditAptitude','attpushType')
              this.processData = _.pick(data,'openType','openNode','signMode','isSplit','repayMode','repayType','deductType','signType','accBank')
              this.params = _.pick(data,'chanName','loanAcctName')
              this.loanData.bizName = data.bizName
              this.repaymentData.chanNo = data.chanNo
              this.getData()
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },    
    //合同
    getContractInfos(){
        let data = {
            chanNo: this.basicData.chanNo,
            isOpen: '13900001'
        }
        this.$axios.post('/api/bycx-fund-service/fund/other/getContractInfos', {params:data})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {           
               this.contracts = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    }, 
    //协议
    getAgrInfos(){
        let data = {
            chan: this.basicData.chanNo,
            isOpen: '13900001'
        }
        this.$axios.post('/api/bycx-fund-service/fund/other/getAgrTempByChanNo', {params:data})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {           
               this.agrs = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },    
    //放款列表
    getAccountInfo(){
        let data = {
            pageNo: this.listLoanData.pageNo || 1,
            pageSize: this.listLoanData.pageSize || 10,
            params:{
                chanNo: this.basicData.chanNo
            }
        }        
        this.$axios.post('/api/bycx-fund-service/fund/account/getReleaseAccountInfos',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
               this.listLoanData = res.data;
               this.loanTableData = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //还款列表
    getRepayInfo(){
        let data = {
            pageNo: this.listRepaymentData.pageNo || 1,
            pageSize: this.listRepaymentData.pageSize || 10,
            params:{
                chanNo: this.basicData.chanNo
            }
        }        
        this.$axios.post('/api/bycx-fund-service/fund/account/getRepayInfoByChanNo',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
               this.listRepaymentData = res.data;
               this.repaymentTableData = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //费用项设置列表
    getFeeProInfos(){
        let data = {
            chanNo: this.basicData.chanNo
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/getFeeProInfos',{params: data})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {               
               this.feeTableData = _.each(result, (item) => 
                    item.editFlag = false
                )
               this.listFeeData = res.data;
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //期数费用项设置列表
    getFeeSetList(){
        this.dateFeeTableData = []//用于费用设置项删除或增加之后都要重新渲染期数费用
        let data = {
            chanNo: this.basicData.chanNo,
            prolist: this.progressData.dateNum,
            busNo: this.basicData.bizNo
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/getFeeSetList',data)
        .then(res => {
          let {code,msg,arryData} = res.data
           if (code == "0000") {    
                for(let item of arryData) {
                    if(item[0] == null) {
                        continue;
                    }
                    let obj = {};
                    obj['期数'] =  item.shift().period
                    obj['editFlag'] = false
                    this.dateFeeTableData.push(_.extend({},obj,...item))
                }
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //日放款额设置列表
    getDayAmount(){
        let data = {
            chanNo: this.basicData.chanNo,
            busNo: this.basicData.bizNo,
            prolist:this.progressData.dateNum
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/getDayAmount',data)
        .then(res => {
          let {code,msg,data} = res.data
           if (code == "0000") {    
               this.dayAmountTableData = _.each(data.list, (item) => 
                    item.editFlag = false
                )    
                this.dayAmountData.dayPosition = data.dayPosition     
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //关联资方产品
    getGoodsOfOne(){
        let data = {
            chanNo: this.basicData.chanNo,
            bizNo: this.basicData.bizNo,
        }        
        this.$axios.post('/api/bycx-fund-service/fund/chan/getGoodsOfOne',{params: data})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {    
              if(result.fundGoodsNo){
                  this.goodsOfOne.id = result.id
                  this.goodsOfOne.fundGoodsNo = result.fundGoodsNo
              }
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //点击编辑页面基本数据按钮
    editUpdateData(data, ableName){
        this.temporaryData = _.clone(data)
        this[ableName]=false
    },
    //修改页面基本数据
    updateData(data, modelName){
        let params = _.clone(data)
        params.chanNo = this.basicData.chanNo
        if(modelName === 'progress'){
            params.dateNum = data.dateNum.join(',')
            params.attpushType = data.attpushType.join(',')
            params.auditAptitude = data.auditAptitude.join(',')
        }
        if(modelName === 'process'){
            params.repayType = data.repayType.join(',')
        }
        let formName = modelName+'Form'
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$axios.post('/api/bycx-fund-service/fund/chan/updateChanInfo',params)
                .then(res => {
                    let {code,msg,result} = res.data
                    switch (modelName){
                        case 'basic':
                            this.abledEditChan = true
                            break;
                        case 'progress':
                            this.abledEditProgress = true
                            break;
                        case 'process':
                            this.abledEditProcess = true
                            break;
                    }
                    if (code == "0000") {
                        this.$message.success(msg)
                        if(modelName==='progress'){
                            this.getFeeSetList()//期数费用
                            this.getDayAmount()//日放款额度
                        }
                    }else{
                        _.extend(data, this.temporaryData)
                        this.temporaryData = null
                        if(msg) this.$message.error(msg)
                    }
                })
            } else {
                return false;
            }
        });
    },
    //获取全部合同
    getAllContract(){
        this.contractVisible = true
        let data = {
            pageNo: this.listContractTableData.pageNo || 1,
            pageSize: this.listContractTableData.pageSize || 10,
            params:{
                chanNo: this.basicData.chanNo
            }
        }
        this.$axios.post('/api/bycx-fund-service/fund/other/getContractInfos',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") { 
               this.listContractTableData = res.data;
               this.contractTableData = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //合同设置新增的选项
    selectionContract(val){     
        this.multipleSelectionContract = val;
    },
    //新增合同
    addContract(){
        if(this.multipleSelectionContract.length){
            _.each(this.multipleSelectionContract,(item)=>{
                _.pick(item,'id')
                item.isOpen = '13900001'
            })
            let data = {
                contList:this.multipleSelectionContract
            }    
            this.$axios.post('/api/bycx-fund-service/fund/other/updateContractInfo',data)
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {               
                    this.$message.success(msg)
                    this.contractVisible=false;
                    this.getContractInfos()
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        }else{
            this.$message.error("请选择")
        }
    },
    //删除合同
    delContract(data){
        data.isOpen ='13900002'
        this.$axios.post('/api/bycx-fund-service/fund/other/updateContractInfo',{contList:data})
        .then(res => {
            let {code,msg,result} = res.data
            if (code == "0000") {               
                this.$message.success('删除成功')
                this.getContractInfos()
            }else{
                if(msg) this.$message.error(msg)
            }
        })
    },
    //获取全部协议
    getAllAgr(){
        this.agrVisible = true
        let data = {
            pageNo: this.listAgrTableData.pageNo || 1,
            pageSize: this.listAgrTableData.pageSize || 10,
            params:{}
        }
        this.$axios.post('/api/bycx-fund-service/fund/other/getAgrTemp',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") { 
               this.listAgrTableData = res.data;
               this.agrTableData = result
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //协议设置新增的选项
    selectionAgr(val){     
        this.multipleSelectionAgr = val;
    },
    //新增协议
    addAgr(){
        if(this.multipleSelectionAgr.length){
            _.each(this.multipleSelectionAgr,(item)=>{
                _.pick(item,'id')
                item.isOpen = '13900001'
            })
            let data = {
                chanNo: this.basicData.chanNo,
                agrTmpList:this.multipleSelectionAgr
            }    
            this.$axios.post('/api/bycx-fund-service/fund/other/updateAgrTemp',data)
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {               
                    this.$message.success(msg)
                    this.agrVisible=false;
                    this.getAgrInfos()
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        }else{
            this.$message.error("请选择")
        }
    },
    //删除协议
    delAgr(data){
        let Json = {
            chanNo: this.basicData.chanNo,
            agrTmpList:[data]
        }
        this.$axios.post('/api/bycx-fund-service/fund/other/delAgrTemp',Json)
        .then(res => {
            let {code,msg,result} = res.data
            if (code == "0000") {               
                this.$message.success('删除成功')
                this.getAgrInfos()
            }else{
                if(msg) this.$message.error(msg)
            }
        })
    },
    //新增放款
    addLoan(){
        this.$refs['loanData'].validate((valid) => {
            if (valid) {
                this.loanData.chanNo = this.basicData.chanNo
                this.loanData.chanName = this.params.chanName
                this.loanData.loanAcctName = this.params.loanAcctName
                this.$axios.post('/api/bycx-fund-service/fund/account/addReleaseAccountInfo',this.loanData)
                .then(res => {
                    let {code,msg,result} = res.data
                    if (code == "0000") {
                        this.$message.success(msg)
                        this.getAccountInfo()//放款
                        this.loanDialogVisible=false
                        let bizName = this.loanData.bizName
                        this.loanData = {}
                        this.loanData.bizName = bizName
                    }else{
                        if(msg) this.$message.error(msg)
                    }
                })
            }
        })
    },
    //删除放款
    delLoan(scope){
        this.$axios.post('/api/bycx-fund-service/fund/account/deleteReleaseAccount',{id: scope.row.id})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
               this.$message.success(msg)
               this.getAccountInfo()//放款
               this.loanDialogVisible=false
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //放款是否开通
    changeIsOpen(scope){
        this.$axios.post('/api/bycx-fund-service/fund/account/updateReleaseAccount',{
            id: scope.row.id,
            isOpen: scope.row.isOpen === '13900001'?'13900002':'13900001'
        }).then(res => {
            if (res.data.code == "0000") {
                this.$message.success('开通成功')
                this.getAccountInfo()//放款
            }else{
                this.$message.error(res.data.msg)
            }
        })
    },
    //还款新增按钮
    addRepayment(){
        this.repaymentData={};
        this.repaymentData.chanNo=this.basicData.chanNo;
        this.repaymentData.isAdd=true;
        this.repaymentDialogVisible=true
    },
    //还款修改按钮
    getRepayment(scope){
        this.$axios.post('/api/bycx-fund-service/fund/account/getRepayInfoById',{id: scope.row.id})
        .then(res => {
          let {code,msg,data} = res.data
           if (code == "0000") {
                this.repaymentData.isAdd = false
                this.repaymentData = data
                this.repaymentDialogVisible=true
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //增加或修改还款
    addUpdateRepayment(){
        this.$refs['repaymentData'].validate((valid) => {
            if (valid) {
                if(this.repaymentData.isAdd){
                    this.$axios.post('/api/bycx-fund-service/fund/account/addRepayInfo',this.repaymentData)
                    .then(res => {
                        let {code,msg,result} = res.data
                        if (code == "0000") {
                            this.$message.success(msg)
                            this.getRepayInfo()//还款
                            this.repaymentDialogVisible=false
                        }else{
                            if(msg) this.$message.error(msg)
                        }
                    })
                }else{
                    this.$axios.post('/api/bycx-fund-service/fund/account/updateRepayInfo',this.repaymentData)
                    .then(res => {
                        let {code,msg,result} = res.data
                        if (code == "0000") {
                            this.$message.success(msg)
                            this.getRepayInfo()//还款
                            this.repaymentDialogVisible=false
                        }else{
                            if(msg) this.$message.error(msg)
                        }
                    })
                }
            }
        })
    },
    //删除还款
    delRepayment(scope){
        this.$axios.post('/api/bycx-fund-service/fund/account/deleteRepayInfo',{id: scope.row.id})
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
               this.$message.success(msg)
               this.getRepayInfo()//放款
               this.repaymentDialogVisible=false
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },    
    //费用项设置是否开通
    updateFeeProInfo(scope){
        let isUse = scope.row.isUse === '13900001'?'13900002':'13900001'
        let data = {
            id: scope.row.id,
            isUse: isUse
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/updateFeeProInfo',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {   
               this.feeTableData[scope.$index].isUse = isUse        
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //删除费用项设置
    deleteFeeProInfo(scope){
        let data = {
            id: scope.row.id,
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/deleteFeeProInfo',data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {               
             this.$message.success(msg)
             this.getFeeProInfos()
             this.getFeeSetList()
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //费用项设置编辑按钮
    editFeeProInfo(scope){
        if(!this.feeData.id){
            this.feeData.id = scope.row.id
            this.feeData.isCustChoose = scope.row.isCustChoose
            this.feeData.isMustChoose = scope.row.isMustChoose
            this.feeData.balancePri = scope.row.balancePri
            this.temporaryData = _.clone(scope.row)
            scope.row.editFlag = true
        }else{
            this.$message.error("请先保存")
        }
    },
    //费用项设置编辑完成
    closeEditFeeProInfo(scope){
        scope.row.isCustChoose = this.feeData.isCustChoose
        scope.row.isMustChoose = this.feeData.isMustChoose
        scope.row.balancePri = this.feeData.balancePri
        this.$axios.post('/api/bycx-fund-service/fund/fee/updateFeeProInfo',this.feeData)
        .then(res => {
            scope.row.editFlag = false
            delete this.feeData.id
            if (res.data.code == "0000") {
                this.$message.success('修改成功')
            }else{
                _.extend(scope.row,this.temporaryData)
                this.temporaryData = null
                this.$message.error(res.data.msg)
            }
        })
    },
    //费用项设置里新增按钮-获取全部列表
    getrepayFeeConf(){
        let data = {
            pageNo: this.listFeeAllData.pageNo || 1,
            pageSize: this.listFeeAllData.pageSize || 10,
            params:{
                chanNo: this.basicData.chanNo
            }
        }        
        this.$axios.post('/api/bycx-fund-service/fund/fee/getrepayFeeConf', data)
        .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {               
               this.listFeeAllData = res.data;
               this.feeAllTableData = result
               this.feeDialogVisible=true;
           }else{
              if(msg) this.$message.error(msg)
           }
        })
    },
    //费用项设置新增的选项
    selectionFee(val){        
        this.multipleSelectionFee = val;
    },
    //新增费用项设置
    addFee(){
        if(this.multipleSelectionFee.length){
            let data = {
                chanNo: this.basicData.chanNo,
                busNo: this.basicData.bizNo,
                feeList:this.multipleSelectionFee
            }    
            this.$axios.post('/api/bycx-fund-service/fund/fee/addBusFeeRel',data)
            .then(res => {
            let {code,msg,result} = res.data
            if (code == "0000") {               
                this.$message.success(msg)
                this.feeDialogVisible=false;
                this.getFeeProInfos()
                this.getFeeSetList()
            }else{
                if(msg) this.$message.error(msg)
            }
            })
        }else{
            this.$message.error("请选择")
        }
    },
    //期数费用设置编辑
    editDateFeeData(scope){
        if(!this.dateFeeValues.length){
            let data = _.omit(scope.row,'期数','editFlag','id')            
            this.dateFeeValues =_.values(_.map(data, item => {return item?item:0}))
            this.temporaryData = _.clone(scope.row)
            scope.row.editFlag = true
        }else{
            this.$message.error("请先保存")
        }
    },
    //期数费用设置编辑完成
    closeEditDateFeeData(scope){
        this.dateFeeData.chanNo = this.basicData.chanNo,
        this.dateFeeData.busNo = this.basicData.bizNo,
        this.dateFeeData.period = scope.row["期数"]      
        let data = _.object(_.keys( _.omit(scope.row,'期数','editFlag','id')),this.dateFeeValues)
        _.extend(this.dateFeeData, data)
        this.$axios.post('/api/bycx-fund-service/fund/fee/updateBusSet',this.dateFeeData)
        .then(res => {
            scope.row.editFlag = false
            this.dateFeeValues = []
            if (res.data.code == "0000") {
                _.extend(scope.row, _.omit(this.dateFeeData,'chanNo','busNo','period'))
                this.$message.success('修改成功')
            }else{
                _.extend(scope.row,this.temporaryData)
                this.temporaryData = null
                this.$message.error(res.data.msg)
            }
        })
    },
    //日放款额编辑,有scope是修改日放款额，，没有是修改总额
    editAmountData(scope){
        if(scope){
            if(!this.dayAmountData.loanDayAmt){
                this.dayAmountData.loanDayAmt = scope.row.loanDayAmt
                this.temporaryData = _.clone(scope.row)
                scope.row.editFlag = true
            }else{
                this.$message.error("请先保存")
            }
        }else{
            this.abledEditTotalAmount=false
            this.temporaryData = this.dayAmountData.dayPosition
        }
    },
    //日放款额编辑完成，有scope是修改日放款额，，没有是修改总额
    closeEditAmountData(scope){
        this.dayAmountData.chanNo = this.basicData.chanNo
        let data = {}
        let total = this.dayAmountData.dayPosition
        if(scope){
            this.dayAmountData.period = scope.row.period,
            scope.row.loanDayAmt = this.dayAmountData.loanDayAmt
            delete this.dayAmountData.dayPosition
            data = {
                chanNo: this.basicData.chanNo,
                bizNo: this.basicData.bizNo,
                list:[this.dayAmountData]
            }
        }else{
            data = {
                chanNo: this.basicData.chanNo,
                bizNo: this.basicData.bizNo,
                dayPosition: this.dayAmountData.dayPosition
            }
        }
        let dayPosition = 0
        _.each(this.dayAmountTableData,item=>{
            dayPosition += parseInt(item.loanDayAmt)
        })
        if(parseInt(total) >= parseInt(dayPosition)){
            this.$axios.post('/api/bycx-fund-service/fund/fee/updateDayAmount',data)
            .then(res => {
                if(scope){
                    scope.row.editFlag = false
                    this.dayAmountData.loanDayAmt=''
                    if (res.data.code == "0000") {
                        this.$message.success('修改成功')
                    }else{
                        _.extend(scope.row,this.temporaryData)
                        this.temporaryData = null
                        this.$message.error(res.data.msg)
                    }
                }else{
                    this.abledEditTotalAmount=true
                    if (res.data.code == "0000") {
                        this.$message.success('修改成功')
                    }else{
                        this.dayAmountData.dayPosition = this.temporaryData 
                        this.temporaryData = null
                        this.$message.error(res.data.msg)
                    }
                }
            })
        }else{
            this.$message.error('日放款不能大于总额')
        }
    },
    //新增关联产品
    addProductOfChan(){
        if(!this.goodsOfOne.fundGoodsNo){
            return false
        }
        let dateNum = this.progressData.dateNum
        let data = {
            id: this.goodsOfOne.id,
            chanNo: this.basicData.chanNo,
            fundGoodsNo :this.goodsOfOne.fundGoodsNo,
            period: dateNum.join(','),
            bizNo:this.basicData.bizNo
        }    
        this.$axios.post('/api/bycx-fund-service/fund/chan/addProductOfChan',data)
        .then(res => {
        let {code,msg,result} = res.data
        if (code == "0000") {               
            this.$message.success(msg)
        }else{
            if(msg) this.$message.error(msg)
        }
        })
    },
    handleSizeChange(listName, methodName, val) {
        listName.pageNo = 1;
        listName.pageSize = val;
        methodName()
    },
    handleCurrentChange(listName, methodName, val) {
        listName.pageNo = val;
        methodName()
    }, 
    filterIsOpenOptions(row){
        if(row.isOpen){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isOpen)})[0].valName
        }else{
            return '否'
        }
    },
    filterStrikeTypeOptions(row){
        if(row.strikeType){
            return _.filter(this.strikeTypeOptions, (item) => { return (item.valCode === row.strikeType)})[0].valName
        }
    },
    filterAcctBelongOptions(row){
        if(row.acctBelong){
            return _.filter(this.acctBelongOptions, (item) => { return (item.valCode === row.acctBelong)})[0].valName
        }
    },
    filterRepayModeOptions(row){
        if(row.repayMode){
            return _.filter(this.repayModeOptions, (item) => { return (item.valCode === row.repayMode)})[0].valName
        }
    },
    filterRepayChanOptions(row){
        if(row.repayChan){
            return _.filter(this.repayChanOptions, (item) => { return (item.valCode === row.repayChan)})[0].valName
        }
    },
    filterAcctOrgOptions(row){
        if(row.acctOrg){
            return _.filter(this.acctOrgOptions, (item) => { return (item.valCode === row.acctOrg)})[0].valName
        }
    },
    filterIsCustChooseOptions(row){
        if(row.isCustChoose){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isCustChoose)})[0].valName
        }
    },
    filterIsMustChooseOptions(row){
        if(row.isMustChoose){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isMustChoose)})[0].valName
        }
    },
    filterIsUseOptions(row){
        if(row.isUse){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isUse)})[0].valName
        }
    },
    filterValidFlagOptions(row){
        if(row.validFlag){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.validFlag)})[0].valName
        }
    },
    filterFeeTypeOptions(row){
        if(row.typ){
            return _.filter(this.feeProTypeOptions, (item) => { return (item.valCode === row.typ)})[0].valName
        }
    },
    filterFeeProTypeOptions(row){
        if(row.feeProType){
            return _.filter(this.feeProTypeOptions, (item) => { return (item.valCode === row.feeProType)})[0].valName
        }
    },
    filterContractAllOptions(row){
        if(row.contractType){
            return _.filter(this.contractOptions, (item) => { return (item.valCode === row.contractType)})[0].valName
        }
    },
    formatArray(data){
        if(data == '' || data == null){
            return []
        }else if(/,/.test(data)){
            return data.split(',')
        } else{
            return [data]
        }
    }
  }
}
</script>