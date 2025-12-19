import { NavLink } from "react-router";
import useAllLoans from "../Hooks/useAllLoans";

const AllLoans = () => {
    const { data: loans = [], isLoading, isError } = useAllLoans();

    return (
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-20">
            <div className="text-center max-w-2xl mx-auto animate-fade-in-down">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary tracking-tight">
                    All Loan Programs
                </h1>
                <p className="opacity-80 text-lg animate-fade-in delay-200">
                    Browse powerful loan programs crafted to empower individuals,
                    startups, and growing businesses.
                </p>
            </div>
            {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-96 bg-base-200 rounded-3xl animate-pulse"
                        />
                    ))}
                </div>
            )}
            {isError && (
                <p className="text-center text-error animate-shake">
                    Failed to load loan programs.
                </p>
            )}
            {!isLoading && !isError && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {loans.map((loan, index) => (
                        <div
                            key={loan._id}
                            style={{ animationDelay: `${index * 120}ms` }}
                            className="
                                group relative bg-base-100 rounded-3xl overflow-hidden
                                p-8 flex flex-col min-h-115
                                shadow-lg hover:shadow-2xl
                                transition-all duration-500 ease-out
                                hover:-translate-y-3 hover:scale-[1.03]
                                border border-transparent hover:border-primary/40
                                animate-slide-up-fade
                            "
                        >
                            <div
                                className="
                                    absolute -inset-1 bg-linear-to-r
                                    from-primary/20 via-transparent to-primary/20
                                    opacity-0 group-hover:opacity-100
                                    blur-xl transition-opacity duration-700
                                    pointer-events-none
                                "
                            />

                            <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                                <img
                                    src={loan.images?.[0]}
                                    alt={loan.title}
                                    className="
                                        h-full w-full object-cover
                                        transition-transform duration-700
                                        group-hover:scale-110 group-hover:rotate-1
                                    "
                                />

                                <div
                                    className="
                                        absolute inset-0 bg-linear-to-tr
                                        from-white/10 via-transparent to-white/10
                                        opacity-0 group-hover:opacity-100
                                        animate-pulse
                                    "
                                />
                            </div>

                            <h2 className="text-2xl font-semibold mb-3 relative z-10">
                                {loan.title}
                            </h2>

                            <p className="text-sm opacity-80 mb-6 grow relative z-10 leading-relaxed">
                                {loan.description}
                            </p>

                            <div className="mb-7 relative z-10">
                                <p className="text-sm">
                                    Max Amount:{" "}
                                    <span className="text-primary font-bold text-lg">
                                        ${loan.maxLoanLimit}
                                    </span>
                                </p>
                            </div>

                            <NavLink
                                to={`/loans/${loan._id}`}
                                className="
                                    btn btn-primary btn-sm w-full
                                    transition-all duration-300
                                    hover:scale-110 hover:shadow-lg
                                    active:scale-95
                                    animate-fade-in-up
                                "
                            >
                                View Details
                            </NavLink>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllLoans;
