<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- 基础伤害(D) =
攻击者攻击力
× { 1 + 方阵攻刃技能 × ( 1 + 方阵召唤加护 ) + 方阵攻刃buff*13 × ( 1 + 方阵召唤加护 )}
× { 1 + 方阵背水技能 × ( 1 + 方阵召唤加护 ) }
× { 1 + UK技能 × ( 1 + 兰子召唤加护 ) + 其他EX技能 + EX攻刃Buff*9 }
× { 1 + 普刃技能 × ( 1 + 老王召唤加护 ) + 通常楚歌buff *14× ( 1 + 老王召唤加护 ) + 巴哈武器攻up技能 + 角色伤害up召唤加护 + 角色伤害up buff + 参战timing buff *10}
× { 1 + 普刃背水技能 × ( 1 + 老王召唤加护 ) + 角色背水被动技能}
× { 1 + 普刃浑身技能 × ( 1 + 老王召唤加护 ) + U巴武器[强壮] + 通常浑身buff*11 }
× ( 弱点補正*1 + 属性攻击力up召唤加护 + 属性攻击力up buff - 属性攻击力down debuff )
× ( 1 + 互动buff × 参加职业数)( 例如c3 superstar的1技能 )
× { 1 + 攻击UP(累计)buff × 累计回数 }
× ( 1 + 浑身buff )
× ( 1 + 逆境buff )
× ( 1 + 角色LB浑身 + 部分浑身buff *12 )
× ( 1 + 角色LB背水 )
× ( 1 + 部分角色背水被动 )
× ( 1 +其他乘算buff )

Add "scoped" attribute to limit CSS to this component only 



举个简单的例子：在120属性主召X120属性友召的条件下，装备有8把sk10的方阵攻刃Ⅱ的武器，除攻刃外无其他技能，攻击平属敌人，那么按照上述公式，加成系数为：
(1 + 8 × 0.15 × 1 ) × (1) × (1) × (1 + 120% × 2)=7.48

第9把武器加入继续加入sk10方阵的话，系数则为：
(1 + 9 × 0.15 × 1) × (1) × (1) × (1 + 120% × 2)=7.99
放入sk10普刃的话，系数为：
(1 + 8 × 0.15 × 1) × (1 + 1 × 0.15) × (1) × (1 + 120% × 2)=8.602

由于放入普刃系数更高，在此之上第10把武器加入sk10普刃时，系数为：
(1 + 8 × 0.15 × 1) × (1 + 2 × 0.15) × (1) × (1 + 120% × 2)=9.724
而放入的为sk10 EX攻刃大的EX武器时，系数为：
(1 + 8 × 0.15 × 1) × (1 + 1 × 0.15) × (1 + 1 × 0.15) × (1 + 120% × 2)=9.8923
这就和“长方体棱长总和一定时，当为长宽高三边长相等的正方体时，体积最大”这一原理一样。武器盘总和限定为10，当武器带来的各区加成值最为接近时，加成系数最大(注：这里指的是属×属)


但由于方阵、普刃都存在加护召唤(角色伤害加护石和EX加护的兰子石并不主流)，实际情况不能直接套用上述状况，因此不同加护下的武器盘配比还是会略有区别，这里选取了相对简单的方阵×属、方阵×方阵、属×属，这三个搭配具体探讨其武器盘配比。

由于武器的白值不同、不同武器的攻刃技能不同(攻刃特大/大/中/小)、甚至部分武器还有多个技能，
因此这里只能假定一个简单的讨论环境作为举例，与实际应用上会有一定差距
假定条件：方阵武器技能仅有方阵·攻刃Ⅱ，且均为Slv10;普刃武器技能仅有攻刃大，且均为Slv10；
EX武器仅有EX攻刃大，且均为Slv10；攻击目标为克属。
方阵召唤满破(方阵技能效果100%up)，
属性召唤效果为120%(四属满破咸鱼/0破贵族级)
令方阵武器数目为X，普刃武器数目为Y，EX武器数目为Z，X+Y+Z=10，分别计算在上述条件下的攻刃加成系数
方阵×属满足：(1 + X × 0.15 × ( 1 + 100% )) × ( 1 + 0.15 × Y ) × ( 1 +0.15 × Z ) × ( 1.5 + 120% × 1 )
方阵×方阵满足：(1 + X × 0.15 × ( 1 + 100% × 2 )) × ( 1 + 0.15 × Y ) × ( 1 +0.15 × Z ) × ( 1.5 + 120% )
属×属满足：(1 + X × 0.15 ) × ( 1 + 0.15 × Y ) × ( 1 +0.15 × Z ) × ( 1.5 + 120% × 2 )

令Z分别为0、1、2、3、4，绘制攻刃加成系数-方阵武器数目变化曲线
-->
<style scoped>
h1, h2 {
     
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
<script>

      		var barChartData = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			datasets: [{
				label: 'Dataset 1',
				backgroundColor: window.chartColors.red,
				stack: 'Stack 0',
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			}, {
				label: 'Dataset 2',
				backgroundColor: window.chartColors.blue,
				stack: 'Stack 0',
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			}, {
				label: 'Dataset 3',
				backgroundColor: window.chartColors.green,
				stack: 'Stack 1',
				data: [
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor(),
					randomScalingFactor()
				]
			}]

		};
		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myBar = new Chart(ctx, {
				type: 'bar',
				data: barChartData,
				options: {
					title: {
						display: true,
						text: 'Chart.js Bar Chart - Stacked'
					},
					tooltips: {
						mode: 'index',
						intersect: false
					},
					responsive: true,
					scales: {
						x: {
							stacked: true,
						},
						y: {
							stacked: true
						}
					}
				}
			});
		};

		document.getElementById('randomizeData').addEventListener('click', function() {
			barChartData.datasets.forEach(function(dataset) {
				dataset.data = dataset.data.map(function() {
					return randomScalingFactor();
				});
			});
			window.myBar.update();
		});
  

</script>