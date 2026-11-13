const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const logoutBtn = document.getElementById('logoutBtn');
const container = document.getElementById('container');
const productsGrid = document.getElementById('productsGrid');
const ventaForm = document.getElementById('ventaForm')
const productoForm = document.getElementById('productoForm');

async function obtenerProductos(){

    const { data, error } = await window.db
        .from('productos')
        .select('*');

    if(error){
        console.log(error);
        return;
    }
    mostrarProductos(data);

}

function mostrarProductos(productos) {
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <h2>${producto.nombre}</h2>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
            <p>${producto.descripcion}</p>
        `;

        productsGrid.appendChild(card);
    });
}
obtenerProductos();

menu.addEventListener('click',()=>{
    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle');
    container.classList.toggle('menu-toggle');
});

async function cargarDashboard() {

    const { count: productos } = await window.db
        .from('productos')
        .select('*', { count: 'exact', head: true });

    document.getElementById('productos-total').textContent = productos || 0;

    const { count: ventas } = await window.db
        .from('ventas')
        .select('*', { count: 'exact', head: true });

    document.getElementById('ventas-total').textContent = ventas || 0;
}

cargarDashboard();

window.db
    .channel('dashboard-live')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => cargarDashboard()
    )
    .subscribe();


console.log(logoutBtn);
console.log(window.db);

logoutBtn.addEventListener('click', async (e) => {

    e.preventDefault();
    const { error } = await window.db.auth.signOut();

    if(error){
        console.log(error);
        alert('Error al cerrar sesión');
        return;
    }
    alert('Sesión cerrada');

    window.location.href = 'index.html';

});


/*obtener y mostrar productos */


if (productoForm) {
    productoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const cantidad = document.getElementById('cantidad').value;
        const descripcion = document.getElementById('descripcion').value;

        const { error } = await window.db
            .from('productos')
            .insert([
                {
                    nombre,
                    precio,
                    cantidad,
                    descripcion
                }
            ]);

        if (error) {
            console.log(error);
            alert('Error al guardar producto');
            return;
        }

        alert('Producto guardado');
        productoForm.reset();
    });
}

if (ventaForm) {
    ventaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const total = parseFloat(document.getElementById('total').value);
        const { data: producto, error: errorBusqueda } = await window.db
            .from('productos')
            .select('id')
            .eq('nombre', nombre)
            .single();

        if (errorBusqueda || !producto) {
            console.log(errorBusqueda);
            alert('Producto no encontrado');
            return;
        }

        const producto_id = producto.id;
        const { error } = await window.db
            .from('ventas')
            .insert([
                {
                    producto_id,
                    cantidad,
                    total
                }
            ]);

        if (error) {
            console.log(error);
            alert(error.message);
            return;
        }

        alert('Venta guardada correctamente');
        ventaForm.reset();
    });
}