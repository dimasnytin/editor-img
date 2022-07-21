// загрузчик фото
const fileInput = document.querySelector(".file-input"),
// фильтр код
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
// сброс фильтров
resetFilterBtn = document.querySelector(".reset-filter"),
// сохраняем фото 
saveImgBtn = document.querySelector(".save-img"),
chooseImgBtn = document.querySelector(".choose-img"); 

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0; flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImage = () =>{
  // получение файла выбор пользователя
  let file = fileInput.files[0];  
  // вернуть, если пользователь не выбрал файл
  if(!file) return;       
  // передача URL-адреса файла в качестве предварительного просмотра img src
  previewImg.src = URL.createObjectURL(file); 
  previewImg.addEventListener("load",() => {
     resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
}

filterOptions.forEach(option => {
  // добавление прослушивателя событий щелчка ко всем кнопкам фильтра
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness"){
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation"){
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});


const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;

  // получение выбранного фильтра
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness"){
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation"){
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

// вращение фото
rotateOptions.forEach(option => {
  option.addEventListener("click", () => {
    // поворот на 90 градусов вращение налево
    if(option.id === "left"){
      rotate -= 90; 
    } else if (option.id === "right") {
      rotate += 90;
      // отражение флип фото
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {

  let brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
  let rotate = 0; flipHorizontal = 1; flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
}

// функц сохраниения фото
const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if(rotate !== 0){
    ctx.rotate(rotate * Math.PI / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  // document.body.appendChild(canvas);
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());