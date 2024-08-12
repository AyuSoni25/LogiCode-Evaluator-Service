import submissionQueue from '../queues/submissionQueue';

export default async function (name: string, payload: Record<string, unknown>) {
  await submissionQueue.add(name, payload);
}
