# Node.js Fundamentals

## What is Node.js?

Node.js is a Javascript runtime that allows JavaScript to run outside the browser. Instead of being used on the frontend like React, it is used on the backend. With Node, you can build servers, API's, command-line tools, and work with files and databases.

## How does Node.js differ from running JavaScript in the browser?

Node.js differs from running in JavaScript in the browser because in the browser, you can work with objects such as document, window and the DOM, which are used to interact with web pages. However, with Node.js, those browser objects are not available. Node.js can work with files, operating systems, servers and databases.

## What is the V8 engine, and how does Node use it?

The v8 engine is a program that reads Javascript, turns it into instructions that the computer can run. V8 is a high powered Google engine built for Chrome, but is used outside the browser and run backend capabilities. The same engine that runs Google Chrome runs Node.

## What are some key use cases for Node.js?

Some key use cases for Node.js includes building APIs, creating command-line tools that automate tasks, and building real time apps such as chat applications.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

CommonJS and ES Modules are both ways to share code between JavaScript files. React uses import and export, which is ES Modules, while Node.js uses require() and module.exports which is CommonJS.

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
import Header from "./Header.js";
// Exports code with export
export default Header;
```
