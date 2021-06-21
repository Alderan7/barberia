document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();
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
    }else{
        elemento.classList.add('seleccionado');
    }
        
    
}