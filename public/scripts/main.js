
/****************************/
/*     GLOBAL VARIABLES     */
/****************************/

let currentMapId = 1;
let currentUserId = 1;
const defaultNewPinImageURL = '../images/map_logo.png';
const defaultNewPinZoom = 14.5;
const focusOnPinZoom = 14.5;


/****************************/
/*     HELPER FUNCTIONS     */
/****************************/

const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
