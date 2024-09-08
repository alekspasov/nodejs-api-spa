require('dotenv').config();

const MONGODB_URI = process.env["MONGOOSE_CONNECT_STRING"];


module.exports = MONGODB_URI;