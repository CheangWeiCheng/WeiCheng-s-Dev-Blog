const d = new Date();
let year = d.getFullYear();
document.getElementById("demo").innerHTML = year;

// Update the cart count in the header
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Function to add product to the cart
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to display the cart items on the cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <p><strong>${item.name}</strong></p>
                    <p>Price: S$${item.price}</p>
                    <div class="quantity">
                        <span class="minus" data-index="${index}"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-index="${index}">></span>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        // Update the total price
        updateTotalPrice();

        // Attach event listeners for the quantity buttons
        const plusButtons = document.querySelectorAll('.plus');
        const minusButtons = document.querySelectorAll('.minus');
        plusButtons.forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        minusButtons.forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
    }
}

// Function to handle increasing quantity
function increaseQuantity(event) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = parseInt(event.target.dataset.index, 10); // Get the item index from the button's data attribute

    cart[index].quantity += 1; // Increment the quantity
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    displayCartItems(); // Refresh the cart display
}

// Function to handle decreasing quantity
function decreaseQuantity(event) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = parseInt(event.target.dataset.index, 10); // Get the item index from the button's data attribute

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Decrement the quantity
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        displayCartItems(); // Refresh the cart display
    } else {
        alert('Quantity cannot be less than 1.'); // Optional user feedback
    }
}

// Function to update the total price
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPriceContainer = document.getElementById('total-price');
    if (totalPriceContainer) {
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalPriceContainer.innerHTML = `Total Price: S$${totalPrice.toFixed(2)}`;
    }
}

// Function to handle checkout
function handleCheckout() {
    localStorage.removeItem('cart'); // Clear the cart
    displayCartItems(); // Update the cart display
    updateCartCount(); // Update the cart count
    alert("Thank you for your purchase! Your cart has been emptied.");
}

// Attach all event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners for "Buy NOW!" buttons
    const buyNowButtons = document.querySelectorAll('.buy-btn');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if product details are in data attributes (for index.html)
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            if (productName && !isNaN(productPrice)) {
                // Handle buttons with data-product and data-price attributes (e.g., index.html)
                addToCart(productName, productPrice);
                console.log(`Added "${productName}" to cart for S$${productPrice}.`);
            } else {
                // Handle buttons using parent container for product details (e.g., products.html)
                const flexItem = button.closest('.flex-item');
                if (!flexItem) {
                    console.error("Could not find parent .flex-item for the 'Buy NOW!' button.");
                    return;
                }

                // Extract product information from DOM
                const productName = flexItem.querySelector('h3').textContent;
                const priceText = flexItem.querySelector('.flex-info p').textContent;
                const extractedProductPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));

                if (!isNaN(extractedProductPrice)) {
                    addToCart(productName, extractedProductPrice);
                    console.log(`Added "${productName}" to cart for S$${extractedProductPrice}.`);
                } else {
                    console.error(`Error parsing product price for "${productName}":`, priceText);
                }
            }
        });
    });

    // Update cart count on page load
    updateCartCount();

    // Attach event listener to the checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Display cart items if on the cart page
    displayCartItems();
});
