// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<ExecutionResponse> {
    console.log(outputTestCase);
    const rawLogBuffer: Buffer[] = [];

    await pullImage(PYTHON_IMAGE);

    console.log('Initialising a new python docker container');
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);

    // starting / booting the corresponding docker container
    await pythonDockerContainer.start();

    console.log('Started the docker container');

    const loggerStream = await pythonDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streamed or returned as a string
    });

    // Attach events on the stream objects to start and stop reading
    loggerStream.on('data', (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try {
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawLogBuffer
      );
      if (codeResponse.trim() === outputTestCase.trim()) {
        return { output: codeResponse, status: 'SUCCESS' };
      } else {
        return { output: codeResponse, status: 'WA' };
      }
    } catch (error) {
      if (error === 'TLE') {
        await pythonDockerContainer.kill();
      }
      return { output: error as string, status: 'ERROR' };
    } finally {
      await pythonDockerContainer.remove();
    }
  }

  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[]
  ): Promise<string> {
    // TODO: May be moved to the docker helper util
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        console.log('Timeout Called');
        rej('TLE');
      }, 2000); // We should take the Time limit in this method for each language and then put it here
      // the problem setter should define the time limit while setting the problem itself

      loggerStream.on('end', () => {
        clearTimeout(timeout);
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        console.log(decodedStream.stdout);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default PythonExecutor;
