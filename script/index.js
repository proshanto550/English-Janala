const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") // promise of response
        .then((res) => res.json()) // promise of json data
        .then((json) => displayLesson(json.data));
};

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWord(data.data));
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `<div class="bg-white rounded-xl shadow-sm text-center py-10">
            <h2 class="font-bold text-2xl mb-4">${word.word}</h2>
            <p class="font-medium mb-4">Meaning / Pronounciation</p>
            <h2 class="font-bangla text-2xl font-semibold text-[#545454] mb-6">${word.meaning} / ${word.pronunciation}</h2>

            <div class="flex justify-between items-center px-10">
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="text-[#374957] fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="text-[#374957] fa-solid fa-volume-high"></i></button>
            </div>
        </div>`;

        wordContainer.append(card);
    });
};

const displayLesson = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. get into every lessons
    for (let lesson of lessons) {
        //       3. create Element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML=`
            <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</button>
        `;

        //       4. append into container
        levelContainer.append(btnDiv);
    }
};
loadLessons();