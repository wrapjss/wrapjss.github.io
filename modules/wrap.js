modules.wrap = {};

let devMode = true;
const callsocket = new SimpleSocket({
  project_id: "658feac47d62dd1261e8c283",
  project_token: "client_60059ad91809cb92052a4004fa70b1cb293",
  // showDebug: true,
});

const Twitchstore = {
  get: async function (v) {
    let b = await sendRequest("GET", "me");
    b = JSON.parse(b[1]);
    let r = b.user.Settings.Display["Embed Twitch Streams"] || {};
    if (typeof v !== undefined && r[v]) {
      r = r[v]
    }
    if (devMode) console.log(r, b)
    return r;
  },
  set: async function (data = {}) {
    let u = await this.get();
    let s = account.Settings.Display;
    let t = Object.keys(data)
    for (i of t) {
      u[i] = data[i]
    }
    s["Embed Twitch Streams"] = u;
    let [c, r] = await sendRequest("POST", "me/settings", {
      update: "display",
      value: s
    });
    if (devMode) console.log(r)
    return r;
  },
  remove: async function (v) {
    let s = account.Settings.Display;
    let u = await this.get();
    if (!u[v]) { return }
    delete u[v]
    s["Embed Twitch Streams"] = u;
    let [c, r] = await sendRequest("POST", "me/settings", {
      update: "display",
      value: s
    });
    if (devMode) console.log(r)
    return r;
  }
}

modules.wrap.crucial = async () => {
  if (localStorage.getItem("wraptop._vp") !== "true") {
    showPopUp("Welcome to Wraptop!",
      "Wraptop is a client made by <a href='https://wrapjss.github.io/?user=wrap#profile'>@wrapjss</a> with usability and user comfort in mind. Wraptop offers uality of life and developmental features for users and developers alike.",
      [["Okay", "var(--themeColor)", () => {
        localStorage.setItem("wraptop._vp", "true");
      }]]
    );

    if (!("Notification" in window)) {
      showPopUp("Wraptop Alert",
        "Your browser does not support the Notification API, so you won't recieve notifications for new posts. Consider updating to a newer browser in order to recieve notifications.",
        [["Ok", "var(--themeColor)"]]
      );
    } else if (Notification.permission !== "granted") {
      showPopUp("Permission grant",
        "Would you like to recieve new post notifications?",
        [
          ["Yes", "var(--themeColor)", () => {
            Notification.requestPermission()
              .then((permission) => {
                if (permission == "granted") {
                  new Notification("Woohoo!", {
                    body: "You'll now be recieving notifications for new posts.",
                    icon: "data:image/jpeg;base64,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"
                  })
                }
              });
          }],
          [
            "No",
            "var(--grayColor)"
          ]
        ]
      )
    }
  }

  const newPostArea = document.getElementById('newPostArea');

  newPostArea.addEventListener('input', function () {
    let content = newPostArea.innerHTML;

    const regex = /:(\w+):/g;
    const newContent = content.replace(regex, (match, emojiName) => {
      return emojis[emojiName] || match;
    });

    if (newContent !== content) {
      newPostArea.innerHTML = newContent;
      placeCaretAtEnd(newPostArea);
    }
  });

  newPostArea.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      return true;
    }
  });

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // document.addEventListener("keypress", (e) => {
  //   const postinp = document.querySelector("#newPostArea");
  //   var isFocusedP = (document.activeElement === postinp);

  //   if (isFocusedP) {
  //     let text = postinp.innerText + e.key;

  //     for (key in Object.keys(emojis)) {
  //       if (postinp.innerText.includes(`:${key}:`))
  //         postinp.innerText = postinp.innerText.replace(`:${key}:`, emojis[key]);
  //     }
  //   }
  // });

  window.callModalOpen = false;

  sidebarButtons.addEventListener("click", async (e) => {
    let path = e.path || (e.composedPath && e.composedPath());
    let button = path[0].closest(".sidebarButton");

    const callWireframe = `
    <input class="searchUserInput" placeholder="Search for a user" id="searchUserInput"></div>
    <div id="searchResults"></div>
    `;

    if (button != null) {
      if (button.innerText == "Call" && !window.callModalOpen) {
        window.callModalOpen = true;
        await sleep(250);
        setPage("home");
        let modalID = showPopUp(
          "Make a Call",
          callWireframe,
          [["Start", "var(--themeColor)"], ["Cancel", "var(--grayColor)"]]
        );

        findI("searchResults").id = "searchResults" + modalID;
        findI("searchUserInput").id = "searchUserInput" + modalID;
        let searchResults = findI("searchResults" + modalID);
        let startButton = findI("modalButtons" + modalID).children[0];

        startButton.hidden = true;
        let selectedUsersMsg = {};

        tempListen(findI("searchUserInput" + modalID), "input", async function (e) {
          let searchTerm = findI("searchUserInput" + modalID).value;

          // Clear only non-selected users, keep selected users at the top
          let selectedUsersHTML = searchResults.querySelectorAll('.selected');
          searchResults.innerHTML = '';
          selectedUsersHTML.forEach(user => searchResults.appendChild(user));

          searchResults.innerHTML += `<div class="loading"></div>`;
          startButton.style.display = "none";
          let [code, response] = await sendRequest("GET", `user/search?term=${searchTerm}&amount=10`);
          response = JSON.parse(response);
          if (code == 200) {
            if (response.length == 0) {
              searchResults.innerText = `We couldn't find anyone named "${searchTerm}".`;
            } else {
              searchResults.innerHTML = '';
              selectedUsersHTML.forEach(user => searchResults.appendChild(user));
            }

            // Render search results
            response.forEach((user) => {
              // Skip rendering if user is already selected
              if (selectedUsersMsg[user._id]) return;

              let thisUser = createElement("newMessageUser", "div", searchResults);
              thisUser.id = user._id;
              thisUser.innerHTML = `<div class="newMessagePfp" style="background-image: url('${decideProfilePic(user)}')"></div><div class="newMessageUserInfo">${getRoleHTML(user)}<span class="newMessageUsername">${user.User}</span></div>`;
              tempListen(thisUser, "click", function () {
                if (selectedUsersMsg[thisUser.id]) {
                  delete selectedUsersMsg[thisUser.id];
                  thisUser.classList.remove("selected");
                  startButton.style.display = (Object.keys(selectedUsersMsg).length > 0 ? "inline-block" : "none");
                } else {
                  user["htmlthing"] = `<div class="newMessagePfp" style="background-image: url('${decideProfilePic(user)}')"></div><div class="newMessageUserInfo">${getRoleHTML(user)}<span class="newMessageUsername">${user.User}</span></div>`;
                  // real? v2
                  selectedUsersMsg[thisUser.id] = user;
                  thisUser.classList.add("selected");
                  startButton.style.display = "inline-block";
                  startButton.hidden = false;
                }
              });
            });
          }
        });

        startButton.onclick = async () => {
          const selectedUsers = Object.values(selectedUsersMsg);
          let selectedIDs = [];
          console.log(selectedUsers);

          for (let selectedUser of selectedUsers) {
            selectedIDs.push(selectedUser._id);
          }
          console.log(selectedIDs.join("~~"));

          // window.wident = await fetch("https://blockdata.memblu.us.to/api/createIdentifier", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json"
          //   },
          //   mode: "no-cors",
          //   body: JSON.stringify({
          //     token: JSON.parse(localStorage.getItem("token")).session,
          //     userID: userID,
          //     invited: selectedIDs.join("~~")
          //   })
          // });

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "https://blockdata.memblu.us.to/api/createIdentifier", false);
          xhr.setRequestHeader("Content-Type", "application/json");
          const senddata = {
            "token": JSON.parse(localStorage.getItem("token")).session,
            "userID": userID,
            "invited": selectedIDs.join("~~")
          }
          xhr.send(JSON.stringify(senddata));

          xhr.onload = () => {
            const responseCode = xhr.status;
            const response = xhr.responseText;

            if (responseCode == 200) {
              console.log(response);

              callsocket.publish({
                task: "call",
                action: "ping"
              }, {
                ping: selectedIDs.join("~~"),
                iden: response
              });
            }
          }

          // if (window.wident.status == 200) {
          //   console.log(await window.wident.text());
          //   callsocket.publish({
          //     task: "call",
          //     action: "ping"
          //   }, {
          //     ping: JSON.stringify(selectedIDs),
          //     iden: window.wident
          //   });
          // } else {
          //   showPopUp("Error!", "There was an error while making the call.", [["Ok", "var(--themeColor)"]]);
          // }
        }
      }
    }
  });
}

