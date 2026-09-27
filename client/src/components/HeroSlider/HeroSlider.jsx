// HeroSlider.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './HeroSlider.module.css';
import { heroSlides } from '../../data/categories';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Navigate to category page or filter products
    // navigate(`/category/${categoryName.toLowerCase()}`);
    navigate(`/search?category=${categoryName.toLowerCase()}`)
    // OR if you want to scroll to category section
    // const element = document.getElementById(categoryName.toLowerCase());
    // if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className={styles.heroSwiper}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className={styles.slide}
              onClick={() => handleCategoryClick(slide.category)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className={styles.slideImage}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className={styles.overlay}>
                  <div className={styles.content}>
                    <h2>{slide.title}</h2>
                    <p>{slide.subtitle}</p>
                    <span className={styles.exploreText}>Explore {slide.category} →</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;