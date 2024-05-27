const items = document.getElementById('items')
const objects = document.getElementById('objects')
const footer = document.getElementById('footer')

const templateCard = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content

const fragment = document.createDocumentFragment()

let cart = {}

items.addEventListener('click', e => {
    addCarrito(e)
})

document.addEventListener('DOMContentLoaded',() => {
    fetchData()

    if(localStorage.getItem('carrito')){
        cart = JSON.parse(localStorage.getItem('carrito'))
        pinterCarrito()
    }

} )


const fetchData = async() => {
    try {
        const res = await fetch('database.json')
        const data = await res.json()
        drowCards(data)
    } catch (error) {
        console.log(error)
    }
}

objects.addEventListener('click', e => {
    btnAccion(e)
})


const drowCards = data => {
    data.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = `${product.precio}`
        templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = product.id


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
}

const addCarrito = (e) => {
    if(e.target.classList.contains('btn-dark')){
        
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();

}


const setCarrito = object => {
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        price: object.querySelector('p').textContent,
        cantidad: 1,
    }

    if(cart.hasOwnProperty(product.id)){
        product.cantidad = cart[product.id].cantidad + 1
    }
    cart[product.id] = {...product}
    pinterCarrito()
}


const pinterCarrito = () => {

    objects.innerHTML = ``
    Object.values(cart).forEach(object => {
        templateCarrito.querySelector('th').textContent = object.id
        templateCarrito.querySelectorAll('td')[0].textContent = object.title
        templateCarrito.querySelectorAll('td')[1].textContent = object.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = object.id
        templateCarrito.querySelector('.btn-danger').dataset.id = object.id
        templateCarrito.querySelector('span').textContent = object.cantidad * object.price
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    objects.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(cart))
}


const pintarFooter = () => {
    footer.innerHTML = ``
    if(Object.keys(cart).length === 0){
        footer.innerHTML = `<th scope="roe" colspan="5">Carrito vacio - comienza a comprar</th>`
        return
    }

    const nCantidad = Object.values(cart).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrice = Object.values(cart).reduce((acc,{cantidad, price} ) => acc + cantidad * price, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelectorAll('span')[0].textContent = nPrice

    
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        cart = {}
        pinterCarrito()
    })
}


const btnAccion = e => {
    if(e.target.classList.contains('btn-info')){
        const producto = cart[e.target.dataset.id]
        producto.cantidad = cart[e.target.dataset.id].cantidad + 1

        cart[e.target.dataset.id] = {...producto}
        pinterCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = cart[e.target.dataset.id]
        producto.cantidad-- 
        if (producto.cantidad === 0) {
            delete cart[e.target.dataset.id]
        }

        
        pinterCarrito()
    }

    e.stopPropagation()
}