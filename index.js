const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const STR_REGEXP = /([+-]?)(?:([^+x-]+)?(?:x(?:\^([\d\/]+))?)|([^+x-]\s))/gi

const objExpression = (exp, sign) => {
	const exprRegx = /[^*/]+|[*/]/g
	const expression = exp.replace(' ', '')
	let resultObj = {}
		
	let arrExp = expression.match(exprRegx)

	//Example of EPIC GOVNOCODE
	if (arrExp.length === 3){
		const findX = arrExp.find((it) => it.indexOf("X") !== -1 )
		resultObj.coeficient = findX === arrExp[2] ? Number(arrExp[0]) : Number(arrExp[2])
		resultObj.coeficient = sign ? resultObj.coeficient * -1 : resultObj.coeficient
		const arrFindPow = findX.split("X")
		resultObj.coeficient = (arrFindPow[0] === "" || arrFindPow[0] === "+" || arrFindPow[0] === "-" || arrFindPow[0] === " ") ?
		(arrFindPow[0] === "-" ? resultObj.coeficient * -1 : resultObj.coeficient) : resultObj.coeficient * Number(arrFindPow[0])
		const findPow = arrFindPow[arrFindPow.length - 1].split("^")
		resultObj.power = findPow[findPow.length - 1] !== "" ? Number(findPow[findPow.length - 1]) : 1
	} else if (arrExp.length === 1){
		const findX = arrExp[0].split("X")
		if (findX.length === 2){
			resultObj.coeficient = (findX[0] === "" || findX[0] === "+" || findX[0] === "-") ?
				findX[0] === "-" ? -1 : 1
				: Number(findX[0])
			resultObj.coeficient = sign ? resultObj.coeficient * -1 : resultObj.coeficient
			if (findX[findX.length - 1] === "")
				resultObj.power = 1
			else {
				const findPow = findX[findX.length - 1].split("^")
				resultObj.power = findPow[findPow.length - 1] !== "" ? Number(findPow[findPow.length - 1]) : 1
			}
		} else {
			resultObj.coeficient = sign ? Number(findX[0]) * -1 : Number(findX[0])
			resultObj.power = 0
		}
	}
	if (resultObj.power > 2){
		resultObj.coeficient = "Error"
		return resultObj
	}
	return resultObj
}

const shortExpressions = (expArr) => {
	let powers = [0, 0, 0]
	expArr.forEach((item, index, arr) => {
		powers[0] = item.power === 0 ? powers[0] + item.coeficient : powers[0]
		powers[1] = item.power === 1 ? powers[1] + item.coeficient : powers[1]
		powers[2] = item.power === 2 ? powers[2] + item.coeficient : powers[2]
	})
	const result = {
		arr: [powers[0], powers[1], powers[2]],
		maxPow: 0
	}
	let shortStr = ""
	for (let index = 0; index < 3; index++) {
		if (powers[index] !== 0){
			result.maxPow = result.maxPow > index ? result.maxPow : index
			let sign = powers[index] > 0 ? shortStr === "" ? "" : "+" : "-"
			powers[index] = powers[index] < 0 ? powers[index] * -1 : powers[index]
			shortStr += `${sign} ${powers[index]} * X^${index} `
		}
	}
	if ( powers[0] === 0 && powers[1] === 0 && powers[2] === 0)
		shortStr += "0 * X^0 "
	console.log('\x1b[36m%s\x1b[0m', `Reduced form:  ${shortStr}= 0`, "\x1b[37m")
	return result
}

const solveExpression = (exp = {}) => {
	if (exp.maxPow === 0) {
		console.log("\x1b[33m", 'The maximum degree is 0', "\x1b[37m")
		if (exp.arr[0] === 0) {
			console.log("\x1b[32m", 'Every decision is right', "\x1b[37m")
		} else {
			console.log("\x1b[31m", "There is no solutions", "\x1b[37m")
		}
	} else if (exp.maxPow === 1) {
		console.log('Polynomial degree: 1')
		const result = -exp.arr[0] / exp.arr[1]
		console.log('\x1b[32m', 'The solution is: ', result.toFixed(4), "\x1b[37m")
	} else if (exp.maxPow === 2) {
		console.log('Polynomial degree: 2')
		const a = exp.arr[2]
		const b = exp.arr[1]
		const c = exp.arr[0]
		const descr = Math.pow(b, 2) - 4 * a * c
		console.log("\x1b[33m", `Discriminant equation: ${b}^2 - 4 * ${a} * ${c}`, "\x1b[37m")
		console.log("\x1b[33m", 'The discriminant is ', descr, "\x1b[37m")
		if (descr > 0) {
			console.log("\x1b[35m", 'Discriminant is strictly positive, the two solutions are: ', "\x1b[37m")
			const x1 = (-b + Math.sqrt(descr)) / (2 * a)
			console.log("\x1b[33m", `X1 equation: (-${b} + √${descr}) / 2 * ${a}`, "\x1b[37m")
			const x2 = (-b - Math.sqrt(descr)) / (2 * a)
			console.log("\x1b[33m", `X2 equation: (-${b} - √${descr}) / 2 * ${a}`, "\x1b[37m")
			console.log('\x1b[32m', 'X1: ', x1.toFixed(4))
			console.log('\x1b[32m', 'X2: ', x2.toFixed(4), "\x1b[37m")
		} else if (descr === 0) {
			const x = -b / 2 * a
			console.log("\x1b[33m", `X equation: -${b} / 2 * ${a}`, "\x1b[37m")
			console.log("\x1b[35m", 'Discriminant is equals to zero, the only solutions is: ', x.toFixed(4), "\x1b[37m")
		} else if (descr < 0) {
			console.log("\x1b[35m", 'Discriminant is negative, complex solution is: ')
			console.log(`${-b} ± i√(${Math.sqrt(Math.abs(descr)).toFixed(4)}) / ${2 * a}`, "\x1b[37m")
		}
	}
}

const answerFunc = (answer) => {
	const answerUp = answer.toUpperCase()
	const parts = answerUp.split('=')
	const rightPart = parts[1].match(STR_REGEXP)
	const leftPart = parts[0].match(STR_REGEXP)
	const expressionsArray = []

	for (let i = 0; i < leftPart.length; i++) {
		expressionsArray.push(objExpression(leftPart[i]))
	}
	if (rightPart) {
		for (let j = 0; j < rightPart.length; j++) {
			expressionsArray.push(objExpression(rightPart[j], true))
		}
	}
	let degree = false
	expressionsArray.forEach((item) => {
		if (item.coeficient === "Error"){
			degree = item.power
		}
	})
	if(degree){
		console.log("\x1b[31m", `Polynomial degree: ${degree}`)
		console.log('The polynomial degree is stricly greater than 2, I can\'t solve.')
		rl.close()
		return false
	}
	const shortObj = shortExpressions(expressionsArray)
	solveExpression(shortObj)
	rl.question('Enter your polynomial: ', (answer) => answerFunc(answer));
}

rl.question('Enter your polynomial: ', (answer) => answerFunc(answer));