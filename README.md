## How to setup a Typescript Express project :

```
1. npm --init -y
```

```
2. npm install -D typescript
```

```
3. npx tsc --init
```

```
4. set outDir to './dist' in tsconfig.json file to define the destination for your compiled ts code.
```

```
5. put node_modules in the exclude property of tsconfig.json file. And src folder's ts file in include property of tsconfig.json file. './src/**/*.ts'
```

```
6. Now, when you run npx tsc, then it will create a new folder named dist in your project directory and inside it, there will exist a index.js file, where all the ts compiled code will be present.
```

```
7. Now, to create an express server, we need to install express as usual - npm install express. But this won't work with ts, as ts needs type for express package as well. For any package that we install, we need to install corresponding types package for it in dev env. So, after installing express, we do npm install -D '@types/express' to install all the types used in express package.
```

```
8. Even ts requires types for node as well. When we do const express = require('express), then it shows error on require, that pls install @types/node. So, as of now we are using import express from 'express'.
```

```
9. So, basically it is same as using webpack, it compiles or bundles our code into a file and then that file we can deploy on production.
```

```
10. Uptil now, whatever code we write in our project, we can compile it into js code using npx tsc command and run it. But, as we were using nodemon to keep checking for any new changes and restart the server, we should be able to do that here as well. But, if you try installing nodemon, and run it nodemon dist/index.js, then it won't be able to restart the server on new changes because the new changes are done in ts files and until we do npx tsc, it won't be compiled to js code and won't reflect in dist/index.js file and hence nodemon is not able to track it. So, we need to do something so that everytime the server starts, it should run npx tsc to compile and then run the server. So we define some scripts in package.json file.

{
    "build": "npx tsc",
    "start": "npx nodemon dist/index.js",
}

These are two separate scripts for running the app, and compiling the code. We want the compilation command to run everytime the server is starting. So we need to define another script.

{
    "build": "npx tsc",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
}

Command defined in prestart will run before the start script runs everytime. So, now we are sure that everytime, we run the app, we do not need to explicitly compile the app, it can be triggered with npm start now. But, the nodemon problem to be able to track changes in compiled code is still there. So, to make nodemon track the compiled code changes, we need to define another script.

{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
}

This command will now keep on checking for any changes in the compiled code. But, we need to run the watch script and start script simultaneuosly so that everytime a change is made, the server can be re-compiled and restarted. To run some scripts simultaneously, we use concurrently npm package. So, do npm i concurrently first. And the define a new script.

{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""
}

Here --kill-others is a flag, to define if one script fails, then kill other scripts as well.
So, now we will just do npm run dev to run the server.
```

```
11. Though I have already setup eslint and prettier in my react project with alnylum, but this time I read the official docs for both and then implemented it. This time it was more understood and more sleek implementation. And, note that we do not need to install prettier and eslint plugins for the integration, this integration if for making sure that everyone who is contributing the code can be bound to use these. That is why these are integrated in code, rather than telling everyone to setup in vs code. And, we had different scripts for prettier and eslint in our react code at alnylum, but this time, we just did it with one script and that was prebuild. We defined the script : npx eslint . --fix in prebuild script so that everytime the code gets built, it will fix all the linting issues and prettier issues first. And in prestart script we have defined to build the project, which means everytime we will run the project, it will first resolve the linting and prettier issues and then build the app to compile the ts code into js code and then run that js code. Also, we defined a script dev, to run the app while development, so that, whenever we make any change in our code, it can automatically track it and can restart the app. For this script, we use concurrently package to run the nodemon and start process simultaneously. And we have used simple-import-sort package to sort the import statements in our file and have integrated it with eslint.
```

