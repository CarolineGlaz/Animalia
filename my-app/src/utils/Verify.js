
const Verify = {
  convertToPositiveNumber(value) {
    let number = isNaN(value) ?
      value.replace(/\D/g, '')
      : value
    return number < 0 ? '0' : number
  }
}

export default Verify