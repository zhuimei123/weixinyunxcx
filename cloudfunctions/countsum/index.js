



const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数 
  const countResult = await db.collection('mingxi').count()
  const total = countResult.total
  // 计算需分几次取 
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组 
  const tasks = []

  for (let i = 0; i < batchTimes; i++) {

    const promise = db.collection('mingxi').where({ 'chewei': event.a }).field({ 'sl': true }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)

  }
  // 等待所有 
  mydata = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),

    }
  })
  mydata = mydata.data
  sum = parseFloat(mydata[0].sl)
  for (let j = 1; j < mydata.length; j++) { sum = sum + parseFloat(mydata[j].sl) }
  return Math.floor(sum)
  //return Math.floor(mydata.reduce((total, item) => total + parseFloat(item.je)))
}