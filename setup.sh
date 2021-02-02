#!/usr/bin/env bash

set -e
set -o pipefail
set -u

step() { >&2 echo -e "\033[1m\033[36m* $@\033[0m"; }

DEF_PACKAGE_NAME="aeris-js-sample-module"
DEF_MODULE_NAME="SampleModule"
DEF_VERSION="0.1.0"
DEF_AUTHOR=""
DEF_HOMEPAGE=""
DEF_GROUP_NAME="SampleGroup"
HAS_GROUP="n"

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

step "Setting up a new Aeris JS map module project..."

read -p "Enter a name for your package [${DEF_PACKAGE_NAME}]: " PACKAGE_NAME
read -p "Enter a class name for your module [${DEF_MODULE_NAME}]: "  MODULE_NAME
read -p "Do you want to setup a module group that contains multiple modules (Y/n)? [n]: " HAS_GROUP

if [[ "${HAS_GROUP}" = "Y" || "${HAS_GROUP}" = "y" ]]; then
     read -p "Enter a class name for your module group [${DEF_GROUP_NAME}]: " GROUP_NAME
fi

read -p "Enter the package version [${DEF_VERSION}]: " VERSION
read -p "Enter the author [${DEF_AUTHOR}]: " AUTHOR
read -p "Enter the package homepage [${DEF_HOMEPAGE}]: " HOMEPAGE

read -p "Enter your Aeris account ID []: " AERIS_ID
read -p "Enter your secret key for your Aeris application []: " AERIS_SECRET

PACKAGE_NAME="${PACKAGE_NAME:-$DEF_PACKAGE_NAME}"
MODULE_NAME="${MODULE_NAME:-$DEF_MODULE_NAME}"
GROUP_NAME="${GROUP_NAME:-$DEF_GROUP_NAME}"
VERSION="${VERSION:-$DEF_VERSION}"
AUTHOR="${AUTHOR:-$DEF_AUTHOR}"
HOMEPAGE="${HOMEPAGE:-$DEF_HOMEPAGE}"

MODULE_ID=$(echo ${MODULE_NAME} \
     | sed 's/\(.\)\([A-Z]\)/\1-\2/g' \
     | tr '[:upper:]' '[:lower:]')

GROUP_ID=$(echo ${GROUP_NAME} \
     | sed 's/\(.\)\([A-Z]\)/\1-\2/g' \
     | tr '[:upper:]' '[:lower:]')

step "Creating environment config..."
cat > .env <<EOF
# Account ID and secret for interacting with the Aeris API
AERIS_CLIENT_ID=${AERIS_ID}
AERIS_CLIENT_SECRET=${AERIS_SECRET}
EOF

step "Creating package.json..."
cat > package.json <<EOF
{
  "name": "${PACKAGE_NAME}",
  "moduleName": "${MODULE_NAME}",
  "version": "${VERSION}",
  "main": "index.js",
  "author": "${AUTHOR}",
  "homepage": "${HOMEPAGE}",
  "license": "MIT",
  "scripts": {
    "build:js": "rm -fr dist; tsc --sourceMap false --outDir dist/src; babel --config-file ./babel-nodejs.config.js dist/src --out-dir dist/src",
    "build:dev": "webpack",
    "build:prod": "NODE_ENV='production' webpack -p --env production",
    "build": "yarn build:js; yarn build:prod; rm dist/index.html",
    "publish": "yarn build:js; npm publish",
    "dev-server": "NODE_ENV='development' webpack-dev-server"
  },
  "files": [
    "/dist",
    "/docs",
    "LICENSE",
    "README.md"
  ],
  "devDependencies": {
    "@babel/cli": "^7.8.4",
    "@babel/core": "^7.8.7",
    "@babel/plugin-proposal-class-properties": "^7.5.5",
    "@babel/plugin-proposal-object-rest-spread": "^7.5.5",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@babel/plugin-transform-runtime": "^7.5.5",
    "@babel/preset-env": "^7.8.7",
    "babel-loader": "^8.0.6",
    "babel-plugin-add-module-exports": "^1.0.2",
    "clean-webpack-plugin": "^3.0.0",
    "dotenv": "^8.2.0",
    "html-webpack-harddisk-plugin": "^1.0.1",
    "html-webpack-plugin": "^3.2.0",
    "regenerator-runtime": "^0.13.3",
    "terser-webpack-plugin": "^2.2.1",
    "ts-loader": "^6.2.1",
    "typescript": "^3.8.3",
    "webpack": "^4.42.0",
    "webpack-bundle-analyzer": "^3.6.1",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "@aerisweather/javascript-sdk": "^1.3.0"
  }
}
EOF

mkdir ./src

step "Creating module file at src/${MODULE_NAME}.ts..."
cat > "src/${MODULE_NAME}.ts" <<EOF
import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';

class ${MODULE_NAME} extends MapSourceModule {

	public get id() {
		return '${MODULE_ID}';
	}

	constructor(opts: any = null) {
		super(opts);

		// Perform additional custom setup required by the module.
	}

