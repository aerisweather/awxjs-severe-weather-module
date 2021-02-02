Aeris JS SDK - Map Module Starter
===========================

Starting with version 1.3.0 of the [Aeris Javascript SDK](https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/), you can now create and add [map source modules](https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/map-modules/) to easily include custom data sources and layers to your [InteractiveMapApp](https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/interactive-map-app/) instances. 

This feature allows you to bundle the code associated with either a single map source or group of map sources into independent containers. Then you can add them to your interactive map applications or share them with other users to add to their map applications as well.

## Setup

Before getting started, you'll need to setup your module project: 

1. Run the included setup script by running the following command from the root of the project's directory:

	```bash
	sh setup.sh
	```
	
	This script will prompt you for information about your module project and setup the project's files with the necessary information. This will also run `yarn install` to install the required dependencies.

1. Add any other dependencies your module project may require using `yarn add` or `npm install`.
1. If you didn't provide your Aeris account keys during setup, you will need to add your Aeris account access keys to the project environment file at `/.env` to use while developing and testing locally:

	```
	# Account ID and secret for interacting with the Aeris API
   AERIS_CLIENT_ID=
   AERIS_CLIENT_SECRET=
	```
	
	Note that this environment file containing your Aeris access keys will **not** be included with your package or Git repository if you choose to publish an NPM module.

## Develop

### Startup the dev server

Then to make developing and testing easier, we've setup the module starter project to use [Webpack's dev server](https://webpack.js.org/configuration/dev-server/). Just run the following to start the dev server:

```bash
yarn dev-server
```
	
This will launch two new browser windows -- one containing output from Webpack's [Bundle Analyzer plugin](https://github.com/webpack-contrib/webpack-bundle-analyzer) to give you an overview of file and dependency sizes, and another that renders a full-screen [InteractiveMapApp](https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/) instance from the Aeris JS SDK. You can customize the map configuration and output by editing the `/dist/template.html` file within the project, which is what is displayed alongside your local development and testing.

### Create your module class

This starter project is setup to use [Typescript](http://typescriptlang.org), but you can also develop your module using regular Javascript syntax. Just rename `src/index.ts` to `src/index.js` to switch to Javascript instead.

Your module's class is defined within the `/src/[MODULE_NAME].ts` file, where `MODULE_NAME` is the name you gave your module's class when setting up. So open this in your [favorite code editor](https://code.visualstudio.com) and begin building your module. This file already contains a subclass of `MapSourceModule` for you to start from, which is the base class all map modules must extend. You just need to add your module's customization and functionality using the available methods in the class. [Read more about setting up modules]() and customizing their integration into an `InteractiveMapApp` instance.

If you opted for created a module group as well during setup, a `/src/[GROUP_NAME].ts` file was also created for you which has already been set up to handle your module instance.

As you make changes to your project's code and files, the running dev server will automatically update with the latest changes in real-time.

## Build + Publish

Once you've completed building and testing your map module, you may either integrate it into your other projects as a local NPM module or release it as a public module so other users of our Aeris JS SDK can use it. 

If you wish to make your module publicly available, we recommend offering both a pre-compiled Javascript file users can include on their web pages and publishing a public NPM module users can install as a dependency in their own Javascript projects. These are the same methods we offer with our own [Aeris Javascript SDK](https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/getting-started/#script-usage-vs-npm-module).

Running the following command from the root of the project directory will build your module for both NPM and precompiled distribution methods as described below. The compiled result will be located in the `/dist` directory:

```bash
yarn build
```

### Publishing an NPM module

Publishing your map module to NPM as a public package allows other users to install and integrate your module into their own map applications. To publish your map module to NPM, [review the NPM guides on contributing](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) to the NPM registry.

Once your package is ready to be published, just run:

```bash
yarn publish
```
	
This will build and upload your package and make it available in the NPM registry. Also be aware of [semantic versioning guidelines](https://docs.npmjs.com/about-semantic-versioning) when updating an NPM package that was previously published.

### Publishing precompiled Javascript

Offering a precompiled Javascript file allows other users to more easily and quickly integrate your map module into their own map applications without requiring additional build steps or dependencies.

Our map module starter project already has [Webpack](http://webpack.js.org) and [Babel](http://babeljs.io) configured to build and compile your map module to a single Javascript file. The build process is configured to transpile the project's code to ES6 using Babel. However, you can customize your build further by modifying the Webpack and/or Babel configuration files.

When you're ready to compile your module, just run:

```bash
yarn build:prod
```

Alternatively, if you want a non-minified version of your compiled module for debugging purposes, you can just run:

```bash
yarn build:dev
```
	
Either of these commands will compile and output the distribution files in the `/dist` directory of the projecct.

To make your compiled map module available to other users, provide them with the `/dist/[name].min.js` file that they can just include in their map application. You can also upload this file to a remote server for them to access is you prefer to host the file for them.

### Documenting your module

If you're making your map module publicly available for others to you, you'll also want to include usage documentation depending on the features and functionality your module provides. 

To document your module, update this README file with basic usage documentation. Alternatively, include additional usage files under the `/docs` directory under the project. This directory will also get published with your NPM package if you choose to publish your project as well.

## Support

Feel free to [submit a new ticket](http://helpdesk.aerisweather.com/) with any questions, bug reports or feature suggestions you have. You can also reach out to us on Twitter at [@AerisWeather](https://twitter.com/AerisWeather).
