/* ----------
   controlFile.js 
   
   Handles file manipulation.
   
   File manipulation referenced from http://www.sitepoint.com/html5-file-drag-and-drop/
   ---------- */
   
(function () {

var drops = {};

function ControlInterface() {}

/**
 * Initializes the control interface.
 */
ControlInterface.init = function () {
    var xhr = new XMLHttpRequest();
    
    if (!(window.File && window.FileList && window.FileReader && xhr.upload)) {
        console.warn('File drag and drop unsupported.');
        return;
    }
    
    drops.state = document.getElementById('state-text');
    drops.solution = document.getElementById('solution-text');
    
	for (var i in drops) {
        drops[i].addEventListener('dragover', fileDragHover, false);
        drops[i].addEventListener('dragleave', fileDragHover, false);
        drops[i].addEventListener('drop', fileSelectHandler, false);
	}
};

/**
 * Handles drag hover events over the target element.
 */
function fileDragHover(e) {
    e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type === 'dragover' ? 'drop-interface drop-interface-hover' : 'drop-interface');
}

/**
 * Handles drop events over the target element.
 */
function fileSelectHandler(e) {
    fileDragHover(e);
    
    var files = e.target.files || e.dataTransfer.files;
    
    parseFile(e, files[0]);
}

/**
 * Reads in the given file.
 */
function parseFile(e, file) {
    console.log('Reading file: ' + file.name);
    var textarea = e.target;
    
    var reader = new FileReader();
	reader.onload = function (e) {
        textarea.value = e.target.result.toUpperCase();
	};
	reader.readAsText(file);
}

// Make available globally.
window.ControlInterface = ControlInterface;

})();