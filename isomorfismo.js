function clone(obj) {
  if(obj == null || typeof(obj) != 'object')
      return obj;    
  var temp = new obj.constructor(); 
  for(var key in obj)
      temp[key] = clone(obj[key]);    
  return temp;
}

var grafo = {
  vertices: {
  },
  verticesNames: [],
  varticesSum: [],
  matrizAdj: [],
  //Funciones de impresion
  imprimirVertices: function(){
    console.log(JSON.stringify(this.vertices));
  },
  imprimirMatriz: function(){
    var header ="+-";
    for(var i=0; i< this.verticesCount() ; i++){
      header += "--";
    }
    header+= "+";
    console.log(header);
    for(var i=0; i< this.verticesCount() ; i++){
      console.log("|"+JSON.stringify(this.matrizAdj[i])+"|");
    }
    console.log(header);
  },
  // Funciones de utilidad
  verticesCount: function(){
    return Object.keys(this.vertices).length;
  },
  verticeSum: function(name){
    var index = this.vertices[name];
    var sum = 0;
    for(var i=0; i<this.verticesCount(); i++){
      sum = sum + this.matrizAdj[index][i];
    }
    return sum;
  },
  agregarVertice: function(name){
    this.vertices[name] = this.verticesCount();
    this.verticesNames.push(name); //Lo agregamos a un arreglo.
    this.matrizAdj.forEach(function(element) {
        element.push(0);
      }, this);
    this.matrizAdj.push([]);
    for(var i=0; i< this.verticesCount() ; i++){
      this.matrizAdj[this.verticesCount()-1].push(0);
    }
  },
  agregarArista: function(origen, destino){
    var indexOrigen = this.vertices[origen];
    var indexDestino = this.vertices[destino];
    this.matrizAdj[indexOrigen][indexDestino] = 1;
    this.matrizAdj[indexDestino][indexOrigen] = 1;
  },
  compararGradosVertices: function(grafo){
    var verticeMatches = {};
    var thisGrados = this.matrizGrados();
    var gradGrafo = grafo.matrizGrados();
    //Recorremos todos los vertices
    for(var i=0; i< this.verticesCount() ; i++){
      // var nombre = this.verticesNames[this.verticesCount()-1];
      // var aristasCoinc = grafo.obtenerVerticesNAristas(cantAristas);
      var coincidencia = gradGrafo.indexOf(thisGrados[i]);
      if(coincidencia != -1){
        verticeMatches[this.verticesNames[i]] = grafo.verticesNames[coincidencia]; //Guardamos cuales concordaron
        gradGrafo[coincidencia] = -99;
      } else {
        console.log("No coinciden los grados de los vertices.");
        return false;
      }
    }
    console.log("Los grados de los vertices coinciden.");
    return true;
  },
  matrizGrados: function(){
    var mat = [];
    for(var i=0; i< this.verticesCount() ; i++){
      mat.push(this.verticeSum(this.verticesNames[i]));
    }
    return mat;
  },
  cantidadAristas: function(){
    var sumaGrados = this.matrizGrados().reduce(function(sum, value) {
      return sum + value;
    }, 0);
    console.log(sumaGrados/2);
    return sumaGrados/2;
  }
}

var grafo2 = clone(grafo);

// grafo.agregarVertice("f");
// grafo.agregarVertice("g");
// grafo.agregarVertice("h");
// grafo.agregarVertice("i");
// grafo.agregarArista("h","i");
// grafo.imprimirMatriz();

// grafo2.agregarVertice("a");
// grafo2.agregarVertice("b");
// grafo2.agregarVertice("c");
// grafo2.agregarVertice("d");
// grafo2.agregarArista("d","a");
// grafo2.imprimirMatriz();

// grafo.compararGradosVertices(grafo2);

var dialog = document.querySelector('dialog');

var showDialogButton = document.querySelector('#crearVertice');
if (! dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}

showDialogButton.addEventListener('click', function() {
  dialog.showModal();
});

