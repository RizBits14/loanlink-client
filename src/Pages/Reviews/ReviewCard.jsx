import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const {
        userName,
        user_photoURL,
        ratings,
        review: reviewText,
        date,
    } = review;

    const roundedRating = Math.round(ratings);
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="group card bg-base-100 border border-base-300 shadow-sm rounded-2xl p-6 max-w-md mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="flex items-center mb-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring ring-primary/60 ring-offset-2 ring-offset-base-100 overflow-hidden">
                        <img
                            src={user_photoURL}
                            alt={userName}
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="ml-3">
                    <h4 className="font-semibold">{userName}</h4>
                    <p className="text-xs text-base-content/60">
                        {formattedDate}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, idx) =>
                    idx < roundedRating ? (
                        <FaStar key={idx} className="text-primary text-sm" />
                    ) : (
                        <FaRegStar key={idx} className="text-primary text-sm" />
                    )
                )}
                <span className="ml-2 text-xs font-medium text-base-content/60">
                    {ratings.toFixed(1)} / 5.0
                </span>
            </div>

            <div className="relative">
                <FaQuoteLeft className="absolute -top-3 -left-1 text-base-300 text-lg" />
                <p className="text-sm leading-relaxed pl-5 text-base-content/80">
                    {reviewText}
                </p>
            </div>
        </div>
    );
};

export default ReviewCard;
