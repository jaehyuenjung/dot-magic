function loader(imageUrl, progressUpdateCallback) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", imageUrl, true);
        xhr.responseType = "arraybuffer";

        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                progressUpdateCallback(round((e.loaded / e.total) * 100 * 0.2));
            }
        };

        xhr.onloadend = function () {
            progressUpdateCallback(20);
            var options = {};
            var headers = xhr.getAllResponseHeaders();
            var typeMatch = headers.match(/^Content-Type\:\s*(.*?)$/im);

            if (typeMatch && typeMatch[1]) {
                options.type = typeMatch[1];
            }

            var blob = new Blob([this.response], options);

            resolve(window.URL.createObjectURL(blob));
        };
        xhr.send();
    });
}
