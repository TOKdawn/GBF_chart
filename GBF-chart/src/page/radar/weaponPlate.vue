<template>
    <div class="small">
    
        <canvas id="myChart2" width="400px" height="400px"></canvas>
    </div>
</template>
<script>
import Chart from 'chart.js';



export default {
    components: {

    },
    data() {
        return {
            basic:'10000',//基础攻击
            Mweapon:[],//方阵武器
            Wweapon:[],//老王武器
            EXweapon:[],//特殊武器
            propStone:'1.5',//属性加护
            Mstone:'1.4',//方阵加护
            Wweapon:'1.4',//老王加护
            other:''//其他加成
        }
    },
    mounted() {
        

        var ctx2 = document.getElementById("myChart2");

        var myChart2 = new Chart(ctx2, {
           	type: 'bar',
            data: {
                labels: ["全方阵", "方阵加老王", "方阵加老王加特殊", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [{
                    label: 'Dataset 1',
                    backgroundColor: window.chartColors.red,
                    stack: 'Stack 0',
                    data: [
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                    ]
                },{
                    label: 'Dataset 1',
                    backgroundColor: window.chartColors.red,
                    stack: 'Stack 0',
                    data: [
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                    ]
                },{
                    label: 'Dataset 1',
                    backgroundColor: window.chartColors.red,
                    stack: 'Stack 0',
                    data: [
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                    ]
                },{
                    label: 'Dataset 1',
                    backgroundColor: window.chartColors.red,
                    stack: 'Stack 0',
                    data: [
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                    ]
                },{
                    label: 'Dataset 1',
                    backgroundColor: window.chartColors.red,
                    stack: 'Stack 0',
                    data: [
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                     this.basic,
                    ]
                }]
            },
            options: {
                
            }

        });
    },
    methods: {

    }
}
</script>
<style>
.small {
    width: 500px;
    height: 500px;
}
</style>