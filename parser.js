var products = [];
$.ajax('http://67.205.130.49:3000', {
    success: function(data) {
        var xml = $.parseXML(data);
        var items = xml.children[0].children[5].children;
        for (var i = 0; i < items.length; i++) {
            var prodChildren = items[i].children;
            var prod = {
                Name: prodChildren[3].innerHTML.replace(/'/g, '׳'),
                Brand: prodChildren[4].innerHTML.replace(/'/g, '׳'),
                Code: prodChildren[1].innerHTML.replace(/'/g, '׳'),
                Price: prodChildren[12].innerHTML
            };
            products.push(prod);
        }

        $('#searchProd').removeAttr('disabled');
    }
});

function calcScore(txt, product) {
    var score = -1000;
    var txtInNameIdx = product.Name.indexOf(txt);
    if (product.Code == txt) {
        score = 100;
    } else if (product.Name == txt) {
        score = 100;
    } else if (txtInNameIdx > -1) {
        score = 5;
//        score = txt.length;
        score -= txt.length;
        if(txtInNameIdx == 0){
            score += 20;
        }
        
        if (txt.indexOf(product.Brand) > -1) {
            // has brand
            score += 20;
        }
    }

    return score;
}