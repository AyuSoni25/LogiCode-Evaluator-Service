import bodyParser from 'body-parser';
import express from 'express';

import bullBoardAdapter from './config/bullBoardConfig';
import serverConfig from './config/serverConfig';
import apiRouter from './routes';
import { SUBMISSION_QUEUE } from './utils/constants';
import sampleWorker from './workers/sampleWorker';
import submissionWorker from './workers/submissionWorker';

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
  submissionWorker(SUBMISSION_QUEUE);
  // sampleQueueProducer('SampleJob', {
  //   name: 'Ayushi',
  //   company: 'Microsoft',
  //   position: 'SDE2 L61',
  //   location: 'Remote | BLR | Noida',
  // });
});
