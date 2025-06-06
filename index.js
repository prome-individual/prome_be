const app = require('./app');
const config = require('./src/config/config');

app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}`);
});