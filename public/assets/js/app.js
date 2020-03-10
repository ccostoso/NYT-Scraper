$( document ).ready(function() {
    $(".add-favorite").on("click", function(e) {
        e.preventDefault();
        const id = $(this).data("id");
        console.log("_id:", id);
    });
});