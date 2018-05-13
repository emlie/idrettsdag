/* –––––––––––––––––––––––––– GET HTML ELEMENTS –––––––––––––––––––––––––– */
var formResult = document.getElementById("formResult");
var selTeam = document.getElementById("selTeam");
var inpPoints = document.getElementById("inpPoints");
var tBodyResults = document.getElementById("tBodyResults");


/* –––––––––––––––––––––––––– GET DATABASES –––––––––––––––––––––––––– */
var database = firebase.database();
var teamsDB = database.ref("teams");
var resultsDB = database.ref("results");









/* –––––––––––––––––––––––––– PUSH AND GET DATA –––––––––––––––––––––––––– */
// show teams
function getTeams(snapshot){

  console.log("testing getTeams");

  var regdTeam = snapshot.key;
  var theRegdTeam = snapshot.val();

  // show teams in selResultTeam
  selResultTeam.innerHTML += `
  <option value="${regdTeam}">
    ${theRegdTeam.name}
  </option>
  `;

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

  // use a second function to get data from schoolsDB and use as foreign key
  var resultsRef = database.ref("teams/" + theRegdResult.team);

  resultsRef.on("value", function(snapshotResults){

    var theResult = snapshotResults.val();

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

  resultsDB.orderByChild("team")
           .equalTo(theSelResultTeam)
           .on("child_added", getResults);

  // if no team is selected, show all results from all teams
  if (theSelResultTeam == "allResults") {
    tBodyResults.innerHTML = "";
    resultsDB.on("child_added", getResults);
  };

};










/* –––––––––––––––––––––––––– REGISTER FUNCTIONS –––––––––––––––––––––––––– */
// when database changes (when new data is added), run function
teamsDB.on("child_added", getTeams);
resultsDB.on("child_added", getResults);
