
const Format = {

  formatStringForURL(str) {
    let formattedStr = str.toLowerCase();
    formattedStr = formattedStr.replace(/\s+/g, '-');
    formattedStr = formattedStr.replace(/[^a-z0-9-_]/g, '');
    formattedStr = formattedStr.replace(/-{2,}/g, '-');

    return formattedStr;
  }
}

export default Format