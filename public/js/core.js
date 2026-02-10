function addToCart(productId, productName, productImage) {
    let formData = new FormData();
    formData.append('product_id', productId);
    formData.append('quantity', 1);

    fetch('/api/addToCart.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // Prikazujemo "Add to Cart" modal
                showAddToCartModal(productName, productImage);
            } else if (data.status === 'guest') {
                // Sačuvaj u localStorage i pokaži modal
                addToCartLocal(productId, 1);
                showAddToCartModal(productName, productImage);
            } else {
                alert(data.message);
            }

            loadLoggedInMiniCart();
            updateMiniCartCountLoggedIn();
        })
        .catch(err => console.error(err));
}

function addToCartLocal(productId, qty = 1) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let found = cart.find(item => item.product_id === productId);
    if (found) {
        found.quantity += qty;
    } else {
        cart.push({ product_id: productId, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    loadGuestMiniCart();
    updateMiniCartCountGuest();
}

function addToWishlist(productId, productName, productImage) {
    let formData = new FormData();
    formData.append('product_id', productId);

    fetch('/api/addToWishlist.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showAddToWishlistModal(productName, productImage);
            } else if (data.status === 'guest') {
                addToWishlistLocal(productId);
                showAddToWishlistModal(productName, productImage);
            } else if (data.status === 'exists') {
                alert("Već postoji na listi želja.");
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
}

function addToWishlistLocal(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

// Funkcija za prikaz "Add to Cart" modala
function showAddToCartModal(productName, productImage) {
    // Dinamički ažuriramo sliku i naziv proizvoda
    document.querySelector("#add_to_cart_modal .modal-product-img img").src = productImage;
    document.querySelector("#add_to_cart_modal .modal-product-info h5 a").textContent = productName;

    // Opcionalno: Ako želiš i link do product-details
    document.querySelector("#add_to_cart_modal .modal-product-info h5 a").href = "#";

    let cartModal = new bootstrap.Modal(document.getElementById('add_to_cart_modal'), {
        backdrop: 'static',
        keyboard: false,
        focus: false
    });
    document.activeElement.blur();
    cartModal.show();
}

// Funkcija za prikaz "Add to Wishlist" modala
function showAddToWishlistModal(productName, productImage) {
    // Dinamički ažuriramo sliku i naziv proizvoda
    document.querySelector("#liton_wishlist_modal .modal-product-img img").src = productImage;
    document.querySelector("#liton_wishlist_modal .modal-product-info h5 a").textContent = productName;

    // Opcionalno: Ako želiš i link do product-details
    document.querySelector("#liton_wishlist_modal .modal-product-info h5 a").href = "#";

    // Otvaramo modal
    let wishlistModal = new bootstrap.Modal(document.getElementById('liton_wishlist_modal'), {
        backdrop: 'static',
        keyboard: false,
        focus: false
    });
    document.activeElement.blur();
    wishlistModal.show();
}