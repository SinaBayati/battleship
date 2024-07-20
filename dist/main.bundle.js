/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/DOM.js":
/*!************************!*\
  !*** ./modules/DOM.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeGameboard: () => (/* binding */ initializeGameboard),
/* harmony export */   renderGameboard: () => (/* binding */ renderGameboard),
/* harmony export */   updateGameboard: () => (/* binding */ updateGameboard)
/* harmony export */ });
function renderGameboard(selector) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const tile = generateTile();
      tile.dataset.coords = `${j},${i}`;
      const gameboard = document.querySelector(selector);
      gameboard.append(tile);
    }
  }
}
function updateGameboard(gameboardObj, selector) {
  gameboardObj.shots.forEach(shot => {
    const shotStr = `${shot.x},${shot.y}`;
    const tiles = Array.from(document.querySelector(selector).querySelectorAll(`${selector} > div`));
    tiles.forEach(t => {
      if (t.dataset.coords == shotStr) {
        if (shot.hit) t.dataset.state = "hit";
        if (!shot.hit) t.dataset.state = "marked";
      }
    });
  });
}
function initializeGameboard(gameboard, selector) {
  const ships = gameboard.ships;
  ships.forEach(ship => {
    const coordsArray = ship.coords;
    coordsArray.forEach(c => {
      const coordStr = `${c[0]},${c[1]}`;
      const tiles = document.querySelector(selector).querySelectorAll(`${selector} > div`);
      tiles.forEach(t => {
        if (t.dataset.coords == coordStr) {
          t.dataset.state = "ship";
        }
      });
    });
  });
}
function generateTile() {
  const tile = document.createElement("div");
  tile.dataset.state = "empty";
  return tile;
}

/***/ }),

/***/ "./modules/computerAttack.js":
/*!***********************************!*\
  !*** ./modules/computerAttack.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerAttack: () => (/* binding */ computerAttack)
/* harmony export */ });
function computerAttack(player) {
  while (true) {
    const randomCoord = getRandomCoord();
    if (isValidShot(randomCoord, player)) {
      player.gameboard.receiveAttack(randomCoord);
      break;
    }
  }
}
function isValidShot(shotCoord, player) {
  const shotsArray = player.gameboard.shots;
  return shotsArray.every(shot => {
    if (shot.x !== shotCoord[0] && shot.y !== shotCoord[1]) {
      return true;
    }
    return false;
  });
}
function getRandomCoord() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return [x, y];
}

/***/ }),

/***/ "./modules/gameboard.js":
/*!******************************!*\
  !*** ./modules/gameboard.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gameboard: () => (/* binding */ gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./modules/ship.js");

function gameboard() {
  const shots = [];
  const ships = [];
  function addShip(coords) {
    // must receive coords in this format: [[1,2],[1,3],[1,4]] => for a vertical ship of length 3
    if (!isValidShipCoords(coords)) return;
    const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.ship)(coords.length);
    newShip.coords = coords;
    this.ships.push(newShip);
  }
  function isValidShipCoords(inputCoords) {
    let isValid = true;
    ships.forEach(s => {
      const currentShipCoords = s.coords;
      for (let coord of inputCoords) {
        if (containsCoord(currentShipCoords, coord)) {
          isValid = false;
        }
      }
    });
    return isValid;
  }
  function containsCoord(shipCoords, targetCoord) {
    // input formats: shipCoords => [[2,3],[2,4]]  targetCoord => [2,3]
    const stringifiedTargetCoord = targetCoord.join(",");
    for (let coord of shipCoords) {
      const stringifiedShipCoord = coord.join(",");
      if (stringifiedShipCoord === stringifiedTargetCoord) {
        return true;
      }
    }
    return false;
  }
  function receiveAttack(coords) {
    const [x, y] = coords;
    const hit = doesHit(coords);
    shots.push({
      x,
      y,
      hit
    });
    if (hit) {
      sendHitToTargetShip(coords);
    }
  }
  function sendHitToTargetShip(coords) {
    for (let ship of ships) {
      const currentShipCoord = ship.coords;
      if (containsCoord(currentShipCoord, coords)) {
        ship.hit();
      }
    }
  }
  function doesHit(coords) {
    for (let ship of ships) {
      const currentShipCoord = ship.coords;
      if (containsCoord(currentShipCoord, coords)) {
        return true;
      }
    }
    return false;
  }
  function areAllShipsSunk() {
    for (let ship of ships) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }
  return {
    shots,
    ships,
    addShip,
    receiveAttack,
    areAllShipsSunk
  };
}

/***/ }),

/***/ "./modules/generate-ship-coords.js":
/*!*****************************************!*\
  !*** ./modules/generate-ship-coords.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateShipCoords: () => (/* binding */ generateShipCoords)
/* harmony export */ });
function generateShipCoords(shipLength) {
  let coords = [];
  let orientation = randBool() ? "h" : "v";
  while (true) {
    let x = randNum();
    let y = randNum();
    if (orientation === "h") {
      for (let i = 0; i < shipLength; i++) {
        coords.push([x, y]);
        x++;
      }
    } else if (orientation === "v") {
      for (let i = 0; i < shipLength; i++) {
        coords.push([x, y]);
        y++;
      }
    }
    if (validateCoords(coords)) break;
    coords = [];
  }
  return coords;
}
function randBool() {
  const randNum = Math.floor(Math.random() * 2);
  if (randNum === 0) return false;
  return true;
}
function randNum() {
  let start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
  return Math.floor(Math.random() * (end + 1));
}
function validateCoords(coords) {
  return coords.every(c => {
    return c[0] <= 9 && c[0] >= 0 && c[1] <= 9 && c[1] >= 0;
  });
}

