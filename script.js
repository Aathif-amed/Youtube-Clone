//creating container and row to add videos //conatiner>row

let div = document.createElement("div");
div.classList.add("container", "mt-5");

let row = document.createElement("div");
row.classList.add("row");

//appending container and row to document
div.append(row);
document.body.append(div);

//api_key for reterving information
const api_key = "AIzaSyAgDQA9Xye-il-IYZg2m61wCFOPC56s_gQ";

// incase above apikey shows 403 error use below apiKey
// const api_key ="AIzaSyDTJJPvprlPTQyUsTLIbDsvHVa57hA9iLw";


//urls for retrievingdata
const searchUrl = "https://www.googleapis.com/youtube/v3/search?";
const playlistUrl = "https://www.googleapis.com/youtube/v3/playlists?";
const activitiesUrl = "https://www.googleapis.com/youtube/v3/activities?";
const channelUrl = "https://www.googleapis.com/youtube/v3/channels?";



let st = document.getElementById("searchItem");
let sb = document.getElementById("searchButton");
fetchVideo("java");
sb.addEventListener("click", () => {
    let queryitem = st.value;
    console.log(queryitem);
    fetchVideo(queryitem);
});
st.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {

        let queryitem = st.value;
        console.log(queryitem);
        fetchVideo(queryitem);
        console.log("Aaa");
    }
})



let viewdetails_div = document.createElement("div");
viewdetails_div.classList.add("container", "mt-5");
viewdetails_div.setAttribute("id", "viewDeatilsdiv");
viewdetails_div.innerHTML = `<h1 class= "text-center"> View Details </h1>`

let viewdetails_row = document.createElement("div");
viewdetails_row.classList.add("row");

let viewdetails_row1 = document.createElement("div");
viewdetails_row1.classList.add("row", "border", "border-secondary");





viewdetails_div.append(viewdetails_row, viewdetails_row1);
document.body.append(viewdetails_div);

//Note: instead of using xmlhttprequest here fetch is used. In this Project fetch is used by async/await inorder to avoid promise chains
async function fetchVideo(queryitem) {
    let res = await fetch(
        searchUrl +
        new URLSearchParams({
            key: api_key,
            part: "snippet",
            type: "video",
            q: queryitem,
            maxResults: 12,
            regionCode: "IN",
        })
    ); //returns readable stream of data in promise object
    let res1 = await res.json(); //to convert the readable stream to json 

    let arr_channelIds = []; //array to store channel id's
    row.innerHTML = " "; //for every search previous row will be appended by empty string

    //following for function will create cards with video details  (length = maxResults) as mentioned in URLSearchParams
    //at line_no:89 -> <a> tag will redirect to the orginal youtube page to watch the video ..and thid redirection is based on the videoid retrieved from (res1) 
    for (let i = 0; i < res1.items.length; i++) {
        let col = document.createElement("div");
        col.classList.add("col-sm-6", "col-md-4", "col-lg-3", "mt-3");
        col.innerHTML += `
        <div class="card h-100">
        <img src="${res1.items[i].snippet.thumbnails.default.url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${res1.items[i].snippet.title}</h5>
          <p class="card-text">${res1.items[i].snippet.description}</p>
          <div class="button mt-3 text-center">
          <div class="row d-flex justify-content-center gap-1">
          <a href="https://www.youtube.com/watch?v=${res1.items[i].id.videoId}" class="btn btn-danger col-xl-5 p-1"><i class="fa-solid fa-play text-dark"></i> watch video</a>
          <a href="#viewDeatilsdiv" class="btn btn-info col-xl-5 p-1" id=viewDetails${i}><i class="fa-solid fa-info"></i> view details</a>
          </div>
          </div>
        </div>
      </div>
     `;
        row.append(col);
        arr_channelIds[i] = res1.items[i].snippet.channelId;
    }
    vd1(arr_channelIds);
}


async function vd1(arr) {



    for (let index = 0; index < arr.length; index++) {
        let cc = await fetch(
            channelUrl +
            new URLSearchParams({
                key: api_key,
                part: "snippet",
                id: arr[index],
            })
        );
        let channel_content = await cc.json();

        let ac = await fetch(
            activitiesUrl +
            new URLSearchParams({
                key: api_key,
                part: "snippet",
                channelId: arr[index],
            })
        )
        let activities = await ac.json();

        let pl = await fetch(
            playlistUrl +
            new URLSearchParams({
                key: api_key,
                part: "snippet",
                channelId: arr[index],
            })
        )
        let playlists = await pl.json();

        let str = "viewDetails" + index;
        let vd = document.getElementById(str);
        vd.addEventListener("click", () => {
            console.log(activities);
            console.log(playlists);
            console.log(channel_content);
            let published_dt, time;

            // to handle undeifned error in the publishedAt value
            if (channel_content.items[0].snippet.publishedAt == undefined) {
                published_dt[0] = "Unknown";
                time = "Unknown"
            } else {
                published_dt = (channel_content.items[0].snippet.publishedAt).split("T");
                time = published_dt[1].split("Z", 1);
            }




            console.log(published_dt);
            viewdetails_row.innerHTML = `
           
            <div class="col p-5 text-center">
                
                <h4 class="text-center">Channel Logo</h4>
                <img src="${channel_content.items[0].snippet.thumbnails.high.url}" alt="" style=" height:400px ;width:600px"  >
                </div>  
               `
            viewdetails_row1.innerHTML = `
            <div class="col-md-4 p-5">

            <h4>Activities</h4>
            <p>Type: ${activities.items[0].snippet.type}</p>
            <img src="${activities.items[0].snippet.thumbnails.default.url}" alt="" style="height:10rem; width:15rem">
            <p>Video Tiltle:${activities.items[0].title}</p>
            <p class="card-text">Description:${activities.items[0].snippet.description}</p>
            <p>Published Date:${(channel_content.items[0].snippet.publishedAt).split("T",1)}</p>
    
        </div>
    
                <div class="col-md-4 p-5 border border-secondary">

                    <h4>Channel Details</h4>
                    <p>UserName: ${channel_content.items[0].snippet.customUrl}</p>
                    <p>Title:${channel_content.items[0].title}</p>
                    <p class="card-text">Description:${channel_content.items[0].snippet.description}</p>
                    <p>Published Date:${published_dt[0]}</p>
                    <p>Published Time:${time}</p>

                 </div>
              
                <div class="col-md-4 p-5">

                    <h4>Playlists</h4>
                    <p>Playlist Id: ${playlists.items[0].id}</p>
                    <img src="${playlists.items[0].snippet.thumbnails.default.url}" alt="" style="height:10rem; width:15rem">
                    <p>Playlist Tiltle:${playlists.items[0].title}</p>
                    <p class="card-text">Description:${playlists.items[0].snippet.description}</p>
                    <p>Published Date:${(playlists.items[0].snippet.publishedAt).split("T",1)}</p>
                </div>
       
         `;
        })

    }
}