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

var formResult = document.getElementById("formResult");
var selTeam = document.getElementById("selTeam");
var inpPoints = document.getElementById("inpPoints");
var tBodyResults = document.getElementById("tBodyResults");


// get databases
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");
var teamsDB = database.ref("teams");
var resultsDB = database.ref("results");





// listener function for registering a school
function addSchool(event) {
  event.preventDefault(); // prevent reloading page
  console.log("testing addSchool"); // test in console

  // get form values
  var school = inpSchool.value;
  inpSchool.value = ""; // clear after submit

  // create the new regdSchool object in schoolsDB with random primary key
  schoolsDB.push({
      "name" : school
    });
};


// listener function for displaying schools
function getSchools(snapshot) {
  console.log("testing getSchools");

  var regdSchool = snapshot.key; // get primary key
  var theRegdSchool = snapshot.val(); // get data from object (not primary key)

  // show schools in table
  tBodySchools.innerHTML += `
  <tr>
    <td>${theRegdSchool.name}</td>
  </tr>
  `;

  // show schools in dropdown menu
  // save option value as primary key
  selSchool.innerHTML += `
  <option value="${regdSchool}">
    ${theRegdSchool.name}
  </option>
  `;
};





// same method for sports, as with schools
// listener function for registering a sport
function addSport(event) {
  event.preventDefault();
  console.log("testing addSport");

  var sport = inpSport.value;
  inpSport.value = "";

  sportsDB.push({
      "name" : sport
    });
};


// listener function for displaying sports
function getSports(snapshot) {
  console.log("testing getSports");

  var regdSport = snapshot.key;
  var theRegdSport = snapshot.val();

  tBodySports.innerHTML += `
  <tr>
    <td>${theRegdSport.name}</td>
  </tr>
  `;

  selSport.innerHTML += `
  <option value="${regdSport}">
    ${theRegdSport.name}
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

  teamsDB.push({
      "name" : team,
      "school" : chosenSchool,
      "class" : className,
      "sport" : chosenSport
    });
};


// listener function for displaying teams
function getTeams(snapshot) {
  console.log("testing getTeams");

  var regdTeam = snapshot.key;
  var theRegdTeam = snapshot.val(); // the object from teamsDB

  // use another listener function to get data from schoolsDB and use as foreign key
  var schoolsRef = database.ref("schools/" + theRegdTeam.school);
  schoolsRef.on("value", function(snapshotSchools){
    console.log("testing schoolsRef");
    var theSchool = snapshotSchools.val();

    // show regdTeam in table of teams
      tBodyTeams.innerHTML += `
      <tr>
        <td>${theRegdTeam.name}</td>
        <td>${theSchool.name}</td>
        <td>${theRegdTeam.class}</td>
        <td>${theRegdTeam.sport}</td>
      </tr>
      `;

    // show regdTeam in selTeam
    selTeam.innerHTML += `
    <option value="${regdTeam}">
      ${theRegdTeam.name}
    </option>
    `;
  });

  /* use another listener function to get data from schoolsDB and use as foreign key
  var sportsRef = database.ref("sports/" + theRegdTeam.sport);
  sportsRef.on("value", function(snapshotSports){
    console.log("testing sportsRef");
    var theSport = snapshotSports.val();
  });
  */

  /* show regdTeam in table of teams
    tBodyTeams.innerHTML += `
    <tr>
      <td>${theRegdTeam.name}</td>
      <td>${theSchool.name}</td>
      <td>${theRegdTeam.class}</td>
      <td>${theSport.name}</td>
    </tr>
    `*/
};





// listener function for registering a result
function addResult(event){
  event.preventDefault();
  console.log("testing regResult");

  var chosenTeam = selTeam.value;
  var points = inpPoints.value;
  inpPoints.value = "";

  resultsDB.push({
    "team" : chosenTeam,
    "points" : points
  });
};


// listener function for showing the results
function showResult(snapshot){
  console.log("testing showResult");

  var theRegdResult = snapshot.val();

  // use another listener function to get data from schoolsDB and use as foreign key
  var resultsRef = database.ref("teams/" + theRegdResult.team);
  resultsRef.on("value", function(snapshotResults){
    console.log("testing resultsRef");
    var theResult = snapshotResults.val();

  tBodyResults.innerHTML += `
  <tr>
    <td>${theResult.name}</td>
    <td>+${theRegdResult.points}</td>
  </tr>
  `;
  });
};





// register functions
// when form is submitted, run function
formSchool.onsubmit = addSchool;
formSport.onsubmit = addSport;
formTeam.onsubmit = regTeam;
formResult.onsubmit = addResult;

// when database changes (when new data is added), run function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
teamsDB.on("child_added", getTeams);
resultsDB.on("child_added", showResult);
