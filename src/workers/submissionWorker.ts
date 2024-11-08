import { Job, Worker } from 'bullmq';

import redisConnection from '../config/redisConfig';
import SubmissionJob from '../jobs/SubmissionJob';

export default function submissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === 'SubmissionJob') {
        const submissionJobInstance = new SubmissionJob(job.data);
        submissionJobInstance.handle(job);
        return true;
      }
    },
    {
      connection: redisConnection,
    }
  );
}
