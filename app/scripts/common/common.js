export function addEventViewCart(container = document) {
    const cartElement = container.querySelectorAll('.jsViewCart');
    console.log(cartElement)
    if (cartElement.length) {
        cartElement.forEach(item => item.addEventListener("click", event => {
            event.preventDefault()
            console.log("acb")
        }))
    }
}