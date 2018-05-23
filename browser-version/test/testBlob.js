console.log('Beginning tests');
console.log('Please note these tests work on Chrome latest, might not work on other browsers due to discrepancies in how local storage works for the file:// protocol');

function testsFailed () {
  document.getElementById('results').innerHTML = 'TESTS FAILED';
}

var filename = 'blob';
var store = localforage.createInstance({
  name: 'test',
  storeName: 'blobs'
});
var item = { hello: 'world', _id: '1' };

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

loadXHR('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOCi1uZzynmYhuAbLg6YLVENsiNI6uTpqpBU9EqTerEPbUrgij')
  .then(function (b) {
    item.blob = b;
    store.setItem(item._id, item)
      .then(function (r) {
        console.log(r);
      })
      .catch(function (e) {
        console.error(e);
      });

    db.update({_id: item._id}, item, { upsert: true }, function (err) {
      if (err) {
        console.log(err);
        testsFailed();
        return;
      }
    });
  });
