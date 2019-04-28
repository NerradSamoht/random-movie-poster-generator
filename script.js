const key = "4120175e535d978bf6f3785ea754ffc2";

function getLatestMovieId(key) {
  const url = `https://api.themoviedb.org/3/movie/latest?api_key=${key}&language=en-US`;

  const id = fetch(url)
    .then(res => res.json())
    .then(res => getRandomInt(res.id))
    .catch(error => console.log("No poster for this result, trying again..."));

  return id;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getMovieImageFilePath(id, key) {
  const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${key}&language=en-US&include_image_language=en`;

  const filePath = fetch(url)
    .then(res => res.json())
    .then(res => res.posters[0].file_path)
    .catch(error => console.log("No poster for this result, trying again..."));

  return filePath;
}

async function init(key) {
  const id = await getLatestMovieId(key);
  const filePath = await getMovieImageFilePath(id, key);

  if (filePath !== undefined) {
    const image = `https://image.tmdb.org/t/p/w500${filePath}`;
    const elem = document.querySelector("#poster");
    const imgElem = `<img src=${image} alt='' />`;
    elem.innerHTML = imgElem;
    n = 0;
  } else {
    n = n + 2;
    console.log(`${n} requests.`);
    if (n === 35) {
      console.log("Waiting 10 seconds to avoid rate limits.");
      setTimeout(init(key), 10000);
      console.log("Continuing search...");
      n = 0;
    } else {
      init(key);
    }
  }
}

let n = 0;
init(key);
