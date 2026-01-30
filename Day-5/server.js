require('dotenv').config();
const connectToDb = require('./src/config/Database');
const app = require('./src/app');


connectToDb();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
