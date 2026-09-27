import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./ProductSlider.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useNavigate } from "react-router-dom";

const ProductSlider = ({ title, products, seeAllLink }) => {
  console.log("seeAllLink:",seeAllLink)
  const navigate = useNavigate();
  return (
    <div className={styles.sliderSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {seeAllLink && <button className={styles.seeAllBtn} onClick={() => navigate(seeAllLink)}>See All</button>}
      </div>   

      <Swiper
        // modules={[Autoplay]}
        spaceBetween={10}
        // autoplay={{
        //   delay: 4000,
        //   disableOnInteraction: false,
        // }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1400: {
            slidesPerView: 6,
          },
        }}
        className={styles.productSwiper}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
