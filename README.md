# Bagplots

An initial push to get a reusable and easily implemented pattern for bagplots with D3.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

These setup steps assume you are working on a Mac. The same general things will need to be done for working on a PC, however, many of the specific tools and methods will be different.

#### Git

You should have git installed. The simplest way to install git on a Mac is to download Xcode Command Line Tools from the app store.

#### Node

[Node](https://nodejs.org/en/) is a Javascript runtime that will be used for many local environment tasks. There are multiple ways to install Node. I would recommend first installing [nvm (Node Version Manager)](https://github.com/creationix/nvm) and using that to manage your version of Node. If you end up working on multiple different web projects locally, it's likely you may end up being dependent on different versions of Node for different projects and this makes it much easier. Alternatively, you can just install from the Node website above.

For nvm, follow the instructions [here](https://github.com/creationix/nvm#installation). You should just be able to open your terminal and use the cURL command provided. This will clone the nvm repo and add it to your path automatically.

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

After installation, confirm installation was successful. `command -v nvm`

### Installing

After making sure you have git and nvm installed, setting up the project should be straightforward.

Clone the repo to your local machine.

```
cd my/desired/directory
git clone https://github.com/anthonysimone/bagplots.git
```

If you have installed nvm to manage your versions of Node, you'll need to switch to the version of Node used by this project. This command should be run from within the project root directory.

```
nvm use
```

If you do not have that version of Node installed yet (which you won't if this is your first time using nvm), you'll need to install that version of Node with nvm. The command will be provided in the terminal message, but it will be as follows. This will install and switch to this version of Node.

```
nvm install 8.11.4
```

[Gulp](https://gulpjs.com/) is a task runner we're currently using locally. We need to install `gulp-cli` globally. The following command installs it within the context of your currently active version of Node.

```
npm install gulp-cli -g
```

Check that everything was installed correctly with `gulp -v`.

Install all of our package dependencies with npm.

```
npm install
```

Everything should be installed and ready to go! Now you can run the local server with Browser Sync.

```
gulp bsync
```

## Deployment

The `gh-pages` branch is deployed directly to [http://anthonysimone.github.io/bagplots](http://anthonysimone.github.io/bagplots). Changes pushed to `master` will only be reflected once they are merged into the `gh-pages` branch and pushed.
