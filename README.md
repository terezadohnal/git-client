# Gitee app

My bachelor thesis repository where I create desktop GUI for Git focused on graph visualization.

## Description

Application allows you to do basic Git operation: commit, push, pull, checkout, merge, clone, branch. It also allows you to visualize your git graph and see how your commits are connected. You can also see the difference between two commits and see the changes in your code.

To see all keyboard shortcuts available please check out upper submenu called **Repository**.

## Installation

Use [npm](https://www.npmjs.com/) to install dependecies

`npm install --legacy-peer-deps`

## Run application

Run application with:

`npm start`

## Test application

To run tests please run:

`npm test`

To clean up screenshots after tests run:

`npm test -- -u`

## Package application

To package application run:

`npm run package`

When packaging application for specific platform choose between: `--mac | --linux | --win`

**Example**: `npm run package -- --mac`
