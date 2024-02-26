const dayjs = require(`dayjs`);
const localizedFormat = require(`dayjs/plugin/localizedFormat`);
const utc = require(`dayjs/plugin/utc`);

dayjs.extend(localizedFormat);
dayjs().format();
dayjs.extend(utc);

module.exports = dayjs;
