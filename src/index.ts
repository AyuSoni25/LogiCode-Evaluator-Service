import express from 'express';

import serverConfig from './config/serverConfig';
import sampleQueueProducer from './producers/sampleQueueProducer';
import apiRouter from './routes';
import sampleWorker from './workers/sampleWorker';

const app = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *: ${serverConfig.PORT}`);

  sampleWorker('SampleQueue');

  sampleQueueProducer('SampleJob', {
    name: 'Ayushi',
    company: 'Microsoft',
    position: 'SDE2 L61',
    location: 'Remote | BLR | Noida',
  });
});
