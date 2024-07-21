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
  // gameboardObj.shots.forEach((shot) => {
  //   const shotStr = `${shot.x},${shot.y}`;
  const shotObj = gameboardObj.shots.at(-1);
  const shotCoordStr = `${shotObj.x},${shotObj.y}`;
  const tiles = Array.from(document.querySelector(selector).querySelectorAll(`${selector} > div`));
  tiles.forEach(t => {
    if (t.dataset.coords == shotCoordStr) {
      if (shotObj.hit) t.dataset.state = "hit";
      if (!shotObj.hit) t.dataset.state = "marked";
    }
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
    if (shot.x == shotCoord[0] && shot.y == shotCoord[1]) {
      return false;
    }
    return true;
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
const winnerEl = document.querySelector("#winner");
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
    winnerEl.textContent = "Human Won!";
  } else if (winner === "computer") {
    winnerEl.textContent = "Computer Won!";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU8sRUFBQyxNQUFNO0VBQ3pDQyxRQUFRLENBQUNDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL21vZHVsZXMvRE9NLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9tb2R1bGVzL2NvbXB1dGVyQXR0YWNrLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbW9kdWxlcy9nZW5lcmF0ZS1zaGlwLWNvb3Jkcy5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vc3JjL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9zcmMvc3R5bGVzLmNzcz80NGIyIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkKHNlbGVjdG9yKXtcbiAgZm9yKGxldCBpID0gMDsgaSA8IDEwOyBpKyspe1xuICAgIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgaisrKXtcbiAgICAgIGNvbnN0IHRpbGUgPSBnZW5lcmF0ZVRpbGUoKTtcbiAgICAgIHRpbGUuZGF0YXNldC5jb29yZHMgPSBgJHtqfSwke2l9YDtcbiAgICAgIGNvbnN0IGdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgZ2FtZWJvYXJkLmFwcGVuZCh0aWxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUdhbWVib2FyZChnYW1lYm9hcmRPYmosc2VsZWN0b3Ipe1xuICAvLyBnYW1lYm9hcmRPYmouc2hvdHMuZm9yRWFjaCgoc2hvdCkgPT4ge1xuICAvLyAgIGNvbnN0IHNob3RTdHIgPSBgJHtzaG90Lnh9LCR7c2hvdC55fWA7XG4gICAgICBjb25zdCBzaG90T2JqID0gZ2FtZWJvYXJkT2JqLnNob3RzLmF0KC0xKTtcbiAgICAgIGNvbnN0IHNob3RDb29yZFN0ciA9IGAke3Nob3RPYmoueH0sJHtzaG90T2JqLnl9YDtcbiAgICAgIFxuICAgICAgY29uc3QgdGlsZXMgPSBBcnJheVxuICAgICAgLmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAke3NlbGVjdG9yfSA+IGRpdmApKTtcblxuICAgICAgdGlsZXMuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgICBpZih0LmRhdGFzZXQuY29vcmRzID09IHNob3RDb29yZFN0cil7XG4gICAgICAgICAgICBpZihzaG90T2JqLmhpdCkgdC5kYXRhc2V0LnN0YXRlID0gXCJoaXRcIjtcbiAgICAgICAgICAgIGlmKCFzaG90T2JqLmhpdCkgdC5kYXRhc2V0LnN0YXRlID0gXCJtYXJrZWRcIjtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdhbWVib2FyZChnYW1lYm9hcmQsc2VsZWN0b3Ipe1xuICBjb25zdCBzaGlwcyA9IGdhbWVib2FyZC5zaGlwcztcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3Jkc0FycmF5ID0gc2hpcC5jb29yZHM7XG4gICAgY29vcmRzQXJyYXkuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgY29uc3QgY29vcmRTdHIgPSBgJHtjWzBdfSwke2NbMV19YDtcbiAgICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAke3NlbGVjdG9yfSA+IGRpdmApO1xuXG4gICAgICB0aWxlcy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgIGlmKHQuZGF0YXNldC5jb29yZHMgPT0gY29vcmRTdHIpe1xuICAgICAgICAgIHQuZGF0YXNldC5zdGF0ZSA9IFwic2hpcFwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGlsZSgpe1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5kYXRhc2V0LnN0YXRlID0gXCJlbXB0eVwiO1xuICByZXR1cm4gdGlsZTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjb21wdXRlckF0dGFjayhwbGF5ZXIpe1xuICB3aGlsZSh0cnVlKXtcbiAgICBjb25zdCByYW5kb21Db29yZCA9IGdldFJhbmRvbUNvb3JkKCk7XG4gICAgaWYoaXNWYWxpZFNob3QocmFuZG9tQ29vcmQscGxheWVyKSl7XG4gICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socmFuZG9tQ29vcmQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRTaG90KHNob3RDb29yZCxwbGF5ZXIpe1xuICBjb25zdCBzaG90c0FycmF5ID0gcGxheWVyLmdhbWVib2FyZC5zaG90cztcbiAgcmV0dXJuIHNob3RzQXJyYXkuZXZlcnkoKHNob3QpID0+IHtcbiAgICBpZihzaG90LnggPT0gc2hvdENvb3JkWzBdIFxuICAgICYmIHNob3QueSA9PSBzaG90Q29vcmRbMV0pe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUNvb3JkKCl7XG4gIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gIHJldHVybiBbeCx5XTtcbn1cbiIsImltcG9ydCB7IHNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnYW1lYm9hcmQoKXtcbiAgY29uc3Qgc2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBhZGRTaGlwKGNvb3Jkcyl7XG4gICAgLy8gbXVzdCByZWNlaXZlIGNvb3JkcyBpbiB0aGlzIGZvcm1hdDogW1sxLDJdLFsxLDNdLFsxLDRdXSA9PiBmb3IgYSB2ZXJ0aWNhbCBzaGlwIG9mIGxlbmd0aCAzXG4gICAgaWYoIWlzVmFsaWRTaGlwQ29vcmRzKGNvb3JkcykpIHJldHVybjtcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcChjb29yZHMubGVuZ3RoKTtcbiAgICBuZXdTaGlwLmNvb3JkcyA9IGNvb3JkcztcbiAgICB0aGlzLnNoaXBzLnB1c2gobmV3U2hpcCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc1ZhbGlkU2hpcENvb3JkcyhpbnB1dENvb3Jkcyl7XG4gICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgIHNoaXBzLmZvckVhY2goKHMpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTaGlwQ29vcmRzID0gcy5jb29yZHM7XG4gICAgICBmb3IobGV0IGNvb3JkIG9mIGlucHV0Q29vcmRzKXtcbiAgICAgICAgaWYoY29udGFpbnNDb29yZChjdXJyZW50U2hpcENvb3Jkcyxjb29yZCkpe1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udGFpbnNDb29yZChzaGlwQ29vcmRzLHRhcmdldENvb3JkKXtcbiAgICAvLyBpbnB1dCBmb3JtYXRzOiBzaGlwQ29vcmRzID0+IFtbMiwzXSxbMiw0XV0gIHRhcmdldENvb3JkID0+IFsyLDNdXG4gICAgY29uc3Qgc3RyaW5naWZpZWRUYXJnZXRDb29yZCA9IHRhcmdldENvb3JkLmpvaW4oXCIsXCIpO1xuICAgIGZvcihsZXQgY29vcmQgb2Ygc2hpcENvb3Jkcyl7XG4gICAgICBjb25zdCBzdHJpbmdpZmllZFNoaXBDb29yZCA9IGNvb3JkLmpvaW4oXCIsXCIpO1xuICAgICAgaWYoc3RyaW5naWZpZWRTaGlwQ29vcmQgPT09IHN0cmluZ2lmaWVkVGFyZ2V0Q29vcmQpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhjb29yZHMpe1xuICAgIGNvbnN0IFt4LHldID0gY29vcmRzO1xuICAgIGNvbnN0IGhpdCA9IGRvZXNIaXQoY29vcmRzKTtcbiAgICBzaG90cy5wdXNoKHt4LHksaGl0fSlcbiAgICBpZihoaXQpe1xuICAgICAgc2VuZEhpdFRvVGFyZ2V0U2hpcChjb29yZHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbmRIaXRUb1RhcmdldFNoaXAoY29vcmRzKXtcbiAgICBmb3IobGV0IHNoaXAgb2Ygc2hpcHMpe1xuICAgICAgY29uc3QgY3VycmVudFNoaXBDb29yZCA9IHNoaXAuY29vcmRzO1xuICAgICAgaWYoY29udGFpbnNDb29yZChjdXJyZW50U2hpcENvb3JkLGNvb3Jkcykpe1xuICAgICAgICBzaGlwLmhpdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRvZXNIaXQoY29vcmRzKXtcbiAgICBmb3IobGV0IHNoaXAgb2Ygc2hpcHMpe1xuICAgICAgY29uc3QgY3VycmVudFNoaXBDb29yZCA9IHNoaXAuY29vcmRzO1xuICAgICAgaWYoY29udGFpbnNDb29yZChjdXJyZW50U2hpcENvb3JkLGNvb3Jkcykpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJlQWxsU2hpcHNTdW5rKCl7XG4gICAgZm9yKGxldCBzaGlwIG9mIHNoaXBzKXtcbiAgICAgIGlmKCEoc2hpcC5pc1N1bmsoKSkpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzaG90cyxcbiAgICBzaGlwcyxcbiAgICBhZGRTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgYXJlQWxsU2hpcHNTdW5rLFxuICB9O1xufSIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNoaXBDb29yZHMoc2hpcExlbmd0aCl7XG4gIGxldCBjb29yZHMgPSBbXTtcbiAgbGV0IG9yaWVudGF0aW9uID0gcmFuZEJvb2woKSA/IFwiaFwiIDogXCJ2XCI7XG4gIFxuICB3aGlsZSh0cnVlKXtcbiAgICBsZXQgeCA9IHJhbmROdW0oKTtcbiAgICBsZXQgeSA9IHJhbmROdW0oKTtcblxuICAgIGlmKG9yaWVudGF0aW9uID09PSBcImhcIil7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKXtcbiAgICAgICAgY29vcmRzLnB1c2goW3gseV0pO1xuICAgICAgICB4Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmKG9yaWVudGF0aW9uID09PSBcInZcIil7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKXtcbiAgICAgICAgY29vcmRzLnB1c2goW3gseV0pO1xuICAgICAgICB5Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHZhbGlkYXRlQ29vcmRzKGNvb3JkcykpIGJyZWFrO1xuICAgIGNvb3JkcyA9IFtdO1xuICB9XG4gIHJldHVybiBjb29yZHM7XG59XG5cbmZ1bmN0aW9uIHJhbmRCb29sKCl7XG4gIGNvbnN0IHJhbmROdW0gPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpKSAqIDIpO1xuICBpZihyYW5kTnVtID09PSAwKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByYW5kTnVtKHN0YXJ0ID0gMCxlbmQgPSA5KXtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkpICogKGVuZCArIDEpKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVDb29yZHMoY29vcmRzKXtcbiAgcmV0dXJuIGNvb3Jkcy5ldmVyeSgoYykgPT4ge1xuICAgIHJldHVybiAoKGNbMF0gPD0gOSAmJiBjWzBdID49IDApICYmIChjWzFdIDw9IDkgJiYgY1sxXSA+PSAwKSk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgZ2FtZWJvYXJkIH0gZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVyKG5hbWUpe1xuICByZXR1cm4ge1xuICAgIGdhbWVib2FyZDogZ2FtZWJvYXJkKCksXG4gICAgbmFtZSxcbiAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBzaGlwKGxlbmd0aCl7XG4gIGxldCBoaXRzID0gMDtcblxuICBmdW5jdGlvbiBpc1N1bmsoKXtcbiAgICByZXR1cm4gdGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdCgpe1xuICAgIHRoaXMuaGl0cyArPSAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZW5ndGgsXG4gICAgaGl0cyxcbiAgICBpc1N1bmssXG4gICAgaGl0LFxuICB9XG59IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosKjo6YWZ0ZXIsKjo6YmVmb3Jle1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbmh0bWx7XG4gIGZvbnQtc2l6ZTogNjIuNSU7XG59XG5cbjpyb290e1xuICAtLWdyZWVuOiAjMDBmZjAwO1xufVxuXG5ib2R5e1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cblxuLmNvbnRhaW5lcntcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiA4cmVtIDEwcmVtO1xufVxuXG5kaXZbZGF0YS1zdGF0ZT1cImVtcHR5XCJde1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cbmRpdltkYXRhLXN0YXRlPVwibWFya2VkXCJde1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA4MGZmO1xufVxuZGl2W2RhdGEtc3RhdGU9XCJoaXRcIl17XG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcbn1cbmRpdltkYXRhLXN0YXRlPVwic2hpcFwiXXtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JlZW4pO1xufVxuXG4uZ2FtZWJvYXJke1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ2FwOiAxcHg7XG4gIHdpZHRoOiA0MDBweDtcbiAgaGVpZ2h0OiA0MDBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JlZW4pO1xuICBib3JkZXI6IDVweCBzb2xpZCB2YXIoLS1ncmVlbik7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgYm94LXNoYWRvdzogMCAwIDEwcHggdmFyKC0tZ3JlZW4pO1xufVxuXG4udGV4dHtcbiAgY29sb3I6IHZhcigtLWdyZWVuKTtcbiAgZm9udC1zaXplOiAzcmVtOyAgXG4gIGZvbnQtZmFtaWx5OiAnQ291cmllciBOZXcnLCBDb3VyaWVyLCBtb25vc3BhY2U7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHRleHQtc2hhZG93OiAwIDAgNXB4IHZhcigtLWdyZWVuKTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbjogMXJlbSAwIDFyZW07XG59XG5cbi5idG4tY29udGFpbmVye1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDNyZW07XG59XG5cbi5idG57XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZ3JlZW4pO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgY29sb3I6IHZhcigtLWdyZWVuKTtcbiAgZm9udC1zaXplOiAycmVtO1xuICBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgQ291cmllciwgbW9ub3NwYWNlO1xuICBmb250LXdlaWdodDogOTAwO1xuICB0ZXh0LXNoYWRvdzogMCAwIDVweCB2YXIoLS1ncmVlbik7XG4gIGJveC1zaGFkb3c6IDAgMCA1cHggdmFyKC0tZ3JlZW4pO1xuICB0cmFuc2l0aW9uOiBhbGwgLjJzO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5idG46aG92ZXIsXG4uYnRuOmFjdGl2ZXtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JlZW4pO1xuICBjb2xvcjogYmxhY2s7XG59XG5cbi5idG46ZGlzYWJsZWR7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbiNnYW1lYm9hcmQtY29tcHV0ZXIgPiBkaXZbZGF0YS1zdGF0ZT1cInNoaXBcIl17XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtBQUNaOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixtQkFBbUI7RUFDbkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHFDQUFxQztFQUNyQyxtQ0FBbUM7RUFDbkMsUUFBUTtFQUNSLFlBQVk7RUFDWixhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLDhCQUE4QjtFQUM5QixrQkFBa0I7RUFDbEIsaUNBQWlDO0FBQ25DOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZiw4Q0FBOEM7RUFDOUMsZ0JBQWdCO0VBQ2hCLGlDQUFpQztFQUNqQyxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGtCQUFrQjtFQUNsQiw4QkFBOEI7RUFDOUIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsOENBQThDO0VBQzlDLGdCQUFnQjtFQUNoQixpQ0FBaUM7RUFDakMsZ0NBQWdDO0VBQ2hDLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBOztFQUVFLDhCQUE4QjtFQUM5QixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiwqOjphZnRlciwqOjpiZWZvcmV7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5odG1se1xcbiAgZm9udC1zaXplOiA2Mi41JTtcXG59XFxuXFxuOnJvb3R7XFxuICAtLWdyZWVuOiAjMDBmZjAwO1xcbn1cXG5cXG5ib2R5e1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxufVxcblxcbi5jb250YWluZXJ7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDhyZW0gMTByZW07XFxufVxcblxcbmRpdltkYXRhLXN0YXRlPVxcXCJlbXB0eVxcXCJde1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxufVxcbmRpdltkYXRhLXN0YXRlPVxcXCJtYXJrZWRcXFwiXXtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDgwZmY7XFxufVxcbmRpdltkYXRhLXN0YXRlPVxcXCJoaXRcXFwiXXtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG59XFxuZGl2W2RhdGEtc3RhdGU9XFxcInNoaXBcXFwiXXtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWdyZWVuKTtcXG59XFxuXFxuLmdhbWVib2FyZHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwxZnIpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XFxuICBnYXA6IDFweDtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbik7XFxuICBib3JkZXI6IDVweCBzb2xpZCB2YXIoLS1ncmVlbik7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBib3gtc2hhZG93OiAwIDAgMTBweCB2YXIoLS1ncmVlbik7XFxufVxcblxcbi50ZXh0e1xcbiAgY29sb3I6IHZhcigtLWdyZWVuKTtcXG4gIGZvbnQtc2l6ZTogM3JlbTsgIFxcbiAgZm9udC1mYW1pbHk6ICdDb3VyaWVyIE5ldycsIENvdXJpZXIsIG1vbm9zcGFjZTtcXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XFxuICB0ZXh0LXNoYWRvdzogMCAwIDVweCB2YXIoLS1ncmVlbik7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtYXJnaW46IDFyZW0gMCAxcmVtO1xcbn1cXG5cXG4uYnRuLWNvbnRhaW5lcntcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAzcmVtO1xcbn1cXG5cXG4uYnRue1xcbiAgcGFkZGluZzogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWdyZWVuKTtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbiAgY29sb3I6IHZhcigtLWdyZWVuKTtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIGZvbnQtZmFtaWx5OiAnQ291cmllciBOZXcnLCBDb3VyaWVyLCBtb25vc3BhY2U7XFxuICBmb250LXdlaWdodDogOTAwO1xcbiAgdGV4dC1zaGFkb3c6IDAgMCA1cHggdmFyKC0tZ3JlZW4pO1xcbiAgYm94LXNoYWRvdzogMCAwIDVweCB2YXIoLS1ncmVlbik7XFxuICB0cmFuc2l0aW9uOiBhbGwgLjJzO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uYnRuOmhvdmVyLFxcbi5idG46YWN0aXZle1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JlZW4pO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uYnRuOmRpc2FibGVke1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuI2dhbWVib2FyZC1jb21wdXRlciA+IGRpdltkYXRhLXN0YXRlPVxcXCJzaGlwXFxcIl17XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4vc3R5bGVzLmNzc1wiO1xuaW1wb3J0IHsgcGxheWVyIH0gZnJvbSAnLi4vbW9kdWxlcy9wbGF5ZXInO1xuaW1wb3J0IHsgZ2VuZXJhdGVTaGlwQ29vcmRzIH0gZnJvbSAnLi4vbW9kdWxlcy9nZW5lcmF0ZS1zaGlwLWNvb3Jkcyc7XG5pbXBvcnQgeyBcbiAgaW5pdGlhbGl6ZUdhbWVib2FyZCxcbiAgcmVuZGVyR2FtZWJvYXJkLFxuICB1cGRhdGVHYW1lYm9hcmQsXG59IGZyb20gJy4uL21vZHVsZXMvRE9NJztcbmltcG9ydCB7IGNvbXB1dGVyQXR0YWNrIH0gZnJvbSAnLi4vbW9kdWxlcy9jb21wdXRlckF0dGFjayc7XG5cbmNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG5jb25zdCByZW9yZGVydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVvcmRlclwiKTtcbmNvbnN0IHBsYXlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXlcIik7XG5jb25zdCBjb21wdXRlckdhbWVib2FyZEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lYm9hcmQtY29tcHV0ZXJcIik7XG5jb25zdCB3aW5uZXJFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2lubmVyXCIpO1xuXG5jb25zdCBodW1hblBsYXllciA9IHBsYXllcihcIkh1bWFuXCIpO1xuYWRkU2hpcHNUb0dhbWVib2FyZChodW1hblBsYXllci5nYW1lYm9hcmQpO1xuXG5jb25zdCBjb21wdXRlclBsYXllciA9IHBsYXllcihcIkNvbXB1dGVyXCIpO1xuYWRkU2hpcHNUb0dhbWVib2FyZChjb21wdXRlclBsYXllci5nYW1lYm9hcmQpO1xuXG5yZW5kZXJHYW1lYm9hcmQoXCIjZ2FtZWJvYXJkLWh1bWFuXCIpO1xuaW5pdGlhbGl6ZUdhbWVib2FyZChodW1hblBsYXllci5nYW1lYm9hcmQsXCIjZ2FtZWJvYXJkLWh1bWFuXCIpO1xucmVuZGVyR2FtZWJvYXJkKFwiI2dhbWVib2FyZC1jb21wdXRlclwiKTtcbmluaXRpYWxpemVHYW1lYm9hcmQoY29tcHV0ZXJQbGF5ZXIuZ2FtZWJvYXJkLFwiI2dhbWVib2FyZC1jb21wdXRlclwiKTtcblxuZnVuY3Rpb24gYWRkU2hpcHNUb0dhbWVib2FyZChnYW1lYm9hcmQpe1xuICB3aGlsZShnYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSAxKXtcbiAgICBnYW1lYm9hcmQuYWRkU2hpcChnZW5lcmF0ZVNoaXBDb29yZHMoNCkpO1xuICB9XG4gIHdoaWxlKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggIT09IDIpe1xuICAgIGdhbWVib2FyZC5hZGRTaGlwKGdlbmVyYXRlU2hpcENvb3JkcygzKSk7XG4gIH1cbiAgd2hpbGUoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gMyl7XG4gICAgZ2FtZWJvYXJkLmFkZFNoaXAoZ2VuZXJhdGVTaGlwQ29vcmRzKDMpKTtcbiAgfVxuICB3aGlsZShnYW1lYm9hcmQuc2hpcHMubGVuZ3RoICE9PSA0KXtcbiAgICBnYW1lYm9hcmQuYWRkU2hpcChnZW5lcmF0ZVNoaXBDb29yZHMoMikpO1xuICB9XG4gIHdoaWxlKGdhbWVib2FyZC5zaGlwcy5sZW5ndGggIT09IDUpe1xuICAgIGdhbWVib2FyZC5hZGRTaGlwKGdlbmVyYXRlU2hpcENvb3JkcygyKSk7XG4gIH1cbiAgd2hpbGUoZ2FtZWJvYXJkLnNoaXBzLmxlbmd0aCAhPT0gNil7XG4gICAgZ2FtZWJvYXJkLmFkZFNoaXAoZ2VuZXJhdGVTaGlwQ29vcmRzKDIpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlclBsYXkoKXtcbiAgY29tcHV0ZXJBdHRhY2soaHVtYW5QbGF5ZXIpO1xuICB1cGRhdGVHYW1lYm9hcmQoaHVtYW5QbGF5ZXIuZ2FtZWJvYXJkLFwiI2dhbWVib2FyZC1odW1hblwiKTtcbn1cblxuZnVuY3Rpb24gaHVtYW5QbGF5KGV2ZW50KXtcbiAgY29uc3QgdGlsZSA9IGV2ZW50LnRhcmdldDtcbiAgY29uc3QgY29vcmRzU3RyID0gdGlsZS5kYXRhc2V0LmNvb3JkcztcblxuICBpZighaXNDb29yZFN0clVuaXF1ZShjb29yZHNTdHIpKXtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgY29vcmRBcnIgPSBjb29yZHNTdHIuc3BsaXQoXCIsXCIpO1xuICBjb29yZEFyciA9IFtOdW1iZXIoY29vcmRBcnJbMF0pLE51bWJlcihjb29yZEFyclsxXSldO1xuXG4gIGNvbXB1dGVyUGxheWVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkQXJyKTtcbiAgdXBkYXRlR2FtZWJvYXJkKGNvbXB1dGVyUGxheWVyLmdhbWVib2FyZCxcIiNnYW1lYm9hcmQtY29tcHV0ZXJcIik7XG5cbiAgaWYoY29tcHV0ZXJQbGF5ZXIuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKXtcbiAgICBzaG93V2lubmVyKFwiaHVtYW5cIik7XG4gICAgcmVtb3ZlTGlzdGVuZXJzKCk7XG4gIH0gZWxzZSB7XG4gICAgY29tcHV0ZXJQbGF5KCk7XG4gICAgaWYoaHVtYW5QbGF5ZXIuZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKXtcbiAgICAgIHNob3dXaW5uZXIoXCJjb21wdXRlclwiKTtcbiAgICAgIHJlbW92ZUxpc3RlbmVycygpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBzZWxlY3RlZENvb3JkcyA9IFtdO1xuZnVuY3Rpb24gaXNDb29yZFN0clVuaXF1ZShjb29yZFN0cil7XG4gIGlmKHNlbGVjdGVkQ29vcmRzLmV2ZXJ5KGMgPT4gIShjID09IGNvb3JkU3RyKSkpe1xuICAgIHNlbGVjdGVkQ29vcmRzLnB1c2goY29vcmRTdHIpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCl7XG4gIGNvbXB1dGVyR2FtZWJvYXJkRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihodW1hblBsYXkpO1xufVxuXG5mdW5jdGlvbiBzaG93V2lubmVyKHdpbm5lcil7XG4gIGlmKHdpbm5lciA9PT0gXCJodW1hblwiKXtcbiAgICB3aW5uZXJFbC50ZXh0Q29udGVudCA9IFwiSHVtYW4gV29uIVwiO1xuICB9IGVsc2UgaWYod2lubmVyID09PSBcImNvbXB1dGVyXCIpe1xuICAgIHdpbm5lckVsLnRleHRDb250ZW50ID0gXCJDb21wdXRlciBXb24hXCI7XG4gIH1cbn1cblxucmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpO1xufSk7XG5cbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCkgPT4ge1xuICByZW9yZGVydEJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFwidHJ1ZVwiKTtcbiAgcGxheUJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFwidHJ1ZVwiKTtcbiAgcmVzdGFydEJ0bi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgY29tcHV0ZXJHYW1lYm9hcmRFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixodW1hblBsYXkpO1xufSk7XG5cbnJlb3JkZXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgbG9jYXRpb24ucmVsb2FkKCk7XG59KTtcbiJdLCJuYW1lcyI6WyJyZW5kZXJHYW1lYm9hcmQiLCJzZWxlY3RvciIsImkiLCJqIiwidGlsZSIsImdlbmVyYXRlVGlsZSIsImRhdGFzZXQiLCJjb29yZHMiLCJnYW1lYm9hcmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJhcHBlbmQiLCJ1cGRhdGVHYW1lYm9hcmQiLCJnYW1lYm9hcmRPYmoiLCJzaG90T2JqIiwic2hvdHMiLCJhdCIsInNob3RDb29yZFN0ciIsIngiLCJ5IiwidGlsZXMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsInQiLCJoaXQiLCJzdGF0ZSIsImluaXRpYWxpemVHYW1lYm9hcmQiLCJzaGlwcyIsInNoaXAiLCJjb29yZHNBcnJheSIsImMiLCJjb29yZFN0ciIsImNyZWF0ZUVsZW1lbnQiLCJjb21wdXRlckF0dGFjayIsInBsYXllciIsInJhbmRvbUNvb3JkIiwiZ2V0UmFuZG9tQ29vcmQiLCJpc1ZhbGlkU2hvdCIsInJlY2VpdmVBdHRhY2siLCJzaG90Q29vcmQiLCJzaG90c0FycmF5IiwiZXZlcnkiLCJzaG90IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYWRkU2hpcCIsImlzVmFsaWRTaGlwQ29vcmRzIiwibmV3U2hpcCIsImxlbmd0aCIsInB1c2giLCJpbnB1dENvb3JkcyIsImlzVmFsaWQiLCJzIiwiY3VycmVudFNoaXBDb29yZHMiLCJjb29yZCIsImNvbnRhaW5zQ29vcmQiLCJzaGlwQ29vcmRzIiwidGFyZ2V0Q29vcmQiLCJzdHJpbmdpZmllZFRhcmdldENvb3JkIiwiam9pbiIsInN0cmluZ2lmaWVkU2hpcENvb3JkIiwiZG9lc0hpdCIsInNlbmRIaXRUb1RhcmdldFNoaXAiLCJjdXJyZW50U2hpcENvb3JkIiwiYXJlQWxsU2hpcHNTdW5rIiwiaXNTdW5rIiwiZ2VuZXJhdGVTaGlwQ29vcmRzIiwic2hpcExlbmd0aCIsIm9yaWVudGF0aW9uIiwicmFuZEJvb2wiLCJyYW5kTnVtIiwidmFsaWRhdGVDb29yZHMiLCJzdGFydCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImVuZCIsIm5hbWUiLCJoaXRzIiwicmVzdGFydEJ0biIsInJlb3JkZXJ0QnRuIiwicGxheUJ0biIsImNvbXB1dGVyR2FtZWJvYXJkRWwiLCJ3aW5uZXJFbCIsImh1bWFuUGxheWVyIiwiYWRkU2hpcHNUb0dhbWVib2FyZCIsImNvbXB1dGVyUGxheWVyIiwiY29tcHV0ZXJQbGF5IiwiaHVtYW5QbGF5IiwiZXZlbnQiLCJ0YXJnZXQiLCJjb29yZHNTdHIiLCJpc0Nvb3JkU3RyVW5pcXVlIiwiY29vcmRBcnIiLCJzcGxpdCIsIk51bWJlciIsInNob3dXaW5uZXIiLCJyZW1vdmVMaXN0ZW5lcnMiLCJzZWxlY3RlZENvb3JkcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3aW5uZXIiLCJ0ZXh0Q29udGVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsInNldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSJdLCJzb3VyY2VSb290IjoiIn0=