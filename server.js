import express from 'express';
import bodyParser from 'body-parser';
import databases from './database/connect';
import apiRoutes from './routes';
import config from './config/config';

const app = express(); 

databases.connectToDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('',(req, res, next) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader('Access-Control-Allow-Headers', 'x-access-token, X-Requested-With,content-type, Authorization, Access-Control-Request-Headers');

	if ('OPTIONS' == req.method) return res.json({ success: false, data: {}, message: `Method not allowed.`});
	else next();
});

app.use('/api', apiRoutes(express));

app.get('*', (req, res) => {
    res.json({ success: true, data: {}, message: "Weather APP"});
});

app.listen(config.port);
console.log(`Server started: ${config.port}`);