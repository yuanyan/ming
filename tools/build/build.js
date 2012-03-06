// import require file

var path = require("path");
var fs = require("fs");
var config = require("./config");
var parser = require("./parse-js");
var pro = require("./process");

// module load sequence
var sequence = [];

// input files
var scripts = [];

// handle arguments
var args = process.argv;

// remove 'node' and 'build.js' arguments
args.splice(0,2); 

while (args.length > 0) {
	var v = args.shift(); //convert object to String
	switch (v) {
		case "help":
			help();
			break;
		case "clear":
			clear();
			break;
		case "-o":
		case "--output":
			break;		
		default:
			scripts.push(v);
			break;
	}
}

if(scripts[0]){
	build(scripts, process.cwd());
}

exit();


// print useage
function help(){

  console.log("Usage:");
  console.log("  build a.js");
  console.log("  build a.js b.js");
  console.log("  build help");
  console.log("  build clear");
}

// exit program
function exit(msg){
	if(msg){
		console.log(msg);
	}
	process.exit();
}

// clear build directory
function clear(dir){

	if(!dir) {
		dir = process.cwd();
	}
  
	fs.readdirSync(dir).forEach(function(file) {
		var p = path.join(dir, file);
		if (file == config.DEFAULT_BUILD) {
			rmdirForce(p);
		}
		else if (file.indexOf('.') == -1 && fs.statSync(p).isDirectory()) {
			
			clear(p);

		}
	});
	
	console.log("Remove build directory",dir+'/'+config.DEFAULT_BUILD);
  
}

// build
function build(scripts, basedir) {

	scripts.forEach(function(val, key) {

		var path = normalize(val, basedir);
		var stat = fs.statSync(path);

		if (stat.isFile()) {
			scripts[key] = path;
		}else{
			exit(val + " is not a valid filename");
		}
	});
	
	generateModuleSequence(scripts);
	combineModuleScript(sequence);
}

function combineModuleScript(sequence){
	
	var source = [],
		compress = [];
	
	
	sequence.forEach(function(module){
		var ast = module.ast;
		var code = module.code;
		
		source.push(code);
		
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		
		code = pro.gen_code(ast, {
			beautify: !compress,
			indent_level: 2
		});
		
		compress.push(code);
	
	});
	
	outputToFile('all.js', compress.join(''));
	outputToFile('all.src.js', source.join(''));
	//console.log(compress.join(''));
	//console.log(source.join(''));

}

function outputToFile(filename, code){

	var outputDir = path.join( process.cwd(), config.DEFAULT_BUILD);
	
	if (!path.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, '0766');
	}
  
	var outputFile = path.join(outputDir, filename);

	fs.writeFileSync(outputFile, code, 'utf-8');
	console.log('Successfully output to ' + getRelativePath(outputFile));
	
}



function generateModuleSequence(scripts){

	var module;
	
	scripts.forEach(function(filepath){
	
		module = getModuleInfo(filepath);	
		sequence.push(module);
		moduleDeps(module.deps);
	
	});
	
	sequence.forEach(function(v){
		console.log('before: ',v.namespace,v.filename);
	});
	
	var index = 0;
	for(var i=0,len=sequence.length; i<len; i++){
		module = sequence[i];
		// put no deps module at the head of sequence
		if(!isModuleHasDeps(module)){
		
			swap(sequence, index, i);	
			index++;
		}
	}
	
	sequence.forEach(function(v){
		console.log('after: ',v.namespace,v.filename);
	});	
	
	
	for(var i=index, len=sequence.length; i<len; i++){
			
		sequence[i].deps.forEach(function(ns){
			
			for(var j=i; j<len; j++){ // find dep module from current index
			
				if(ns == sequence[j].namespace){ //
				
					var temp = sequence[j];
					remove(sequence, j);
					sequence.splice(i, 0, temp);
					i--
				}
			}
		});
	}
	
	sequence.forEach(function(v){
		console.log('final:', v.namespace,v.filename);
	});
}


