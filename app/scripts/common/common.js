export function addEventViewCart(container = document) {
    const cartElement = container.querySelectorAll('.jsViewCart');
    if (cartElement.length) {
        cartElement.forEach(item => item.addEventListener("click", event => {
            event.preventDefault()
        }))
    }
}