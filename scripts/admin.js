/* –––––––––––––––––––––––––– GET HTML ELEMENTS –––––––––––––––––––––––––– */
var formSchool = document.getElementById("formSchool");
var inpSchool = document.getElementById("inpSchool");
var tBodySchools = document.getElementById("tBodySchools");
var formDelSchool = document.getElementById("formDelSchool");
var selDeleteSchool = document.getElementById("selDeleteSchool");

var formSport = document.getElementById("formSport");
var inpSport = document.getElementById("inpSport");
var tBodySports = document.getElementById("tBodySports");
var formDeleteSport = document.getElementById("formDeleteSport");
var selDeleteSport = document.getElementById("selDeleteSport");

var tBodyTeams = document.getElementById("tBodyTeams");
var formDeleteTeam = document.getElementById("formDeleteTeam");
var selDeleteTeam = document.getElementById("selDeleteTeam");

var formResult = document.getElementById("formResult");
var selTeam = document.getElementById("selTeam");
var inpPoints = document.getElementById("inpPoints");
var tBodyResults = document.getElementById("tBodyResults");

var selTeamTeam = document.getElementById("selTeamTeam");
var selTeamSchool = document.getElementById("selTeamSchool");
var selTeamSport = document.getElementById("selTeamSport");
var selResultTeam = document.getElementById("selResultTeam");


/* –––––––––––––––––––––––––– GET DATABASES –––––––––––––––––––––––––– */
var database = firebase.database();
var schoolsDB = database.ref("schools");
var sportsDB = database.ref("sports");
var teamsDB = database.ref("teams");
var resultsDB = database.ref("results");









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


// show schools
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

  // show schools in selDeleteSchool
  selDeleteSchool.innerHTML += `
  <option value="${regdSchool}">
    ${theRegdSchool.name}
  </option>
  `;

  // show schools in selTeamSchool
  selTeamSchool.innerHTML += `
  <option value="${regdSchool}">
    ${theRegdSchool.name}
  </option>
  `;

};


// delete school
function deleteSchool(event){

  console.log("testing deleteSchool");

  event.preventDefault();

  // the value of the option == databse object's key
  var deletedSchool = selDeleteSchool.value;

  // create path for the object to be deleted
  var deletedSchoolRef = database.ref("schools/" + deletedSchool);

  deletedSchoolRef.remove();

  // Reload the current page, without using the cache
  window.location.reload(true);

};





// use the same method for sports, as with schools
// add new sport to sportsDB
function addSport(event){

  console.log("testing addSport");

  event.preventDefault();

  var sport = inpSport.value;
  inpSport.value = "";

  sportsDB.push({
    "name" : sport
  });

};


// show sports in table
function getSports(snapshot){

  console.log("testing getSports");

  var regdSport = snapshot.key;
  var theRegdSport = snapshot.val();

  // show data in table
  tBodySports.innerHTML += `
  <tr>
    <td>
      ${theRegdSport.name}
    </td>
  </tr>
  `;

  // show sports in selDeleteSport
  selDeleteSport.innerHTML += `
  <option value="${regdSport}">
    ${theRegdSport.name}
  </option>
  `;

  // show sports in selTeamSport
  selTeamSport.innerHTML += `
  <option value="${regdSport}">
    ${theRegdSport.name}
  </option>
  `;

};


// delete sport
function deleteSport(event){

  console.log("testing deleteSport");

  event.preventDefault();

  var deletedSport = selDeleteSport.value;

  var deletedSportRef = database.ref("sports/" + deletedSport);

  deletedSportRef.remove();

  window.location.reload(true);

};





// get teams
function getTeamsSel(snapshot){

  console.log("testing getTeamsSel");

  var thisRegdTeam = snapshot.key;
  var thatRegdTeam = snapshot.val();

  // show regdTeam in selTeam
  selTeam.innerHTML += `
  <option value="${thisRegdTeam}">
    ${thatRegdTeam.name}
  </option>
  `;

  // show teams in selTeamTeam
  selTeamTeam.innerHTML += `
  <option value="${thatRegdTeam.name}">
    ${thatRegdTeam.name}
  </option>
  `;

  // show teams in selResultTeam
  selResultTeam.innerHTML += `
  <option value="${thisRegdTeam}">
    ${thatRegdTeam.name}
  </option>
  `;

  // show teams in selDeleteTeam
  selDeleteTeam.innerHTML += `
  <option value="${thisRegdTeam}">
    ${thatRegdTeam.name}
  </option>
  `;

};


