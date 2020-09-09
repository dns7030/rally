const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
 
  return [year,month, day].map(formatNumber).join('-')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
const formatShortDate = date => {
  const shortDate = date.toDateString().split(" ")
  return {
    "date": `${shortDate[0]} ${shortDate[1]} ${shortDate[2]}`,
    "time": `${formatNumber (date.getHours())} : ${formatNumber(date.getMinutes())}`
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  formatShortDate: formatShortDate
}
