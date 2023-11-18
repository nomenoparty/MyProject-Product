const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if(inputsQuantity.length > 0){
  inputsQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);
      
      if(quantity > 0 && quantity <= input.max){
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}