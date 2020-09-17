




/*
순서도
1. onclick이벤트 발생 시 onRegisterPressed가 실행된다.
2. input의 value들을 subObj에 담고, subObj를 빈배열 arr에 담는다.
3. localstorage에 stringfy(문자열 변환)로 arr을 담는다.
/////////4. prpareTableCell()에 input의 value를 argument에 전달하고 실행한다.
/////////5. table에다가 row와 cell을 만들고 해당 값들을 innerHTML로 넣는다.
/////////6. 마지막으로 input항목들을 삭제한다.
/////////7. init()을 실행한다.
4. init()실행하여 table을 리셋시키고 로컬스토리지의 데이터를 arr에 다시 담는다.
8.
init()실행했을때 localstorage에 데이터가 있다면,
arr에 localstorage의 데이터를 parse(오브젝트로 변환)하고 arr에 데이터를 넣는다.
for문을 돌면서 prepareTableCell에 차례차례 넣고 실행한다.


*/
var arr = [];
const list_element = document.getElementById('tablerows');
const pagination_element = document.getElementById('pagination');
let current_page = 1;
let rows = 5;

function init(items, wrapper, rows_per_page, page) {
  //refresh 한번 '';안하면 local값과 다르게 테이블이 계속 늘어남..
  wrapper.innerHTML = '';
  page--;

  let str = localStorage.getItem('tableRecord')

  if (str !== null) {
    arr = JSON.parse(str);
  }
  let start = rows_per_page * page;
  let end = start + rows_per_page
  let paginatedItems = arr.slice(start, end);
  console.log(paginatedItems)
  if (paginatedItems.length === 0) {
    let temp = 0;
    while (temp < 5) {
      emptyTable()
      temp++
    }
  } else if (paginatedItems.length < 6) {
    for (let i = 0; i < paginatedItems.length; i++) {
      prepareTableCell(
        i + ((current_page - 1) * 5),
        paginatedItems[i].firstname,
        paginatedItems[i].lastname,
        paginatedItems[i].rollnum,
        paginatedItems[i].subject
      )
    }
    let temp = 0;
    while (temp < 5 - paginatedItems.length) {
      emptyTable()
      temp++
    }
  } else {
    for (let i = 0; i < paginatedItems.length; i++) {
      prepareTableCell(
        i + ((current_page - 1) * 5),
        paginatedItems[i].firstname,
        paginatedItems[i].lastname,
        paginatedItems[i].rollnum,
        paginatedItems[i].subject
      )
    }
  }
  SetupPagination(arr, pagination_element, rows)
}



function emptyTable() {
  let table = document.getElementById('tablerows');
  let row = table.insertRow();
  row.insertCell(0)
  row.insertCell(1)
  row.insertCell(2)
  row.insertCell(3)
  row.insertCell(4)
  row.insertCell(5)
}



function onRegisterPressed() {
  let firstName = document.getElementById('firstname').value;
  let lastName = document.getElementById('lastname').value;
  let rollNum = document.getElementById('rollnum').value;
  let subject = document.getElementById('subject').value;

  if (!firstName) {
    firstName = "-";
  }
  if (!lastName) {
    lastName = "-";
  }
  if (!rollNum) {
    rollNum = "-";
  }
  if (!subject) {
    subject = "-";
  }

  let stuObj = {
    firstname: firstName,
    lastname: lastName,
    rollnum: rollNum,
    subject: subject
  }
  if (selectedIndex === -1) {
    arr.push(stuObj)
  } else {
    arr.splice(selectedIndex, 1, stuObj);
  }
  localStorage.tableRecord = JSON.stringify(arr)
  init(arr, list_element, rows, current_page)

  //다시 selectednum을 -1 만듬
  onClear();
}