dialog.querySelector('.crear').addEventListener('click', function() {
  var nombre = document.querySelector('#verticeName');
  // console.log(nombre.value);
  if (document.getElementById('option-1').checked) {
    grafo.agregarVertice(nombre.value);
    console.log("Vertice "+ nombre.value +" agregado al primer grafo");
  } else {
    grafo2.agregarVertice(nombre.value);
    console.log("Vertice "+ nombre.value +" agregado al segundo grafo");
  }
  nombre.value = '';
  representarGrafos();
  dialog.close();
});

document.querySelector('#aristagrafo1').addEventListener('click', function() {
  var nombre = document.querySelector('#grafo1Relation');
  var vertices = nombre.value.split(",");
  console.log(JSON.stringify(vertices));
  grafo.agregarArista(vertices[0], vertices[1]);
  representarGrafos();
});

document.querySelector('#aristagrafo2').addEventListener('click', function() {
  var nombre = document.querySelector('#grafo2Relation');
  var vertices = nombre.value.split(",");
  grafo2.agregarArista(vertices[0], vertices[1]);
  representarGrafos();
});

var snackbarContainer = document.querySelector('#demo-snackbar-example');
var showSnackbarButton = document.querySelector('#resultado');
var handler = function(event) {
  showSnackbarButton.style.backgroundColor = '';
};
showSnackbarButton.addEventListener('click', function() {
  'use strict';
  //primera verificacion
  if(grafo.verticesCount() == grafo2.verticesCount()){
    window.setTimeout(function(){
      var data = {
        message: 'Misma cantidad de Vertices',
        timeout: 2000,
        actionHandler: handler,
        actionText: 'Undo'
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    },0);

    //Segunda verificacion
    if(grafo.cantidadAristas() == grafo2.cantidadAristas()){
      window.setTimeout(function(){
        var data = {
          message: 'Misma cantidad de Aristas',
          timeout: 2000,
          actionHandler: handler,
          actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      },2000);

      //Tercera verificacion
      if(grafo.compararGradosVertices(grafo2)){
        window.setTimeout(function(){
          var data = {
            message: 'Mismo grado de vertices :D',
            timeout: 2000,
            actionHandler: handler,
            actionText: 'Undo'
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        },4000);
      } else {
        window.setTimeout(function(){
          var data = {
            message: 'Los grados de los vertices no coinciden',
            timeout: 2000,
            actionHandler: handler,
            actionText: 'Undo'
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        },4000);
      }
    } else {
      window.setTimeout(function(){
        var data = {
          message: 'No puede ser isomorfo no tiene la misma cantidad.',
          timeout: 2000,
          actionHandler: handler,
          actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      },2000);
    }
  } else {
    window.setTimeout(function(){
      var data = {
        message: 'No funciona, no tiene la misma cantidad de vertices.',
        timeout: 2000,
        actionHandler: handler,
        actionText: 'Undo'
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    },1000);
  }
  
});

function representarGrafos(){
  var htmlgrafo1 = "";
  grafo.verticesNames.forEach(function(nombre) {
    var indice = grafo.vertices[nombre];
    var asociadas = [];
    for(var i = 0; i < grafo.matrizAdj[indice].length; i++){
      if(grafo.matrizAdj[indice][i] == 1){
        var associated = grafo.verticesNames[i];
        asociadas.push(associated);
      }
    }
    htmlgrafo1 += `<span class="mdl-chip mdl-chip--contact">
                    <span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">`+ nombre +`</span>
                    <span class="mdl-chip__text">`+asociadas.join()+`</span>
                  </span>`;
  }, this);
  document.getElementById("grafo1").innerHTML = htmlgrafo1;  

  var htmlgrafo2 = "";
  grafo2.verticesNames.forEach(function(nombre) {
    var indice = grafo2.vertices[nombre];
    var asociadas = [];
    for(var i = 0; i < grafo2.matrizAdj[indice].length; i++){
      if(grafo2.matrizAdj[indice][i] == 1){
        var associated = grafo2.verticesNames[i];
        asociadas.push(associated);
      }
    }
    htmlgrafo2 += `<span class="mdl-chip mdl-chip--contact">
                    <span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">`+ nombre +`</span>
                    <span class="mdl-chip__text">`+asociadas.join()+`</span>
                  </span>`;
  }, this);
  document.getElementById("grafo2").innerHTML = htmlgrafo2;  
}

dialog.querySelector('.close').addEventListener('click', function() {
  dialog.close();
});
