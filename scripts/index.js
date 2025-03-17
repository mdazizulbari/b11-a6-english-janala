const autoLogin = () => {
  document.getElementById("hero-sect").classList.add("hidden");
  document.getElementById("nav-sect").classList.remove("hidden");
  document.getElementById("learn-sect").classList.remove("hidden");
  document.getElementById("faq-sect").classList.remove("hidden");
};
autoLogin();

const login = () => {
  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("input-name").value.trim();
    const password = document.getElementById("input-pass").value.trim();
    if (name === "") {
      Swal.fire({
        title: "Enter your name to login",
        icon: "error",
      });
      return;
    }
    if (password === "123456") {
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
      });
      document.getElementById("hero-sect").classList.add("hidden");
      document.getElementById("nav-sect").classList.remove("hidden");
      document.getElementById("learn-sect").classList.remove("hidden");
      document.getElementById("faq-sect").classList.remove("hidden");
    } else
      Swal.fire({
        title: "Enter your name to login",
        icon: "error",
      });
  });
};

const logout = () => {
  document.getElementById("hero-sect").classList.remove("hidden");
  document.getElementById("nav-sect").classList.add("hidden");
  document.getElementById("learn-sect").classList.add("hidden");
  document.getElementById("faq-sect").classList.add("hidden");
};

const loadLessonButtons = () => {
  fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then((response) => response.json())
    .then((data) => displayLessonButtons(data.data))
    .catch((error) => {
      Swal.fire({
        title: "Error fetching data",
        text: error.message,
        icon: "error",
      });
    });
};
loadLessonButtons();

const displayLessonButtons = (buttons) => {
  lessonBtnContainer = document.getElementById("lesson-btn-container");
  for (let button of buttons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
          <button
          id="lesson-btn-${button.level_no}"
            onclick="loadLessons(${button.level_no})"
            class="btn lesson-btn-class w-fit border-2 border-cyan-200 hover:bg-cyan-200 transition-all ease-in-out duration-500 rounded-lg mt-4 bg-white font-bold text-lg"
          >
            <i class="fa-solid fa-book-open"></i>
            Lesson - ${button.level_no}
          </button>
    `;
    lessonBtnContainer.append(btnDiv);
  }
};

const loadLessons = (level) => {
  displayLoadingSpinner();
  //   fetch the data
  fetch(`https://openapi.programming-hero.com/api/level/${level}`)
    //   convert promise to json
    .then((response) => response.json())
    //   send data to display
    .then((data) => {
      displayLessons(data.data);
      hideLoadingSpinner();
    })
    .catch((error) => {
      Swal.fire({
        title: "Error fetching data",
        text: error.message,
        icon: "error",
      });
    });
  // removing the btn style class from all the btns
  for (let i = 1; i < 8; i++) {
    const lessonBtnId = document.getElementById(`lesson-btn-${i}`);
    lessonBtnId.classList.remove("lesson-btn");
  }
  const lessonBtnId = document.getElementById(`lesson-btn-${level}`);
  lessonBtnId.classList.add("lesson-btn");
};

const displayLessons = (lessons) => {
  // get the container
  const lessonsContainer = document.getElementById("lessons-container");
  lessonsContainer.innerHTML = ``;
  lessonsContainer.classList.add("grid", "grid-cols-3", "gap-5");
  if (lessons.length === 0) {
    lessonsContainer.classList.remove("grid", "grid-cols-3", "gap-5");
    lessonsContainer.innerHTML = `
          <div class="flex flex-col justify-center items-center gap-5 py-20">
            <img src="assets/alert-error.png" alt="" />
            <h5 class=" atma-regular">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h5>
            <h2 class="text-4xl font-bold atma-regular">নেক্সট Lesson এ যান</h2>
          </div>
    `;
    return;
  }
  // loop operation on array of object
  for (let lesson of lessons) {
    const lessonDiv = document.createElement("div");
    lessonDiv.innerHTML = `
            <div
              class="bg-white h-full p-8 flex flex-col gap-3 items-center justify-between rounded-2xl"
            >
              <h4 class="text-2xl font-bold">${
                lesson.word || "খুজে পাওয়া যাইনি"
              }</h4>
              <h5 class="">Meaning / Pronounciation</h5>
              <h3 class="text-2xl text-center atma-regular">"${
                lesson.meaning || "খুজে পাওয়া যাইনি"
              } / ${lesson.pronunciation || "খুজে পাওয়া যাইনি"}"</h3>
              <div class="w-full mt-5 flex justify-between text-2xl">
                <div
                onclick="loadInformation(${lesson.id})"
                  class="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 transition-all ease-in-out duration-500"
                >
                  <i class="fa-solid fa-circle-info"></i>
                </div>
                <div
                onclick="pronounceWord('${lesson.word}')"
                  class="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 transition-all ease-in-out duration-500"
                >
                  <i class="fa-solid fa-volume-high"></i>
                </div>
              </div>
            </div>
    `;
    // append element
    lessonsContainer.append(lessonDiv);
  }
};

const loadInformation = (lessonId) => {
  const url = `https://openapi.programming-hero.com/api/word/${lessonId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayInformation(data.data);
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        title: "Error fetching data",
        text: error.message,
        icon: "error",
      });
    });
};

const displayInformation = (information) => {
  document.getElementById("lessonInfo").showModal();
  const infoContainer = document.getElementById("info-container");
  const capitalizeFirstLetter = (word) => {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  let synonymsHtml = "";
  if (information.synonyms && information.synonyms.length > 0) {
    synonymsHtml = information.synonyms
      .map(
        (synonym) =>
          `<span class="btn bg-cyan-200 rounded-lg border-none">${capitalizeFirstLetter(
            synonym
          )}</span>`
      )
      .join(" ");
  } else {
    synonymsHtml = `<span class="text-gray-500">খুজে পাওয়া যাইনি</span>`;
  }
  infoContainer.innerHTML = `
        <div class="p-8 border-2 border-cyan-100 rounded-lg space-y-2">
          <h3 class="text-4xl font-bold pb-3">
            ${
              information.word || "খুজে পাওয়া যাইনি"
            } (<i class="fa-solid fa-microphone-lines"></i>:${
    information.pronunciation || "খুজে পাওয়া যাইনি"
  })
          </h3>
          <h4 class="text-xl font-bold">Meaning</h4>
          <h5 class="text-lg pb-3">${information.meaning}</h5>
          <h4 class="text-xl font-bold">Example</h4>
          <p class="text-lg pb-3">
          ${information.sentence || "খুজে পাওয়া যাইনি"}
          </p>
          <h4 class="text-xl font-bold">সমার্থক শব্দ গুলো</h4>
          <div class="flex gap-3">${synonymsHtml}</div>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button
              class="btn bg-cyan-200 hover:bg-cyan-300 transition-all ease-in-out duration-400 rounded-lg border-none"
            >
              Complete Learning
            </button>
          </form>
        </div>
  `;
};

const displayLoadingSpinner = () => {
  document.getElementById("loading-spinner").classList.remove("hidden");
};
const hideLoadingSpinner = () => {
  document.getElementById("loading-spinner").classList.add("hidden");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