	source(): any {
		// Setup and return the map content source that's used to load and render your module's
		// data on the map
		// re: https://www.aerisweather.com/docs/js/classes/tilesource.html
		// re: https://www.aerisweather.com/docs/js/classes/vectorsource.html

		return null;
	}

	controls(): any {
		// Setup and return the layer button configuration for this module. If 'null' is returnd,
		// then this module will not include a toggleable control within the map application.
		// re: https://www.aerisweather.com/docs/js/globals.html#buttonoptions

		return {
			value: this.id,
			title: '${MODULE_NAME}'
		};
	}

	legend(): any {
		// Create and return the legend configuration for this module. If 'null' is returned, then
		// a legend will not be rendered when this module's map source is active.
		// re: https://www.aerisweather.com/docs/js/globals.html#legendoptions

		return null;
	}

	infopanel(): any {
		// Create and return the info panel configuration to associate with data loaded and
		// rendered by this module's map source. If a custom info panel view is not needed for this
		// module, just return 'null'.
		// re: https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/interactive-map-app/info-panel/
		// re: https://www.aerisweather.com/docs/js/globals.html#infopanelviewsection

		return null;
	}

	onInit() {
		// Perform custom actions when the module has been initialized with a map application
		// instance.
	}

	onAdd() {
		// Perform custom actions when the module's map source has been added to the map and is
		// active.
	}

	onRemove() {
		// Perform custom actions when the module's map source has been removed from the map and
		// is no longer active.
	}

	onMarkerClick(marker: any, data: any) {
		// Perform custom actions when a marker object associated with the module's map source was
		// clicked on the map. You can use this method to perform additional actions or to display
		// the info panel for the module with the marker's data, e.g.:
		//
		// this.showInfoPanel('Observation', data);
	}

	onShapeClick(shape: any, data: any) {
		// Perform custom actions when a vector shape object associated with the module's map
		// source was clicked on the map. You can use this method to perform additional actions or
		// to display the info panel for the module with the shape's data, e.g.:
		//
		// this.showInfoPanel('Outlook', data);
	}
}

export default ${MODULE_NAME};
EOF

if [[ "${HAS_GROUP}" = "Y" || "${HAS_GROUP}" = "y" ]]; then
step "Creating module group file at src/${GROUP_NAME}.ts..."
cat > "src/${GROUP_NAME}.ts" <<EOF
import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import { IMapSourceModule } from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import ${MODULE_NAME} from './${MODULE_NAME}';

class ${GROUP_NAME} extends ModuleGroup {

     get id() {
          return '${GROUP_ID}';
     }

     async load(): Promise<IMapSourceModule[]> {
          return new Promise((resolve, reject) => {
               this._modules = [new ${MODULE_NAME}()];
               resolve(this._modules);
          });
     }

     controls() {
          return {
               title: '${GROUP_NAME}',
               buttons: this.modules ? this.modules.map((m) => m.controls()) : []
          };
     }
}

export default ${GROUP_NAME};
EOF
cat > src/index.ts <<EOF
import ${GROUP_NAME} from './${GROUP_NAME}';

export { default as ${MODULE_NAME} } from './${MODULE_NAME}';

export default ${GROUP_NAME};
EOF
else
cat > src/index.ts <<EOF
import ${MODULE_NAME} from './${MODULE_NAME}';

export default ${MODULE_NAME};
EOF
fi

mkdir -p ./test
mkdir -p ./public

cat > ./public/template.html <<EOF
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<title>Aeris JS - ${MODULE_NAME} Module</title>

	<style>
	html, body {
		height: 100%;
		margin: 0;
		padding: 0;
		width: 100%;
	}
    #app {
        height: 100%;
        width: 100%;
    }
    </style>

    <script src="https://cdn.aerisapi.com/sdk/js/1.3.0/aerisweather.min.js"></script>
    <link rel="stylesheet" href="https://cdn.aerisapi.com/sdk/js/1.3.0/aerisweather.css">

</head>
<body>

    <div id="app"></div>

<script>
window.addEventListener('load', () => {

    // Update with your Aeris account access keys
    const aeris = new AerisWeather('<%= htmlWebpackPlugin.options.aeris.clientId %>', '<%= htmlWebpackPlugin.options.aeris.clientSecret %>');

    aeris.apps().then((apps) => {
        const app = new apps.InteractiveMapApp('#app', {
            map: {
                map: {
                    zoom: 5
                }
            },
            panels: {
                layers: {
                    buttons: []
                }
            }
        });

        // Add an instance of your module to the map application
        app.modules.add(new ${MODULE_NAME}());

    });

});
</script>

</body>
</html>
EOF

# remove git-related files for this directory
rm -fr .git

yarn install

step "Done setting up your module project!"
read -p "Do you want to startup the development server (y/n)? [y]: " START_DEV_SERVER

if [[ "${START_DEV_SERVER}" = "Y" || "${START_DEV_SERVER}" = "y" ]]; then
    yarn dev-server
fi
