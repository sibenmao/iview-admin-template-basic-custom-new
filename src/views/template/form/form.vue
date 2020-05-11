<template>
    <div>
        <Card title="人工终端" shadow>
            <Form :label-width="150" ref="orderForm" :rules="rules" :model="form" label-colon hide-required-mark>
                <div class="item-box">
                    <FormItem label="易购条码" key="codeText">
                        <Input v-model="codeText" type="text" class="input" readonly />
                    </FormItem>
                    <FormItem label="卡号" prop="card_no" key="card_no">
                        <Input v-model="form.card_no" type="text" class="input" readonly />
                    </FormItem>
                    <FormItem label="车牌号" prop="plate_number" key="plate_number">
                        <!-- <input
                            type="text"
                            v-model="form.plate_number"
                            class="truck_input"
                            maxlength="7"
                            minlength="7"
                            placeholder="请输入车牌号"
                            ref="truck"
                            @blur="truckBlur"
                        /> -->
                        <Input
                            type="text"
                            v-model="form.plate_number"
                            class="truck_input"
                            maxlength="7"
                            minlength="7"
                            placeholder="请输入车牌号"
                            ref="truck"
                            @blur="truckBlur"
                        />
                    </FormItem>

                    <FormItem label="车辆分组" key="carGroup">
                        <Select v-model="carGroup" placeholder="请选择车辆分组" class="input" filterable>
                            <Option v-for="(item, index) in carGroupList" :value="index" :key="index">{{ item }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="选择客户" prop="customer_id" key="customer_id">
                        <template>
                            <Select v-model.number="form.customer_id" placeholder="请选择客户" @on-change="changeCustomer" class="input" filterable>
                                <Option v-for="item in customerList" :value="item.customer_id" :key="item.customer_id">{{ item.customer_name }}</Option>
                            </Select>
                            <!-- <Input readonly v-model="form.customer_name" type="text" class="input" v-else /> -->
                        </template>
                    </FormItem>

                    <FormItem label="持卡人姓名" prop="driver_name" key="driver_name">
                        <Input disabled v-model="form.driver_name" class="input" />
                    </FormItem>

                    <FormItem label="料类分组" key="stoneGroupId">
                        <Select v-model="stoneGroupId" placeholder="请选料类分组" @on-change="changeStoneGroup" class="input" filterable>
                            <Option v-for="item in stoneGroupList" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="选择料类" prop="stone_id" key="stone_id">
                        <Select v-model.number="form.stone_id" class="input" placeholder="请选择料类" @on-change="changeStone" filterable>
                            <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <!-- <Input readonly v-model="form.stone_name" type="text" class="input" v-else /> -->
                    </FormItem>

                    <FormItem label="料价" key="stonePrice">
                        <Input disabled v-model="stonePrice" type="text" class="input" />
                    </FormItem>

                    <FormItem label="地磅" key="poundip">
                        <Select v-model="poundip" placeholder="请选择地磅" @on-change="changePound" class="input">
                            <Option v-for="(item, index) in poundList" :value="item.ip" :key="index">{{ item.text }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="皮重" prop="tare_weight" key="tare_weight">
                        <Input type="text" v-model.number="form.tare_weight" class="input" />
                    </FormItem>

                    <FormItem label="预装重量" prop="preload" key="preload">
                        <Input type="text" v-model.number="form.preload" class="input" />
                    </FormItem>
                </div>
            </Form>
        </Card>
    </div>
</template>
<script>
import './form.scss';
export default {
    props: {
        plateRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '车牌号不能为空',
                        trigger: 'blur',
                    },
                ];
            },
        },
        customerRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '请选择要登记的客户',
                        trigger: 'blur',
                        type: 'number',
                    },
                ];
            },
        },
        stoneRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '请选择要登记的料类',
                        trigger: 'blur',
                        type: 'number',
                    },
                ];
            },
        },
        preloadRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '请填写预装重量',
                        trigger: 'blur',
                        type: 'number',
                    },
                    {
                        //自定义验证函数
                        validator: (rule, value, callback) => {
                            if (value <= 0) {
                                callback(new Error('预装重量不允许为0'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ];
            },
        },
        tareWeightRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '请读取皮量',
                        trigger: 'blur',
                        type: 'number',
                    },
                    {
                        //自定义验证函数
                        validator: (rule, value, callback) => {
                            if (value <= 0) {
                                callback(new Error('皮量不允许为0'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ];
            },
        },
        cardNoRules: {
            type: Array,
            default: () => {
                return [
                    {
                        required: true,
                        message: '请放入卡片',
                        trigger: 'change',
                    },
                ];
            },
        },
    },
    data() {
        return {
            form: {
                customer_id: '',
                stone_id: '',
                plate_number: '',
                driver_name: '',
                preload: '0',
                in_terminal: '',
                card_no: '',
                tare_weight: '',
                customer_name: '',
                stone_name: '',
            },
            codeText: '',
            carGroupList: [],
            carGroup: '',
            stoneGroupList: [],
            stoneGroupId: '',
            stoneList: [],
            poundList: [],
            poundip: '',
            customerList: [],
            stonePrice: ''
        };
    },
    computed: {
        rules() {
            return {
                plate_number: this.plateRules,
                driver_name: this.driverRules,
                customer_id: this.customerRules,
                stone_id: this.stoneRules,
                // preload: this.preloadRules,
                tare_weight: this.tareWeightRules,
                card_no: this.cardNoRules,
            };
        },
    },
    methods: {
        truckBlur() {},
        changeCustomer() {},
        changeStoneGroup() {},
        changeStone() {},
        changePound() {},
    },
};
</script>
