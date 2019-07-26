$(".nav-list li").click(function(){
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
});