callsocket.subscribe({
  task: "call",
  action: "ping"
}, async (data) => {
  const selectedIDs = data.ping.split("~~");

  if (userID in selectedIDs) {
    // const check_ = await fetch("https://blockdata.memblu.us.to/api/verifyIdentifier", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   mode: "no-cors",
    //   body: JSON.stringify({
    //     token: JSON.parse(localStorage.getItem("token")).session,
    //     userID: userID,
    //     wtoken: data.iden
    //   })
    // });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://blockdata.memblu.us.to/api/verifyIdentifier", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    const senddata = {
      "token": JSON.parse(localStorage.getItem("token")).session,
      "userID": userID,
      "wtoken": data.iden
    };
    xhr.send(JSON.stringify(senddata));

    xhr.onload = () => {
      const responseCode = xhr.status;
      const response = xhr.response;

      if (response !== "200 OK.") return;
      const host_ = atob(data.iden.split(";")[0]);
      const [code, responsee] = sendRequest(`user?id=${host_}`);
      const host = JSON.parse(responsee);
      showPopUp("Someone's calling!", `${host.User || "Unknown User"} has invited you to a call!`, [
        ["Join", "var(--themeColor)", () => {
          // ...
        }],
        ["Decline", "var(--grayColor)"]
      ]);
    }

    console.log(await check_.text());
    if (check_.status != 200) return;
    const host_ = atob(data.iden.split(";")[0]);
    const [code, response] = sendRequest(`user?id=${host_}`);
    const host = JSON.parse(response);
    showPopUp("Someone's calling!", `${host.User || "Unknown User"} has invited you to a call!`, [
      ["Join", "var(--themeColor)", () => {
        // ...
      }],
      ["Decline", "var(--grayColor)"]
    ]);
  }
});

async function wrap_gp(pid) {
  return new Promise(async (resolve, reject) => {
    const [code, response] = await sendRequest("GET", `posts/get?postid=${pid}`);

    resolve(JSON.parse(response));
  });
}

// <iframe width="560" height="315" src="https://www.youtube.com/embed/d2KvdnmpUiY?si=ETfXT3mqwgdDET4x" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

document.getElementById("createPostButton").onclick = (e) => {
  e.preventDefault();

  if (account.User.includes("wrap")) {
    showPopUp("Nope.", "No posting. Total wrap silence, remember?", [["Ok", "var(--themeColor)"]]);
  }
}

const iframeZ = document.createElement("iframe");
iframeZ.width = 120;
iframeZ.height = 250;
// iframeZ.src = "https://www.youtube.com/embed/QPW3XwBoQlw?si=boPGApqDpclVOwjr?";
iframeZ.src = "https://www.youtube.com/embed/QPW3XwBoQlw?rel=0&amp;autoplay=1&amp;controls=0&amp;showinfo=0&mute=1"
iframeZ.title = "YouTube Video Player";
iframeZ.allow = "accelerometer; autoplay; clipboard-write; encrypted-media";
iframeZ.referrerpolicy = "strict-origin-when-cross-origin";
iframeZ.allowfullscreen = true;
iframeZ.style.marginLeft = "25px";
iframeZ.style.border = "none";
iframeZ.style.outline = "none";
// iframeZ.style.position = "fixed";
// iframeZ.style.bottom = 0;
// iframeZ.style.right = 0;
iframeZ.id = "subway";
iframeZ.addEventListener("click", () => {
  showPopUp("YouTube Embed", "Are you sure you'd like to play this content? This content may be overwheling and possibly disturbing to some audiences (it'll play anyways LMAO)", [["Yes", "var(--themeColor)"], ["No", "var(--grayColor)"]])
});
document.getElementById("sidebarSection").appendChild(iframeZ);

// window.addEventListener("scroll", function() {
//   var elementTarget = document.getElementById("subway");
//   if (window.scrollY > (elementTarget.offsetTop + elementTarget.offsetHeight)) {
//       elementTarget.style.left = window.mouseX;
//       elementTarget.style.top = window.mouseY;
//   }
// });

modules.wrap.onPost = async (post) => {
  post = await wrap_gp(post._id);
  let author = post["users"][0];
  post = post["posts"][0];
  console.log(post);

  if (document.hidden && Notification.permission == "granted") {
    // indio comi shorta indio come- *gets cut off by aggresive phonk beat*
    if (!post.Media) {
      const notif_ = new Notification(`${author.User} (Photop)`, {
        icon: `https://photop-content.s3.amazonaws.com/ProfileImages/${author?.Settings?.ProfilePic || "DefaultProfilePic"}`,
        body: `${post?.Text || null}`
      });
      // pls send helo 😭🙏
    } else {
      const notif_ = new Notification(`${author.User} (Photop)`, {
        icon: `https://photop-content.s3.amazonaws.com/ProfileImages/${author?.Settings?.ProfilePic || "DefaultProfilePic"}`,
        body: `${post?.Text || null}`,
        image: `https://photop-content.s3.amazonaws.com/PostImages/${post?._id}0`
      });
    }

    console.log(notif_);
  }
}

