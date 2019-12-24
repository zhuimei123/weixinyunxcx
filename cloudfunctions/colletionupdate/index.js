// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('army').where({ 'mingci': _.gte(parseInt(event.m)) })
      .update({
        data: {
          mingci: _.inc(parseInt(event.n))
        },
      })
  } catch (e) {
    console.error(e)
  }
}