importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
importScripts('https://static.simplesocket.net/library/js/2.1/simplesocket.js');

workbox.routing.registerRoute(
    new RegExp(/.*\.(?:js|css)/g),
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|webp|mp3|mp4)/g),
    workbox.strategies.cacheFirst()
);

const socket = new SimpleSocket({
    project_id: "61b9724ea70f1912d5e0eb11",
    project_token: "client_a05cd40e9f0d2b814249f06fbf97fe0f1d5"
});

let postQuery = { task: "general", location: "home", fullNew: true };

// async function wrap_gp(pid) {
//     return new Promise(async (resolve, reject) => {
//         const [code, response] = await sendRequest("GET", `posts/get?postid=${pid}`);

//         resolve(JSON.parse(response));
//     });
// }

async function wrap_gp(pid) {
    return new Promise(async (resolve) => {
        const _shit = await fetch(`https://api.photop.live/posts/get?postid=${pid}`);
        const shit = await _shit.json();

        resolve(shit);
    });
}

socket.subscribe(postQuery, async (data) => {
    if (data.type != "newpost") return;
    if (Notification.permission != "granted") return;

    const shit = await wrap_gp(data.post._id);
    let author = shit["users"][0];
    let post = shit["posts"][0];
    self.registration.showNotification(`${author.User} (Photop)`, {
        body: `${post?.Text || ""}`,
        icon: `https://photop-content.s3.amazonaws.com/ProfileImages/${author?.Settings?.ProfilePic || "DefaultProfilePic"}`,
    });
});