const emojis = { 100: '💯', 1234: '🔢', hash: '#️⃣', keycap_star: '*️⃣', zero: '0️⃣', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣', five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', copyright: '©️', registered: '®️', mahjong: '🀄', black_joker: '🃏', a: '🅰️', b: '🅱️', o2: '🅾️', parking: '🅿️', ab: '🆎', cl: '🆑', cool: '🆒', free: '🆓', id: '🆔', new: '🆕', ng: '🆖', ok: '🆗', sos: '🆘', up: '🆙', vs: '🆚', 'flag-ac': '🇦🇨', 'flag-ad': '🇦🇩', 'flag-ae': '🇦🇪', 'flag-af': '🇦🇫', 'flag-ag': '🇦🇬', 'flag-ai': '🇦🇮', 'flag-al': '🇦🇱', 'flag-am': '🇦🇲', 'flag-ao': '🇦🇴', 'flag-aq': '🇦🇶', 'flag-ar': '🇦🇷', 'flag-as': '🇦🇸', 'flag-at': '🇦🇹', 'flag-au': '🇦🇺', 'flag-aw': '🇦🇼', 'flag-ax': '🇦🇽', 'flag-az': '🇦🇿', 'flag-ba': '🇧🇦', 'flag-bb': '🇧🇧', 'flag-bd': '🇧🇩', 'flag-be': '🇧🇪', 'flag-bf': '🇧🇫', 'flag-bg': '🇧🇬', 'flag-bh': '🇧🇭', 'flag-bi': '🇧🇮', 'flag-bj': '🇧🇯', 'flag-bl': '🇧🇱', 'flag-bm': '🇧🇲', 'flag-bn': '🇧🇳', 'flag-bo': '🇧🇴', 'flag-bq': '🇧🇶', 'flag-br': '🇧🇷', 'flag-bs': '🇧🇸', 'flag-bt': '🇧🇹', 'flag-bv': '🇧🇻', 'flag-bw': '🇧🇼', 'flag-by': '🇧🇾', 'flag-bz': '🇧🇿', 'flag-ca': '🇨🇦', 'flag-cc': '🇨🇨', 'flag-cd': '🇨🇩', 'flag-cf': '🇨🇫', 'flag-cg': '🇨🇬', 'flag-ch': '🇨🇭', 'flag-ci': '🇨🇮', 'flag-ck': '🇨🇰', 'flag-cl': '🇨🇱', 'flag-cm': '🇨🇲', cn: '🇨🇳', 'flag-co': '🇨🇴', 'flag-cp': '🇨🇵', 'flag-cr': '🇨🇷', 'flag-cu': '🇨🇺', 'flag-cv': '🇨🇻', 'flag-cw': '🇨🇼', 'flag-cx': '🇨🇽', 'flag-cy': '🇨🇾', 'flag-cz': '🇨🇿', de: '🇩🇪', 'flag-dg': '🇩🇬', 'flag-dj': '🇩🇯', 'flag-dk': '🇩🇰', 'flag-dm': '🇩🇲', 'flag-do': '🇩🇴', 'flag-dz': '🇩🇿', 'flag-ea': '🇪🇦', 'flag-ec': '🇪🇨', 'flag-ee': '🇪🇪', 'flag-eg': '🇪🇬', 'flag-eh': '🇪🇭', 'flag-er': '🇪🇷', es: '🇪🇸', 'flag-et': '🇪🇹', 'flag-eu': '🇪🇺', 'flag-fi': '🇫🇮', 'flag-fj': '🇫🇯', 'flag-fk': '🇫🇰', 'flag-fm': '🇫🇲', 'flag-fo': '🇫🇴', fr: '🇫🇷', 'flag-ga': '🇬🇦', gb: '🇬🇧', 'flag-gd': '🇬🇩', 'flag-ge': '🇬🇪', 'flag-gf': '🇬🇫', 'flag-gg': '🇬🇬', 'flag-gh': '🇬🇭', 'flag-gi': '🇬🇮', 'flag-gl': '🇬🇱', 'flag-gm': '🇬🇲', 'flag-gn': '🇬🇳', 'flag-gp': '🇬🇵', 'flag-gq': '🇬🇶', 'flag-gr': '🇬🇷', 'flag-gs': '🇬🇸', 'flag-gt': '🇬🇹', 'flag-gu': '🇬🇺', 'flag-gw': '🇬🇼', 'flag-gy': '🇬🇾', 'flag-hk': '🇭🇰', 'flag-hm': '🇭🇲', 'flag-hn': '🇭🇳', 'flag-hr': '🇭🇷', 'flag-ht': '🇭🇹', 'flag-hu': '🇭🇺', 'flag-ic': '🇮🇨', 'flag-id': '🇮🇩', 'flag-ie': '🇮🇪', 'flag-il': '🇮🇱', 'flag-im': '🇮🇲', 'flag-in': '🇮🇳', 'flag-io': '🇮🇴', 'flag-iq': '🇮🇶', 'flag-ir': '🇮🇷', 'flag-is': '🇮🇸', it: '🇮🇹', 'flag-je': '🇯🇪', 'flag-jm': '🇯🇲', 'flag-jo': '🇯🇴', jp: '🇯🇵', 'flag-ke': '🇰🇪', 'flag-kg': '🇰🇬', 'flag-kh': '🇰🇭', 'flag-ki': '🇰🇮', 'flag-km': '🇰🇲', 'flag-kn': '🇰🇳', 'flag-kp': '🇰🇵', kr: '🇰🇷', 'flag-kw': '🇰🇼', 'flag-ky': '🇰🇾', 'flag-kz': '🇰🇿', 'flag-la': '🇱🇦', 'flag-lb': '🇱🇧', 'flag-lc': '🇱🇨', 'flag-li': '🇱🇮', 'flag-lk': '🇱🇰', 'flag-lr': '🇱🇷', 'flag-ls': '🇱🇸', 'flag-lt': '🇱🇹', 'flag-lu': '🇱🇺', 'flag-lv': '🇱🇻', 'flag-ly': '🇱🇾', 'flag-ma': '🇲🇦', 'flag-mc': '🇲🇨', 'flag-md': '🇲🇩', 'flag-me': '🇲🇪', 'flag-mf': '🇲🇫', 'flag-mg': '🇲🇬', 'flag-mh': '🇲🇭', 'flag-mk': '🇲🇰', 'flag-ml': '🇲🇱', 'flag-mm': '🇲🇲', 'flag-mn': '🇲🇳', 'flag-mo': '🇲🇴', 'flag-mp': '🇲🇵', 'flag-mq': '🇲🇶', 'flag-mr': '🇲🇷', 'flag-ms': '🇲🇸', 'flag-mt': '🇲🇹', 'flag-mu': '🇲🇺', 'flag-mv': '🇲🇻', 'flag-mw': '🇲🇼', 'flag-mx': '🇲🇽', 'flag-my': '🇲🇾', 'flag-mz': '🇲🇿', 'flag-na': '🇳🇦', 'flag-nc': '🇳🇨', 'flag-ne': '🇳🇪', 'flag-nf': '🇳🇫', 'flag-ng': '🇳🇬', 'flag-ni': '🇳🇮', 'flag-nl': '🇳🇱', 'flag-no': '🇳🇴', 'flag-np': '🇳🇵', 'flag-nr': '🇳🇷', 'flag-nu': '🇳🇺', 'flag-nz': '🇳🇿', 'flag-om': '🇴🇲', 'flag-pa': '🇵🇦', 'flag-pe': '🇵🇪', 'flag-pf': '🇵🇫', 'flag-pg': '🇵🇬', 'flag-ph': '🇵🇭', 'flag-pk': '🇵🇰', 'flag-pl': '🇵🇱', 'flag-pm': '🇵🇲', 'flag-pn': '🇵🇳', 'flag-pr': '🇵🇷', 'flag-ps': '🇵🇸', 'flag-pt': '🇵🇹', 'flag-pw': '🇵🇼', 'flag-py': '🇵🇾', 'flag-qa': '🇶🇦', 'flag-re': '🇷🇪', 'flag-ro': '🇷🇴', 'flag-rs': '🇷🇸', ru: '🇷🇺', 'flag-rw': '🇷🇼', 'flag-sa': '🇸🇦', 'flag-sb': '🇸🇧', 'flag-sc': '🇸🇨', 'flag-sd': '🇸🇩', 'flag-se': '🇸🇪', 'flag-sg': '🇸🇬', 'flag-sh': '🇸🇭', 'flag-si': '🇸🇮', 'flag-sj': '🇸🇯', 'flag-sk': '🇸🇰', 'flag-sl': '🇸🇱', 'flag-sm': '🇸🇲', 'flag-sn': '🇸🇳', 'flag-so': '🇸🇴', 'flag-sr': '🇸🇷', 'flag-ss': '🇸🇸', 'flag-st': '🇸🇹', 'flag-sv': '🇸🇻', 'flag-sx': '🇸🇽', 'flag-sy': '🇸🇾', 'flag-sz': '🇸🇿', 'flag-ta': '🇹🇦', 'flag-tc': '🇹🇨', 'flag-td': '🇹🇩', 'flag-tf': '🇹🇫', 'flag-tg': '🇹🇬', 'flag-th': '🇹🇭', 'flag-tj': '🇹🇯', 'flag-tk': '🇹🇰', 'flag-tl': '🇹🇱', 'flag-tm': '🇹🇲', 'flag-tn': '🇹🇳', 'flag-to': '🇹🇴', 'flag-tr': '🇹🇷', 'flag-tt': '🇹🇹', 'flag-tv': '🇹🇻', 'flag-tw': '🇹🇼', 'flag-tz': '🇹🇿', 'flag-ua': '🇺🇦', 'flag-ug': '🇺🇬', 'flag-um': '🇺🇲', 'flag-un': '🇺🇳', us: '🇺🇸', 'flag-uy': '🇺🇾', 'flag-uz': '🇺🇿', 'flag-va': '🇻🇦', 'flag-vc': '🇻🇨', 'flag-ve': '🇻🇪', 'flag-vg': '🇻🇬', 'flag-vi': '🇻🇮', 'flag-vn': '🇻🇳', 'flag-vu': '🇻🇺', 'flag-wf': '🇼🇫', 'flag-ws': '🇼🇸', 'flag-xk': '🇽🇰', 'flag-ye': '🇾🇪', 'flag-yt': '🇾🇹', 'flag-za': '🇿🇦', 'flag-zm': '🇿🇲', 'flag-zw': '🇿🇼', koko: '🈁', sa: '🈂️', u7121: '🈚', u6307: '🈯', u7981: '🈲', u7a7a: '🈳', u5408: '🈴', u6e80: '🈵', u6709: '🈶', u6708: '🈷️', u7533: '🈸', u5272: '🈹', u55b6: '🈺', ideograph_advantage: '🉐', accept: '🉑', cyclone: '🌀', foggy: '🌁', closed_umbrella: '🌂', night_with_stars: '🌃', sunrise_over_mountains: '🌄', sunrise: '🌅', city_sunset: '🌆', city_sunrise: '🌇', rainbow: '🌈', bridge_at_night: '🌉', ocean: '🌊', volcano: '🌋', milky_way: '🌌', earth_africa: '🌍', earth_americas: '🌎', earth_asia: '🌏', globe_with_meridians: '🌐', new_moon: '🌑', waxing_crescent_moon: '🌒', first_quarter_moon: '🌓', moon: '🌔', full_moon: '🌕', waning_gibbous_moon: '🌖', last_quarter_moon: '🌗', waning_crescent_moon: '🌘', crescent_moon: '🌙', new_moon_with_face: '🌚', first_quarter_moon_with_face: '🌛', last_quarter_moon_with_face: '🌜', full_moon_with_face: '🌝', sun_with_face: '🌞', star2: '🌟', stars: '🌠', thermometer: '🌡️', mostly_sunny: '🌤️', barely_sunny: '🌥️', partly_sunny_rain: '🌦️', rain_cloud: '🌧️', snow_cloud: '🌨️', lightning: '🌩️', tornado: '🌪️', fog: '🌫️', wind_blowing_face: '🌬️', hotdog: '🌭', taco: '🌮', burrito: '🌯', chestnut: '🌰', seedling: '🌱', evergreen_tree: '🌲', deciduous_tree: '🌳', palm_tree: '🌴', cactus: '🌵', hot_pepper: '🌶️', tulip: '🌷', cherry_blossom: '🌸', rose: '🌹', hibiscus: '🌺', sunflower: '🌻', blossom: '🌼', corn: '🌽', ear_of_rice: '🌾', herb: '🌿', four_leaf_clover: '🍀', maple_leaf: '🍁', fallen_leaf: '🍂', leaves: '🍃', mushroom: '🍄', tomato: '🍅', eggplant: '🍆', grapes: '🍇', melon: '🍈', watermelon: '🍉', tangerine: '🍊', lemon: '🍋', banana: '🍌', pineapple: '🍍', apple: '🍎', green_apple: '🍏', pear: '🍐', peach: '🍑', cherries: '🍒', strawberry: '🍓', hamburger: '🍔', pizza: '🍕', meat_on_bone: '🍖', poultry_leg: '🍗', rice_cracker: '🍘', rice_ball: '🍙', rice: '🍚', curry: '🍛', ramen: '🍜', spaghetti: '🍝', bread: '🍞', fries: '🍟', sweet_potato: '🍠', dango: '🍡', oden: '🍢', sushi: '🍣', fried_shrimp: '🍤', fish_cake: '🍥', icecream: '🍦', shaved_ice: '🍧', ice_cream: '🍨', doughnut: '🍩', cookie: '🍪', chocolate_bar: '🍫', candy: '🍬', lollipop: '🍭', custard: '🍮', honey_pot: '🍯', cake: '🍰', bento: '🍱', stew: '🍲', fried_egg: '🍳', fork_and_knife: '🍴', tea: '🍵', sake: '🍶', wine_glass: '🍷', cocktail: '🍸', tropical_drink: '🍹', beer: '🍺', beers: '🍻', baby_bottle: '🍼', knife_fork_plate: '🍽️', champagne: '🍾', popcorn: '🍿', ribbon: '🎀', gift: '🎁', birthday: '🎂', jack_o_lantern: '🎃', christmas_tree: '🎄', santa: '🎅', fireworks: '🎆', sparkler: '🎇', balloon: '🎈', tada: '🎉', confetti_ball: '🎊', tanabata_tree: '🎋', crossed_flags: '🎌', bamboo: '🎍', dolls: '🎎', flags: '🎏', wind_chime: '🎐', rice_scene: '🎑', school_satchel: '🎒', mortar_board: '🎓', medal: '🎖️', reminder_ribbon: '🎗️', studio_microphone: '🎙️', level_slider: '🎚️', control_knobs: '🎛️', film_frames: '🎞️', admission_tickets: '🎟️', carousel_horse: '🎠', ferris_wheel: '🎡', roller_coaster: '🎢', fishing_pole_and_fish: '🎣', microphone: '🎤', movie_camera: '🎥', cinema: '🎦', headphones: '🎧', art: '🎨', tophat: '🎩', circus_tent: '🎪', ticket: '🎫', clapper: '🎬', performing_arts: '🎭', video_game: '🎮', dart: '🎯', slot_machine: '🎰', '8ball': '🎱', game_die: '🎲', bowling: '🎳', flower_playing_cards: '🎴', musical_note: '🎵', notes: '🎶', saxophone: '🎷', guitar: '🎸', musical_keyboard: '🎹', trumpet: '🎺', violin: '🎻', musical_score: '🎼', running_shirt_with_sash: '🎽', tennis: '🎾', ski: '🎿', basketball: '🏀', checkered_flag: '🏁', snowboarder: '🏂', 'woman-running': '🏃‍♀️', 'man-running': '🏃‍♂️', runner: '🏃', 'woman-surfing': '🏄‍♀️', 'man-surfing': '🏄‍♂️', surfer: '🏄', sports_medal: '🏅', trophy: '🏆', horse_racing: '🏇', football: '🏈', rugby_football: '🏉', 'woman-swimming': '🏊‍♀️', 'man-swimming': '🏊‍♂️', swimmer: '🏊', 'woman-lifting-weights': '🏋️‍♀️', 'man-lifting-weights': '🏋️‍♂️', weight_lifter: '🏋️', 'woman-golfing': '🏌️‍♀️', 'man-golfing': '🏌️‍♂️', golfer: '🏌️', racing_motorcycle: '🏍️', racing_car: '🏎️', cricket_bat_and_ball: '🏏', volleyball: '🏐', field_hockey_stick_and_ball: '🏑', ice_hockey_stick_and_puck: '🏒', table_tennis_paddle_and_ball: '🏓', snow_capped_mountain: '🏔️', camping: '🏕️', beach_with_umbrella: '🏖️', building_construction: '🏗️', house_buildings: '🏘️', cityscape: '🏙️', derelict_house_building: '🏚️', classical_building: '🏛️', desert: '🏜️', desert_island: '🏝️', national_park: '🏞️', stadium: '🏟️', house: '🏠', house_with_garden: '🏡', office: '🏢', post_office: '🏣', european_post_office: '🏤', hospital: '🏥', bank: '🏦', atm: '🏧', hotel: '🏨', love_hotel: '🏩', convenience_store: '🏪', school: '🏫', department_store: '🏬', factory: '🏭', izakaya_lantern: '🏮', japanese_castle: '🏯', european_castle: '🏰', 'rainbow-flag': '🏳️‍🌈', waving_white_flag: '🏳️', pirate_flag: '🏴‍☠️', 'flag-england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'flag-scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'flag-wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', waving_black_flag: '🏴', rosette: '🏵️', label: '🏷️', badminton_racquet_and_shuttlecock: '🏸', bow_and_arrow: '🏹', amphora: '🏺', 'skin-tone-2': '🏻', 'skin-tone-3': '🏼', 'skin-tone-4': '🏽', 'skin-tone-5': '🏾', 'skin-tone-6': '🏿', rat: '🐀', mouse2: '🐁', ox: '🐂', water_buffalo: '🐃', cow2: '🐄', tiger2: '🐅', leopard: '🐆', rabbit2: '🐇', cat2: '🐈', dragon: '🐉', crocodile: '🐊', whale2: '🐋', snail: '🐌', snake: '🐍', racehorse: '🐎', ram: '🐏', goat: '🐐', sheep: '🐑', monkey: '🐒', rooster: '🐓', chicken: '🐔', service_dog: '🐕‍🦺', dog2: '🐕', pig2: '🐖', boar: '🐗', elephant: '🐘', octopus: '🐙', shell: '🐚', bug: '🐛', ant: '🐜', bee: '🐝', beetle: '🐞', fish: '🐟', tropical_fish: '🐠', blowfish: '🐡', turtle: '🐢', hatching_chick: '🐣', baby_chick: '🐤', hatched_chick: '🐥', bird: '🐦', penguin: '🐧', koala: '🐨', poodle: '🐩', dromedary_camel: '🐪', camel: '🐫', dolphin: '🐬', mouse: '🐭', cow: '🐮', tiger: '🐯', rabbit: '🐰', cat: '🐱', dragon_face: '🐲', whale: '🐳', horse: '🐴', monkey_face: '🐵', dog: '🐶', pig: '🐷', frog: '🐸', hamster: '🐹', wolf: '🐺', bear: '🐻', panda_face: '🐼', pig_nose: '🐽', feet: '🐾', chipmunk: '🐿️', eyes: '👀', 'eye-in-speech-bubble': '👁️‍🗨️', eye: '👁️', ear: '👂', nose: '👃', lips: '👄', tongue: '👅', point_up_2: '👆', point_down: '👇', point_left: '👈', point_right: '👉', facepunch: '👊', wave: '👋', ok_hand: '👌', '+1': '👍', '-1': '👎', clap: '👏', open_hands: '👐', crown: '👑', womans_hat: '👒', eyeglasses: '👓', necktie: '👔', shirt: '👕', jeans: '👖', dress: '👗', kimono: '👘', bikini: '👙', womans_clothes: '👚', purse: '👛', handbag: '👜', pouch: '👝', mans_shoe: '👞', athletic_shoe: '👟', high_heel: '👠', sandal: '👡', boot: '👢', footprints: '👣', bust_in_silhouette: '👤', busts_in_silhouette: '👥', boy: '👦', girl: '👧', 'male-farmer': '👨‍🌾', 'male-cook': '👨‍🍳', 'male-student': '👨‍🎓', 'male-singer': '👨‍🎤', 'male-artist': '👨‍🎨', 'male-teacher': '👨‍🏫', 'male-factory-worker': '👨‍🏭', 'man-boy-boy': '👨‍👦‍👦', 'man-boy': '👨‍👦', 'man-girl-boy': '👨‍👧‍👦', 'man-girl-girl': '👨‍👧‍👧', 'man-girl': '👨‍👧', 'man-man-boy': '👨‍👨‍👦', 'man-man-boy-boy': '👨‍👨‍👦‍👦', 'man-man-girl': '👨‍👨‍👧', 'man-man-girl-boy': '👨‍👨‍👧‍👦', 'man-man-girl-girl': '👨‍👨‍👧‍👧', 'man-woman-boy': '👨‍👩‍👦', 'man-woman-boy-boy': '👨‍👩‍👦‍👦', 'man-woman-girl': '👨‍👩‍👧', 'man-woman-girl-boy': '👨‍👩‍👧‍👦', 'man-woman-girl-girl': '👨‍👩‍👧‍👧', 'male-technologist': '👨‍💻', 'male-office-worker': '👨‍💼', 'male-mechanic': '👨‍🔧', 'male-scientist': '👨‍🔬', 'male-astronaut': '👨‍🚀', 'male-firefighter': '👨‍🚒', man_with_probing_cane: '👨‍🦯', red_haired_man: '👨‍🦰', curly_haired_man: '👨‍🦱', bald_man: '👨‍🦲', white_haired_man: '👨‍🦳', man_in_motorized_wheelchair: '👨‍🦼', man_in_manual_wheelchair: '👨‍🦽', 'male-doctor': '👨‍⚕️', 'male-judge': '👨‍⚖️', 'male-pilot': '👨‍✈️', 'man-heart-man': '👨‍❤️‍👨', 'man-kiss-man': '👨‍❤️‍💋‍👨', man: '👨', 'female-farmer': '👩‍🌾', 'female-cook': '👩‍🍳', 'female-student': '👩‍🎓', 'female-singer': '👩‍🎤', 'female-artist': '👩‍🎨', 'female-teacher': '👩‍🏫', 'female-factory-worker': '👩‍🏭', 'woman-boy-boy': '👩‍👦‍👦', 'woman-boy': '👩‍👦', 'woman-girl-boy': '👩‍👧‍👦', 'woman-girl-girl': '👩‍👧‍👧', 'woman-girl': '👩‍👧', 'woman-woman-boy': '👩‍👩‍👦', 'woman-woman-boy-boy': '👩‍👩‍👦‍👦', 'woman-woman-girl': '👩‍👩‍👧', 'woman-woman-girl-boy': '👩‍👩‍👧‍👦', 'woman-woman-girl-girl': '👩‍👩‍👧‍👧', 'female-technologist': '👩‍💻', 'female-office-worker': '👩‍💼', 'female-mechanic': '👩‍🔧', 'female-scientist': '👩‍🔬', 'female-astronaut': '👩‍🚀', 'female-firefighter': '👩‍🚒', woman_with_probing_cane: '👩‍🦯', red_haired_woman: '👩‍🦰', curly_haired_woman: '👩‍🦱', bald_woman: '👩‍🦲', white_haired_woman: '👩‍🦳', woman_in_motorized_wheelchair: '👩‍🦼', woman_in_manual_wheelchair: '👩‍🦽', 'female-doctor': '👩‍⚕️', 'female-judge': '👩‍⚖️', 'female-pilot': '👩‍✈️', 'woman-heart-man': '👩‍❤️‍👨', 'woman-heart-woman': '👩‍❤️‍👩', 'woman-kiss-man': '👩‍❤️‍💋‍👨', 'woman-kiss-woman': '👩‍❤️‍💋‍👩', woman: '👩', family: '👪', couple: '👫', two_men_holding_hands: '👬', two_women_holding_hands: '👭', 'female-police-officer': '👮‍♀️', 'male-police-officer': '👮‍♂️', cop: '👮', 'woman-with-bunny-ears-partying': '👯‍♀️', 'man-with-bunny-ears-partying': '👯‍♂️', dancers: '👯', bride_with_veil: '👰', 'blond-haired-woman': '👱‍♀️', 'blond-haired-man': '👱‍♂️', person_with_blond_hair: '👱', man_with_gua_pi_mao: '👲', 'woman-wearing-turban': '👳‍♀️', 'man-wearing-turban': '👳‍♂️', man_with_turban: '👳', older_man: '👴', older_woman: '👵', baby: '👶', 'female-construction-worker': '👷‍♀️', 'male-construction-worker': '👷‍♂️', construction_worker: '👷', princess: '👸', japanese_ogre: '👹', japanese_goblin: '👺', ghost: '👻', angel: '👼', alien: '👽', space_invader: '👾', imp: '👿', skull: '💀', 'woman-tipping-hand': '💁‍♀️', 'man-tipping-hand': '💁‍♂️', information_desk_person: '💁', 'female-guard': '💂‍♀️', 'male-guard': '💂‍♂️', guardsman: '💂', dancer: '💃', lipstick: '💄', nail_care: '💅', 'woman-getting-massage': '💆‍♀️', 'man-getting-massage': '💆‍♂️', massage: '💆', 'woman-getting-haircut': '💇‍♀️', 'man-getting-haircut': '💇‍♂️', haircut: '💇', barber: '💈', syringe: '💉', pill: '💊', kiss: '💋', love_letter: '💌', ring: '💍', gem: '💎', couplekiss: '💏', bouquet: '💐', couple_with_heart: '💑', wedding: '💒', heartbeat: '💓', broken_heart: '💔', two_hearts: '💕', sparkling_heart: '💖', heartpulse: '💗', cupid: '💘', blue_heart: '💙', green_heart: '💚', yellow_heart: '💛', purple_heart: '💜', gift_heart: '💝', revolving_hearts: '💞', heart_decoration: '💟', diamond_shape_with_a_dot_inside: '💠', bulb: '💡', anger: '💢', bomb: '💣', zzz: '💤', boom: '💥', sweat_drops: '💦', droplet: '💧', dash: '💨', hankey: '💩', muscle: '💪', dizzy: '💫', speech_balloon: '💬', thought_balloon: '💭', white_flower: '💮', moneybag: '💰', currency_exchange: '💱', heavy_dollar_sign: '💲', credit_card: '💳', yen: '💴', dollar: '💵', euro: '💶', pound: '💷', money_with_wings: '💸', chart: '💹', seat: '💺', computer: '💻', briefcase: '💼', minidisc: '💽', floppy_disk: '💾', cd: '💿', dvd: '📀', file_folder: '📁', open_file_folder: '📂', page_with_curl: '📃', page_facing_up: '📄', date: '📅', calendar: '📆', card_index: '📇', chart_with_upwards_trend: '📈', chart_with_downwards_trend: '📉', bar_chart: '📊', clipboard: '📋', pushpin: '📌', round_pushpin: '📍', paperclip: '📎', straight_ruler: '📏', triangular_ruler: '📐', bookmark_tabs: '📑', ledger: '📒', notebook: '📓', notebook_with_decorative_cover: '📔', closed_book: '📕', book: '📖', green_book: '📗', blue_book: '📘', orange_book: '📙', books: '📚', name_badge: '📛', scroll: '📜', memo: '📝', telephone_receiver: '📞', pager: '📟', fax: '📠', satellite_antenna: '📡', loudspeaker: '📢', mega: '📣', outbox_tray: '📤', inbox_tray: '📥', package: '📦', 'e-mail': '📧', incoming_envelope: '📨', envelope_with_arrow: '📩', mailbox_closed: '📪', mailbox: '📫', mailbox_with_mail: '📬', mailbox_with_no_mail: '📭', postbox: '📮', postal_horn: '📯', newspaper: '📰', iphone: '📱', calling: '📲', vibration_mode: '📳', mobile_phone_off: '📴', no_mobile_phones: '📵', signal_strength: '📶', camera: '📷', camera_with_flash: '📸', video_camera: '📹', tv: '📺', radio: '📻', vhs: '📼', film_projector: '📽️', prayer_beads: '📿', twisted_rightwards_arrows: '🔀', repeat: '🔁', repeat_one: '🔂', arrows_clockwise: '🔃', arrows_counterclockwise: '🔄', low_brightness: '🔅', high_brightness: '🔆', mute: '🔇', speaker: '🔈', sound: '🔉', loud_sound: '🔊', battery: '🔋', electric_plug: '🔌', mag: '🔍', mag_right: '🔎', lock_with_ink_pen: '🔏', closed_lock_with_key: '🔐', key: '🔑', lock: '🔒', unlock: '🔓', bell: '🔔', no_bell: '🔕', bookmark: '🔖', link: '🔗', radio_button: '🔘', back: '🔙', end: '🔚', on: '🔛', soon: '🔜', top: '🔝', underage: '🔞', keycap_ten: '🔟', capital_abcd: '🔠', abcd: '🔡', symbols: '🔣', abc: '🔤', fire: '🔥', flashlight: '🔦', wrench: '🔧', hammer: '🔨', nut_and_bolt: '🔩', hocho: '🔪', gun: '🔫', microscope: '🔬', telescope: '🔭', crystal_ball: '🔮', six_pointed_star: '🔯', beginner: '🔰', trident: '🔱', black_square_button: '🔲', white_square_button: '🔳', red_circle: '🔴', large_blue_circle: '🔵', large_orange_diamond: '🔶', large_blue_diamond: '🔷', small_orange_diamond: '🔸', small_blue_diamond: '🔹', small_red_triangle: '🔺', small_red_triangle_down: '🔻', arrow_up_small: '🔼', arrow_down_small: '🔽', om_symbol: '🕉️', dove_of_peace: '🕊️', kaaba: '🕋', mosque: '🕌', synagogue: '🕍', menorah_with_nine_branches: '🕎', clock1: '🕐', clock2: '🕑', clock3: '🕒', clock4: '🕓', clock5: '🕔', clock6: '🕕', clock7: '🕖', clock8: '🕗', clock9: '🕘', clock10: '🕙', clock11: '🕚', clock12: '🕛', clock130: '🕜', clock230: '🕝', clock330: '🕞', clock430: '🕟', clock530: '🕠', clock630: '🕡', clock730: '🕢', clock830: '🕣', clock930: '🕤', clock1030: '🕥', clock1130: '🕦', clock1230: '🕧', candle: '🕯️', mantelpiece_clock: '🕰️', hole: '🕳️', man_in_business_suit_levitating: '🕴️', 'female-detective': '🕵️‍♀️', 'male-detective': '🕵️‍♂️', sleuth_or_spy: '🕵️', dark_sunglasses: '🕶️', spider: '🕷️', spider_web: '🕸️', joystick: '🕹️', man_dancing: '🕺', linked_paperclips: '🖇️', lower_left_ballpoint_pen: '🖊️', lower_left_fountain_pen: '🖋️', lower_left_paintbrush: '🖌️', lower_left_crayon: '🖍️', raised_hand_with_fingers_splayed: '🖐️', middle_finger: '🖕', 'spock-hand': '🖖', black_heart: '🖤', desktop_computer: '🖥️', printer: '🖨️', three_button_mouse: '🖱️', trackball: '🖲️', frame_with_picture: '🖼️', card_index_dividers: '🗂️', card_file_box: '🗃️', file_cabinet: '🗄️', wastebasket: '🗑️', spiral_note_pad: '🗒️', spiral_calendar_pad: '🗓️', compression: '🗜️', old_key: '🗝️', rolled_up_newspaper: '🗞️', dagger_knife: '🗡️', speaking_head_in_silhouette: '🗣️', left_speech_bubble: '🗨️', right_anger_bubble: '🗯️', ballot_box_with_ballot: '🗳️', world_map: '🗺️', mount_fuji: '🗻', tokyo_tower: '🗼', statue_of_liberty: '🗽', japan: '🗾', moyai: '🗿', grinning: '😀', grin: '😁', joy: '😂', smiley: '😃', smile: '😄', sweat_smile: '😅', laughing: '😆', innocent: '😇', smiling_imp: '😈', wink: '😉', blush: '😊', yum: '😋', relieved: '😌', heart_eyes: '😍', sunglasses: '😎', smirk: '😏', neutral_face: '😐', expressionless: '😑', unamused: '😒', sweat: '😓', pensive: '😔', confused: '😕', confounded: '😖', kissing: '😗', kissing_heart: '😘', kissing_smiling_eyes: '😙', kissing_closed_eyes: '😚', stuck_out_tongue: '😛', stuck_out_tongue_winking_eye: '😜', stuck_out_tongue_closed_eyes: '😝', disappointed: '😞', worried: '😟', angry: '😠', rage: '😡', cry: '😢', persevere: '😣', triumph: '😤', disappointed_relieved: '😥', frowning: '😦', anguished: '😧', fearful: '😨', weary: '😩', sleepy: '😪', tired_face: '😫', grimacing: '😬', sob: '😭', open_mouth: '😮', hushed: '😯', cold_sweat: '😰', scream: '😱', astonished: '😲', flushed: '😳', sleeping: '😴', dizzy_face: '😵', no_mouth: '😶', mask: '😷', smile_cat: '😸', joy_cat: '😹', smiley_cat: '😺', heart_eyes_cat: '😻', smirk_cat: '😼', kissing_cat: '😽', pouting_cat: '😾', crying_cat_face: '😿', scream_cat: '🙀', slightly_frowning_face: '🙁', slightly_smiling_face: '🙂', upside_down_face: '🙃', face_with_rolling_eyes: '🙄', 'woman-gesturing-no': '🙅‍♀️', 'man-gesturing-no': '🙅‍♂️', no_good: '🙅', 'woman-gesturing-ok': '🙆‍♀️', 'man-gesturing-ok': '🙆‍♂️', ok_woman: '🙆', 'woman-bowing': '🙇‍♀️', 'man-bowing': '🙇‍♂️', bow: '🙇', see_no_evil: '🙈', hear_no_evil: '🙉', speak_no_evil: '🙊', 'woman-raising-hand': '🙋‍♀️', 'man-raising-hand': '🙋‍♂️', raising_hand: '🙋', raised_hands: '🙌', 'woman-frowning': '🙍‍♀️', 'man-frowning': '🙍‍♂️', person_frowning: '🙍', 'woman-pouting': '🙎‍♀️', 'man-pouting': '🙎‍♂️', person_with_pouting_face: '🙎', pray: '🙏', rocket: '🚀', helicopter: '🚁', steam_locomotive: '🚂', railway_car: '🚃', bullettrain_side: '🚄', bullettrain_front: '🚅', train2: '🚆', metro: '🚇', light_rail: '🚈', station: '🚉', tram: '🚊', train: '🚋', bus: '🚌', oncoming_bus: '🚍', trolleybus: '🚎', busstop: '🚏', minibus: '🚐', ambulance: '🚑', fire_engine: '🚒', police_car: '🚓', oncoming_police_car: '🚔', taxi: '🚕', oncoming_taxi: '🚖', car: '🚗', oncoming_automobile: '🚘', blue_car: '🚙', truck: '🚚', articulated_lorry: '🚛', tractor: '🚜', monorail: '🚝', mountain_railway: '🚞', suspension_railway: '🚟', mountain_cableway: '🚠', aerial_tramway: '🚡', ship: '🚢', 'woman-rowing-boat': '🚣‍♀️', 'man-rowing-boat': '🚣‍♂️', rowboat: '🚣', speedboat: '🚤', traffic_light: '🚥', vertical_traffic_light: '🚦', construction: '🚧', rotating_light: '🚨', triangular_flag_on_post: '🚩', door: '🚪', no_entry_sign: '🚫', smoking: '🚬', no_smoking: '🚭', put_litter_in_its_place: '🚮', do_not_litter: '🚯', potable_water: '🚰', 'non-potable_water': '🚱', bike: '🚲', no_bicycles: '🚳', 'woman-biking': '🚴‍♀️', 'man-biking': '🚴‍♂️', bicyclist: '🚴', 'woman-mountain-biking': '🚵‍♀️', 'man-mountain-biking': '🚵‍♂️', mountain_bicyclist: '🚵', 'woman-walking': '🚶‍♀️', 'man-walking': '🚶‍♂️', walking: '🚶', no_pedestrians: '🚷', children_crossing: '🚸', mens: '🚹', womens: '🚺', restroom: '🚻', baby_symbol: '🚼', toilet: '🚽', wc: '🚾', shower: '🚿', bath: '🛀', bathtub: '🛁', passport_control: '🛂', customs: '🛃', baggage_claim: '🛄', left_luggage: '🛅', couch_and_lamp: '🛋️', sleeping_accommodation: '🛌', shopping_bags: '🛍️', bellhop_bell: '🛎️', bed: '🛏️', place_of_worship: '🛐', octagonal_sign: '🛑', shopping_trolley: '🛒', hindu_temple: '🛕', hammer_and_wrench: '🛠️', shield: '🛡️', oil_drum: '🛢️', motorway: '🛣️', railway_track: '🛤️', motor_boat: '🛥️', small_airplane: '🛩️', airplane_departure: '🛫', airplane_arriving: '🛬', satellite: '🛰️', passenger_ship: '🛳️', scooter: '🛴', motor_scooter: '🛵', canoe: '🛶', sled: '🛷', flying_saucer: '🛸', skateboard: '🛹', auto_rickshaw: '🛺', large_orange_circle: '🟠', large_yellow_circle: '🟡', large_green_circle: '🟢', large_purple_circle: '🟣', large_brown_circle: '🟤', large_red_square: '🟥', large_blue_square: '🟦', large_orange_square: '🟧', large_yellow_square: '🟨', large_green_square: '🟩', large_purple_square: '🟪', large_brown_square: '🟫', white_heart: '🤍', brown_heart: '🤎', pinching_hand: '🤏', zipper_mouth_face: '🤐', money_mouth_face: '🤑', face_with_thermometer: '🤒', nerd_face: '🤓', thinking_face: '🤔', face_with_head_bandage: '🤕', robot_face: '🤖', hugging_face: '🤗', the_horns: '🤘', call_me_hand: '🤙', raised_back_of_hand: '🤚', 'left-facing_fist': '🤛', 'right-facing_fist': '🤜', handshake: '🤝', crossed_fingers: '🤞', i_love_you_hand_sign: '🤟', face_with_cowboy_hat: '🤠', clown_face: '🤡', nauseated_face: '🤢', rolling_on_the_floor_laughing: '🤣', drooling_face: '🤤', lying_face: '🤥', 'woman-facepalming': '🤦‍♀️', 'man-facepalming': '🤦‍♂️', face_palm: '🤦', sneezing_face: '🤧', face_with_raised_eyebrow: '🤨', 'star-struck': '🤩', zany_face: '🤪', shushing_face: '🤫', face_with_symbols_on_mouth: '🤬', face_with_hand_over_mouth: '🤭', face_vomiting: '🤮', exploding_head: '🤯', pregnant_woman: '🤰', 'breast-feeding': '🤱', palms_up_together: '🤲', selfie: '🤳', prince: '🤴', man_in_tuxedo: '🤵', mrs_claus: '🤶', 'woman-shrugging': '🤷‍♀️', 'man-shrugging': '🤷‍♂️', shrug: '🤷', 'woman-cartwheeling': '🤸‍♀️', 'man-cartwheeling': '🤸‍♂️', person_doing_cartwheel: '🤸', 'woman-juggling': '🤹‍♀️', 'man-juggling': '🤹‍♂️', juggling: '🤹', fencer: '🤺', 'woman-wrestling': '🤼‍♀️', 'man-wrestling': '🤼‍♂️', wrestlers: '🤼', 'woman-playing-water-polo': '🤽‍♀️', 'man-playing-water-polo': '🤽‍♂️', water_polo: '🤽', 'woman-playing-handball': '🤾‍♀️', 'man-playing-handball': '🤾‍♂️', handball: '🤾', diving_mask: '🤿', wilted_flower: '🥀', drum_with_drumsticks: '🥁', clinking_glasses: '🥂', tumbler_glass: '🥃', spoon: '🥄', goal_net: '🥅', first_place_medal: '🥇', second_place_medal: '🥈', third_place_medal: '🥉', boxing_glove: '🥊', martial_arts_uniform: '🥋', curling_stone: '🥌', lacrosse: '🥍', softball: '🥎', flying_disc: '🥏', croissant: '🥐', avocado: '🥑', cucumber: '🥒', bacon: '🥓', potato: '🥔', carrot: '🥕', baguette_bread: '🥖', green_salad: '🥗', shallow_pan_of_food: '🥘', stuffed_flatbread: '🥙', egg: '🥚', glass_of_milk: '🥛', peanuts: '🥜', kiwifruit: '🥝', pancakes: '🥞', dumpling: '🥟', fortune_cookie: '🥠', takeout_box: '🥡', chopsticks: '🥢', bowl_with_spoon: '🥣', cup_with_straw: '🥤', coconut: '🥥', broccoli: '🥦', pie: '🥧', pretzel: '🥨', cut_of_meat: '🥩', sandwich: '🥪', canned_food: '🥫', leafy_green: '🥬', mango: '🥭', moon_cake: '🥮', bagel: '🥯', smiling_face_with_3_hearts: '🥰', yawning_face: '🥱', partying_face: '🥳', woozy_face: '🥴', hot_face: '🥵', cold_face: '🥶', pleading_face: '🥺', sari: '🥻', lab_coat: '🥼', goggles: '🥽', hiking_boot: '🥾', womans_flat_shoe: '🥿', crab: '🦀', lion_face: '🦁', scorpion: '🦂', turkey: '🦃', unicorn_face: '🦄', eagle: '🦅', duck: '🦆', bat: '🦇', shark: '🦈', owl: '🦉', fox_face: '🦊', butterfly: '🦋', deer: '🦌', gorilla: '🦍', lizard: '🦎', rhinoceros: '🦏', shrimp: '🦐', squid: '🦑', giraffe_face: '🦒', zebra_face: '🦓', hedgehog: '🦔', sauropod: '🦕', 't-rex': '🦖', cricket: '🦗', kangaroo: '🦘', llama: '🦙', peacock: '🦚', hippopotamus: '🦛', parrot: '🦜', raccoon: '🦝', lobster: '🦞', mosquito: '🦟', microbe: '🦠', badger: '🦡', swan: '🦢', sloth: '🦥', otter: '🦦', orangutan: '🦧', skunk: '🦨', flamingo: '🦩', oyster: '🦪', guide_dog: '🦮', probing_cane: '🦯', bone: '🦴', leg: '🦵', foot: '🦶', tooth: '🦷', female_superhero: '🦸‍♀️', male_superhero: '🦸‍♂️', superhero: '🦸', female_supervillain: '🦹‍♀️', male_supervillain: '🦹‍♂️', supervillain: '🦹', safety_vest: '🦺', ear_with_hearing_aid: '🦻', motorized_wheelchair: '🦼', manual_wheelchair: '🦽', mechanical_arm: '🦾', mechanical_leg: '🦿', cheese_wedge: '🧀', cupcake: '🧁', salt: '🧂', beverage_box: '🧃', garlic: '🧄', onion: '🧅', falafel: '🧆', waffle: '🧇', butter: '🧈', mate_drink: '🧉', ice_cube: '🧊', woman_standing: '🧍‍♀️', man_standing: '🧍‍♂️', standing_person: '🧍', woman_kneeling: '🧎‍♀️', man_kneeling: '🧎‍♂️', kneeling_person: '🧎', deaf_woman: '🧏‍♀️', deaf_man: '🧏‍♂️', deaf_person: '🧏', face_with_monocle: '🧐', farmer: '🧑‍🌾', cook: '🧑‍🍳', student: '🧑‍🎓', singer: '🧑‍🎤', artist: '🧑‍🎨', teacher: '🧑‍🏫', factory_worker: '🧑‍🏭', technologist: '🧑‍💻', office_worker: '🧑‍💼', mechanic: '🧑‍🔧', scientist: '🧑‍🔬', astronaut: '🧑‍🚀', firefighter: '🧑‍🚒', people_holding_hands: '🧑‍🤝‍🧑', person_with_probing_cane: '🧑‍🦯', red_haired_person: '🧑‍🦰', curly_haired_person: '🧑‍🦱', bald_person: '🧑‍🦲', white_haired_person: '🧑‍🦳', person_in_motorized_wheelchair: '🧑‍🦼', person_in_manual_wheelchair: '🧑‍🦽', health_worker: '🧑‍⚕️', judge: '🧑‍⚖️', pilot: '🧑‍✈️', adult: '🧑', child: '🧒', older_adult: '🧓', bearded_person: '🧔', person_with_headscarf: '🧕', woman_in_steamy_room: '🧖‍♀️', man_in_steamy_room: '🧖‍♂️', person_in_steamy_room: '🧖', woman_climbing: '🧗‍♀️', man_climbing: '🧗‍♂️', person_climbing: '🧗', woman_in_lotus_position: '🧘‍♀️', man_in_lotus_position: '🧘‍♂️', person_in_lotus_position: '🧘', female_mage: '🧙‍♀️', male_mage: '🧙‍♂️', mage: '🧙', female_fairy: '🧚‍♀️', male_fairy: '🧚‍♂️', fairy: '🧚', female_vampire: '🧛‍♀️', male_vampire: '🧛‍♂️', vampire: '🧛', mermaid: '🧜‍♀️', merman: '🧜‍♂️', merperson: '🧜', female_elf: '🧝‍♀️', male_elf: '🧝‍♂️', elf: '🧝', female_genie: '🧞‍♀️', male_genie: '🧞‍♂️', genie: '🧞', female_zombie: '🧟‍♀️', male_zombie: '🧟‍♂️', zombie: '🧟', brain: '🧠', orange_heart: '🧡', billed_cap: '🧢', scarf: '🧣', gloves: '🧤', coat: '🧥', socks: '🧦', red_envelope: '🧧', firecracker: '🧨', jigsaw: '🧩', test_tube: '🧪', petri_dish: '🧫', dna: '🧬', compass: '🧭', abacus: '🧮', fire_extinguisher: '🧯', toolbox: '🧰', bricks: '🧱', magnet: '🧲', luggage: '🧳', lotion_bottle: '🧴', thread: '🧵', yarn: '🧶', safety_pin: '🧷', teddy_bear: '🧸', broom: '🧹', basket: '🧺', roll_of_paper: '🧻', soap: '🧼', sponge: '🧽', receipt: '🧾', nazar_amulet: '🧿', ballet_shoes: '🩰', 'one-piece_swimsuit': '🩱', briefs: '🩲', shorts: '🩳', drop_of_blood: '🩸', adhesive_bandage: '🩹', stethoscope: '🩺', 'yo-yo': '🪀', kite: '🪁', parachute: '🪂', ringed_planet: '🪐', chair: '🪑', razor: '🪒', axe: '🪓', diya_lamp: '🪔', banjo: '🪕', bangbang: '‼️', interrobang: '⁉️', tm: '™️', information_source: 'ℹ️', left_right_arrow: '↔️', arrow_up_down: '↕️', arrow_upper_left: '↖️', arrow_upper_right: '↗️', arrow_lower_right: '↘️', arrow_lower_left: '↙️', leftwards_arrow_with_hook: '↩️', arrow_right_hook: '↪️', watch: '⌚', hourglass: '⌛', keyboard: '⌨️', eject: '⏏️', fast_forward: '⏩', rewind: '⏪', arrow_double_up: '⏫', arrow_double_down: '⏬', black_right_pointing_double_triangle_with_vertical_bar: '⏭️', black_left_pointing_double_triangle_with_vertical_bar: '⏮️', black_right_pointing_triangle_with_double_vertical_bar: '⏯️', alarm_clock: '⏰', stopwatch: '⏱️', timer_clock: '⏲️', hourglass_flowing_sand: '⏳', double_vertical_bar: '⏸️', black_square_for_stop: '⏹️', black_circle_for_record: '⏺️', m: 'Ⓜ️', black_small_square: '▪️', white_small_square: '▫️', arrow_forward: '▶️', arrow_backward: '◀️', white_medium_square: '◻️', black_medium_square: '◼️', white_medium_small_square: '◽', black_medium_small_square: '◾', sunny: '☀️', cloud: '☁️', umbrella: '☂️', snowman: '☃️', comet: '☄️', phone: '☎️', ballot_box_with_check: '☑️', umbrella_with_rain_drops: '☔', coffee: '☕', shamrock: '☘️', point_up: '☝️', skull_and_crossbones: '☠️', radioactive_sign: '☢️', biohazard_sign: '☣️', orthodox_cross: '☦️', star_and_crescent: '☪️', peace_symbol: '☮️', yin_yang: '☯️', wheel_of_dharma: '☸️', white_frowning_face: '☹️', relaxed: '☺️', female_sign: '♀️', male_sign: '♂️', aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍', libra: '♎', scorpius: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓', chess_pawn: '♟️', spades: '♠️', clubs: '♣️', hearts: '♥️', diamonds: '♦️', hotsprings: '♨️', recycle: '♻️', infinity: '♾️', wheelchair: '♿', hammer_and_pick: '⚒️', anchor: '⚓', crossed_swords: '⚔️', medical_symbol: '⚕️', scales: '⚖️', alembic: '⚗️', gear: '⚙️', atom_symbol: '⚛️', fleur_de_lis: '⚜️', warning: '⚠️', zap: '⚡', white_circle: '⚪', black_circle: '⚫', coffin: '⚰️', funeral_urn: '⚱️', soccer: '⚽', baseball: '⚾', snowman_without_snow: '⛄', partly_sunny: '⛅', thunder_cloud_and_rain: '⛈️', ophiuchus: '⛎', pick: '⛏️', helmet_with_white_cross: '⛑️', chains: '⛓️', no_entry: '⛔', shinto_shrine: '⛩️', church: '⛪', mountain: '⛰️', umbrella_on_ground: '⛱️', fountain: '⛲', golf: '⛳', ferry: '⛴️', boat: '⛵', skier: '⛷️', ice_skate: '⛸️', 'woman-bouncing-ball': '⛹️‍♀️', 'man-bouncing-ball': '⛹️‍♂️', person_with_ball: '⛹️', tent: '⛺', fuelpump: '⛽', scissors: '✂️', white_check_mark: '✅', airplane: '✈️', email: '✉️', fist: '✊', hand: '✋', v: '✌️', writing_hand: '✍️', pencil2: '✏️', black_nib: '✒️', heavy_check_mark: '✔️', heavy_multiplication_x: '✖️', latin_cross: '✝️', star_of_david: '✡️', sparkles: '✨', eight_spoked_asterisk: '✳️', eight_pointed_black_star: '✴️', snowflake: '❄️', sparkle: '❇️', x: '❌', negative_squared_cross_mark: '❎', question: '❓', grey_question: '❔', grey_exclamation: '❕', exclamation: '❗', heavy_heart_exclamation_mark_ornament: '❣️', heart: '❤️', heavy_plus_sign: '➕', heavy_minus_sign: '➖', heavy_division_sign: '➗', arrow_right: '➡️', curly_loop: '➰', loop: '➿', arrow_heading_up: '⤴️', arrow_heading_down: '⤵️', arrow_left: '⬅️', arrow_up: '⬆️', arrow_down: '⬇️', black_large_square: '⬛', white_large_square: '⬜', star: '⭐', o: '⭕', wavy_dash: '〰️', part_alternation_mark: '〽️', congratulations: '㊗️', secret: '㊙️' };