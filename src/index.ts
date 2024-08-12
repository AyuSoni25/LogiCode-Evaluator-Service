import bodyParser from 'body-parser';
import express from 'express';

import bullBoardAdapter from './config/bullBoardConfig';
import serverConfig from './config/serverConfig';
import runPython from './containers/runPythonDocker';
import sampleQueueProducer from './producers/sampleQueueProducer';
import apiRouter from './routes';
import sampleWorker from './workers/sampleWorker';

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *: ${serverConfig.PORT}`);
  console.log(
    `BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`
  );

  sampleWorker('SampleQueue');

  sampleQueueProducer('SampleJob', {
    name: 'Ayushi',
    company: 'Microsoft',
    position: 'SDE2 L61',
    location: 'Remote | BLR | Noida',
  });

  const code = `x = input();
y = input();
print("value of x is ", x);
print("value of y is ", y);`;

  const inputCase = `100
200`;
  runPython(code, inputCase);
});
