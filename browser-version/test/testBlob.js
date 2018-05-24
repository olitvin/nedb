console.log('Beginning tests');
console.log('Please note these tests work on Chrome latest, might not work on other browsers due to discrepancies in how local storage works for the file:// protocol');

function testsFailed () {
  document.getElementById('results').innerHTML = 'TESTS FAILED';
}

var filename = 'blob';
var item = { hello: 'world', _id: '14355' };

var db = new Nedb({ filename: filename, autoload: true });

function loadXHR (url) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.onerror = function () {reject('Network error.');};
      xhr.onload = function () {
        if (xhr.status === 200) {resolve(xhr.response);}else {reject('Loading error:' + xhr.statusText);}
      };
      xhr.send();
    } catch(err) {reject(err.message); }
  });
}

db.find({}, function(err, res) {
    console.log(res);
    var img = document.createElement("img");
    img.src = URL.createObjectURL(res[0].blob);
    img.id = "picture_";
    document.body.appendChild(img);

    console.log(err, res);
  });
loadXHR('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOCi1uZzynmYhuAbLg6YLVENsiNI6uTpqpBU9EqTerEPbUrgij')
  .then(function (b) {
    item.blob = new File([b], "test", {type: b.type});
    item.timestamp = new Date().getTime();
    db.update({_id: item._id}, item, { upsert: true }, function (err) {
      if (err) {
        console.log(err);
        testsFailed();
        return;
      }

      db.find({}, function(err, res) {        
        var img=document.createElement("img");
        img.src=(window.webkitURL ? webkitURL : URL).createObjectURL(res[0].blob);
        img.id="picture";
        document.body.appendChild(img);

        console.log(err, res);
      })
    });
  });
