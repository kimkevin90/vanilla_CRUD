let arr = [];
let temp = -1;
let onClear = () => (temp = -1);
let dom = (id) => {
  return document.getElementById(id);
};
let table = dom("tablerows");
function init() {
  table.innerHTML = "";
  let str = localStorage.getItem("record");
  if (str) arr = JSON.parse(str);
  for (let i = 0; i < arr.length; i++) {
    showT(i, arr[i].first, arr[i].second, arr[i].third, arr[i].day);
  }
  for (let i = 0; i < 5 - arr.length; i++) {
    table.innerHTML += `<tr id=tr_${
      i + arr.length
    }><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td></td></tr>`;
  }
}
function register(first, second, third, day) {
  let obj = { first, second, third, day };
  temp === -1 ? arr.push(obj) : arr.splice(temp, 1, obj);
  localStorage.record = JSON.stringify(arr);
  init();
  onClear();
  location.reload();
}
function showT(index, first, second, third, day) {
  table.innerHTML += `<tr id=tr_${index}><td>${
    index + 1
  }</td><td>${first}</td><td>${second}</td><td>${third}</td><td>${day}</td><td><button onclick=onEdit(${index})>Edit</button><br /><button onclick=deleteR(${index})>Delete</button></td></tr>`;
}
function deleteR(index) {
  arr.splice(index, 1);
  localStorage.record = JSON.stringify(arr);
  init();
}
function onEdit(index) {
  temp = index;
  let obj = arr[index];
  dom("firstname").value = obj.first;
  dom("lastname").value = obj.second;
  dom("rollnum").value = obj.third;
  dom("subject").value = obj.day;
}
function search(input, startDate, LastDate) {
  let firstD = new Date(startDate).getTime();
  let lastD = new Date(LastDate).getTime();
  let tbody = table.children;
  for (let i = 0; i < tbody.length; i++) {
    let tr = dom("tr_" + i);
    tr.style.display = "none";
    td = tr.children;
    let ex = new Date(td[4].innerHTML).getTime();
    for (let j = 1; j < td.length; j++) {
      cell = td[j];
      //대표님 여기서 || 연산자로 아래코드를 줄일수 있는 방법이있나요?
      if (
        cell.innerHTML.toUpperCase().indexOf(input.toUpperCase()) > -1 &&
        !startDate &&
        !LastDate
      )
        tr.style.display = "";
      else if (
        cell.innerHTML.toUpperCase().indexOf(input.toUpperCase()) > -1 &&
        firstD <= ex &&
        lastD >= ex
      )
        tr.style.display = "";
    }
  }
}
