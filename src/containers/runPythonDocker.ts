// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(/'/g, `'\\"'`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"'`)}' | python3 test.py`;
  //   const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
  //     'python3',
  //     '-c',
  //     code,
  //     'stty -echo',
  //   ]);

  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    '/bin/sh',
    '-c',
    runCommand,
  ]);

  await pythonDockerContainer.start();
  const loggerStream = await pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    timestamps: false,
    follow: true, //whether the logs are streamed or returned as a string
  });

  // Attach events on the stream objects to start and stop reading
  loggerStream.on('data', (chunk) => {
    rawLogBuffer.push(chunk);
  });

  await new Promise((res) => {
    loggerStream.on('end', () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      console.log(decodedStream.stdout);
      res(decodeDockerStream);
    });
  });

  // remove the container when done with it.
  await pythonDockerContainer.remove();

  return pythonDockerContainer;
}

export default runPython;
