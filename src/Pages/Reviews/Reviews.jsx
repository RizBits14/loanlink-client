import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { motion as Motion } from "framer-motion";
import gsap from "gsap";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const headerRef = useRef(null);

    useEffect(() => {
        fetch("/reviews.json")
            .then((res) => res.json())
            .then((data) => setReviews(data));
    }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-base-100 py-14 md:py-20">
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

            <div className="max-w-6xl mx-auto px-4">
                <div ref={headerRef} className="text-center mb-10">
                    <Motion.p
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="mx-auto inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-base-content/70 backdrop-blur"
                    >
                        Reviews • Real customers
                    </Motion.p>

                    <Motion.h3
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight"
                    >
                        What Our <span className="text-primary">Customers</span> Say
                    </Motion.h3>

                    <Motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                        className="mt-3 text-base-content/70 max-w-2xl mx-auto"
                    >
                        Real feedback from people who trusted LoanLink — transparency, speed, and reliability.
                    </Motion.p>
                </div>

                <Motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="relative"
                >
                    <Swiper
                        effect="coverflow"
                        grabCursor
                        centeredSlides
                        loop={reviews.length > 3}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                        coverflowEffect={{
                            rotate: 26,
                            stretch: 0,
                            depth: 140,
                            modifier: 1.15,
                            slideShadows: false,
                        }}
                        pagination={{ clickable: true }}
                        modules={[EffectCoverflow, Pagination, Autoplay]}
                        className="pb-12"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id} className="py-2">
                                <ReviewCard review={review} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-10 bg-linear-to-t from-base-100 via-base-100/70 to-transparent" />
                </Motion.div>
            </div>
        </section>
    );
};

export default Reviews;
