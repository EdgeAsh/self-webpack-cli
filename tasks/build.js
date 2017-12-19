/*
// fake code, core code
	rm('-rf', assetsPath)
	mkdir(assetsPath)

	renderConf.entry  //core

	var compiler = webpack(renderConf)

	compiler.watch({},(err,status));
*/

require('shelljs/global')
 
const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const { resolve } = require('path')

const r = url => resolve(process.cwd(), url)

const webpackConf = require('./webpack.conf')
const config = require(r('./mina-config'))
const assetsPath = r('./dist')

rm('-rf', assetsPath)
mkdir(assetsPath)

var renderConf = webpackConf
/*
* 遍历入口文件
* 函数库lodash.reduce是对数组reduce方法的优化。
* 第一个参数是要操作的数组对象，其他参数都忘后挪了一位顺序不变
* 第二个参数是函数，该函数可以有四个参数function(
*		 accumulator,  // 上次操作返回的结果
*    currentValue, // 当前数组元素
*    currentIndex, // 当前数组索引
*    array				 // 被操作的数组
*  )
*
* 本例中，reduce函数返回一个对象。对象的每个属性就是一个入口文件
*/
var entry = () => _.reduce(config.json.pages, (en,i) => {
	en[i] = resolve(process.cwd(),'./',`${i}.mina`)
	return en;
}, {})

// input 
renderConf.entry = entry()
renderConf.entry.app = config.app

// output
renderConf.output = {
	path: r('./dist'),
	filename: '[name].js'
}

var compiler = webpack(renderConf)

fs.writeFileSync(r('./dist/app.json'),JSON.stringify(config.json),'utf8')


// 监听状态
compiler.watch({
	aggregateTimeout: 300,
	poll: true
},(err, stats) => {
	process.stdout.write(stats.toString({
		color: true,
		modules: false,
		children: true,
		chunks: true,
		chunkModules: true
	}) + '\n\n')
})