function moduleDeps(deps){

	//console.log("deps: ",deps);

	var modulepath;
	
	deps.forEach(function(ns){
		var module = ns.replace(".","/").concat(".js");
		
		// find in app src directory first
		modulepath = path.join(process.cwd(), module);
		
		// when not find in app src directory
		if(!path.existsSync(modulepath)){
			modulepath = path.join(config.DEFAULT_MODULEJS_SRC, module);
		}
		
		// then find in modulejs src directory
		if(!path.existsSync(modulepath)){
			console.error("Can't find " + ns + " module");
		}else{
			
			var module = getModuleInfo(modulepath);
			
			if(!isExistInSequence(module)){
				sequence.push(module);
			}
	
			moduleDeps(module.deps);
			
		}


	});
	
}

function isModuleHasDeps(module){
	var has = false;
	module.deps.forEach(function(v){
		if(v){
			has = true;
		}
	});

	return has;
}



function isExistInSequence(module){
	var exist = false;

	// compare with namespace
	if(module.namespace){
		var ns = module.namespace;
		sequence.forEach(function(module){
	
			if(module.namespace == ns){
				exist = true;
			}
	
		});
		
	}
	// if module not define namespace, compare with code
	else{
		var code = module.code;
		sequence.forEach(function(module){
	
			if(module.code == code){
				exist = true;
			}
	
		});
	
	}

	return exist;

}




function getModuleInfo(filepath) {

  filepath = normalize(filepath);

  var code = fs.readFileSync(filepath, "utf-8");
  var ast = parser.parse(code);

  return {
	namespace: getModuleNamespace(ast),
    deps: getModuleDependencies(ast),
	filepath: filepath,
    filename: path.basename(filepath).replace(/\.js$/, ""),
	code : code,
	ast : ast
  };
}


function getModuleNamespace(ast){

	var pattern = /,call,name,define,string,([^,?]+)(?:\?|,|$)function/g;
	var text = ast.toString();
	var match = pattern.exec(text);
		
	return match[1];

}

function getModuleDependencies(ast) {
  var deps = [];

  // get dependencies
  // module('a') ==> call,name,module,string,a
  var pattern = /,call,name,require,string,([^,?]+)(?:\?|,|$)(?![function])/g;
  var text = ast.toString();
  var match;
  while ((match = pattern.exec(text))) {
    if (deps.indexOf(match[1]) == -1) {
      deps.push(match[1]);
    }
  }

  // console.log(require('util').inspect(deps,false,10));
  
  return deps;
}

// utilities for build

// array utility method
function remove(array, from, to){
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

function swap(array,i,j){
	var temp = array[j];
	array[j] = array[i];
	array[i] = temp;	
}

// fs utility method
// lifesinger@gmail.com (Frank Wang)
/**
 * rm -rf dir.
 * @param {string} dir The directory path.
 */
function rmdirForce(dir) {
  fs.readdirSync(dir).forEach(function(file) {
    var p = path.join(dir, file);
    if (fs.statSync(p).isFile()) {
      fs.unlinkSync(p);
    } else {
      rmdirForce(p);
    }
  });
  fs.rmdirSync(dir);
};

/**
 * Whether the id is absolute id.
 * @param {string} id The module id.
 * @return {boolean} The boolean result.
 */
function isAbsoluteId (id) {
  return id.indexOf('/') === 0 ||
      id.indexOf('://') !== -1 ||
      id.indexOf(':\\') !== -1;
};

/**
 * Normalizes a filepath.
 * @param {string} filepath The filepath.
 * @param {string} basedir The base directory.
 * @return {string} The normalized path.
 * @this exports
 */
function normalize(filepath, basedir) {
  basedir = basedir || process.cwd();

  if (filepath == '*.js') {
    filepath = basedir;
  }
  else if (!isAbsoluteId(filepath)) {
    filepath = path.join(basedir, filepath);
  }

  if (!path.existsSync(filepath)) {
    filepath += '.js';
    if (!path.existsSync(filepath)) {
      throw 'This file or directory doesn\'t exist: ' + filepath;
    }
  }

  return filepath;
};

/**
 * Gets the relative parts of path according to current work dir.
 * @param {string} filepath The file path.
 * @param {string} basedir The base directory.
 * @return {string} The relative path.
 */
function getRelativePath(filepath, basedir) {
  basedir = basedir || process.cwd();
  if (filepath.indexOf(basedir) === 0) {
    filepath = filepath.replace(basedir + '/', '');
  }
  return filepath;
};