/***/ }),

/***/ "./modules/player.js":
/*!***************************!*\
  !*** ./modules/player.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   player: () => (/* binding */ player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./modules/gameboard.js");

function player(name) {
  return {
    gameboard: (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.gameboard)(),
    name
  };
}

/***/ }),

/***/ "./modules/ship.js":
/*!*************************!*\
  !*** ./modules/ship.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ship: () => (/* binding */ ship)
/* harmony export */ });
function ship(length) {
  let hits = 0;
  function isSunk() {
    return this.hits === this.length;
  }
  function hit() {
    this.hits += 1;
  }
  return {
    length,
    hits,
    isSunk,
    hit
  };
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*,*::after,*::before{
  margin: 0;
  padding: 0;
}

html{
  font-size: 62.5%;
}

:root{
  --green: #00ff00;
}

body{
  background-color: black;
}

.container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rem 10rem;
}

div[data-state="empty"]{
  background-color: black;
}
div[data-state="marked"]{
  background-color: #0080ff;
}
div[data-state="hit"]{
  background-color: red;
}
div[data-state="ship"]{
  background-color: var(--green);
}

.gameboard{
  display: grid;
  grid-template-columns: repeat(10,1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 1px;
  width: 400px;
  height: 400px;
  background-color: var(--green);
  border: 5px solid var(--green);
  border-radius: 5px;
  box-shadow: 0 0 10px var(--green);
}

.text{
  color: var(--green);
  font-size: 3rem;  
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  text-shadow: 0 0 5px var(--green);
  display: flex;
  justify-content: center;
  margin: 1rem 0 1rem;
}

.btn-container{
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.btn{
  padding: 20px;
  border-radius: 5px;
  border: 2px solid var(--green);
  background-color: black;
  color: var(--green);
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  text-shadow: 0 0 5px var(--green);
  box-shadow: 0 0 5px var(--green);
  transition: all .2s;
  cursor: pointer;
}

.btn:hover,
.btn:active{
  background-color: var(--green);
  color: black;
}

.btn:disabled{
  display: none;
}

#gameboard-computer > div[data-state="ship"]{
  background-color: black;
}`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;EACE,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,8BAA8B;EAC9B,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,qBAAqB;AACvB;AACA;EACE,8BAA8B;AAChC;;AAEA;EACE,aAAa;EACb,qCAAqC;EACrC,mCAAmC;EACnC,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,8BAA8B;EAC9B,8BAA8B;EAC9B,kBAAkB;EAClB,iCAAiC;AACnC;;AAEA;EACE,mBAAmB;EACnB,eAAe;EACf,8CAA8C;EAC9C,gBAAgB;EAChB,iCAAiC;EACjC,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;AACX;;AAEA;EACE,aAAa;EACb,kBAAkB;EAClB,8BAA8B;EAC9B,uBAAuB;EACvB,mBAAmB;EACnB,eAAe;EACf,8CAA8C;EAC9C,gBAAgB;EAChB,iCAAiC;EACjC,gCAAgC;EAChC,mBAAmB;EACnB,eAAe;AACjB;;AAEA;;EAEE,8BAA8B;EAC9B,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,uBAAuB;AACzB","sourcesContent":["*,*::after,*::before{\n  margin: 0;\n  padding: 0;\n}\n\nhtml{\n  font-size: 62.5%;\n}\n\n:root{\n  --green: #00ff00;\n}\n\nbody{\n  background-color: black;\n}\n\n.container{\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8rem 10rem;\n}\n\ndiv[data-state=\"empty\"]{\n  background-color: black;\n}\ndiv[data-state=\"marked\"]{\n  background-color: #0080ff;\n}\ndiv[data-state=\"hit\"]{\n  background-color: red;\n}\ndiv[data-state=\"ship\"]{\n  background-color: var(--green);\n}\n\n.gameboard{\n  display: grid;\n  grid-template-columns: repeat(10,1fr);\n  grid-template-rows: repeat(10, 1fr);\n  gap: 1px;\n  width: 400px;\n  height: 400px;\n  background-color: var(--green);\n  border: 5px solid var(--green);\n  border-radius: 5px;\n  box-shadow: 0 0 10px var(--green);\n}\n\n.text{\n  color: var(--green);\n  font-size: 3rem;  \n  font-family: 'Courier New', Courier, monospace;\n  font-weight: 600;\n  text-shadow: 0 0 5px var(--green);\n  display: flex;\n  justify-content: center;\n  margin: 1rem 0 1rem;\n}\n\n.btn-container{\n  display: flex;\n  flex-direction: column;\n  gap: 3rem;\n}\n\n.btn{\n  padding: 20px;\n  border-radius: 5px;\n  border: 2px solid var(--green);\n  background-color: black;\n  color: var(--green);\n  font-size: 2rem;\n  font-family: 'Courier New', Courier, monospace;\n  font-weight: 900;\n  text-shadow: 0 0 5px var(--green);\n  box-shadow: 0 0 5px var(--green);\n  transition: all .2s;\n  cursor: pointer;\n}\n\n.btn:hover,\n.btn:active{\n  background-color: var(--green);\n  color: black;\n}\n\n.btn:disabled{\n  display: none;\n}\n\n#gameboard-computer > div[data-state=\"ship\"]{\n  background-color: black;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _modules_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/player */ "./modules/player.js");
/* harmony import */ var _modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/generate-ship-coords */ "./modules/generate-ship-coords.js");
/* harmony import */ var _modules_DOM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/DOM */ "./modules/DOM.js");
/* harmony import */ var _modules_computerAttack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../modules/computerAttack */ "./modules/computerAttack.js");





const restartBtn = document.querySelector("#restart");
const reordertBtn = document.querySelector("#reorder");
const playBtn = document.querySelector("#play");
const computerGameboardEl = document.querySelector("#gameboard-computer");
const humanPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_1__.player)("Human");
addShipsToGameboard(humanPlayer.gameboard);
const computerPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_1__.player)("Computer");
addShipsToGameboard(computerPlayer.gameboard);
(0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.renderGameboard)("#gameboard-human");
(0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.initializeGameboard)(humanPlayer.gameboard, "#gameboard-human");
(0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.renderGameboard)("#gameboard-computer");
(0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.initializeGameboard)(computerPlayer.gameboard, "#gameboard-computer");
function addShipsToGameboard(gameboard) {
  while (gameboard.ships.length !== 1) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(4));
  }
  while (gameboard.ships.length !== 2) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(3));
  }
  while (gameboard.ships.length !== 3) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(3));
  }
  while (gameboard.ships.length !== 4) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(2));
  }
  while (gameboard.ships.length !== 5) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(2));
  }
  while (gameboard.ships.length !== 6) {
    gameboard.addShip((0,_modules_generate_ship_coords__WEBPACK_IMPORTED_MODULE_2__.generateShipCoords)(2));
  }
}
function computerPlay() {
  (0,_modules_computerAttack__WEBPACK_IMPORTED_MODULE_4__.computerAttack)(humanPlayer);
  (0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.updateGameboard)(humanPlayer.gameboard, "#gameboard-human");
}
function humanPlay(event) {
  const tile = event.target;
  const coordsStr = tile.dataset.coords;
  if (!isCoordStrUnique(coordsStr)) {
    return;
  }
  let coordArr = coordsStr.split(",");
  coordArr = [Number(coordArr[0]), Number(coordArr[1])];
  computerPlayer.gameboard.receiveAttack(coordArr);
  (0,_modules_DOM__WEBPACK_IMPORTED_MODULE_3__.updateGameboard)(computerPlayer.gameboard, "#gameboard-computer");
  if (computerPlayer.gameboard.areAllShipsSunk()) {
    showWinner("human");
    removeListeners();
  } else {
    computerPlay();
    if (humanPlayer.gameboard.areAllShipsSunk()) {
      showWinner("computer");
      removeListeners();
    }
  }
}
const selectedCoords = [];
function isCoordStrUnique(coordStr) {
  if (selectedCoords.every(c => !(c == coordStr))) {
    selectedCoords.push(coordStr);
    return true;
  }
  return false;
}
function removeListeners() {
  computerGameboardEl.removeEventListener(humanPlay);
}
function showWinner(winner) {
  if (winner === "human") {
    alert('Human Won');
  } else if (winner === "computer") {
    alert("Computer Won");
  }
}
restartBtn.addEventListener("click", () => {
  location.reload();
});
playBtn.addEventListener("click", () => {
  reordertBtn.setAttribute("disabled", "true");
  playBtn.setAttribute("disabled", "true");
  restartBtn.removeAttribute("disabled");
  computerGameboardEl.addEventListener("click", humanPlay);
});
reordertBtn.addEventListener("click", () => {
  location.reload();
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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azovL3RlbXBsYXRlLTEvLi9tb2R1bGVzL0RPTS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbW9kdWxlcy9jb21wdXRlckF0dGFjay5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbW9kdWxlcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL21vZHVsZXMvZ2VuZXJhdGUtc2hpcC1jb29yZHMuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9zdHlsZXMuY3NzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vc3JjL3N0eWxlcy5jc3M/NDRiMiIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZChzZWxlY3Rvcil7XG4gIGZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKXtcbiAgICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorKyl7XG4gICAgICBjb25zdCB0aWxlID0gZ2VuZXJhdGVUaWxlKCk7XG4gICAgICB0aWxlLmRhdGFzZXQuY29vcmRzID0gYCR7an0sJHtpfWA7XG4gICAgICBjb25zdCBnYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIGdhbWVib2FyZC5hcHBlbmQodGlsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVHYW1lYm9hcmQoZ2FtZWJvYXJkT2JqLHNlbGVjdG9yKXtcbiAgZ2FtZWJvYXJkT2JqLnNob3RzLmZvckVhY2goKHNob3QpID0+IHtcbiAgICBjb25zdCBzaG90U3RyID0gYCR7c2hvdC54fSwke3Nob3QueX1gO1xuICAgIGNvbnN0IHRpbGVzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAke3NlbGVjdG9yfSA+IGRpdmApXG4gICAgKTtcblxuICAgIHRpbGVzLmZvckVhY2goKHQpID0+IHtcbiAgICAgIGlmKHQuZGF0YXNldC5jb29yZHMgPT0gc2hvdFN0cil7XG4gICAgICAgIGlmKHNob3QuaGl0KSB0LmRhdGFzZXQuc3RhdGUgPSBcImhpdFwiO1xuICAgICAgICBpZighc2hvdC5oaXQpIHQuZGF0YXNldC5zdGF0ZSA9IFwibWFya2VkXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdhbWVib2FyZChnYW1lYm9hcmQsc2VsZWN0b3Ipe1xuICBjb25zdCBzaGlwcyA9IGdhbWVib2FyZC5zaGlwcztcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3Jkc0FycmF5ID0gc2hpcC5jb29yZHM7XG4gICAgY29vcmRzQXJyYXkuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgY29uc3QgY29vcmRTdHIgPSBgJHtjWzBdfSwke2NbMV19YDtcbiAgICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAke3NlbGVjdG9yfSA+IGRpdmApO1xuXG4gICAgICB0aWxlcy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgIGlmKHQuZGF0YXNldC5jb29yZHMgPT0gY29vcmRTdHIpe1xuICAgICAgICAgIHQuZGF0YXNldC5zdGF0ZSA9IFwic2hpcFwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGlsZSgpe1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICByZXR1cm4gdGlsZTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjb21wdXRlckF0dGFjayhwbGF5ZXIpe1xuICB3aGlsZSh0cnVlKXtcbiAgICBjb25zdCByYW5kb21Db29yZCA9IGdldFJhbmRvbUNvb3JkKCk7XG4gICAgaWYoaXNWYWxpZFNob3QocmFuZG9tQ29vcmQscGxheWVyKSl7XG4gICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tQ29vcmQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRTaG90KHNob3RDb29yZCxwbGF5ZXIpe1xuICBjb25zdCBzaG90c0FycmF5ID0gcGxheWVyLmdhbWVib2FyZC5zaG90cztcbiAgcmV0dXJuIHNob3RzQXJyYXkuZXZlcnkoKHNob3QpID0+IHtcbiAgICBpZihzaG90LnggIT09IHNob3RDb29yZFswXSBcbiAgICAmJiBzaG90LnkgIT09IHNob3RDb29yZFsxXSl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tQ29vcmQoKXtcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgcmV0dXJuIFt4LHldO1xufVxuIiwiaW1wb3J0IHsgc2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdhbWVib2FyZCgpe1xuICBjb25zdCBzaG90cyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGFkZFNoaXAoY29vcmRzKXtcbiAgICAvLyBtdXN0IHJlY2VpdmUgY29vcmRzIGluIHRoaXMgZm9ybWF0OiBbWzEsMl0sWzEsM10sWzEsNF1dID0+IGZvciBhIHZlcnRpY2FsIHNoaXAgb2YgbGVuZ3RoIDNcbiAgICBpZighaXNWYWxpZFNoaXBDb29yZHMoY29vcmRzKSkgcmV0dXJuO1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwKGNvb3Jkcy5sZW5ndGgpO1xuICAgIG5ld1NoaXAuY29vcmRzID0gY29vcmRzO1xuICAgIHRoaXMuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVmFsaWRTaGlwQ29vcmRzKGlucHV0Q29vcmRzKXtcbiAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgc2hpcHMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFNoaXBDb29yZHMgPSBzLmNvb3JkcztcbiAgICAgIGZvcihsZXQgY29vcmQgb2YgaW5wdXRDb29yZHMpe1xuICAgICAgICBpZihjb250YWluc0Nvb3JkKGN1cnJlbnRTaGlwQ29vcmRzLGNvb3JkKSl7XG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb250YWluc0Nvb3JkKHNoaXBDb29yZHMsdGFyZ2V0Q29vcmQpe1xuICAgIC8vIGlucHV0IGZvcm1hdHM6IHNoaXBDb29yZHMgPT4gW1syLDNdLFsyLDRdXSAgdGFyZ2V0Q29vcmQgPT4gWzIsM11cbiAgICBjb25zdCBzdHJpbmdpZmllZFRhcmdldENvb3JkID0gdGFyZ2V0Q29vcmQuam9pbihcIixcIik7XG4gICAgZm9yKGxldCBjb29yZCBvZiBzaGlwQ29vcmRzKXtcbiAgICAgIGNvbnN0IHN0cmluZ2lmaWVkU2hpcENvb3JkID0gY29vcmQuam9pbihcIixcIik7XG4gICAgICBpZihzdHJpbmdpZmllZFNoaXBDb29yZCA9PT0gc3RyaW5naWZpZWRUYXJnZXRDb29yZCl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3Jkcyl7XG4gICAgY29uc3QgW3gseV0gPSBjb29yZHM7XG4gICAgY29uc3QgaGl0ID0gZG9lc0hpdChjb29yZHMpO1xuICAgIHNob3RzLnB1c2goe3gseSxoaXR9KVxuICAgIGlmKGhpdCl7XG4gICAgICBzZW5kSGl0VG9UYXJnZXRTaGlwKGNvb3Jkcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2VuZEhpdFRvVGFyZ2V0U2hpcChjb29yZHMpe1xuICAgIGZvcihsZXQgc2hpcCBvZiBzaGlwcyl7XG4gICAgICBjb25zdCBjdXJyZW50U2hpcENvb3JkID0gc2hpcC5jb29yZHM7XG4gICAgICBpZihjb250YWluc0Nvb3JkKGN1cnJlbnRTaGlwQ29vcmQsY29vcmRzKSl7XG4gICAgICAgIHNoaXAuaGl0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZG9lc0hpdChjb29yZHMpe1xuICAgIGZvcihsZXQgc2hpcCBvZiBzaGlwcyl7XG4gICAgICBjb25zdCBjdXJyZW50U2hpcENvb3JkID0gc2hpcC5jb29yZHM7XG4gICAgICBpZihjb250YWluc0Nvb3JkKGN1cnJlbnRTaGlwQ29vcmQsY29vcmRzKSl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBhcmVBbGxTaGlwc1N1bmsoKXtcbiAgICBmb3IobGV0IHNoaXAgb2Ygc2hpcHMpe1xuICAgICAgaWYoIShzaGlwLmlzU3VuaygpKSl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNob3RzLFxuICAgIHNoaXBzLFxuICAgIGFkZFNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBhcmVBbGxTaGlwc1N1bmssXG4gIH07XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2hpcENvb3JkcyhzaGlwTGVuZ3RoKXtcbiAgbGV0IGNvb3JkcyA9IFtdO1xuICBsZXQgb3JpZW50YXRpb24gPSByYW5kQm9vbCgpID8gXCJoXCIgOiBcInZcIjtcbiAgXG4gIHdoaWxlKHRydWUpe1xuICAgIGxldCB4ID0gcmFuZE51bSgpO1xuICAgIGxldCB5ID0gcmFuZE51bSgpO1xuXG4gICAgaWYob3JpZW50YXRpb24gPT09IFwiaFwiKXtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspe1xuICAgICAgICBjb29yZHMucHVzaChbeCx5XSk7XG4gICAgICAgIHgrKztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYob3JpZW50YXRpb24gPT09IFwidlwiKXtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspe1xuICAgICAgICBjb29yZHMucHVzaChbeCx5XSk7XG4gICAgICAgIHkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsaWRhdGVDb29yZHMoY29vcmRzKSkgYnJlYWs7XG4gICAgY29vcmRzID0gW107XG4gIH1cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZnVuY3Rpb24gcmFuZEJvb2woKXtcbiAgY29uc3QgcmFuZE51bSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkpICogMik7XG4gIGlmKHJhbmROdW0gPT09IDApIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJhbmROdW0oc3RhcnQgPSAwLGVuZCA9IDkpe1xuICByZXR1cm4gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSkgKiAoZW5kICsgMSkpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNvb3Jkcyhjb29yZHMpe1xuICByZXR1cm4gY29vcmRzLmV2ZXJ5KChjKSA9PiB7XG4gICAgcmV0dXJuICgoY1swXSA8PSA5ICYmIGNbMF0gPj0gMCkgJiYgKGNbMV0gPD0gOSAmJiBjWzFdID49IDApKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBnYW1lYm9hcmQgfSBmcm9tICcuL2dhbWVib2FyZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5ZXIobmFtZSl7XG4gIHJldHVybiB7XG4gICAgZ2FtZWJvYXJkOiBnYW1lYm9hcmQoKSxcbiAgICBuYW1lLFxuICB9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIHNoaXAobGVuZ3RoKXtcbiAgbGV0IGhpdHMgPSAwO1xuXG4gIGZ1bmN0aW9uIGlzU3Vuaygpe1xuICAgIHJldHVybiB0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgZnVuY3Rpb24gaGl0KCl7XG4gICAgdGhpcy5oaXRzICs9IDE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxlbmd0aCxcbiAgICBoaXRzLFxuICAgIGlzU3VuayxcbiAgICBoaXQsXG4gIH1cbn0iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKiwqOjphZnRlciwqOjpiZWZvcmV7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxuaHRtbHtcbiAgZm9udC1zaXplOiA2Mi41JTtcbn1cblxuOnJvb3R7XG4gIC0tZ3JlZW46ICMwMGZmMDA7XG59XG5cbmJvZHl7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuXG4uY29udGFpbmVye1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDhyZW0gMTByZW07XG59XG5cbmRpdltkYXRhLXN0YXRlPVwiZW1wdHlcIl17XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuZGl2W2RhdGEtc3RhdGU9XCJtYXJrZWRcIl17XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDgwZmY7XG59XG5kaXZbZGF0YS1zdGF0ZT1cImhpdFwiXXtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xufVxuZGl2W2RhdGEtc3RhdGU9XCJzaGlwXCJde1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbik7XG59XG5cbi5nYW1lYm9hcmR7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xuICBnYXA6IDFweDtcbiAgd2lkdGg6IDQwMHB4O1xuICBoZWlnaHQ6IDQwMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbik7XG4gIGJvcmRlcjogNXB4IHNvbGlkIHZhcigtLWdyZWVuKTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBib3gtc2hhZG93OiAwIDAgMTBweCB2YXIoLS1ncmVlbik7XG59XG5cbi50ZXh0e1xuICBjb2xvcjogdmFyKC0tZ3JlZW4pO1xuICBmb250LXNpemU6IDNyZW07ICBcbiAgZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgdGV4dC1zaGFkb3c6IDAgMCA1cHggdmFyKC0tZ3JlZW4pO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luOiAxcmVtIDAgMXJlbTtcbn1cblxuLmJ0bi1jb250YWluZXJ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogM3JlbTtcbn1cblxuLmJ0bntcbiAgcGFkZGluZzogMjBweDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1ncmVlbik7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuICBjb2xvcjogdmFyKC0tZ3JlZW4pO1xuICBmb250LXNpemU6IDJyZW07XG4gIGZvbnQtZmFtaWx5OiAnQ291cmllciBOZXcnLCBDb3VyaWVyLCBtb25vc3BhY2U7XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIHRleHQtc2hhZG93OiAwIDAgNXB4IHZhcigtLWdyZWVuKTtcbiAgYm94LXNoYWRvdzogMCAwIDVweCB2YXIoLS1ncmVlbik7XG4gIHRyYW5zaXRpb246IGFsbCAuMnM7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmJ0bjpob3Zlcixcbi5idG46YWN0aXZle1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbik7XG4gIGNvbG9yOiBibGFjaztcbn1cblxuLmJ0bjpkaXNhYmxlZHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI2dhbWVib2FyZC1jb21wdXRlciA+IGRpdltkYXRhLXN0YXRlPVwic2hpcFwiXXtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLG1CQUFtQjtFQUNuQixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IscUNBQXFDO0VBQ3JDLG1DQUFtQztFQUNuQyxRQUFRO0VBQ1IsWUFBWTtFQUNaLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsOEJBQThCO0VBQzlCLGtCQUFrQjtFQUNsQixpQ0FBaUM7QUFDbkM7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLDhDQUE4QztFQUM5QyxnQkFBZ0I7RUFDaEIsaUNBQWlDO0VBQ2pDLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLDhCQUE4QjtFQUM5Qix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZiw4Q0FBOEM7RUFDOUMsZ0JBQWdCO0VBQ2hCLGlDQUFpQztFQUNqQyxnQ0FBZ0M7RUFDaEMsbUJBQW1CO0VBQ25CLGVBQWU7QUFDakI7O0FBRUE7O0VBRUUsOEJBQThCO0VBQzlCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHVCQUF1QjtBQUN6QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLCo6OmFmdGVyLCo6OmJlZm9yZXtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmh0bWx7XFxuICBmb250LXNpemU6IDYyLjUlO1xcbn1cXG5cXG46cm9vdHtcXG4gIC0tZ3JlZW46ICMwMGZmMDA7XFxufVxcblxcbmJvZHl7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuXFxuLmNvbnRhaW5lcntcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgcGFkZGluZzogOHJlbSAxMHJlbTtcXG59XFxuXFxuZGl2W2RhdGEtc3RhdGU9XFxcImVtcHR5XFxcIl17XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuZGl2W2RhdGEtc3RhdGU9XFxcIm1hcmtlZFxcXCJde1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwODBmZjtcXG59XFxuZGl2W2RhdGEtc3RhdGU9XFxcImhpdFxcXCJde1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5kaXZbZGF0YS1zdGF0ZT1cXFwic2hpcFxcXCJde1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JlZW4pO1xcbn1cXG5cXG4uZ2FtZWJvYXJke1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcXG4gIGdhcDogMXB4O1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgaGVpZ2h0OiA0MDBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyZWVuKTtcXG4gIGJvcmRlcjogNXB4IHNvbGlkIHZhcigtLWdyZWVuKTtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJveC1zaGFkb3c6IDAgMCAxMHB4IHZhcigtLWdyZWVuKTtcXG59XFxuXFxuLnRleHR7XFxuICBjb2xvcjogdmFyKC0tZ3JlZW4pO1xcbiAgZm9udC1zaXplOiAzcmVtOyAgXFxuICBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlO1xcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gIHRleHQtc2hhZG93OiAwIDAgNXB4IHZhcigtLWdyZWVuKTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMXJlbSAwIDFyZW07XFxufVxcblxcbi5idG4tY29udGFpbmVye1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDNyZW07XFxufVxcblxcbi5idG57XFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4pO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuICBjb2xvcjogdmFyKC0tZ3JlZW4pO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTtcXG4gIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICB0ZXh0LXNoYWRvdzogMCAwIDVweCB2YXIoLS1ncmVlbik7XFxuICBib3gtc2hhZG93OiAwIDAgNXB4IHZhcigtLWdyZWVuKTtcXG4gIHRyYW5zaXRpb246IGFsbCAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5idG46aG92ZXIsXFxuLmJ0bjphY3RpdmV7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbik7XFxuICBjb2xvcjogYmxhY2s7XFxufVxcblxcbi5idG46ZGlzYWJsZWR7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4jZ2FtZWJvYXJkLWNvbXB1dGVyID4gZGl2W2RhdGEtc3RhdGU9XFxcInNoaXBcXFwiXXtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5vcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMuY3NzXCI7XG5pbXBvcnQgeyBwbGF5ZXIgfSBmcm9tICcuLi9tb2R1bGVzL3BsYXllcic7XG5pbXBvcnQgeyBnZW5lcmF0ZVNoaXBDb29yZHMgfSBmcm9tICcuLi9tb2R1bGVzL2dlbmVyYXRlLXNoaXAtY29vcmRzJztcbmltcG9ydCB7IFxuICBpbml0aWFsaXplR2FtZWJvYXJkLFxuICByZW5kZXJHYW1lYm9hcmQsXG4gIHVwZGF0ZUdhbWVib2FyZCxcbn0gZnJvbSAnLi4vbW9kdWxlcy9ET00nO1xuaW1wb3J0IHsgY29tcHV0ZXJBdHRhY2sgfSBmcm9tICcuLi9tb2R1bGVzL2NvbXB1dGVyQXR0YWNrJztcblxuY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcbmNvbnN0IHJlb3JkZXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZW9yZGVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheVwiKTtcbmNvbnN0IGNvbXB1dGVyR2FtZWJvYXJkRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVib2FyZC1jb21wdXRlclwiKTtcblxuY29uc3QgaHVtYW5QbGF5ZXIgPSBwbGF5ZXIoXCJIdW1hblwiKTtcbmFkZFNoaXBzVG9HYW1lYm9hcmQoaHVtYW5QbGF5ZXIuZ2FtZWJvYXJkKTtcblxuY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBwbGF5ZXIoXCJDb21wdXRlclwiKTtcbmFkZFNoaXBzVG9HYW1lYm9hcmQoY29tcHV0ZXJQbGF5ZXIuZ2FtZWJvYXJkKTtcblxucmVuZGVyR2FtZWJvYXJkKFwiI2dhbWVib2FyZC1odW1hblwiKTtcbmluaXRpYWxpemVHYW1lYm9hcmQoaHVtYW5QbGF5ZXIuZ2FtZWJvYXJkLFwiI2dhbWVib2FyZC1odW1hblwiKTtcbnJlbmRlckdhbWVib2FyZChcIiNnYW1lYm9hcmQtY29tcHV0ZXJcIik7XG5pbml0aWFsaXplR2FtZWJvYXJkKGNvbXB1dGVyUGxheWVyLmdhbWVib2FyZCxcIiNnYW1lYm9hcmQtY29tcHV0ZXJcIik7XG5cbmZ1bmN0aW9uIGFkZFNoaXBzVG9HYW1lYm9hcmQoZ2FtZWJvYXJkKXtcbiAgd2hpbGUoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gMSl7XG4gICAgZ2FtZWJvYXJkLmFkZFNoaXAoZ2VuZXJhdGVTaGlwQ29vcmRzKDQpKTtcbiAgfVxuICB3aGlsZShnYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSAyKXtcbiAgICBnYW1lYm9hcmQuYWRkU2hpcChnZW5lcmF0ZVNoaXBDb29yZHMoMykpO1xuICB9XG4gIHdoaWxlKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggIT09IDMpe1xuICAgIGdhbWVib2FyZC5hZGRTaGlwKGdlbmVyYXRlU2hpcENvb3JkcygzKSk7XG4gIH1cbiAgd2hpbGUoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gNCl7XG4gICAgZ2FtZWJvYXJkLmFkZFNoaXAoZ2VuZXJhdGVTaGlwQ29vcmRzKDIpKTtcbiAgfVxuICB3aGlsZShnYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSA1KXtcbiAgICBnYW1lYm9hcmQuYWRkU2hpcChnZW5lcmF0ZVNoaXBDb29yZHMoMikpO1xuICB9XG4gIHdoaWxlKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggIT09IDYpe1xuICAgIGdhbWVib2FyZC5hZGRTaGlwKGdlbmVyYXRlU2hpcENvb3JkcygyKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJQbGF5KCl7XG4gIGNvbXB1dGVyQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgdXBkYXRlR2FtZWJvYXJkKGh1bWFuUGxheWVyLmdhbWVib2FyZCxcIiNnYW1lYm9hcmQtaHVtYW5cIik7XG59XG5cbmZ1bmN0aW9uIGh1bWFuUGxheShldmVudCl7XG4gIGNvbnN0IHRpbGUgPSBldmVudC50YXJnZXQ7XG4gIGNvbnN0IGNvb3Jkc1N0ciA9IHRpbGUuZGF0YXNldC5jb29yZHM7XG5cbiAgaWYoIWlzQ29vcmRTdHJVbmlxdWUoY29vcmRzU3RyKSl7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGNvb3JkQXJyID0gY29vcmRzU3RyLnNwbGl0KFwiLFwiKTtcbiAgY29vcmRBcnIgPSBbTnVtYmVyKGNvb3JkQXJyWzBdKSxOdW1iZXIoY29vcmRBcnJbMV0pXTtcblxuICBjb21wdXRlclBsYXllci5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZEFycik7XG4gIHVwZGF0ZUdhbWVib2FyZChjb21wdXRlclBsYXllci5nYW1lYm9hcmQsXCIjZ2FtZWJvYXJkLWNvbXB1dGVyXCIpO1xuXG4gIGlmKGNvbXB1dGVyUGxheWVyLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSl7XG4gICAgc2hvd1dpbm5lcihcImh1bWFuXCIpO1xuICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICB9IGVsc2Uge1xuICAgIGNvbXB1dGVyUGxheSgpO1xuICAgIGlmKGh1bWFuUGxheWVyLmdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSl7XG4gICAgICBzaG93V2lubmVyKFwiY29tcHV0ZXJcIik7XG4gICAgICByZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgc2VsZWN0ZWRDb29yZHMgPSBbXTtcbmZ1bmN0aW9uIGlzQ29vcmRTdHJVbmlxdWUoY29vcmRTdHIpe1xuICBpZihzZWxlY3RlZENvb3Jkcy5ldmVyeShjID0+ICEoYyA9PSBjb29yZFN0cikpKXtcbiAgICBzZWxlY3RlZENvb3Jkcy5wdXNoKGNvb3JkU3RyKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycygpe1xuICBjb21wdXRlckdhbWVib2FyZEVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoaHVtYW5QbGF5KTtcbn1cblxuZnVuY3Rpb24gc2hvd1dpbm5lcih3aW5uZXIpe1xuICBpZih3aW5uZXIgPT09IFwiaHVtYW5cIil7XG4gICAgYWxlcnQoJ0h1bWFuIFdvbicpO1xuICB9IGVsc2UgaWYod2lubmVyID09PSBcImNvbXB1dGVyXCIpe1xuICAgIGFsZXJ0KFwiQ29tcHV0ZXIgV29uXCIpO1xuICB9XG59XG5cbnJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCkgPT4ge1xuICBsb2NhdGlvbi5yZWxvYWQoKTtcbn0pO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgcmVvcmRlcnRCdG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcInRydWVcIik7XG4gIHBsYXlCdG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcInRydWVcIik7XG4gIHJlc3RhcnRCdG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gIGNvbXB1dGVyR2FtZWJvYXJkRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsaHVtYW5QbGF5KTtcbn0pO1xuXG5yZW9yZGVydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG4iXSwibmFtZXMiOlsicmVuZGVyR2FtZWJvYXJkIiwic2VsZWN0b3IiLCJpIiwiaiIsInRpbGUiLCJnZW5lcmF0ZVRpbGUiLCJkYXRhc2V0IiwiY29vcmRzIiwiZ2FtZWJvYXJkIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYXBwZW5kIiwidXBkYXRlR2FtZWJvYXJkIiwiZ2FtZWJvYXJkT2JqIiwic2hvdHMiLCJmb3JFYWNoIiwic2hvdCIsInNob3RTdHIiLCJ4IiwieSIsInRpbGVzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsInQiLCJoaXQiLCJzdGF0ZSIsImluaXRpYWxpemVHYW1lYm9hcmQiLCJzaGlwcyIsInNoaXAiLCJjb29yZHNBcnJheSIsImMiLCJjb29yZFN0ciIsImNyZWF0ZUVsZW1lbnQiLCJjb21wdXRlckF0dGFjayIsInBsYXllciIsInJhbmRvbUNvb3JkIiwiZ2V0UmFuZG9tQ29vcmQiLCJpc1ZhbGlkU2hvdCIsInJlY2VpdmVBdHRhY2siLCJzaG90Q29vcmQiLCJzaG90c0FycmF5IiwiZXZlcnkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJhZGRTaGlwIiwiaXNWYWxpZFNoaXBDb29yZHMiLCJuZXdTaGlwIiwibGVuZ3RoIiwicHVzaCIsImlucHV0Q29vcmRzIiwiaXNWYWxpZCIsInMiLCJjdXJyZW50U2hpcENvb3JkcyIsImNvb3JkIiwiY29udGFpbnNDb29yZCIsInNoaXBDb29yZHMiLCJ0YXJnZXRDb29yZCIsInN0cmluZ2lmaWVkVGFyZ2V0Q29vcmQiLCJqb2luIiwic3RyaW5naWZpZWRTaGlwQ29vcmQiLCJkb2VzSGl0Iiwic2VuZEhpdFRvVGFyZ2V0U2hpcCIsImN1cnJlbnRTaGlwQ29vcmQiLCJhcmVBbGxTaGlwc1N1bmsiLCJpc1N1bmsiLCJnZW5lcmF0ZVNoaXBDb29yZHMiLCJzaGlwTGVuZ3RoIiwib3JpZW50YXRpb24iLCJyYW5kQm9vbCIsInJhbmROdW0iLCJ2YWxpZGF0ZUNvb3JkcyIsInN0YXJ0IiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiZW5kIiwibmFtZSIsImhpdHMiLCJyZXN0YXJ0QnRuIiwicmVvcmRlcnRCdG4iLCJwbGF5QnRuIiwiY29tcHV0ZXJHYW1lYm9hcmRFbCIsImh1bWFuUGxheWVyIiwiYWRkU2hpcHNUb0dhbWVib2FyZCIsImNvbXB1dGVyUGxheWVyIiwiY29tcHV0ZXJQbGF5IiwiaHVtYW5QbGF5IiwiZXZlbnQiLCJ0YXJnZXQiLCJjb29yZHNTdHIiLCJpc0Nvb3JkU3RyVW5pcXVlIiwiY29vcmRBcnIiLCJzcGxpdCIsIk51bWJlciIsInNob3dXaW5uZXIiLCJyZW1vdmVMaXN0ZW5lcnMiLCJzZWxlY3RlZENvb3JkcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3aW5uZXIiLCJhbGVydCIsImFkZEV2ZW50TGlzdGVuZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsInNldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSJdLCJzb3VyY2VSb290IjoiIn0=