let pagina=1;

const cita = {
    nombre: '',
    fecha: '',
    hora:'',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta el DIV actual según el tab que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion según el tab que se presiona
    cambiarSeccion();

    //Paginación siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la página actual para ocultar o mostrar la paginación
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    //Almacena (en el objeto creado previamente) el nombre de la persona que va a realizar la reserva
    nombreCita();   
    
    //Almacena (en el objeto creado previamente)la fecha en que se va a realizar la reserva
    fechaCita();

    //Deshabilita dias pasados

    deshabilitarFechaAnterior();

    //Almacena la hora en el objeto
    horaCita();

}

function mostrarSeccion(){

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }    

    const seccionActual =  document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
    //Eliminar la clase actual en el tab anterior
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta el Tab actual
    const tab= document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces =  document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace=>{
        enlace.addEventListener('click', e=>{
            e.preventDefault();
            pagina= parseInt(e.target.dataset.paso);

            //Llamar a la función mostrarSeccion

            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios(){
    try{
        const resultado  = await fetch('../servicios.json')
        const db =  await resultado.json();
        const {servicios} = db;

        //Generar el html

        servicios.forEach(servicio => {
           const {id, nombre, precio} = servicio;
           //DOM Scripting
            //Generar nombre del servicio
           const nombreServicio =  document.createElement('P');
           nombreServicio.textContent = nombre;
           nombreServicio.classList.add('nombre-servicio');

            //Generar el precio del servicio
            const precioServicio =  document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor del servicio
            const servicioDiv =  document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio=id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            //Inyectar precio y nombre en el div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en el HTML

            document.querySelector('#servicios').appendChild(servicioDiv);
        });

    }catch(error){
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;
    //Forzar que el elemento al que le damos click sea el DIV (Porque el DIC tiene el ID)
    if(e.target.tagName === 'P'){
        elemento=e.target.parentElement;
    }else{
        elemento=e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id= parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre:elemento.firstElementChild.textContent,
            precio:elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
        
    
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;
        console.log(pagina);
        botonesPaginador();
    });

}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina--;
        console.log(pagina);
        botonesPaginador();
    });
    
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Estamos en la página 3 y hay que cargar
                          //el resumen de la cita, o el error por faltar algún campo
        
    }else{
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }

    mostrarSeccion();//Cambia la seccion que se muestra por la que debe mostrarse
}

function mostrarResumen(){
    //Destructuring

    const {nombre, fecha, hora, servicios} = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');
    console.log(cita);
    //Limpia el HTML previo
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validacion de objeto

    if(Object.values(cita).includes('')){
        const noServicios =  document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen DIV
        resumenDiv.appendChild(noServicios);

        return;
    }

const headingCita =  document.createElement('H3');
headingCita.textContent='Resumen de Cita';

    //mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

const serviciosCita =  document.createElement('DIV');
serviciosCita.classList.add('resumen-servicio');

const headingServicios =  document.createElement('H3');
headingServicios.textContent='Resumen de Servicios';

serviciosCita.appendChild(headingServicios);
let cantidad=0;
    //Iterar sobre el vector de servicio
    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent=nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent=precio;
        precioServicio.classList.add('precio');

        const totalServicio =  precio.split('$');
        cantidad+=parseInt(totalServicio[1].trim());

        //Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;
    resumenDiv.appendChild(cantidadPagar);
}

function eliminarServicio(id){
    const {servicios} = cita;

    cita.servicios = servicios.filter( servicio => servicio.id !== id);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];


}

function nombreCita(){
    const nombreInput =  document.querySelector('#nombre');

    nombreInput.addEventListener('input', e=>{
        //La función Trim que podemos ver relacionada con el atributo value sirve
        //para no tener en cuenta los espacios delanteros o traseros de una palabra o conjunto de ellas
        //trimStart y trimEnd son similares, pero quitan los espacios de delante o de detrás, respectivamente
        const nombreTexto = e.target.value.trim();

        //validacion de que el nombre debe tener algo

        if(nombreTexto === '' || nombreTexto.length < 2){
            mostrarAlerta('Nombre no Válido', 'error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre=nombreTexto;
        }

    });

}

function mostrarAlerta(mensaje, tipo){

    //Si hay una alerta previa no crearemos otra

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent=mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //insertar en el HTML

    const formulario= document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar alerta tras 3 segundos

    setTimeout(() =>{
        alerta.remove();
    }, 3000);

}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e=>{
        const dia = new Date(e.target.value).getUTCDay();
        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value='';
            mostrarAlerta('Los Fines de Semana no se puede realizar realizar una reserva', 'error');
        }else{
            cita.fecha=fechaInput.value;
        }
    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    //Formato deseado YYYY-MM-DD
    const fechaAhora =  new Date();
    const year =  fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;    

    if(mes<10){
       mes=`0${mes}`
    }

    const fechaDeshabilitar=`${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora =  document.querySelector('#hora');
    inputHora.addEventListener('input', e=>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':');


    if(hora[0]<10 || hora[0]>18){
        mostrarAlerta('Hora no válida', 'error');
        setTimeout(()=>{
            inputHora.value='';
        }, 3000);
        cita.hora='';
    }else{
        cita.hora=horaCita;
    }

    });
}