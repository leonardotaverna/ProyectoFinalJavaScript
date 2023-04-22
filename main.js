const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '62619fe7d7mshf18220b0543bdb9p1734e0jsn1827061b6617',
		'X-RapidAPI-Host': 'pizzaallapala.p.rapidapi.com'
	}
};

const costos = [
    IVA=1.21,
]

const pizzeria= async () =>{
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let section = document.querySelector('.productos');
    let carro = document.querySelector('.carrito');

    mostrarCarrito();

    const productos = await fetch('https://pizzaallapala.p.rapidapi.com/productos', options);
    const prodPizzeria = await productos.json();
    console.log (prodPizzeria);
        
    prodPizzeria.productos.slice(0,11).forEach((prod) => {
        section.innerHTML +=
        `<div class="tarjeta">  
            <div class="img-box">
                <img src="${prod.linkImagen}"></img>
            </div>
            <span>${prod.nombre}</span>
            <span>${prod.descripcion}</span>
            <span>$${prod.precio}</span>
            <button id="btnResta-${prod.id}"> - </button>
            <button id="btnSuma-${prod.id}"> + </button>
        </div>`;
    });

    funcionBtnResta();
    funcionBtnSuma();
    mostrarCarrito();

    function funcionBtnSuma() {
        prodPizzeria.productos.slice(0,11).forEach((prod) => {
            document.getElementById(`btnSuma-${prod.id}`).addEventListener('click', () => {
                sumarAlCarrito(prod);
            });
        });
    }

    function funcionBtnResta() {     
        prodPizzeria.productos.slice(0,11).forEach((prod) => {
            document.getElementById(`btnResta-${prod.id}`).addEventListener('click', () => {
                restarAlCarrito(prod);
            });
        });
    }

    function sumarAlCarrito(prod) {
        let existe = carrito.some((element) => element.id == prod.id);
        if (existe === false) {
            prod.cantidad = 1;
            carrito.push(prod);
        }
        else {
            let carritoPedidos = carrito.find((element) => element.id == prod.id);
            carritoPedidos.cantidad++;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }

    function restarAlCarrito(prod) {
        let existe = carrito.some((element) => element.id == prod.id);
        if (existe === false) {
            prod.cantidad = 1;
            carrito.pop(prod);
        }
        else {
            let carritoPedidos = carrito.find((element) => element.id == prod.id);
            if (carritoPedidos.cantidad > 0) {
                carritoPedidos.cantidad--;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            }
        }
    }

    function mostrarCarrito() {
        carro.innerHTML = '';
        let totalCarrito = 0;
        carrito.slice(0,12).forEach((prod) => {
            let subtotal = (prod.cantidad * prod.precio * IVA);
            carro.innerHTML +=
            `<div class="card">
               <span><img src="${prod.linkImagen}"></img></span>
               <span>${prod.nombre}</span>
               <span>$${prod.precio} + IVA</span>
               <p>unidades: ${prod.cantidad}</p>
               <p>Subtotal compra: $${subtotal.toFixed(2)}</p>
               <button id="vaciarCarrito-${prod.id}">Borrar</button>
            </div>`;
            totalCarrito += subtotal;
        });

        carro.innerHTML +=
        `<div class="totalCompra">
            <p>Total de la compra: $${totalCarrito.toFixed(2)}</p>
            <button id= "comprar">Finalizar Compra</button>
        </div>`

        function finalizarCompra(){
            Swal.fire({
                title: '¿Está seguro que no desea agregar más productos al carrito?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Finalizar compra',
                denyButtonText: `Seguir comprando`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  Swal.fire('¡Gracias por su compra!', '', 'success')
                } else if (result.isDenied) {
                  Swal.fire('Continúe agregando productos', '', 'info')
                }
            })
        }
        
        document.getElementById("comprar").addEventListener("click",finalizarCompra);

        funcionBtnBorrar();
    }

    function funcionBtnBorrar() {
        carrito.forEach((prod) => {
            document.getElementById(`vaciarCarrito-${prod.id}`).addEventListener('click', () => {
                borrarProd(prod);
            });
        });
    }

    function borrarProd(prod) {
        carrito = carrito.filter((element) => element.id !== prod.id);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}
    
pizzeria();
