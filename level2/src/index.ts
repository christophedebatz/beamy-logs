import express from 'express';
import bodyParser from 'body-parser'
import LogController from './LogController'
import LogRequestMapper from './Mapping/LogRequestMapper'
import { Log } from './Log'
import LogQueueService from './Queue/LogQueueService'

const port = process.env.PORT;
const app: express.Express = express();
app.use(bodyParser.json())

// creates dependencies chain
const logController = new LogController(
  new LogRequestMapper(),
  new LogQueueService<Log>()
);

app.post('/', logController.queueLog);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
