modules.wrap = async () => {
  if (localStorage.getItem("wraptop._vp") !== "true")
    showPopUp("Welcome to Wraptop!",
              "Wraptop is a client made by <a href='https://wrapjss.github.io/?user=wrap#profile'>@wrapjss</a> with usability and user comfort in mind. Wraptop offers uality of life and developmental features for users and developers alike.",
              [["Okay", "var(--themeColor)", () => {
                localStorage.setItem("wraptop._vp", "true");
              }]]
            );
}
