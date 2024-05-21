class Lightbox {

    constructor(){
        this.initEvents()
        this.index = 0
    }

    initEvents(){
        const btnPrev = document.querySelector(".btn.prev");
        const btnNext = document.querySelector(".btn.next");
        const slides = document.querySelectorAll(".slide");
        const carousel = document.querySelector(".carousel");
        const overlay = document.querySelector(".overlay");

        btnNext.addEventListener("click", () => {
            if (this.index == slides.length - 1) {
                this.index = 0;
            } else {
                this.index += 1;
            }
            this.changeSlide();
        });

        btnPrev.addEventListener("click", () => {
            if (this.index == 0) {
                this.index = slides.length - 1;
            } else {
                this.index -= 1;
            }
            this.changeSlide();
        });
        
        overlay.addEventListener("click", () => {
            this.close()          
        });

        document.addEventListener("keydown", (event) => {
            if (carousel.style.display === 'flex') {
                if (event.key === "ArrowRight") {
                    btnNext.click();
                } else if (event.key === "ArrowLeft") {
                    btnPrev.click();
                } else if (event.key === "Escape") {
                    this.close();
                }
            }
        });
    }

    open(index){
        const sliderContainer = document.querySelector('.slider-container')        
        this.index = index;
        const carousel = document.querySelector(".carousel");
        carousel.style.display = 'flex';
        this.changeSlide();
        sliderContainer.style.opacity = '1'
    }

    close(){
        const carousel = document.querySelector(".carousel");
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.style.opacity = '0'
        carousel.style.display = "none";
    }

    changeSlide() {
        const slider = document.querySelector(".slider");
        const slide = document.querySelector(".slide");
        const slideWidth = slide.getBoundingClientRect().width;
        slider.style.transform = `translateX(-${this.index * slideWidth}px)`;
    }

    clearSlides(){
        const slider = document.querySelector('.slider')
        slider.innerHTML = ''
        this.index = 0
    }

    addSlide(media){
        const slider = document.querySelector(".slider");
        const slide = document.createElement("li");
        slide.classList.add("slide");
      
        const m = new Media(media, {controls: true}) // Utilisation de la factory Media
        const img = m.getMediaDOM()
      
        const title = document.createElement("p");
        title.innerHTML = media.title;
      
        slide.appendChild(img);   
        slide.appendChild(title); 
        slider.appendChild(slide);
    }

}
