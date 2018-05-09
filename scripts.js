/* –––––––––––––––––––––––––– GET HTML ELEMENTS –––––––––––––––––––––––––– */
var formSchool = document.getElementById("formSchool");
var inpSchool = document.getElementById("inpSchool");
var tBodySchools = document.getElementById("tBodySchools");

var formSport = document.getElementById("formSport");
var inpSport = document.getElementById("inpSport");
var tBodySports = document.getElementById("tBodySports");


/* –––––––––––––––––––––––––– GET DATABASES –––––––––––––––––––––––––– */
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");









/* –––––––––––––––––––––––––– PUSH AND GET DATA –––––––––––––––––––––––––– */
// add new school to schoolsDB
function addSchool(event){

  // control in console
  console.log("testing addSchool");

  // prevent reloading page
  event.preventDefault();

  // get form values
  var school = inpSchool.value;
  inpSchool.value = ""; // clear after submit

  // push new object to schoolsDB with random primary key
  schoolsDB.push({
    "name" : school
  });

};


// show data from schoolsDB
function getSchools(snapshot){

  console.log("testing getSchools");

  var regdSchool = snapshot.key; // get school object primary key
  var theRegdSchool = snapshot.val(); // get school object other data

  // show data in table
  tBodySchools.innerHTML += `
  <tr>
    <td>
      ${theRegdSchool.name}
    </td>
  </tr>
  `;

};





// use the same method for sports, as with schools
// add new sport to database
function addSport(event){

  console.log("testing addSport");

  event.preventDefault();

  var sport = inpSport.value;
  inpSport.value = "";

  sportsDB.push({
    "name" : sport
  });

};


// show data from sportsDB
function getSports(snapshot){

  console.log("testing getSports");

  var regdSport = snapshot.key;
  var theRegdSport = snapshot.val();

  tBodySports.innerHTML += `
  <tr>
    <td>
      ${theRegdSport.name}
    </td>
  </tr>
  `;

};











/* –––––––––––––––––––––––––– REGISTER FUNCTIONS –––––––––––––––––––––––––– */
// when form is submitted, run function
formSchool.onsubmit = addSchool;
formSport.onsubmit = addSport;


// when database changes (when new data is added), run function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
