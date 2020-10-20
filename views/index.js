const table = document.querySelector("#tablerows");
let tempIndex = -1;
function init() {
  fetch("http://localhost:3001/getAll")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data));

  table.addEventListener("click", function (event) {
    //클릭시 event.target.dataset으로 해당 테이블 id값을 가져옴
    if (event.target.className === "delete-row-btn") {
      deleteRow(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
      document.querySelector("#add-name-btn").innerText = "수정하기";
      handleEditRow(event.target.dataset.id);
    }
  });
}

function loadHTMLTable(data) {
  table.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    table.innerHTML += `<tr><td>${i + 1}</td><td>${data[i].name}</td><td>${
      data[i].contents
    }</td><td>${data[i].writer}</td><td>${
      data[i].date
    }</td><td><button class="delete-row-btn" data-id=${
      data[i].id
    }>Delete</td><td><button class="edit-row-btn" data-id=${
      data[i].id
    }>Edit</td></tr>`;
  }
  for (let i = 0; i < 5 - data.length; i++) {
    table.innerHTML += `<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td></td><td></td></tr>`;
  }
}

function deleteRow(id) {
  fetch("http://localhost:3001/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        init();
      }
    });
}

function handleEditRow(id) {
  document.querySelector("#name-input").dataset.id = id;
  tempIndex = id;
}

function register() {
  let nameInput = document.querySelector("#name-input");
  let name = document.querySelector("#name-input").value;
  let contents = document.querySelector("#contents-input").value;
  let writer = document.querySelector("#writer-input").value;
  let date = document.querySelector("#date-input").value;
  if (tempIndex === -1) {
    fetch("http://localhost:3001/insert", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: name,
        contents: contents,
        writer: writer,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data));
    // .then(() => init());
  } else {
    fetch("http://localhost:3001/update", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: nameInput.dataset.id,
        name: name,
        contents: contents,
        writer: writer,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          init();
          onClear();
        }
      });
  }
}

function onClear() {
  tempIndex = -1;
}

const searchBtn = document.querySelector("#search-form");

searchBtn.onsubmit = function (e) {
  e.preventDefault();
  init();
  const searchValue = document.querySelector("#search-input").value;
  const firstDate = new Date(
    document.querySelector("#firstDate").value
  ).getTime();
  const lastDate = new Date(
    document.querySelector("#lastDate").value
  ).getTime();
  if (searchValue !== "") {
    fetch("http://localhost:3001/search/" + searchValue)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let day = new Date(data[i].date).getTime();
          if (firstDate <= day && lastDate >= day) {
            loadHTMLTable(data);
          } else if (!firstDate && !lastDate) {
            loadHTMLTable(data);
          } else {
            table.innerHTML =
              "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
          }
        }
      });
  } else {
    location.reload();
  }
};
