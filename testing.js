// get HTML elements
var formSchool = document.getElementById("formSchool");
var inpSchool = document.getElementById("inpSchool");
var tBodySchools = document.getElementById("tBodySchools");

var formSport = document.getElementById("formSport");
var inpSport = document.getElementById("inpSport");
var tBodySports = document.getElementById("tBodySports");

var formTeam = document.getElementById("formTeam");
var inpTeamName = document.getElementById("inpTeamName");
var selSchool = document.getElementById("selSchool");
var inpClassName = document.getElementById("inpClassName");
var selSport = document.getElementById("selSport");
var tBodyTeams = document.getElementById("tBodyTeams");


// get databases
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");
var teamsDB = database.ref("teams");





// listener function for registering a school
function addSchool(event) {
  event.preventDefault(); // prevent reloading page
  console.log("testing addSchool"); // test in console

  // get form values
  var school = inpSchool.value;
  inpSchool.value = ""; // clear after submit

  // create new empty object in schoolsDB + the value
  var newSchool = database.ref("schools/" + school);

  // create the object
  newSchool.set(
    {
      "name" : school
    }
  );
};


// listener function for displaying schools
function getSchools(snapshot) {
  console.log("testing getSchools");

  var regdSchool = snapshot.key; // get primary key

  // show schools in table
  tBodySchools.innerHTML += `
  <tr>
    <td>${regdSchool}</td>
  </tr>
  `;

  // show schools in dropdown menu
  selSchool.innerHTML += `
  <option value="${regdSchool}">
    ${regdSchool}
  </option>
  `;
};





// listener function for registering a sport
function addSport(event) {
  event.preventDefault();
  console.log("testing addSport");

  var sport = inpSport.value;
  inpSport.value = "";

  var newSport = database.ref("sports/" + sport);

  newSport.set(
    {
      "name" : sport
    }
  );
};


// listener function for displaying sports
function getSports(snapshot) {
  console.log("tetsing getSports");

  var regdSport = snapshot.key;

  tBodySports.innerHTML += `
  <tr>
    <td>${regdSport}</td>
  </tr>
  `;

  selSport.innerHTML += `
  <option value="${regdSport}">
    ${regdSport}
  </option>
  `;
};





// listener function for registering a team
function regTeam(event) {
  event.preventDefault();
  console.log("testing regTeam");

  var team = inpTeamName.value;
  var chosenSchool = selSchool.value;
  var className = inpClassName.value;
  var chosenSport = selSport.value;

  inpTeamName.value = "";
  inpClassName.value = "";

  var newTeam = database.ref("teams/" + team);

  newTeam.set(
    {
      "name" : team,
      "school" : chosenSchool,
      "class" : className,
      "sport" : chosenSport
    }
  );
};





// listener function for displaying teams
function getTeams(snapshot) {
  console.log("testing getTeams");

  var regdTeam = snapshot.key;
  var theRegdTeam = snapshot.val(); // the object from teamsDB
  var teamName = theRegdTeam.name;
  var teamSchool = theRegdTeam.school;
  var teamClass = theRegdTeam.class;
  var teamSport = theRegdTeam.sport;

  tBodyTeams.innerHTML += `
  <tr>
    <td>${teamName}</td>
    <td>${teamSchool}</td>
    <td>${teamClass}</td>
    <td>${teamSport}</td>
  </tr>
  `;
};





// register functions
// when form is submitted, run function
formSchool.onsubmit = addSchool;
formSport.onsubmit = addSport;
formTeam.onsubmit = regTeam;

// when database changes (when new data is added), rund function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
teamsDB.on("child_added", getTeams);