function prepareTableCell(index, firstName, lastName, rollNum, subject) {

  let table = document.getElementById('tablerows');
  let row = table.insertRow();
  let indexCell = row.insertCell(0)
  let firstNameCell = row.insertCell(1)
  let lastNameCell = row.insertCell(2)
  let rollNumCell = row.insertCell(3)
  let subjectCell = row.insertCell(4)
  let actionCell = row.insertCell(5)

  indexCell.innerHTML = index + 1;
  firstNameCell.innerHTML = firstName;
  lastNameCell.innerHTML = lastName;
  rollNumCell.innerHTML = rollNum;
  subjectCell.innerHTML = subject;
  actionCell.innerHTML = '<button onclick="onEditPressed(' + index + ')">Edit</button><br /><button onclick="deleteTableRow(' + index + ')">Delete</button>';
}



/*
///삭제 매커니즘 ///
테이블 생성 시 onregisterpressd() 실행하고
init()발생하면서 preparedTableCell에 for문돌면서 i를 index값에 넣는다.
이로인해 action 항목 delete버튼에 onclick에 i번호가 들어간다.
delete버튼 누르는 순간 인덱스도 같이 적용되고, 테이블 사라지며 arr을 splice로 해당 값 날리고
다시 로컬스토리지에 저장하고
body의 onload로 init()실행한다. 
*/

function deleteTableRow(index) {
  arr.splice(index, 1)
  //update 로컬스토리지
  localStorage.tableRecord = JSON.stringify(arr)
  init(arr, list_element, rows, current_page);
}

//12:30
var selectedIndex = -1;
//인덱스로 특정한 행을 가져온다.
function onEditPressed(index) {
  selectedIndex = index;

  let stuObj = arr[index]
  console.log(stuObj)
  document.getElementById('firstname').value = stuObj.firstname;
  document.getElementById('lastname').value = stuObj.lastname;
  document.getElementById('rollnum').value = stuObj.rollnum;
  document.getElementById('subject').value = stuObj.subject;

  document.getElementById('submit').innerHTML = "Update"
}


function onClear() {
  selectedIndex = -1;
  //clear input
  document.getElementById('firstname').value = '';
  document.getElementById('lastname').value = '';
  document.getElementById('rollnum').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('submit').innerHTML = "Register"
}




function searchTable() {
  let firstday = document.getElementById('firstDate').value
  let lastday = document.getElementById('lastDate').value;

  console.log(getDateRangeData(firstday, lastday))

  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById('regtable');
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    // Hide the row initially.
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (var j = 1; j < td.length; j++) {
      dateCell = tr[i].getElementsByTagName("td")[4];
      cell = tr[i].getElementsByTagName("td")[j];
      if (cell) {
        if (cell.innerHTML.toUpperCase().indexOf(filter) > -1 && getDateRangeData(firstday, lastday).includes(dateCell.innerHTML)
        ) {
          tr[i].style.display = "";

        }
      }
    }
  }
}


function getDateRangeData(param1, param2) {  //param1은 시작일, param2는 종료일이다.
  var res_day = [];
  var ss_day = new Date(param1);
  var ee_day = new Date(param2);
  while (ss_day.getTime() <= ee_day.getTime()) {
    var _mon_ = (ss_day.getMonth() + 1);
    _mon_ = _mon_ < 10 ? '0' + _mon_ : _mon_;
    var _day_ = ss_day.getDate();
    _day_ = _day_ < 10 ? '0' + _day_ : _day_;
    res_day.push(ss_day.getFullYear() + '-' + _mon_ + '-' + _day_);
    ss_day.setDate(ss_day.getDate() + 1);
  }
  return res_day;
}

//SetupPagination(arr, pagination_element, rows)
function SetupPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = '';

  let page_count = Math.ceil(items.length / rows_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page, items) {
  let button = document.createElement('button');
  button.innerText = page;

  if (current_page == page) button.classList.add('active');

  button.addEventListener('click', function () {
    current_page = page;
    init(items, list_element, rows, current_page)
  })

  return button;
}


init(arr, list_element, rows, current_page)
