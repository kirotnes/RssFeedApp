

function wrapIn(tag, content, attr) {
    return (attr) ? "<" + tag + " " + attr + ">" + content + "</" + tag + ">" : "<" + tag + ">" + content + "</" + tag + ">";
}

function imgError(image) {
    image.onerror = "";
    image.src = "/img/rss.jpg";
    return true;
}

function render(articles) {

    var aritcleHolder = $("#list");
    aritcleHolder.empty();

    articles.forEach(function(article) {


        var widget = wrapIn("li",
            wrapIn("div", "<img onerror='imgError(this);' src='" + ((article.image.url) ? article.image.url : "/img/rss.jpg") + "' />") +
            wrapIn("div",
                wrapIn("div",
                    wrapIn("a", article.title, "href='" + article.link + "' target='blank'")) + wrapIn("div", (article.author||"")+ " " + moment(article.pubdate).fromNow())));
       
        aritcleHolder.append(widget);


    });
}



$(function() {

	 moment.locale(navigator.language);

    var widgetId = $("#widgetid").val();
    var dataUrl = "/api/widgets/" + widgetId + "/data";
    var aritcleHolder = $("#list");

    var getDataUrl = function(){

    	return dataUrl+"?rand=" + Math.random();
    }

    var fetch = function() {
        $.get(getDataUrl(), function(data) {
            render(data);
        })
    };

    fetch();

    setInterval(fetch, 1000 * 60);

});
