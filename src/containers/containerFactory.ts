import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]) {
  const docker = new Docker();
  const container = await docker.createContainer({
    Image: imageName,
    Cmd: cmdExecutable,
    AttachStdin: true, // to enable input streams
    AttachStdout: true, // to enable output streams
    AttachStderr: true, // to enable error streams
    Tty: false,
    HostConfig: {
      Memory: 1024 * 1024 * 512, // to prevent fork bom, max value we can give is 1 GB
    },
    OpenStdin: true, // keep the input stream open even when no interaction is there
  });

  return container;
}

export default createContainer;
