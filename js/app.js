class SentenceMethods {
  constructor(text) {
    this.text = text;
    this.keywords = [
      " kiedy",
      " więc",
      " ponieważ",
      " dlatego",
      " aby",
      " zatem",
      " żeby",
      " że",
    ];
  }
  grammerAdder() {
    for (let i = 0; i < this.keywords.length; i++) {
      let regex = new RegExp(this.keywords[i], "g");
      this.text = this.text.replace(regex, ",$&");
    }
  }
  punctuationAdder() {
    this.text = this.text.replace(/spacja/g, " ");
    this.text = this.text.replace(/kropka/g, ".");
    this.text = this.text.replace(/przecinek/g, ",");
    this.text = this.text.replace(/enter/g, "\n");
	this.text = this.text.replace(/myślnik/g, "-");
    this.text = this.text.replace(/\sktór[a-z]{1}/g, ",$&");
    this.text = this.text.replace(/(p|P)an/g, (v) => {
      return v.charAt(0).toUpperCase() + v.slice(1);
    });
    this.text = this.text.replace(/(p|P)aństw[a-z]{1}/g, (v) => {
      return v.charAt(0).toUpperCase() + v.slice(1);
    });
    this.text = this.text.replace(
      /([!?.]\s+)([a-z])/g,
      (m, $1, $2) => $1 + $2.toUpperCase()
    );
  }
}
// Kolory sekcji
const sectionColorPicker = (sectionName) => {
  const sectionColors = {
    "Sprawy Ogólne": "#336699",
    "Spa": "#dd6aa4",
    "Basen": "#6ac3dd",
    "Animacje": "#c66add",
    "Ochrona": "#000000",
    "Gastronomia": "#FFD700",
    "Recepcja": "#323276",
    "Marketing:": "#554b6e",
    "Siłownia": "#9edb50",
    "Szkolenia": "#faff6b",
    "Dział IT": "#b7b7b7",
  };
  for (let [key, value] of Object.entries(sectionColors)) {
    if (key.toUpperCase() === sectionName.toUpperCase()) {
      return value;
    }
  }
};
const wholeElement = `<div class="form-row">
  <div class="textInput">
    <textarea class="resize-control textareaInput" data-border="" cols="3" rows="5"  onkeydown="expandingTextarea(this)" maxlength="1400"></textarea><div class="micContainer" onClick="micListen(this)"><img class="mic" src="./static/images/mic.png"/></div>
  </div>
  <div class="options">
  <p class="infoFor" >Informacja dla: </p>
  <div class="select">
    <select class="workers">
     <option value=""disabled selected hidden>Wybierz... </option>
     <option class="options">Osoba 1</option>
     <option class="options">Osoba 2</option>
     <option class="options">Osoba 3</option>
      </select>
  <div class="select_arrow">
  </div>
  </div>
  </div>
  </div>`;
function expandingTextarea(param) {
  const el = param;
  setTimeout(() => {
    el.style.cssText = "height:auto; padding:0";
    el.style.cssText = "height:" + el.scrollHeight + "px";
  }, 0);
}

function addText(param) {
  param.insertAdjacentHTML("beforebegin", wholeElement);
}


//------ Główna funkcja wywołująca webspeech oraz modyfikacje tekstu ----

const micListen = (param) => {
  let recognition = new webkitSpeechRecognition();
  let textarea = param.parentNode.children[0];
  textarea.focus();
  recognition.start();
  recognition.lang = "pl-PL";
  recognition.onresult = (e) => {
    let sentence = new SentenceMethods(e.results[0][0].transcript);
    sentence.punctuationAdder();
    sentence.grammerAdder();
	let text = sentence.text[0].toUpperCase() + sentence.text.slice(1,sentence.text.length);
    textarea.value += " " + text + ".";
  };
};

const formSaveFile = document.getElementById("formSaveFile");
const fileSaveName = document.getElementById("fileSaveName");
const sections = [...document.querySelectorAll(".sections")];
let jsonFile = [];

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};
const createJsonInfo = (section) => {
  let sectionName = section.firstElementChild.textContent;
  let sectionNum = section.children.length - 2;
  let textFieldArr = [];
  let forms = section.querySelectorAll(".form-row");
  for (const form of forms) {
    let elem = form.firstElementChild.firstElementChild;
    let selectedWorker = form.querySelector(
      ".options > .select > select"
    ).value;
    textFieldArr.push({
      content: elem.value ? elem.value : "none",
      person: selectedWorker ? selectedWorker : "none",
    });
  }
  jsonFile.push({
    name: sectionName,
    textFieldsContent: textFieldArr,
    textFieldsNum: sectionNum,
  });
};
// Coś z zapisywaniem pliku???
formSaveFile.addEventListener("submit", (e) => {
  e.preventDefault();
  filename = fileSaveName.value;
  if (filename.trim() === "") {
    throw new Error("Błąd pusta nazwa pliku!");
  } else {
    for (let i = 0; i < sections.length; i++) {
      createJsonInfo(sections[i]);
    }
    downloadToFile(
      JSON.stringify(jsonFile),
      `${filename}.json`,
      "application/json"
    );
  }
});

const addBtn = [...document.getElementsByClassName("addBtn")];
const fileImportInput = document.getElementById("fileImportInput");
function fileHandle() {
  const file = this.files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    let jsonImport = JSON.parse(reader.result);
    Object.entries(jsonImport).forEach(([key, value]) => {
      let sectionName = sections[key].firstElementChild.textContent;
      if (sectionName === value.name) {
        let addBtn = sections[key].querySelector(".addBtn");
        if (value.textFieldsContent.length > 1) {
          for (let i = 0; i < value.textFieldsContent.length - 1; i++) {
            addText(addBtn);
          }
        }
        let forms = sections[key].querySelectorAll(".form-row");
        for (let i = 0; i < forms.length; i++) {
          let elem = forms[i].firstElementChild.firstElementChild;
          let textFieldsContent = value.textFieldsContent[i];
          if (textFieldsContent.person !== "none") {
            forms[i].querySelector(".options > .select > select").value =
              textFieldsContent.person;
          }

          if (textFieldsContent.content !== "none") {
            elem.value = textFieldsContent.content;
          }
        }
      }
    });
  };
	// na jakis error
  reader.onerror = function () {
    console.log(reader.error);
  };
  window.scrollTo(0, 0);
}
fileImportInput.addEventListener("change", fileHandle, false);
const jumpSectionsBtn = document.getElementById("jumpSectionsBtn");
const jumpSectionsContent = document.getElementById("jumpSectionsContent");
jumpSectionsBtn.addEventListener("click", () => {
  if (
    jumpSectionsContent.style.display === "none" ||
    jumpSectionsContent.style.display === ""
  ) {
    jumpSectionsContent.style.display = "flex";
  } else {
    jumpSectionsContent.style.display = "none";
  }
  console.log(jumpSectionsContent.style.display);
});

const jumpSections = document.querySelectorAll("#jumpSections > li");
function jumpToSection() {
  document
    .querySelector(`legend[data-division="${this.textContent.toLowerCase()}"]`)
    .scrollIntoView();
}
jumpSections.forEach((section) => {
  section.addEventListener("click", jumpToSection);
});
