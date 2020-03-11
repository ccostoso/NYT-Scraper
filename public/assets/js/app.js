$( document ).ready(function() {
    $(".add-favorite").on("click", function(e) {
        e.preventDefault();
        const id = $(this).data("id");
        console.log("_id:", id);

        $.ajax({
            url: '/:id',
            method: 'PUT',
            data: id
        })
        .then(function() {
            location.reload();
        })
    });

    $("#reset").on("click", function(e) {
        e.preventDefault();

        $("main").empty();
        
        $.ajax({
            url: '/reset',
            method: 'DELETE',
            data: id
        }).then(function() {
            $.ajax({
                url: '/',
                method: 'GET'
            }).then(function(res) {
                console.log(res);
            })
        })
    })
});