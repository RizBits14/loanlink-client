import { motion as Motion } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const { userName, user_photoURL, ratings, review: reviewText } = review;

    const roundedRating = Math.round(ratings);

    return (
        <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="group relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition-shadow duration-300 hover:shadow-2xl"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-secondary/12 blur-3xl" />
                <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-secondary/8" />
            </div>

            <div className="relative flex items-center gap-4">
                <div className="avatar">
                    <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-primary/35 ring-offset-2 ring-offset-base-100">
                        <img src={user_photoURL} alt={userName} className="h-full w-full object-cover" />
                    </div>
                </div>

                <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold">{userName}</h4>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-xs font-semibold text-base-content/70">
                        {ratings.toFixed(1)} / 5.0
                    </span>
                </div>
            </div>

            <div className="relative mt-5 flex items-center gap-1">
                {[...Array(5)].map((_, idx) =>
                    idx < roundedRating ? (
                        <FaStar key={idx} className="text-primary text-sm" />
                    ) : (
                        <FaRegStar key={idx} className="text-primary text-sm" />
                    )
                )}
            </div>

            <div className="relative mt-5 rounded-2xl border border-base-300 bg-base-200/40 p-4">
                <FaQuoteLeft className="absolute -top-3 left-4 text-base-300 text-lg" />
                <p className="text-sm leading-relaxed text-base-content/80">{reviewText}</p>
            </div>

            <div className="relative mt-5 flex items-center justify-between">
                <div className="h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        </Motion.div>
    );
};

export default ReviewCard;
