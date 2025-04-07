document.addEventListener("DOMContentLoaded", function() {
    const deleteButton = document.getElementById("deleteButton");
    const favDialog = document.getElementById("favDialog");
    
    if (deleteButton && favDialog) {
      deleteButton.addEventListener("click", function(event) {
        favDialog.showModal();
      });
    } else {
      console.error("No se encontraron deleteButton o favDialog en el DOM.");
    }
  });
  
  document.addEventListener("DOMContentLoaded", function() {
    const deleteButton2 = document.getElementById("deleteButton2");
    const favDialog = document.getElementById("favDialog");
    
    if (deleteButton2 && favDialog) {
      deleteButton2.addEventListener("click", function(event) {
        favDialog.showModal();
      });
    } else {
      console.error("No se encontraron deleteButton2 o favDialog en el DOM.");
    }
  });
  