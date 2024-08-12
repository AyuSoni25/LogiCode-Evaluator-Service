import bodyParser from 'body-parser';
import express from 'express';

import bullBoardAdapter from './config/bullBoardConfig';
import serverConfig from './config/serverConfig';
import sampleQueueProducer from './producers/sampleQueueProducer';
import submissionQueueProducer from './producers/submissionQueueProducer';
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

  sampleQueueProducer('SampleJob', {
    name: 'Ayushi',
    company: 'Microsoft',
    position: 'SDE2 L61',
    location: 'Remote | BLR | Noida',
  });

  const code = `
  #include<iostream>
  using namespace std;

  int main(){
    int a, b;
    cin>>a>>b;
    cout<<"The sum of a and b is : "<<a+b;
    return 0;
  }
  `;

  const inputCase = `10 20`;

  submissionWorker(SUBMISSION_QUEUE);

  submissionQueueProducer('SubmissionJob', {
    '1234': {
      language: 'CPP',
      inputCase,
      code,
    },
  });
});
