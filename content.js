let popupBox = null;

document.addEventListener("click", function (e) {
  let el = e.target;

  // only work on YouTube subtitle text
  if (!el.classList.contains("ytp-caption-segment")) return;

  let range;
  let textNode;

  if (document.caretPositionFromPoint) {
    let pos = document.caretPositionFromPoint(e.clientX, e.clientY);
    textNode = pos.offsetNode;
    range = document.createRange();
    range.setStart(textNode, pos.offset);
    range.setEnd(textNode, pos.offset);
  } 
  else if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(e.clientX, e.clientY);
    textNode = range.startContainer;
  }

  if (!textNode || textNode.nodeType !== 3) return;

  let text = textNode.textContent;
  let index = range.startOffset;

  let start = index;
  let end = index;

  while (start > 0 && /\w/.test(text[start - 1])) start--;
  while (end < text.length && /\w/.test(text[end])) end++;

  let word = text.substring(start, end).toLowerCase();

  if (!word) return;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json())
    .then(data => {
      let meaning = data[0].meanings[0].definitions[0].definition;
      showPopup(word, meaning);
    })
    .catch(() => {
      showPopup(word, "Meaning not found");
    });
});

function showPopup(word, meaning) {
  if (popupBox) popupBox.remove();

  popupBox = document.createElement("div");
  popupBox.innerHTML = `<b>${word}</b> = ${meaning}`;

  popupBox.style.position = "fixed";
  popupBox.style.bottom = "120px";
  popupBox.style.right = "20px";
  popupBox.style.background = "white";
  popupBox.style.color = "black";
  popupBox.style.padding = "10px";
  popupBox.style.border = "1px solid black";
  popupBox.style.borderRadius = "6px";
  popupBox.style.zIndex = "999999";

  document.body.appendChild(popupBox);

  setTimeout(() => popupBox.remove(), 5000);
}
