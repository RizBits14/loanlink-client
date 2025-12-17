import { NavLink } from "react-router";

const loans = [
    {
        id: 1,
        title: "Micro Business Loan",
        description: "Flexible financing for small businesses and startups.",
        amount: "$2,000 – $10,000",
        duration: "6 – 24 months",
    },
    {
        id: 2,
        title: "Education Support Loan",
        description: "Financial support for education and skill development.",
        amount: "$1,000 – $5,000",
        duration: "6 – 18 months",
    },
    {
        id: 3,
        title: "Agriculture Loan",
        description: "Funding support for farming and agricultural needs.",
        amount: "$3,000 – $15,000",
        duration: "12 – 36 months",
    },
    {
        id: 4,
        title: "Women Entrepreneurship Loan",
        description: "Empowering women-led small businesses.",
        amount: "$2,000 – $8,000",
        duration: "6 – 24 months",
    },
    {
        id: 5,
        title: "Emergency Relief Loan",
        description: "Quick financial assistance during emergencies.",
        amount: "$500 – $3,000",
        duration: "3 – 12 months",
    },
    {
        id: 6,
        title: "Small Trade Loan",
        description: "Support for small traders and shop owners.",
        amount: "$1,500 – $7,000",
        duration: "6 – 24 months",
    },
];

const AllLoans = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-14">

            <div className="text-center max-w-2xl mx-auto animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 text-primary">
                    All Loan Programs
                </h1>
                <p className="opacity-80">
                    Browse available loan programs designed to support individuals,
                    entrepreneurs, and small businesses.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loans.map((loan, index) => (
                    <div
                        key={loan.id}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="
                            relative bg-base-100 rounded-2xl p-6 flex flex-col
                            shadow-md hover:shadow-xl
                            transition-all duration-300 ease-out
                            hover:-translate-y-2 hover:scale-[1.02]
                            border border-transparent hover:border-primary/30
                            animate-slide-up
                        "
                    >
                        <div className="
                            absolute inset-0 rounded-2xl
                            bg-linear-to-br from-primary/5 to-transparent
                            opacity-0 hover:opacity-100
                            transition-opacity duration-300
                            pointer-events-none
                        " />

                        <h2 className="text-xl font-semibold mb-2 relative z-10">
                            {loan.title}
                        </h2>

                        <p className="text-sm opacity-80 mb-4 grow relative z-10">
                            {loan.description}
                        </p>

                        <div className="text-sm space-y-1 mb-6 relative z-10">
                            <p><strong>Amount:</strong> {loan.amount}</p>
                            <p><strong>Duration:</strong> {loan.duration}</p>
                        </div>

                        <NavLink
                            to={`/loans/${loan.id}`}
                            className="
                                btn btn-primary btn-sm w-full
                                transition-all duration-300
                                hover:scale-105 active:scale-95
                            "
                        >
                            View Details
                        </NavLink>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AllLoans;
