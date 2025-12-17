import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/reviews.json")
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="py-16 text-center">
                <span className="loading loading-spinner loading-lg"></span>
            </section>
        );
    }

    return (
        <section className="w-full bg-base-100 py-14 md:py-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        What Our <span className="text-primary">Customers</span> Say
                    </h3>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Real feedback from people who trusted LoanLink — transparency,
                        speed, and reliability.
                    </p>
                </div>

                <Swiper
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    loop
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    coverflowEffect={{
                        rotate: 30,
                        stretch: 0,
                        depth: 120,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination]}
                    className="pb-12"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <ReviewCard review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Reviews;
