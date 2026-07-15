# Node.js Fundamentals

## What is Node.js?

Node.js is an enviornment that allows Javascript to work outside the browser. Instead of being used on the Frontend like React, it is used on the backend. With Node, you can work with things such as servers.

## How does Node.js differ from running JavaScript in the browser?

Node.js differs from running in JavaScript in the browser because in the browser, you can work with things such as documents, windows and button, which would be frontend. However, with Node you can work with files, operating systems, servers and databases.

## What is the V8 engine, and how does Node use it?

The v8 engine is a program that reads Javascript, turns it into instructions that the computer can run. V8 is a high powered Google engine built for Chrome, but it was taken out of the browser for Node to run extra abilities. The same engine that runs Google Chrome runs Node.

## What are some key use cases for Node.js?

Some key use cases for Node.js are API's which allows Node to create API's, command-line which is ran in the terminal to automate tasks and Real time apps that push updates instantly with things such as chat.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

CommonJS and ES Modules are both ways to import and export code between JavaScript files. React uses import and export, while this Node.js course uses require() and module.exports.

**CommonJS (default in Node.js):**

```js
// Imports code with require()
const Header = require("./Header");
//Exports code with module.exports
module.exports = Header;
```

**ES Modules (supported in modern Node.js):**

```js
//Imports code with import
import Header from "./Header";
// Exports code with export
export default Header;
```
