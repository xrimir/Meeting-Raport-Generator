"use strict";
function genPDF() {
  pdfMake.fonts = {
    Roboto: {
      normal:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
      bold:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    },
    Georgia: {
      normal: "Georgia-normal.ttf"
    }
  };

  const sections = [...document.querySelectorAll(".sections")];
  const meetingTitle = document.getElementById("meeting").textContent;
  const result = {
    content: [{ text: [{ text: "Podsumowanie Zebrania: " }, { text: `${meetingTitle.split(" ")[2]}`, bold: true }], style: "header" }],
    styles: {
      header: { fontSize: 15, margin: [0, 0, 0, 30], alignment: "center" },
      table: { margin: [0, 0, 0, 20] },
      worker: {
        fontSize: 9,
        characterSpacing: 0.5,
        pageBreak: "after",
      },
      text: { characterSpacing: 0.6, fontSize: 12 },
    },
    defaultStyle: {
      font: "Roboto",
    },
  };

  for (let i = 0; i < sections.length; i++) {
    let tableContent = [];
    let isSectionEmpty = sections[i].children[1].children[0].children[0].value
    if (isSectionEmpty !== "") {
      let sectionTitle = sections[i].children[0].textContent;
      tableContent = [
        [
          {
            text: sectionTitle,
            colSpan: 2,
            alignment: "left",
            margin: [29, 0, 0, 6],
            fontSize: 15
          },
          {},
        ],
      ];
      for (let j = 1; j <= sections[i].children.length - 2; j++) {
        let textValue = sections[i].children[
          j
        ].children[0].children[0].value.trim();
        if (textValue !== "") {
          let color =
            sectionColorPicker(sections[i].children[0].textContent);
          let worker =
            sections[i].children[j].children[1].children[1].children[0].value;
          tableContent.push(
            [
              {
                text: "",
                fillColor: color,
                rowSpan: 2,
              },
              { text: textValue, style: "text", font: "Georgia", margin: [10, 0, 0, 0] },
            ],
            [
              {},
              {
                text: [
                  { text: worker ? "Przydzielona osoba: " : "", style: "worker" },
                  { text: worker ? `${worker}` : "", style: "worker", bold: true },

                ],
                margin: [10, 10, 0, 0]
              },
            ]
          );
          tableContent.push([
            { text: "", colSpan: 2, margin: [0, 8, 0, 0] },
            {},
          ]);
        }
      }
      result.content.push({
        style: "table",
        table: {
          widths: [10, 470],
          heights: [0, 70],
          body: tableContent,
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0.1 : 0.1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "white" : "white";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "white" : "white";
          },
        },
      });
    }
  }
  pdfMake.createPdf(result).download();
}
const pdfDownloadBtn = document.getElementById("pdfConvert");
pdfDownloadBtn.addEventListener("click", genPDF);
