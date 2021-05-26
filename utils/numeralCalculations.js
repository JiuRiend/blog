/**
 * 解决百分比的和不等于1的问题
 * @param { Array<Number> } arr 一组数据
 * @param { Boolean } needSign 返回值是否添加%
 * @param { Number } decimalCount 精度：最多保留多少位小数
 * @returns { Array<Number|String> }
 */
 export const calcPercentage = (arr = [], needSign = true, decimalCount = 4) => {
  const sum = arr.reduce((a, b) => a + b, 0)
  const D = decimalCount < 2 ? 2 : decimalCount
  // E1, E2将小数转化成整数，解决因精度导致小数计算错误的问题
  const E1 = Math.pow(10, D)
  const E2 = Math.pow(10, D + 2)
  if (sum === 0) {
    return arr.map(_ => needSign ? '0%' : 0)
  }
  const perArr = arr.map((e, i) => ({
    index: i,
    percentage: Math.round((e / sum).toFixed(D) * E1)
  }))
  const all = perArr.reduce((a, b) => a + b.percentage, 0)
  // 比较计算出的百分比总和和实际总和
  if (all > E1) {
    // 根据误差大小排序
    perArr.sort((a, b) => {
      const aCur = a.percentage * Math.pow(10, 2)
      const aReal = Number((arr[a.index] / sum).toFixed(D + 2)) * E2
      const bCur = b.percentage * Math.pow(10, 2)
      const bReal = Number((arr[b.index] / sum).toFixed(D + 2)) * E2
      const aError = aCur - aReal
      const bError = bCur - bReal
      return bError - aError < 0 ? -1 : bError - aError > 0 ? 1 : a.index - b.index // 根据误差排序，如果误差一样，索引小的在前面
    })
    let sumError = all - E1; let i = 0
    // 百分比总和多的部分，从误差大的百分比依次扣除
    while (sumError) {
      perArr[i].percentage = perArr[i].percentage - 1
      sumError--
      i++
    }
  }
  if (all < E1) {
    // 根据误差大小排序
    perArr.sort((a, b) => {
      const aCur = a.percentage * Math.pow(10, 2)
      const aReal = Number((arr[a.index] / sum).toFixed(decimalCount + 2)) * E2
      const bCur = b.percentage * Math.pow(10, 2)
      const bReal = Number((arr[b.index] / sum).toFixed(decimalCount + 2)) * E2
      const aError = aCur - aReal
      const bError = bCur - bReal
      return aError - bError < 0 ? -1 : aError - bError > 0 ? 1 : a.index - b.index
    })
    let sumError = all - E1; let i = 0
    // 百分比总和少的部分，从误差大的百分比依次补上
    while (sumError) {
      perArr[i].percentage = perArr[i].percentage + 1
      sumError++
      i++
    }
  }
  return perArr.sort((a, b) => a.index - b.index).map(e => needSign ? (e.percentage / Math.pow(10, D - 2)).toFixed(D - 2) + '%' : e.percentage / E1)
}
