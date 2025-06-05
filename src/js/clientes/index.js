console.log('Hola Mundo 3');
import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { validarFormulario } from "../funciones";
import { lenguaje } from "../lenguaje";

const FormClientes = document.getElementById('FormClientes');
const BtnGuardar = document.getElementById('BtnGuardar');
const BtnModificar = document.getElementById('BtnModificar');
const BtnLimpiar = document.getElementById('BtnLimpiar');
const ValidarTelefono = document.getElementById('telefono');
const ValidarNIT = document.getElementById('nit');

const ValidacionTelefono = () => {
    const cantidadDigitos = ValidarTelefono.value;

    // Si el campo está vacío, remover todas las clases de validación
    if (cantidadDigitos.length < 1) {
        ValidarTelefono.classList.remove('is-valid', 'is-invalid');
    } else {
        // Si el número no tiene exactamente 8 dígitos
        if (cantidadDigitos.length != 8){
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Numero Invalido",
                text: "el numero telefono debe ser de 8 digitos",
                timer: 2000
            });

            ValidarTelefono.classList.remove('is-valid');
            ValidarTelefono.classList.add('is-invalid');
        } else { // Si el número tiene exactamente 8 dígitos
            ValidarTelefono.classList.remove('is-invalid');
            ValidarTelefono.classList.add('is-valid');
        }
    }
}

function validarNIT(){
    const nit = ValidarNIT.value.trim();
    
    let nd, add = 0;

    if (nd = /^(\d+)-?([\dkK])$/.exec(nit)) {
        nd[2] = (nd[2].toLowerCase() === 'k') ? 10 : parseInt(nd[2], 10);

        for (let i = 0; i < nd[1].length; i++) {
            add += ((((i - nd[1].length) * -1) + 1) * parseInt(nd[1][i], 10));
        }
        return ((11 - (add % 11)) % 11) === nd[2];
    } else {
        return false;
    } 
}

const ValidacionNIT = () => {
    if (validarNIT()) {
        ValidarNIT.classList.add('is-valid');
        ValidarNIT.classList.remove('is-invalid');
    } else {
        ValidarNIT.classList.remove('is-valid');
        ValidarNIT.classList.add('is-invalid');
        Swal.fire({
            position: "center",
            icon: "error",
            title: "NIT INVALIDO",
            text: "El numero de nit ingresado es invalido",
            showConfirmButton: true,
        });
    }
    return validarNIT();
};

const TablaClientes = new DataTable('#TableClientes',{
    dom: `<"row mt-3 justify-content-between" 
                <"col" l> 
                <"col" B> 
                <"col-3" f>
            >
            t
            <"row mt-3 justify-content-between" 
                <"col-md-3 d-flex align-items-center" i> 
                <"col-md-8 d-flex justify-content-end" p>
            >`,
    language: lenguaje,
    data: [],
    columns: [
        {
            title: 'No.',
            data: 'id',
            width: '8%',
            render: (data, type, row, meta) => meta.row + 1
        },
        {
            title: 'Nombre Completo',
            data: 'nombre',
            render: (data, type, row) => `${row.nombre} ${row.apellido}`
        },
        {
            title: 'Telefono',
            data: 'telefono'
        },
        {
            title: 'NIT',
            data: 'nit'
        },
        {
            title: 'Correo',
            data: 'correo'
        },
        {
            title: 'Acciones',
            data: 'id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                return `
                <div class='d-flex justify-content-center'>
                         <button class='btn btn-warning modificar mx-1' 
                             data-id="${data}" 
                             data-nombre="${row.nombre}"  
                             data-apellido="${row.apellido}"
                             data-nit="${row.nit || ''}"  
                             data-telefono="${row.telefono || ''}"
                             data-correo="${row.correo || ''}">
                             <i class='bi bi-pencil-square me-1'></i> Modificar
                         </button>
                         <button class='btn btn-danger eliminar mx-1' 
                             data-id="${data}">
                            <i class="bi bi-trash3 me-1"></i>Eliminar
                         </button>
                     </div>`;
            }
        }
    ]
});

const guardarAPI = async (e) => {
    e.preventDefault();
    BtnGuardar.disabled = true;

    if (!validarFormulario(FormClientes, ['id'])) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Campo obligatorio",
            text: "todos los campos son obligatotios",
            showConfirmButton: true,
        });
        BtnGuardar.disabled = false; 
        return;
    }

    const body = new FormData(FormClientes);
    const url = '/app03_haga/guardarAPI';
    const config = {
        method: 'POST',
        body
    };

    try {
        const respuesta = await fetch(url, config);
        const datos = await respuesta.json();
        console.log(datos);
        const { codigo, mensaje } = datos;

        if (codigo === 1) {
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Exito",
                text: mensaje,
                showConfirmButton: true,
            });
            // limpiarTodo();
            // buscarAPI();
        }
    } catch (error) {
        console.log(error);
    }
    BtnGuardar.disabled = false;
}

//TablaClientes.on('click', '.eliminar', eliminarClientes);
//TablaClientes.on('click', '.modificar', llenarFormulario);
ValidarTelefono.addEventListener('change', ValidacionTelefono);
ValidarNIT.addEventListener('change', ValidacionNIT);
FormClientes.addEventListener('submit', guardarAPI);