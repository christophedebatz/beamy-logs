import express from 'express';
import bodyParser from 'body-parser'
import LogController from './LogController.js'
import LogRequestMapper from './Mapping/LogRequestMapper.js'
import LogWriterService from './Writing/LogWriterService.js'

const app: express.Express = express();
app.use(bodyParser.json())
const port = process.env.PORT;

// creates dependencies chain
const logController = new LogController(
  new LogRequestMapper(),
  new LogWriterService(),
);

app.post('/', logController.saveLog);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
