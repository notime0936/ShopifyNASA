var nasaPodUrl = 'https://api.nasa.gov/planetary/apod?api_key=xrZOC6NXnFP0PbRQ3AgFoCdXdR89vxagq3nG5u2q';
var btnId;
var picLike;

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    getImg(); 
    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      var fromDate = document.getElementById('datePicker').value;
      var givendate = new Date(fromDate);
      var todayDate = new Date();
      if (givendate>todayDate){
        alert("You can only select past dates.");
      }
      else{
       getImg(fromDate);
      }
    })
  }
};


//nasa API
function getImg(fromDate) {
  var queryUrl=nasaPodUrl;
  btnId = 0;
  picLike = new Map();
  document.getElementById('contentContainer').innerHTML='';
  document.getElementById('imgloading').style.display = 'block';
  
  if(typeof fromDate !== 'undefined'){
    queryUrl=queryUrl+'&start_date='+fromDate;
  }
    fetch(queryUrl)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        response.json().then(function(data) {
          if (Array.isArray(data)){
            data.forEach(showData);
          }
          else{
            showData(data);
          }
          document.getElementById('imgloading').style.display = 'none';
          likecheck();

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
      document.getElementById('imgloading').style.display = 'none';
      document.getElementById('content').innerHTML = `<h2>Error while fetching data from NASA's API : ${err}</h2>`;
    });
  }

function showData(data){
  var htmlContent;
  var buttonId="likebutton"+btnId;
  btnId++;
  var status = {like:false , buttonId:buttonId};
  picLike.set(data.url, status);
  
  htmlContent = `<h1>${data.title}</h1>`;
  htmlContent += `<h5>${data.date}</h5>`;

    if (data.media_type == 'video'){
      htmlContent += `<iframe width="420" height="315"
      src="${data.url}">
      </iframe>`;
    }else{
      htmlContent += `<img src="${data.url}"/>`;
    }
    
    htmlContent += `<p>${data.explanation}</p>`;
    htmlContent += `<div id="${buttonId}" onclick="likedBtn('${data.url}')" class="likebtn">&#9829;</div>`;
  document.getElementById('contentContainer').innerHTML+=htmlContent;
}

// like button

function likedBtn(imgUrl){
  var status = picLike.get(imgUrl);
  if (status.like){
    document.getElementById(status.buttonId).style.color = "black";
    status.like = false;
  }
  else{
    document.getElementById(status.buttonId).style.color = "red";
    status.like = true;
  }
  picLike.set(imgUrl, status);
  fetch('/like?url='+imgUrl+'&likes='+status.like)
  .catch(function(err) {
    console.log('Like button submit error :-S', err);
    document.getElementById('error').innerHTML = `<h2>Error while submitting like button : ${err}</h2>`;
  });
}

// like check
function likecheck(){
  fetch('/likecheck')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {
          data.forEach(url=>{
            var status = picLike.get(url);
            status.like = true;
            document.getElementById(status.buttonId).style.color="red";
            picLike.set(url,status);
          });
        });
      }
    )
}
