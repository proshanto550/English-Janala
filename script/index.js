const spinner = (status) => {
    if(status==true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
        .then((res) => res.json()) // promise of json data
        .then((json) => displayLesson(json.data));
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");

    lessonButtons.forEach(btn => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
    spinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");  //Button Active
            displayLevelWord(data.data)
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}


const createElements = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn bg-[#EDF7FF] border-1 border-[#D7E4EF] rounded-md">${el}</span>`);
    return htmlElements.join(" ");
};

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
        <h2 class="text-3xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation} )</h2>
        <div>
            <h2 class="text-xl font-semibold">Meaning</h2>
            <h2 class="text-xl font-bangla font-medium">${word.meaning}</h2>
        </div>
        <div>
            <h2 class="text-xl font-semibold">Example</h2>
            <p class="text-xl font-normal">${word.sentence}</p>
        </div>
        <div class="text-xl">
            <h2 class="font-bangla font-semibold mb-2">সমার্থক শব্দ গুলো</h2>
            <div>${createElements(word.synonyms)}</div>
        </div>
    `;
    document.getElementById("my_modal_5").showModal();
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
            <div class="text-center col-span-full font-bangla">
                <img class="inline-block mb-3" src="assets/alert-error.png" alt="">
                <p class="text-[#79716B] mb-3 text-xs">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-3xl font-medium">নেক্সট <span class="text-[#422AD5]">Lesson</span> এ যান</h2>
            </div>
        `;
        spinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-10">
            <h2 class="font-bold text-2xl mb-4">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-medium mb-4">Meaning / Pronounciation</p>
            <h2 class="font-bangla text-2xl font-semibold text-[#545454] mb-6">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}</h2>

            <div class="flex justify-between items-center px-10">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="text-[#374957] fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="text-[#374957] fa-solid fa-volume-high"></i></button>
            </div>
        </div>`;

        wordContainer.append(card);
    });
    spinner(false);
};

const displayLesson = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. get into every lessons
    for (let lesson of lessons) {
        //       3. create Element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</button>
        `;

        //       4. append into container
        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords);
    });
});