// show teams in table
function getTeams(snapshot){

  console.log("testing getTeams");

  var regdTeam = snapshot.key;
  var theRegdTeam = snapshot.val();

  // nest a second function to get data from schoolsDB and use as foreign key
  var schoolsRef = database.ref("schools/" + theRegdTeam.school);

  schoolsRef.on("value", function(snapshotSchools){

    console.log("testing schoolsRef");

    var regdTeamSchool = snapshot.key;
    var theSchool = snapshotSchools.val();

    // nest a third function to get data from sportsDB and use as foreign key
    var sportsRef = database.ref("sports/" + theRegdTeam.sport);

    sportsRef.on("value", function(snapshotSports){

      console.log("testing sportsRef");

      var regdTeamSport = snapshot.key;
      var theSport = snapshotSports.val();

      // show teams in table
      tBodyTeams.innerHTML += `
      <tr>
        <td>
          ${theRegdTeam.name}
        </td>
        <td>
          ${theSchool.name}
        </td>
        <td class="tdUppercase">
          ${theRegdTeam.class}
        </td>
        <td>
          ${theSport.name}
        </td>
      </tr>
      `;

    });

  });

};


// delete team
function deleteTeam(event){

  console.log("testing deleteTeam");

  event.preventDefault();

  var deletedTeam = selDeleteTeam.value;

  var deletedTeamRef = database.ref("teams/" + deletedTeam);

  deletedTeamRef.remove();

  window.location.reload(true);

};





// use the same method for results, as with schools
// add new sport to resultsDB
function addResult(event){

  console.log("testing addResult");

  event.preventDefault();

  var chosenTeam = selTeam.value;
  var points = inpPoints.value;
  inpPoints.value = "";

  resultsDB.push({
    "team" : chosenTeam,
    "points" : points
  });

};


// show results in table
function getResults(snapshot){

  console.log("testing getResults");

  var theRegdResult = snapshot.val();

  // use a second function to get data from steamsDB and use as foreign key
  var teamsRef = database.ref("teams/" + theRegdResult.team);

  teamsRef.on("value", function(snapshotResults){

    console.log("testing resultsRef");

    var theResult = snapshotResults.val();

    tBodyResults.innerHTML += "";

    tBodyResults.innerHTML += `
    <tr>
      <td>${theResult.name}</td>
      <td>+ ${theRegdResult.points}</td>
    </tr>
    `;

  });

};










/* –––––––––––––––––––––––––– SORT DATA –––––––––––––––––––––––––– */
// sort results by team
function sortResultByTeam(){

  console.log("testing sortResultByTeam");

  var theSelResultTeam = selResultTeam.value;

  // show the results of the selected team
  tBodyResults.innerHTML = "";

  // show only the results of the selected team
  resultsDB.orderByChild("team")
           .equalTo(theSelResultTeam)
           .on("child_added", getResults);

  // if no team is selected, show all results from all teams
  if (theSelResultTeam == "allResults") {
    tBodyResults.innerHTML = "";
    resultsDB.on("child_added", getResults);
  };

};


// use the same method for teams, schools, and sports as for results
// sort teams by team
function sortTeamsByTeam(){

  console.log("testing sortTeamsByTeam");

  var theSelTeamTeam = selTeamTeam.value;

  tBodyTeams.innerHTML = "";

  teamsDB.orderByChild("name")
         .equalTo(theSelTeamTeam)
         .on("child_added", getTeams);

  if (theSelTeamTeam == "allTeams") {
    tBodyTeams.innerHTML = "";
    teamsDB.on("child_added", getTeams);
  };

};


// sort teams by school
function sortTeamsBySchool(){

  console.log("testing sortTeamsBySchool");

  var theSelTeamSchool = selTeamSchool.value;

  tBodyTeams.innerHTML = "";

  teamsDB.orderByChild("school")
         .equalTo(theSelTeamSchool)
         .on("child_added", getTeams);

  if (theSelTeamSchool == "allSchools") {
    tBodyTeams.innerHTML = "";
    teamsDB.on("child_added", getTeams);
  };

};


// sort teams by sport
function sortTeamsBySport(){

  console.log("testing sortTeamsBySport");

  var theSelTeamSport = selTeamSport.value;

  tBodyTeams.innerHTML = "";

  teamsDB.orderByChild("sport")
         .equalTo(theSelTeamSport)
         .on("child_added", getTeams);

  if (theSelTeamSport == "allSports") {
    tBodyTeams.innerHTML = "";
    teamsDB.on("child_added", getTeams);
  };

};










/* –––––––––––––––––––––––––– REGISTER FUNCTIONS –––––––––––––––––––––––––– */
// when form is submitted, run function
formSchool.onsubmit = addSchool;
formDelSchool.onsubmit = deleteSchool;
formSport.onsubmit = addSport;
formDeleteSport.onsubmit = deleteSport;
formDeleteTeam.onsubmit = deleteTeam;
formResult.onsubmit = addResult;


// when database changes (when new data is added), run function
schoolsDB.on("child_added", getSchools);
sportsDB.on("child_added", getSports);
teamsDB.on("child_added", getTeamsSel);
teamsDB.on("child_added", getTeams);
resultsDB.on("child_added", getResults);
