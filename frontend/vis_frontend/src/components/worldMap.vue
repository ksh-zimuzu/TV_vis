<template>
  <div class="echarts">
    <div :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>

<script>
    import echarts from "echarts" //引入组件
    import '../service/world.js'    //引入组件

    export default {
      name: "worldMap",
      props: {
        width: {type: String, default: "1000px" },
        height: {type: String, default: "600px"}
      },
      data() {
        return {
          chart: null,
          data:[
            {"name": "日本", "value": 5506},//JP
            {"name": "美国", "value": 17606},//US
            {"name": "英国", "value": 9862},//GB
            {"name": "加拿大", "value": 3491},//CA
            {"name": "新西兰", "value": 306},//NZ
            {"name": "中国", "value": 2164},//CN+TW+HK
            {"name": "法国", "value": 1451},//FR
            {"name": "西班牙", "value": 751},//ES
            {"name": "墨西哥", "value": 478},//MX
            {"name": "菲律宾", "value": 1199},//PH
            {"name": "智利", "value": 183},//CL
            {"name": "土耳其", "value": 528},//TR
            {"name": "澳大利亚", "value": 2567},//AU
            {"name": "伊朗", "value": 63},//IR
            {"name": "意大利", "value": 786},//IT
            {"name": "德国", "value": 2747},//DE
            {"name": "荷兰", "value": 1210},//NL
            {"name": "葡萄牙", "value": 169},//PT
            {"name": "新加坡", "value": 249},//SG
            {"name": "阿根廷", "value": 191},//AR
            {"name": "韩国", "value": 1790},//KR
            {"name": "冰岛", "value": 70},//IS
            {"name": "芬兰", "value": 223},//FI
            {"name": "丹麦", "value": 413},//DK
            {"name": "以色列", "value": 196},//IL
            {"name": "委内瑞拉", "value": 116},//VE
            {"name": "印度", "value": 336},//IN
            {"name": "奥地利", "value": 187},//AT
            //{"name": "", "value": },//IO
            {"name": "泰国", "value": 766},//TH
            {"name": "哥伦比亚", "value": 126},//CO
            {"name": "厄瓜多尔", "value": 5},//EC
            //{"name": "", "value": },//XC 可能是cross country的意思
            {"name": "哈萨克斯坦", "value": 7},//KZ
            {"name": "尼日利亚", "value": 9},//NG
            {"name": "爱尔兰", "value": 71},//IE
            {"name": "马来西亚", "value": 336},//MY
            {"name": "南非", "value": 70},//ZA
            {"name": "波兰", "value": 477},//PL
            {"name": "北朝鲜", "value": 11},//KP
            {"name": "比利时", "value": 373},//BE
            {"name": "巴西", "value": 584},//BR
            {"name": "俄罗斯", "value": 564},//RU
            {"name": "瑞典", "value": 615},//SE
            {"name": "捷克", "value": 574},//CZ
            {"name": "印度尼西亚", "value": 178},//ID
            {"name": "伯利兹", "value": 5},//BZ
            {"name": "希腊", "value": 154},//GR
            {"name": "挪威", "value": 395},//NO
            {"name": "瑞士", "value": 61},//CH
            {"name": "克罗地亚", "value": 47},//HR
            {"name": "加纳", "value": 3},//GH
            {"name": "波多黎各", "value": 21},//PR
            {"name": "埃及", "value": 176},//EG
            {"name": "秘鲁", "value": 29},//PE
            {"name": "塞浦路斯", "value": 9},//CY
            {"name": "罗马尼亚", "value": 68},//RO
            {"name": "斯洛伐克", "value": 86},//SK
            {"name": "立陶宛", "value": 16},//LT
            {"name": "巴基斯坦", "value": 311},//PK
            {"name": "塞尔维亚", "value": 61},//RS
            {"name": "哥斯达黎加", "value": 6},//CR
            {"name": "约旦", "value": 5},//JO
            {"name": "阿联酋", "value": 24},//AE
            {"name": "爱沙尼亚", "value": 16},//EE
            {"name": "乌克兰", "value": 72},//UA
            {"name": "斯洛文尼亚", "value": 11},//SI
            {"name": "保加利亚", "value": 56},//BG
            {"name": "黎巴嫩", "value": 22},//LB
            //{"name": "前苏联", "value": 64},//SU
            {"name": "特里尼达和多巴哥", "value": 2},//TT
            {"name": "匈牙利", "value": 121},//HU
            {"name": "斯里兰卡", "value": 6},//LK
            {"name": "孟加拉国", "value": 15},//BD
            {"name": "尼泊尔", "value": 8},//NP
            {"name": "亚美尼亚", "value": 8},//AM
            {"name": "波斯尼亚和黑塞哥维那", "value": 11},//BA
            {"name": "黑山", "value": 2},//ME
            {"name": "叙利亚", "value": 35},//SY
            {"name": "肯尼亚", "value": 13},//KE
            {"name": "格鲁吉亚", "value": 48},//GE
            {"name": "拉脱维亚", "value": 13},//LV
            {"name": "安哥拉", "value": 1},//AO
            {"name": "摩洛哥", "value": 3},//MA
            {"name": "阿塞拜疆", "value": 6},//AZ
            {"name": "阿尔巴尼亚", "value": 11},//AL
            {"name": "乌拉圭", "value": 6},//UY
            {"name": "巴拿马", "value": 3},//PA
            //{"name": "", "value": },//XG
            {"name": "阿富汗", "value": 10},//AF
            {"name": "突尼斯", "value": 7},//TN
            {"name": "多明尼加共和国", "value": 3},//DO
            {"name": "南斯拉夫", "value": 8},//YU
            {"name": "卢森堡", "value": 5},//LU
            {"name": "马耳他", "value": 2},//MT
            //{"name": "", "value": },//CS 捷克斯洛伐克（前）
            {"name": "牙买加", "value": 4},//JM
            {"name": "瓦努阿图", "value": 1},//VU
            {"name": "巴布亚新几内亚", "value": 2},//PG
            //{"name": "", "value": },//VI 美属处女群岛
            {"name": "洪都拉斯", "value": 1},//HN
            //{"name": "", "value": 1},//AW
            //{"name": "", "value": 1},//AN 荷属安地列斯群岛
            {"name": "蒙古", "value": 1},//MN
            //{"name": "安道尔", "value": 2},//AD
            {"name": "阿尔及利亚", "value": 3},//DZ
            {"name": "沙特阿拉伯", "value": 14},//SA
            {"name": "玻利维亚", "value": 1},//BO
            {"name": "科威特", "value": 32},//KW
            {"name": "斯威士兰", "value": 1},//SZ
            //{"name": "马里亚纳群岛", "value": 1},//MP
            {"name": "斐济", "value": 1},//FJ
            {"name": "卡塔尔", "value": 4},//QA
            {"name": "伊拉克", "value": 4},//IQ
            {"name": "巴林", "value": 2},//BH
            {"name": "乌干达", "value": 2},//UG
            {"name": "马尔代夫", "value": 3},//MV
            {"name": "白俄罗斯", "value": 8},//BY
            {"name": "摩尔多瓦", "value": 1},//MD
            {"name": "巴拉圭", "value": 3},//PY
            {"name": "越南", "value": 17},//VN
            {"name": "缅甸", "value": 1},//MM
            {"name": "古巴", "value": 7},//CU
            //{"name": "特克斯和凯科斯群岛", "value": 1},//TC
            {"name": "马其顿", "value": 3},//MK
            {"name": "多哥", "value": 2},//TG
            //{"name": "巴勒斯坦", "value": 1},//PS
            {"name": "塞内加尔", "value": 1},//SN
            {"name": "喀麦隆", "value": 1},//CM
            {"name": "毛里求斯", "value": 1},//MU
            {"name": "博茨瓦纳", "value": 1}//BW
          ]
        };
      },
      mounted() {
        this.initChart();
      },
      methods: {
        initChart() {
          this.chart = echarts.init(this.$refs.myEchart);
          window.onresize = echarts.init(this.$refs.myEchart).resize;
          // 把配置和数据放这里
          this.chart.setOption({
            //b8dfe6
            backgroundColor: "#B8DFE6",
            title: {    //地图显示标题
              text: 'TMDB：全球剧集数量',
              subtext: 'Number of global TV series',
              //sublink: 'http://www.baidu.com',
              top: "30px",
              left: 'center',
              textStyle: {color: '#fff'}
            },
            visualMap: {   //图列显示柱
              type: 'piecewise',
              splitNumber: 15,
              pieces:[
                {lte: 0},
                {gt: 0, lte: 5},
                {gt: 5, lte: 10},
                {gt: 10, lte: 20},
                {gt: 20, lte: 50},
                {gt: 50, lte: 100},
                {gt: 100, lte: 200},
                {gt: 200, lte: 500},
                {gt: 500, lte: 1000},
                {gt: 1000, lte: 2000},
                {gt: 2000, lte: 3000},
                {gt: 3000, lte: 5000},
                {gt: 5000, lte: 8000},
                {gt: 8000, lte: 12000},
                {gt: 12000}
              ],
              min: 0,
              max: 17606,
              left: 30,
              bottom: 100,
              text:['高','低'],
              realtime: false,
              calculable : true,
              color: ['#0C4E00', '#5C8100', '#A0B700', '#D2CF00', '#E6E4A6', '#E5E2E0']
              //color: ['orangered','yellow','lightskyblue']
            },
            tooltip: {  //提示框组件
              trigger: 'item',
              formatter: '{b}<br/>{c} 部剧'
            },
            series: [{
              name:"剧集数量",
              type: 'map',
              mapType: 'world',
              roam: true, //开启鼠标缩放和平移漫游
              scaleLimit:{
                min: 0.5,
                max: 2.0
              },
              data: this.data,   //绑定数据
              nameMap:{ //自定义地区的名称映射
                'Afghanistan':'阿富汗',
                'Singapore':'新加坡',
                'Angola':'安哥拉',
                'Albania':'阿尔巴尼亚',
                'United Arab Emirates':'阿联酋',
                'Argentina':'阿根廷',
                'Armenia':'亚美尼亚',
                'French Southern and Antarctic Lands':'法属南半球和南极领地',
                'Australia':'澳大利亚',
                'Austria':'奥地利',
                'Azerbaijan':'阿塞拜疆',
                'Burundi':'布隆迪',
                'Belgium':'比利时',
                'Benin':'贝宁',
                'Burkina Faso':'布基纳法索',
                'Bangladesh':'孟加拉国',
                'Bulgaria':'保加利亚',
                'The Bahamas':'巴哈马',
                'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
                'Belarus':'白俄罗斯',
                'Belize':'伯利兹',
                'Bermuda':'百慕大',
                'Bolivia':'玻利维亚',
                'Brazil':'巴西',
                'Brunei':'文莱',
                'Bhutan':'不丹',
                'Botswana':'博茨瓦纳',
                'Central African Republic':'中非共和国',
                'Canada':'加拿大',
                'Switzerland':'瑞士',
                'Chile':'智利',
                'China':'中国',
                'United States':'美国',
                'Ivory Coast':'象牙海岸',
                'Cameroon':'喀麦隆',
                'Democratic Republic of the Congo':'刚果民主共和国',
                'Republic of the Congo':'刚果共和国',
                'Colombia':'哥伦比亚',
                'Costa Rica':'哥斯达黎加',
                'Cuba':'古巴',
                'Northern Cyprus':'北塞浦路斯',
                'Cyprus':'塞浦路斯',
                'Germany':'德国',
                'Djibouti':'吉布提',
                'Denmark':'丹麦',
                'Dominican Republic':'多明尼加共和国',
                'Algeria':'阿尔及利亚',
                'Ecuador':'厄瓜多尔',
                'Egypt':'埃及',
                'Eritrea':'厄立特里亚',
                'Spain':'西班牙',
                'Estonia':'爱沙尼亚',
                'Ethiopia':'埃塞俄比亚',
                'Finland':'芬兰',
                'Fiji':'斐济',
                'Tanzania':'坦桑尼亚',
                'Falkland Islands':'福克兰群岛',
                'France':'法国',
                'Gabon':'加蓬',
                'United Kingdom':'英国',
                'Georgia':'格鲁吉亚',
                'Ghana':'加纳',
                'Guinea':'几内亚',
                'Gambia':'冈比亚',
                'Guinea Bissau':'几内亚比绍',
                'Equatorial Guinea':'赤道几内亚',
                'Greece':'希腊',
                'Greenland':'格陵兰',
                'Guatemala':'危地马拉',
                'French Guiana':'法属圭亚那',
                'Guyana':'圭亚那',
                'Honduras':'洪都拉斯',
                'Croatia':'克罗地亚',
                'Haiti':'海地',
                'Hungary':'匈牙利',
                'Indonesia':'印度尼西亚',
                'India':'印度',
                'Ireland':'爱尔兰',
                'Iran':'伊朗',
                'Iraq':'伊拉克',
                'Iceland':'冰岛',
                'Israel':'以色列',
                'Italy':'意大利',
                'Jamaica':'牙买加',
                'Jordan':'约旦',
                'Japan':'日本',
                'Kazakhstan':'哈萨克斯坦',
                'Kenya':'肯尼亚',
                'Kyrgyzstan':'吉尔吉斯斯坦',
                'Cambodia':'柬埔寨',
                'Korea':'韩国',
                'Kosovo':'科索沃',
                'Kuwait':'科威特',
                'Laos':'老挝',
                'Lebanon':'黎巴嫩',
                'Liberia':'利比里亚',
                'Libya':'利比亚',
                'Sri Lanka':'斯里兰卡',
                'Lesotho':'莱索托',
                'Lithuania':'立陶宛',
                'Luxembourg':'卢森堡',
                'Latvia':'拉脱维亚',
                'Morocco':'摩洛哥',
                'Moldova':'摩尔多瓦',
                'Madagascar':'马达加斯加',
                'Mexico':'墨西哥',
                'Macedonia':'马其顿',
                'Mali':'马里',
                'Myanmar':'缅甸',
                'Montenegro':'黑山',
                'Mongolia':'蒙古',
                'Mozambique':'莫桑比克',
                'Mauritania':'毛里塔尼亚',
                'Malawi':'马拉维',
                'Malaysia':'马来西亚',
                'Namibia':'纳米比亚',
                'New Caledonia':'新喀里多尼亚',
                'Niger':'尼日尔',
                'Nigeria':'尼日利亚',
                'Nicaragua':'尼加拉瓜',
                'Netherlands':'荷兰',
                'Norway':'挪威',
                'Nepal':'尼泊尔',
                'New Zealand':'新西兰',
                'Oman':'阿曼',
                'Pakistan':'巴基斯坦',
                'Panama':'巴拿马',
                'Peru':'秘鲁',
                'Philippines':'菲律宾',
                'Papua New Guinea':'巴布亚新几内亚',
                'Poland':'波兰',
                'Puerto Rico':'波多黎各',
                'Dem. Rep. Korea':'北朝鲜',
                'Portugal':'葡萄牙',
                'Paraguay':'巴拉圭',
                'Qatar':'卡塔尔',
                'Romania':'罗马尼亚',
                'Russia':'俄罗斯',
                'Rwanda':'卢旺达',
                'Western Sahara':'西撒哈拉',
                'Saudi Arabia':'沙特阿拉伯',
                'Sudan':'苏丹',
                'South Sudan':'南苏丹',
                'Senegal':'塞内加尔',
                'Solomon Islands':'所罗门群岛',
                'Sierra Leone':'塞拉利昂',
                'El Salvador':'萨尔瓦多',
                'Somaliland':'索马里兰',
                'Somalia':'索马里',
                'Republic of Serbia':'塞尔维亚',
                'Suriname':'苏里南',
                'Slovakia':'斯洛伐克',
                'Slovenia':'斯洛文尼亚',
                'Sweden':'瑞典',
                'Swaziland':'斯威士兰',
                'Syria':'叙利亚',
                'Chad':'乍得',
                'Togo':'多哥',
                'Thailand':'泰国',
                'Tajikistan':'塔吉克斯坦',
                'Turkmenistan':'土库曼斯坦',
                'East Timor':'东帝汶',
                'Trinidad and Tobago':'特里尼达和多巴哥',
                'Tunisia':'突尼斯',
                'Turkey':'土耳其',
                'United Republic of Tanzania':'坦桑尼亚',
                'Uganda':'乌干达',
                'Ukraine':'乌克兰',
                'Uruguay':'乌拉圭',
                'United States of America':'美国',
                'Uzbekistan':'乌兹别克斯坦',
                'Venezuela':'委内瑞拉',
                'Vietnam':'越南',
                'Vanuatu':'瓦努阿图',
                'West Bank':'西岸',
                'Yemen':'也门',
                'South Africa':'南非',
                'Zambia':'赞比亚',
                'Zimbabwe':'津巴布韦',
                'Bahamas':'巴哈马群岛',
                'Dominican Rep.':'多米尼加共和国',
                'Dominica':'多米尼加岛',
                'Faeroe Is.':'法罗群岛',
                'Czech Rep.':'捷克',
                'Bosnia and Herz.':'波黑',
                'Serbia':'塞尔维亚',
                'Cape Verde':'佛得角',
                'Guinea-Bissau':'几内亚比绍',
                'Central African Rep.':'中非共和国',
                'Dem. Rep. Congo':'刚果（金）',
                'Congo':'刚果',
                'S. Sudan':'南苏丹',
                'Lao PDR':'老挝',
                'Solomon Is.':'所罗门群岛',
                'Mauritius':'毛里求斯',
                'Comoros':'科摩罗',
                'Falkland Is.':'福克兰群岛'
              },
              itemStyle: {
                emphasis: {
                  areaColor: '#0F8C79',
                  borderColor: '#ffffff',
                  borderWidth: 1
                }
              }
            }],
          });
        }
      }
    }
</script>

<style scoped>

</style>
