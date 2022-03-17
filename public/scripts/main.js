
/****************************/
/*     GLOBAL VARIABLES     */
/****************************/

let currentMapId = 1;
let currentUserId = 1;
const defaultNewPinImageURL = '../images/map_logo.png';
const defaultNewPinZoom = 16;
const focusOnPinZoom = 16;


/****************************/
/*     HELPER FUNCTIONS     */
/****************************/

const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
